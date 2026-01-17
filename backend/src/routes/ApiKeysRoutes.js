const express = require ('express');
const router = express.Router ();


const {create_ApiKey_mw, 
    listUsersApiKeys_mw, delete_apiKeys_mw, update_RateLimit_mw
} = require ('../middlewares/api_keys_middleware');


router.post ('/', create_ApiKey_mw);

router.get ('/', listUsersApiKeys_mw);

router.delete ('/:id', delete_apiKeys_mw);

router.patch ('/', update_RateLimit_mw);


module.exports = router;
