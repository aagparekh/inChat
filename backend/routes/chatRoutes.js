const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {accessChat, fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require('../controllers/chatControllers');
const router = express.Router(); 

router.route("/").post(authenticate, accessChat).get(authenticate, fetchChats);
router.route("/group").post(authenticate,createGroupChat);
router.route("/rename").put(authenticate,renameGroup);
router.route("/add-to-group").put(authenticate,addToGroup);
router.route("/remove-from-group").put(authenticate,removeFromGroup);

module.exports = router;