const express = require ('express');
const { list_friends_mw , send_friend_request_mw, removeFriend_mw , accept_friend_mw, list_pendingfriend_mw, list_sent_requests_mw} = require ('../middlewares/friends_middleware');
const router = express.Router ();


router.get ('/list', list_friends_mw);

router.get ('/pending', list_pendingfriend_mw);

router.get ('/sent', list_sent_requests_mw);


router.post ('/request', send_friend_request_mw );

router.delete ('/remove', removeFriend_mw);

router.put ('/accept', accept_friend_mw);



module.exports = router;