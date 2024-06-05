import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
//protected routes token base

    //jb v request get krnge tb  uske bad me next validate honga or phir response send hga
export const requireSignIn = async(req,res,next) =>{
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET);
          req.user = decode ; 
          console.log('islooged in middleware',decode);
     next();
    } catch (error) {
        console.log(error)
    }
};
//admin acess
export const isAdmin = async(req,res,next) =>{
  try {
     const user =await userModel.findById(req.user._id);
     if(user.role!==1){
        return res.status(401).send({
            sucess:false,
            message:'UnAuthorised Acess'
        })
     }else{
        next();
     }
  } catch (error) {
    console.log(error);
    res.status(401).send({
        sucess:false,
        error,
        message:'Error in Admin Middleware'
    })
    
  }
};