// Importing required modules and dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = "KashyapSayani";

// Route for user registration
router.post(
    "/register",
    // Validation middleware for input fields
    [
        body("first_name").isLength({ min: 3 }),
        body("last_name").isLength({ min: 3 }),
        body("email").isEmail(),
        body("city").isLength({ min: 3 }),
        body("state").isLength({ min: 3 }),
        body("role").isLength(1),
        body("password").isLength({ min: 3 })
    ],
    async (req, res) => {
        let success = false;

        // Validate input fields
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }

        try {
            // Check if user with the same email already exists
            let user = await User.findOne({ email: req.body.email })

            if (user) {
                return res.status(200).json({ success, error: "Sorry a user with this email already exists" })
            }

            // Hash the password before storing in the database
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            // Create a new user in the database
            user = await User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                dob: req.body.dob,
                city: req.body.city,
                state: req.body.state,
                role: req.body.role,
                password: secPass
            });

            // Create JWT token for the user
            const data = {
                user: {
                    id: user.id,
                    role: user.role
                },
            };

            success = true;

            // Send success response along with user details
            return res.json({ success, user });

        } catch (error) {
            // Handle errors and send a 500 internal server error response
            console.log("error : ", error);
            return res.status(500).send({ success: false, error });
        }
    }
);

// Route for user login
router.post(
    "/login",
    // Validation middleware for input fields
    [
        body("email").isEmail(),
        body("password").isLength({ min: 3 })
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Check if user with the given email exists
            let user = await User.findOne({ email: email })

            if (!user) {
                return res.status(200).json({ success, error: "Please try to login with correct credentials" })
            }

            // Compare the provided password with the hashed password in the database
            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(200).json({ success, error: "Please try to login with correct credentials" })
            }

            // Create JWT token for the authenticated user
            const data = {
                user: {
                    id: user.id,
                    role: user.role
                },
            };

            const authToken = jwt.sign(JSON.stringify(data), JWT_SECRET);

            success = true;
            const role = user.role;

            // Send success response along with authentication token and user role
            return res.json({ success, authToken, role });

        } catch (error) {
            // Handle errors and send a 500 internal server error response
            console.log("error : ", error);
            return res.status(500).send({ success: false, error });
        }
    }
);

// Exporting the router for use in other files
module.exports = router;