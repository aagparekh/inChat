const express = require('express')
const {registerUser,authUser,allUsers, fetchAllUsers} = require('../controllers/UserControllers');
const {authenticate} = require("../middleware/authMiddleware")
const router = express.Router();

router.route('/').post(registerUser).get(authenticate,allUsers);
router.route('/fetchalluser').get(authenticate,fetchAllUsers)
router.post('/login',authUser);

module.exports= router;