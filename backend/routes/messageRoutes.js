const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const router = express.Router();

router.route('/').post(authenticate,sendMessage);
router.route('/:chatId').get(authenticate,allMessages);

module.exports = router;