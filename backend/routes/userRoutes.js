const express = require('express')
const {registerUser,authUser,allUsers} = require('../controllers/UserControllers');
const {authenticate} = require("../middleware/authMiddleware")
const router = express.Router();

router.route('/').post(registerUser).get(authenticate,allUsers);

router.post('/login',authUser);

module.exports= router;