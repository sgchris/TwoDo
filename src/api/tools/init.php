<?php

require_once __DIR__.'/../../../vendor/autoload.php';
require_once __DIR__.'/functions.php';

// facebook GriNotes app data
$config = parse_ini_file(__DIR__.'/config.ini');
define('FB_APP_ID', $config['FB_APP_ID']);
define('FB_APP_SECRET', $config['FB_APP_SECRET']);
define('FB_APP_VERSION', $config['FB_APP_VERSION']);

global $fbUser;

// create connection
createDbConnection();

// authentication
$accessToken = $_REQUEST['access_token'] ?? false;
if ($accessToken) {
    $fbUser = getUserFromCache($accessToken);
}

if ($accessToken && !$fbUser) {
    $fbUser = getUserFromFacebook($accessToken);
    file_put_contents('/tmp/grinotes.log', date('H:i:s')." reading profile from FB and adding user to cache\n", FILE_APPEND);
}

// temp allow access from all
setHeaders();

/////////////////////////////////////////////////////////////////////////////

// create global variable $db
function createDbConnection()
{
    global $db;

    try {
        $dbFilePath = __DIR__.'/../grinotes.db';
        if (!file_exists($dbFilePath)) {
            _exit('DB file does not exist');
        }

        if (!is_writeable($dbFilePath)) {
            _exit('DB file does not accessible');
        }
        $db = new PDO('sqlite:'.$dbFilePath);
        if (!$db) {
            _exit('Connection error');
        }

        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (\Exception $e) {
        _exit('Connection error:'.$e->getMessage());
    }

    return $db;
}


// FB authentication - check if already present in the cache
function getUserFromCache($accessToken)
{
    $fbUser = null;
    file_put_contents('/tmp/grinotes.log', date('H:i:s')." apcu:".(function_exists('apcu_fetch')?'defined':'missing').". key-value:".(function_exists('apcu_exists') && apcu_exists($accessToken)?'exists':'missing')."\n", FILE_APPEND);
    if ($accessToken && function_exists('apcu_fetch') && (apcu_exists($accessToken))) {
        $fbUser = apcu_fetch($accessToken, $fetchSuccess);
        if ($fetchSuccess) {
            $fbUser = json_decode($fbUser, $__assoc = true);
            return $fbUser;
        } else {
            apcu_delete($accessToken);
        }
    }

    return false;
}

// read user data from facebook
function getUserFromFacebook($accessToken)
{
    if ($accessToken) {
        $fb = new \Facebook\Facebook([
            'app_id' => FB_APP_ID,
            'app_secret' => FB_APP_SECRET,
            'default_graph_version' => FB_APP_VERSION,
        ]);

        if ($fb) {
            try {
                // get the data
                $fbResponse = $fb->get('/me?fields=id,name,email', $accessToken);

                // get parsed response
                $fbUserData = $fbResponse->getDecodedBody();

                // store user data locally
                if (function_exists('apcu_store')) {
                    apcu_store($accessToken, json_encode($fbUserData));
                    file_put_contents('/tmp/grinotes.log', date('H:i:s')." added to cache ".apcu_fetch($accessToken)."\n", FILE_APPEND);
                } else {
                    file_put_contents('/tmp/grinotes.log', date('H:i:s')." 'apcu_store' is not defined\n", FILE_APPEND);
                }

                // check that the user is in the system
                registerUser($fbUserData);

                return $fbUserData;
            } catch (\Facebook\Exceptions\FacebookResponseException $e) {
                _exit('FB response error (exc): '.$e->getMessage());
            } catch (\Facebook\Exceptions\FacebookSDKException $e) {
                _exit('FB response error (sdk): '.$e->getMessage());
            }
        }
    }

    return false;
}


function setHeaders()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding');
    header('Access-Control-Allow-Methods: POST, GET');
    header('Access-Control-Allow-Credentials: true');

    // since it's API, the response is JSON only
    header('Content-Type: application/json');
}
