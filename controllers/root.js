import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randomString from "../utils/random.js";
import config from "config";
import CryptoJS from "crypto-js";
import userModel from "../models/user/user.js";
import { userRegisterValidations, errorMiddleware } from "../middleware/index.js"
import user from "../models/user/user.js";


const router = express.Router();


router.post("/register", userRegisterValidations(), errorMiddleware, async (req, res) => {
    try {
        let userData = new userModel(req.body);

        // checking

        let emailCheck = await userModel.findOne({ email: userData.email });
        let phoneCheck = await userModel.findOne({ phone: userData.phone });

        if (emailCheck || phoneCheck) {
            return res.status(200).json({ msg: "Email and phone already Exist" });
        };

        // Hasing.

        let hashing = await bcrypt.hash(userData.password, 10);
        userData.password = hashing;

        console.log(hashing);


        // random String. 

        userData.userverifyToken.email = randomString(10);
        userData.userverifyToken.phone = randomString(10);


        // User Authentication.

        let emailToken = jwt.sign({
            email: userData.userverifyToken.email
        },
            config.get("JWTKEY"),
            { expiresIn: "60000" }
        );

        let phoneToken = jwt.sign(
            { phone: userData.userverifyToken.phone },
            config.get("JWTKEY"),
            { expiresIn: "60000" }
        );



        console.log(`${config.get("URL")}/public/email/verify/${emailToken}`);
        console.log(`${config.get("URL")}/public/phone/verify/${phoneToken}`);


        await userData.save();




        await userModel.create(userData);
        return res.status(200).json({ msg: "User added successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


router.get("/email/verify/:token", async (req, res) => {
    try {
        let token = req.params.token;
        let verify = await jwt.verify(token, config.get("JWTKEY"));
        if (!verify) {
            return res.status(401).json({ success: false, msg: "Token Expire. Please Register Again" })
        }

        let userData = await userModel.findOne({
            "userverifyToken.email": verify.email
        });

        if (!userData) {
            return res.status(200).json({ success: "The Email has been Verified." });
        }
        // console.log(userData);
        userData.userverified.email = true;
        await userData.save();
        res.status(200).json({ success: "The Email has been Verified." });

    } catch (error) {
        res.status(500).json({ sucess: false, msg: "Internel Server Error" });

    }
});

router.get("/phone/verify/:token", async (req, res) => {
    try {
        let token = req.params.token;
        let verify = await jwt.verify(token, config.get("JWTKEY"));
        // console.log(verify);

        if (!verify) {
            res.status(401).json({ msg: "Token expired" })
        };

        let userData = await userModel.findOne({
            "userverifyToken.phone": verify.phone
        })

        if (!userData) {
            return res.status(200).json({ success: "The phone has been verifed" })
        }

        userData.userverified.phone = true;

        await userData.save();
        res.status(200).json({ success: true, msg: "The phone number has been verified" })



    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, msg: "Internel Server Error" });

    }
});


router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        
        let emailfind = await userModel.findOne({ email: email });
        if (!emailfind) {
            res.status(404).json({msg : "User email not Found Please Register!"})
        }

        let verifyPassword = await bcrypt.compare(password, emailfind.password);
        if (!verifyPassword); {
            return res.status(500).json({ msg: "Incorrect Password" })

        }

       


    } catch (error) {
        console.log(error);
        res.status(500).json({msg : "Internal Server Error"})
    }
})

export default router; 