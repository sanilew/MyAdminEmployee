const JWT_SECRET = "KashyapSayani";
const jwt = require("jsonwebtoken");

const fetchuser = (req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error : "Please authenticate using a valid token"});
    }

    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    }  catch (error) {
        console.log("error : ", error);
        return res.status(500).send({ error })
    }
}

module.exports = fetchuser;