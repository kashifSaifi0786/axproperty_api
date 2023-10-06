const router = require("express").Router();
const CryptoJs = require("crypto-js");
const User = require("../model/user");
const { generatePassword } = require("../utils/commonMethod");
const { verifyToken, isAdminAndSrManager } = require("../middleware/access");

router.post("/:userId", isAdminAndSrManager, async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role)
    return res.status(401).json("Fields are required.");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).json("Email Already exists.");

    const genPas = generatePassword();
    console.log(genPas);

    const user = new User({
      email,
      role,
      name,
      password: CryptoJs.AES.encrypt(genPas, process.env.PAS_SEC).toString(),
    });

    const savedUser = await user.save();

    return res.status(201).json("User created succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.put("/:userId/:id", isAdminAndSrManager, async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role)
    return res.status(401).json("Fields are required.");

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          email,
          role,
        },
      },
      { new: true }
    );

    return res.status(201).json("User updated succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.delete("/:userId/:id", isAdminAndSrManager, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    return res.status(201).json("User deleted succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
