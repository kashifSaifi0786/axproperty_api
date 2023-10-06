const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function (cb) {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      name: this.name,
    },
    process.env.JWT_SEC
  );

  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).label("Name"),
    email: Joi.string().email({}).required().label("Email"),
    password: Joi.string().min(5).required().label("Password"),
    role: Joi.string().max(15).label("Role"),
  });

  return schema.validate(user);
}

module.exports = mongoose.model("User", userSchema);
module.exports.validate = validateUser;
