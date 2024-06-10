const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const User = require("../model/User")
const bcrypt = require("bcryptjs");

router.get("/fetchalluser", fetchuser, async (req, res) => {
    try{
        let success = false;

        if(req.user.role === "3"){
            return res.status(200).json({ success, error: "You don't have access to fetch all user" });
        }
    
        const users = await User.find({ user: req.user.id });
        success = true;
        return res.json({success,users});
    }
    catch (error) {
        console.log("error : ", error);
        return res.status(500).send({success : false, error });
    }

});

router.get("/fetchuserbyid/:id", fetchuser, async (req, res) => {
    try{
        let success = false;
        const userId = req.params.id;

        if(req.params.id !== req.user.id && req.user.role === "3"){
            return res.status(200).json({ success, error: "You don't have access to fetch another user" });
        }

        const user = await User.findById(userId).select("-password");

        if(!user) {
            return res.status(404).json({ success, error: "User not found" })
        }

        success = true;
        return res.json({success,user});
    }
    catch (error) {
        console.log("error : ", error);
        return res.status(500).send({success : false, error })
    }
});

router.put("/updateuser/:id", fetchuser, async (req,res) => {
    try {

        const {first_name,last_name,email,dob,city,state,role,password} = req.body;

        let updatedUser = {};

        first_name && (updatedUser.first_name = first_name);
        last_name && (updatedUser.last_name = last_name);
        email && (updatedUser.email = email);
        dob && (updatedUser.dob = dob);
        city && (updatedUser.city = city);
        state && (updatedUser.state = state);
        role && (updatedUser.role = role);
        password && (updatedUser.password = password);

        let user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({ success, error: "User not found" })
        }

        if(req.user.role === "3"){
            return res.status(200).json({ success, error: "You don't have access to edit user" })
        }

        let secPass;
        const salt = await bcrypt.genSalt(10);
        password && (secPass = await bcrypt.hash(req.body.password, salt));
        secPass && (updatedUser.password = secPass);

        user = await User.findByIdAndUpdate(req.params.id,{$set: updatedUser},{new:true});

        success = true;

        return res.json({success,user});

    } catch (error) {
        console.log("error : ", error);
        return res.status(500).send({success : false, error });
    }
});

router.delete("/deleteuser/:id", fetchuser, async (req,res) => {
    try {

        let user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({ success, error: "User not found" })
        }

        if(!req.user.role === "1"){
            return res.status(200).json({ success, error: "You don't have access to delete user" })
        }

        user = await User.findByIdAndDelete(req.params.id);

        success = true;

        return res.json({success,user});

    } catch (error) {
        console.log("error : ", error);
        return res.status(500).send({success : false, error });
    }
});

module.exports = router;