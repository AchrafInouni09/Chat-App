const express = require ('express');
const router = express.Router ();

const {
  list_conversations_mw,
  direct_conversation_mw,
  list_messages_mw,
  create_group_mw,
  list_all_groups_mw,
  join_group_mw
} = require("../middlewares/chat_middleware");

router.get ("/conversations", list_conversations_mw);
router.post ("/conversation/direct", direct_conversation_mw);
router.get ("/conversations/:id/messages", list_messages_mw);


// Room
router.post("/groups", create_group_mw);
router.get("/groups", list_all_groups_mw);
router.post("/groups/:id/join", join_group_mw); 

module.exports = router;