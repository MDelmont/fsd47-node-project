import utilsForm from "../utils/utilsForm.js";
import UserModel from "../Models/User.model.js"
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
dotenv.config();


const postLoginController = async (req,res) => {
  console.log('start to postLoginController')
  try {
    
    // check missing field
    const requiredFields = ['email', 'password'];
    
   const missingFields = utilsForm.checkMissingField(req,requiredFields)
   if (missingFields.length > 0) {
    for (let field of missingFields){
      req.flash('errors', `Le champs "${field}" est requis.`);
    }
    return res.render("auth/login", { session: req.session, errors: req.flash('errors') });
  }
  const {email,password} = req.body
    // Get user with email
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    // Return response if user does not exist
    if (!user) {
      req.flash('errors', `Email ou mot de passe invalide.`);
   
      return res.render("auth/login", { session: req.session, errors: req.flash('errors') });
    }
    // Compare the password
    const valid = await user.comparePassword(password);
  
    // Return response if password is not valid
    if (!valid) {
      req.flash('errors', `Email ou mot de passe invalide.`);
   
      return res.render("auth/login", { session: req.session, errors: req.flash('errors') });
    }
    req.session.isAdmin = user.isAdmin
    
    // creat jwt token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY_JWT_AUTH,
      { expiresIn: '24h' }
    )
    // put token in session
    req.session.token = token
    req.session.activeUser = {_id : user._id, photo: user.photo}
    return res.redirect('/user/home')
  } catch (error) {
    // redirect to login page with errors
    console.log('error',error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("auth/login", { session : req.session, errors: req.flash('errors') ,historyData:req.body});
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getLoginController = async (req,res) => {
  if(req.session.token){
    res.redirect('/user/home')
  }
  // redirect to login page
  res.render("auth/login" ,{ session: req.session, errors: req.flash('errors'),success: req.flash('success') });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getLogoutController = async (req,res) => {
  // destroy session for logout
  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la destruction de la session:', err);
    } else {
      console.log('Session détruite avec succès.');
      // redirect to login page
      res.redirect('/auth/login');
    }
  });


}


export default  {
  postLoginController,
  getLoginController,
  getLogoutController,
}