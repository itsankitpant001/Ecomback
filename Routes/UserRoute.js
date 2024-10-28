const router=require('express').Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const UserModel = require('../Model/UserSchema');

// API to Register a User
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    // Check if the user already exists
    const userExists = await UserModel.findOne({ username });
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const userExists2 = await UserModel.findOne({ email });
    if (userExists2) {
        return res.status(400).json({ message: "email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new UserModel({
        email,
        username,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
});
// API to Login a User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username },"secret");

    res.status(200).json({ message: "Login successful", token,userId:user._id });
});
module.exports=router