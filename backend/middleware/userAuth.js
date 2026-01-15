import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.json({success: false, message: "Not Authorized! Please Login Again."})
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(decodedToken.id){
            req.userId = decodedToken.id
        }else{
            return res.json({success: false, message: "Not Authorized! Please Login Again."})
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth;