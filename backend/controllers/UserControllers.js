const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

// *************************Route 1**************************

// Registering New User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body; //Destructuring User Details from Request Body

  // Validating The Empty User Fields
  if (!name || !password || !email) {
    return res.status(400).json({ error: "Please Enter All Fields" });
    // throw new Error("Please Enter All Fields")
  }
  const userExits = await User.findOne({ email });

  if (userExits) {
    return res.status(409).json({ error: "User Already Exits" });
    // throw new Error("User Already Exits");
  }

  const salt = await bcrypt.genSalt(10); // Generating Salt
  const bcryptPassword = await bcrypt.hash(password, salt); // hashing password

  // creating New User
  const user = await User.create({
    name,
    email,
    password: bcryptPassword,
    pic,
  });

  // Server Sending Response with User Details
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ error: "Failed To Create User" });
    // throw new Error("Failed To Create User");
  }
});

// *************************Route 1**************************

// *************************Route 2**************************

// Authenticating the User -->Login
const authUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  // console.log(req.body);
  if (!user) {
    res.status(401).json({ error: "Invalid Email Or Password" });
    // throw new Error("Invalid Email Or Password");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  // console.log(passwordCompare);
  if (!passwordCompare) {
    return res.status(401).json({ error: "Invalid Email Or Password" });
    // throw new Error("Invalid Email Or Password");
  }
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    pic: user.pic,
    token: generateToken(user._id),
  });
});

// *************************Route 2**************************



// *************************Route 3**************************
// User MUST be Logged IN 
// /api/user?search=aagam

const allUsers = asyncHandler(async (req, res) => {
    // console.log(req);
    
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
      res.send(users);
});

// *************************Route 3**************************

const fetchAllUsers = asyncHandler(async (req, res) => {
  try {
    const query = { _id: { $ne: req.user._id } };
    const users = await User.find(query);
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


module.exports = { registerUser, authUser, allUsers,fetchAllUsers };
