// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

// Register a new user

const validateRegisterInput = (
  username,
  firstname,
  lastname,
  number,
  password
) => {
  if (!username) return "Username is required";
  if (!firstname) return "First name is required";
  if (!lastname) return "Last name is required";
  if (!number) return "Phone number is required";
  if (!password) return "Password is required";
  return null;
};

router.post("/register", async (req, res) => {
  const { username, firstname, lastname, number, password } = req.body;
  const validationError = validateRegisterInput(
    username,
    firstname,
    lastname,
    number,
    password
  );
  if (validationError) {
    return res.status(400).json({ msg: validationError });
  }
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ username, firstname, lastname, number, password });
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
