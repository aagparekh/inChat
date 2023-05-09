const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');



const authenticate = asyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password")   //req.user is my current authenticated user
            next();
        } catch (error) {
            return res.status(401).json({error: "User Unauthorized"});
        }
    }
});

module.exports = {authenticate};