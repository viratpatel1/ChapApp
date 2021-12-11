import jwt from "jsonwebtoken";
const Auth = (req, res, next) =>
{
    try
    {
        const token = req.header("token");
        // console.log("req ", req.body)
        console.log("token ", token);
        if (!token)
            return res.status(401).json({ message: "No authentication token, access denied" });
        const verified = jwt.verify(token, process.env.Key);
        if (!verified)
            return res.status(401).json({ message: "Token verification failed, authorization denied" });
        req.user = verified._id;
        next();
    } catch (err)
    {
        res.status(500).json({ error: err.message });
    }
}
export default Auth;