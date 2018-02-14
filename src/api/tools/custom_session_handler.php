<?php

class CustomSessionHandler extends SessionHandler
{

    /**
     * @var string
     */
    private $sid;

    /**
     * @var \Zend\Cache\Storage\Adapter\Filesystem
     */
    private $zendCacheObject = null;

    // default max lifetime
    const GC_MAX_LIFETIME = 1440;

    /**
     *
     * @param mixed $save_path
     * @param mixed $session_name
     * @return
     */
    public function open($save_path, $session_name)
    {
        // retrieve SID
        if (isset($_COOKIE[$session_name])) {
            $this->sid = $_COOKIE[$session_name];
        }

        // store the same object to refresh TTL (Todo: check if necessary?!)
        $this->getZendCacheObject()->setItem($this->sid, $this->getZendCacheObject()->getItem($this->sid));

        return true;
    }

    /**
     *
     * @return
     */
    public function create_sid()
    {
        // use built-in methods to generate session ID
        return ($this->sid = 'zs'.parent::create_sid());
    }

    /**
     *
     * @return
     */
    public function close()
    {
        return true;
    }

    /**
     *
     * @param mixed $session_id
     * @return
     */
    public function destroy($session_id)
    {
        // clear the namespace from the cache
        $this->getZendCacheObject()->removeItem($session_id);
        return true;
    }

    /**
     *
     * @param mixed $maxlifetime
     * @return
     */
    public function gc($maxlifetime)
    {
        // clear old files
        $this->getZendCacheObject()->clearExpired();
        return true;
    }

    /**
     *
     * @param mixed $session_id
     * @return
     */
    public function read($session_id)
    {
        $data = $this->getZendCacheObject()->getItem($session_id);
        if (!$data) {
            $data = '';
        }
        return $data;
    }

    /**
     *
     * @param mixed $session_id
     * @param mixed $session_data
     * @return
     */
    public function write($session_id, $session_data)
    {
        $res = $this->getZendCacheObject()->setItem($session_id, $session_data);
        return true;
    }

    /**
     * @param \Zend\Cache\Storage\Adapter\Filesystem $zendCacheObject
     */
    public function setZendCacheObject($zendCacheObject)
    {
        $this->zendCacheObject = $zendCacheObject;
    }

    /**
     * @return \Zend\Cache\Storage\Adapter\Filesystem
     */
    public function getZendCacheObject()
    {
        if (is_null($this->zendCacheObject)) {
            // get the session max lifetime
            $maxLifeTime = get_cfg_var('session.gc_maxlifetime');
            if (!$maxLifeTime) {
                $maxLifeTime = self::GC_MAX_LIFETIME; // get the default
            }

            // get the temp folder for the cache - try GUI temp
            $cacheDir = sys_get_temp_dir();
            if (!is_writable($cacheDir)) {
                throw new \Exception('temp folder is not writeable');
            }

            // getting a Zend_Cache_Core object
            $this->zendCacheObject = \Zend\Cache\StorageFactory::factory(array(
                'adapter' => array(
                    'name' => 'filesystem',
                    'options' => array(
                        'cache_dir' => $cacheDir,
                        'ttl' => $maxLifeTime - 1, // -1 because the GC might run before TTL ends
                        'file_locking' => false,
                    ),
                ),
            ));
        }

        return $this->zendCacheObject;
    }
}
