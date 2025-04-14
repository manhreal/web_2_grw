// middleware/cache.js

// cache for information in home page
const cacheStore = new Map(); //  Use Map to store cache data

// keyFn: function to get key to distinct each cache
export const cacheMiddleware = (keyFn, ttl = 20 * 60 * 1000) => {
    return (req, res, next) => {
        const key = typeof keyFn === 'function' ? keyFn(req) : keyFn; 
        const now = Date.now(); // get current time
        const cache = cacheStore.get(key); // get data following key

        // if cache exist and not expired, return cache
        if (cache && now - cache.timestamp < ttl) {
            console.log(`[CACHE HIT] - Key: ${key} | Age: ${Math.round((now - cache.timestamp) / 1000)}s`);
            return res.status(200).json({
                success: true,
                data: cache.data,
                cached: true
            });
        }

        // if cache not exist or expired, set cache
        console.log(`[CACHE MISS] - Key: ${key}`);
        res.sendWithCache = (dataObject) => {
            cacheStore.set(key, {
                data: dataObject,
                timestamp: Date.now()
            });
            console.log(`[CACHE SET] - Key: ${key}`);
            return res.status(200).json({
                success: true,
                data: dataObject,
                cached: false
            });
        };
        next();
    };
};

// function to clear cache
export const clearCache = (key) => {
    const existed = cacheStore.has(key); // check if key exist
    cacheStore.delete(key); // delete cache
    console.log(`[CACHE CLEARED] - Key: ${key} | Found: ${existed}`);
};

// cache for test page
const testCacheStore = new Map();

export const cacheTestMiddleware = (ttl = 20 * 60 * 1000) => {
    return (req, res, next) => {
        const key = `test-${req.params.id}`;
        const now = Date.now();
        const cache = testCacheStore.get(key);

        if (cache && now - cache.timestamp < ttl) {
            console.log(`[TEST CACHE HIT] - Key: ${key} | Age: ${Math.round((now - cache.timestamp) / 1000)}s`);
            return res.json(cache.data); 
        }

        console.log(`[TEST CACHE MISS] - Key: ${key}`);
        res.sendTestCache = (dataObject) => {
            testCacheStore.set(key, {
                data: dataObject,
                timestamp: Date.now()
            });

            console.log(`[TEST CACHE SET] - Key: ${key}`);
            return res.json(dataObject); 
        };

        next();
    };
};

export const clearTestCache = (id) => {
    const key = `test-${id}`;
    const existed = testCacheStore.has(key);
    testCacheStore.delete(key);
    console.log(`[TEST CACHE CLEARED] - Key: ${key} | Found: ${existed}`);
};

// cache for top user test
const topUserCacheStore = new Map(); 

export const cacheMiddlewareTopUser = (key = 'topUsers', ttl = 20 * 60 * 1000) => {
    return (req, res, next) => {
        const now = Date.now();
        const cache = topUserCacheStore.get(key);

        if (cache && now - cache.timestamp < ttl) {
            console.log(`[TOP USERS CACHE HIT] - Key: ${key} | Age: ${Math.round((now - cache.timestamp) / 1000)}s`);
            return res.status(200).json({
                topUsers: cache.data
            });
        }

        console.log(`[TOP USERS CACHE MISS] - Key: ${key}`);

        res.sendProfileCache = (dataObject) => {
            topUserCacheStore.set(key, {
                data: dataObject,
                timestamp: Date.now()
            });


            console.log(`[PROFILE CACHE SET] - Key: ${key}`);
            return res.status(200).json(dataObject); 
        };


        next();
    };
};

export const clearTopUserCache = (key = 'topUsers') => {
    const existed = topUserCacheStore.has(key);
    topUserCacheStore.delete(key);
    console.log(`[TOP USERS CACHE CLEARED] - Key: ${key} | Found: ${existed}`);
};


// cache for profile
const profileCacheStore = new Map(); 

export const cacheMiddlewareProfile = (ttl = 5 * 60 * 1000) => {
    return (req, res, next) => {
        const key = `profile:${req.user.email}`;
        const now = Date.now();
        const cached = profileCacheStore.get(key);

        if (cached && now - cached.timestamp < ttl) {
            console.log(`[PROFILE CACHE HIT] - Key: ${key} | Age: ${Math.round((now - cached.timestamp) / 1000)}s`);
            return res.status(200).json({
                success: true,
                data: cached.data,
                cached: true
            });
        }

        console.log(`[PROFILE CACHE MISS] - Key: ${key}`);

        res.sendProfileCache = (dataObject) => {
            profileCacheStore.set(key, {
                data: dataObject,
                timestamp: Date.now()
            });

            console.log(`[PROFILE CACHE SET] - Key: ${key}`);
            return res.status(200).json({
                success: true,
                data: dataObject,
                cached: false
            });
        };
        next();
    };
};