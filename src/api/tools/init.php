<?php

session_start();

require_once __DIR__.'/../../../vendor/autoload.php';
require_once __DIR__.'/functions.php';

// read the ini file
$config = parse_ini_file(__DIR__.'/config.ini');

// facebook TwoDo app data
define('FB_APP_ID', $config['FB_APP_ID']);
define('FB_APP_SECRET', $config['FB_APP_SECRET']);
define('FB_APP_VERSION', $config['FB_APP_VERSION']);

global $fbUserId, $fbUserName;

// create connection
try {
    $dbFilePath = __DIR__.'/../twodo.db';
    if (!file_exists($dbFilePath)) {
        die('DB file does not exist');
    }

    if (!is_writeable($dbFilePath)) {
        die('DB file does not accessible');
    }
    $db = new PDO('sqlite:'.$dbFilePath);
    if (!$db) {
        die('Connection error');
    }

    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (\Exception $e) {
    die('Connection error:'.$e->getMessage());
}


// FB authentication - check if already present in the session
if (!isset($_SESSION['fb']) || !isset($_SESSION['fb']['access_token'])) {
    file_put_contents('/tmp/grinotes.log', date('H:i:s')." reading profile from FB and adding user to session\n", FILE_APPEND);
    $accessToken = $_REQUEST['access_token'] ?? false;
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
                $_SESSION['fb'] = [
                    'id' => $fbUserData['id'],
                    'name' => $fbUserData['name'],
                    'email' => $fbUserData['email'],
                    'access_token' => $accessToken,
                ];
                file_put_contents('/tmp/grinotes.log', date('H:i:s')." added to session ".json_encode($_SESSION['fb'])."\n", FILE_APPEND);
                
                // check that the user is in the system
                registerUser($fbUserData);
            } catch (\Facebook\Exceptions\FacebookResponseException $e) {
                _exit('FB response error (exc): '.$e->getMessage());
            } catch (\Facebook\Exceptions\FacebookSDKException $e) {
                _exit('FB response error (sdk): '.$e->getMessage());
            }
        }
    }
}


// init headers

// temp allow access from all
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Credentials: true');

header('Content-Type: application/json');
