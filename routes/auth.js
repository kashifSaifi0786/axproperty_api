const router = require("express").Router();
const User = require("../model/user");
const { validate } = require("../model/user");
const CryptoJs = require("crypto-js");

router.post("/register/:type", async (req, res) => {
  const type = req.params.type;

  if (type !== "admin") {
    return res.status(400).json("Invalid type");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Credentials required.");
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json("Email Already registered.");
    }

    const newUser = new User({
      name,
      email,
      password: CryptoJs.AES.encrypt(password, process.env.PAS_SEC).toString(),
      role: "admin",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json("Wrong credentials");

    const hashedPass = CryptoJs.AES.decrypt(user.password, process.env.PAS_SEC);
    const originalPas = hashedPass.toString(CryptoJs.enc.Utf8);

    if (originalPas !== password) {
      return res.status(401).json("Wrong credentials");
    }

    const token = user.generateAuthToken();

    const { password: pas, ...rest } = user._doc;

    res.status(200).json({ ...rest, token });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
