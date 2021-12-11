import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passform } from "../models/passmodel.js";
import Auth from "../middleware/Auth.js";


const router = express.Router()

router.get("/", async (req, res) =>
{
    try
    {
        await passform.find()
            .then((ress) => res.send(ress))
            .catch((err) => console.log(err.message));


    } catch (err)
    {
        console.log(err)
    }
});


router.post("/login", async (req, res) =>
{
    try
    {
        const { email, password } = req.body;
        // console.log(req.body)

        const isPresent = await passform.findOne({ email });
        if (!isPresent)
        {
            console.log("No User Found")
            return res.status(401).json({ message: "No User Present" })
        } else
        {
            // console.log(isPresent)
            const isMatch = await bcrypt.compare(password, isPresent.password)
            if (isPresent)
            {
                const token = await jwt.sign({ id: isPresent._id }, process.env.Key, { expiresIn: "1h" });
                // const userverify = await jwt.verify(token, process.env.Key);
                // console.log("token ", token)
                console.log("Login")
                // res.cookie(`token`, token, {
                //     expires: new Date(Date.now() + 258900),
                //     httpOnly: true,
                // });

                // res.json({ ...isPresent.toObject(), token: token });
                return res.status(200).json({ message: "Login Success", isPresent, token })
            } else
            {
                console.log("Invalid Credentials")
                return res.status(500).json({ message: "Invalid Credentials" })
            }
        }

    } catch (error)
    {
        console.log("Error")
        return res.status(400).json({ message: "Something went Wrong" });
    }
})


router.post("/signup", async (req, res) =>
{
    try
    {
        const { email, password, profilepic, username } = req.body;
        console.log(username, email, password)
        // if (!email || !password || !username) return res.status(500).json({ message: "Required Feild" });
        const CheckEmail = await passform.findOne({ email });
        const HashPassword = await bcrypt.hash(password, 12);
        if (CheckEmail) return res.status(400).json({ message: "User Present with Same Email" });
        // const token = jwt.sign({ NewData_id: NewData._id, email }, process.env.Key, { expiresIn: "1h" },);
        const NewData = await new passform({
            email, password: HashPassword, username, profilepic
        });

        await NewData.save()
            .then(() => res.status(200).json({ message: "Registered Success" }))
            .catch((err) => res.status(400).json({ err }));
    } catch (error) 
    {
        res.status(400).json({ error });
    }
})




export const LoginRoute = router;