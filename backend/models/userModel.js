const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg",
  },
},
{
    timestamps: true
}
);

const User = mongoose.model("User", userModel);

module.exports = User;
