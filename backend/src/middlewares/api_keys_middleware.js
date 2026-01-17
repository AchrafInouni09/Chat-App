const {ApiKeys} = require ('../models/ApiKeys');

const apikeymodel = new ApiKeys () ;


const rateLimitStore = new Map ();

async function apiKey_auth_mw (req, res, next)
{
    const apiKey = req.headers['x-api-key'];

    if (!apiKey)
    {
        return res.status(401).json({ message: 'Invalid API key' });
    }

    try
    {
        const keydata = await apikeymodel.findByKey (apiKey);
        if (!keydata)
        {
            return res.status(401).json({ message: 'Invalid API key' });
        }

        const now = Date.now ();
        const windowMs = 60 * 60 * 1000; // time for  reset;
        const keyId = keydata.id;

        if (!rateLimitStore.has (keyId))
        {
            rateLimitStore.set (keyId, {count : 0, resetTime : now + windowMs});
        }

        const rateData = rateLimitStore.get (keyId);

        if (now > rateData.resetTime)
        {
            rateData.count = 0;
            rateData.resetTime = now + windowMs;
        }

        if (rateData.count >= keydata.rate_limit)
        {
            return res.status(429).json({ 
                message: 'Rate limit exceeded',
                limit: keydata.rate_limit,
                resetAt: new Date(rateData.resetTime).toISOString()
            });
        }

        rateData.count++;

        // rate limit headers ;

        res.set ('X-RateLimit-Limit', keydata.rate_limit);
        res.set ('X-RateLimit-Remaining', keydata.rate_limit - rateData.count);
        res.set ('X-RateLimit-Reset', rateData.resetTime);

        req.user = {
            id: keydata.user_id,
            username: keydata.username,
            role: keydata.role
        };
        req.apiKey = keydata;
        
        next();
    }
    catch (err)
    {
        console.error('API Key auth error:', err);
        res.status(500).json({ message: 'Authentication error' });
    }
}



async function create_ApiKey_mw (req, res, next)
{
    try
    {
        const { name, rate_limit } = req.body;
        
        if (!name || name.trim() === '')
            {
            return res.status(400).json({ message: 'API key name is required' });
        }

        const apiKey = await apikeymodel.create(
            req.user.id, 
            name.trim(), 
            rate_limit || 100
        );
        res.status(201).json({
            message: 'API key created. Save this key - it will not be shown again!',
            apiKey: {
                id: apiKey.id,
                key: apiKey.key,
                prefix: apiKey.prefix,
                name: apiKey.name,
                rateLimit: apiKey.rateLimit
            }
        });
    }
    catch (err)
    {
        console.error('Error creating API key:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function listUsersApiKeys_mw (req, res , next)
{
    try
    {
        const Keys = await apikeymodel.listByUser (req.user.id);
        res.json({ apiKeys: Keys || [] });
    }
    catch (err)
    {
        console.error('Error listing API keys:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function delete_apiKeys_mw(req, res, next)
{
    try
    {
        const deleted = await apikeymodel.delete(req.params.id, req.user.id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'API key not found' });
        }
        
        res.json({ message: 'API key deleted' });
    }
    catch (err)
    {
        console.error('Error deleting API key:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function update_RateLimit_mw(req, res, next)
{
    try
    {
        const { rate_limit } = req.body;
        
        if (!rate_limit || rate_limit < 1)
            {
            return res.status(400).json({ message: 'Valid rate_limit is required' });
        }
        
        const updated = await apikeymodel.updateRateLimit(req.params.id, req.user.id, rate_limit);
        
        if (!updated)
        {
            return res.status(404).json({ message: 'API key not found' });
        }
        res.json({ message: 'Rate limit updated' });
    }
    catch (err)
    {
        console.error('Error updating API key:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {apiKey_auth_mw, create_ApiKey_mw, listUsersApiKeys_mw, delete_apiKeys_mw, update_RateLimit_mw};