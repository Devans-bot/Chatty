import jwt from 'jsonwebtoken'

const GenerateToken=(id,res)=>{
    const token =jwt.sign({id},process.env.JWT_SEC,{
        expiresIn:"15d"
    })
    
res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",   // OR "none" with secure
  secure: false,    // true only if HTTPS
});


}

export default GenerateToken