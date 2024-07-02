import utilsForm from "../utils/utilsForm.js";
import UserModel from "../Models/User.model.js"
import dotenv from "dotenv";
import utilsData from "../utils/utilsData.js"
dotenv.config();



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getCreateUserControlleur  = async (req,res) => {
  res.render('admin/create')
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const  postCreateUserControlleur = async (req,res) => {
  try{
    
    // check missing fields
    const requiredFields = [ 'gender','firstname',"lastname","email","password",
                              "password_confirm","phone","birthdate","city","country",
                            "photo","category","isAdmin"];
      const missingFields = utilsForm.checkMissingField(req,requiredFields)
      if (missingFields.length > 0) {
        for (let field of missingFields){
          req.flash('errors', `Le champs "${field}" est requis.`);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
      }

      let {gender,firstname,lastname,email,password,
        password_confirm,phone,birthdate,city,country,
        photo,category,isAdmin} = req.body;

      email = email.toLowerCase()

      // check password
      const errors = await utilsForm.checkPasswordCondition(password,password_confirm)
      // return error if password condition not pass
      if (errors.length > 0) {
        for (let error of errors){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
      }

      // check gender
      const errorsGender = await utilsForm.checkGenderValue(gender)
      if (errorsGender.length > 0) {
        for (let error of errorsGender){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
      }

      // check category
      const errorsCategory = await utilsForm.checkCategoryValue(category)
      if (errorsCategory.length > 0) {
        for (let error of errorsCategory){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
      }

      // check Phone
      const errorsPhone= await utilsForm.checkPhoneFormat(phone)
      if (errorsPhone.length > 0) {
        for (let error of errorsPhone){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
      }

      // check birthdate
      const errorsBirthdate= await utilsForm.checkDateFormat(birthdate)
      if (errorsBirthdate.length > 0) {
        for (let error of errorsBirthdate){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body });
      }

      // check photo
      const errorsPhoto= await utilsForm.checkUrlFormat(photo)
      if (errorsPhoto.length > 0) {
        for (let error of errorsPhoto){
          req.flash('errors', error.msg);
        }
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body });
      }
      // check if user exist
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {

        req.flash('errors', "Un utilisateur existe déjà avec cette adresse email.");
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body});
      }
      // create user with data
      const newUser = new UserModel({
        gender,
        firstname,
        lastname,
        email,
        password,
        phone,
        birthdate,
        city,
        country,
        photo,
        category,
        isAdmin
      });
      // save user in database
      const userSave = await newUser.save();

      // redirect to login page
      if (userSave){
        return res.redirect("/auth/login");
      } else {
        // If mongoose error
        req.flash('errors', "Une erreur interne est survenu");
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body});
      }
     
  }catch (error){
  console.log(error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body});
  }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUpdateUserControlleur = async (req,res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);

        const formattedUser = {
            ...user,
            birthdate: utilsData.formatDateYYYYMMDD(user.birthdate)
        }

        console.log('formatted user = ', formattedUser);
        return res.render("user/form", { url: `/user/update/${userId}`, user: formattedUser, title:'Modifier mon profil', btnText:'Modifier', token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});

    } catch (error) {
        console.log(error);
        req.flash('errors', "Une erreur interne est survenu");
        return res.render("user/form", {title:'Modifier mon profil', token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const  postUpdateUserControlleur = async (req,res) => {
  try{
    const userId = req.auth.userId
    const userModify = req.params.userId
    // check missing fields
    const requiredFields = [ 'gender','firstname',"lastname","email","password",
      "password_confirm","phone","birthdate","city","country",
    "photo","category","isAdmin"];
    const missingFields = utilsForm.checkMissingField(req,requiredFields)
    if (missingFields.length > 0) {
    for (let field of missingFields){
    req.flash('errors', `Le champs "${field}" est requis.`);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }

    let {gender,firstname,lastname,email,password,
    password_confirm,phone,birthdate,city,country,
    photo,category,isAdmin} = req.body;

    email = email.toLowerCase()

    // check password
    const errors = await utilsForm.checkPasswordCondition(password,password_confirm)
    // return error if password condition not pass
    if (errors.length > 0) {
    for (let error of errors){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }

    // check gender
    const errorsGender = await utilsForm.checkGenderValue(gender)
    if (errorsGender.length > 0) {
    for (let error of errorsGender){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }

    // check category
    const errorsCategory = await utilsForm.checkCategoryValue(category)
    if (errorsCategory.length > 0) {
    for (let error of errorsCategory){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }

    // check Phone
    const errorsPhone= await utilsForm.checkPhoneFormat(phone)
    if (errorsPhone.length > 0) {
    for (let error of errorsPhone){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') ,informationHistory :req.body});
    }

    // check birthdate
    const errorsBirthdate= await utilsForm.checkDateFormat(birthdate)
    if (errorsBirthdate.length > 0) {
    for (let error of errorsBirthdate){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body });
    }

    // check photo
    const errorsPhoto= await utilsForm.checkUrlFormat(photo)
    if (errorsPhoto.length > 0) {
    for (let error of errorsPhoto){
    req.flash('errors', error.msg);
    }
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body });
    }
    const userAuth = await UserModel.findOne({ _id:userId });
    const existingUser = await UserModel.findOne({ email });
    
    if(userAuth.isAdmin != true && existingUser._id != userId){

      req.flash('errors', "Modification non autorisée");
      return res.render("user/create", { token: req.session.token, errors: req.flash('errors'),informationHistory :req.body});
    }

    if (existingUser) {
      // Update user fields with values from req.body
      existingUser.gender = gender;
      existingUser.firstname = firstname;
      existingUser.lastname = lastname;
      existingUser.email = email;
      existingUser.password = password; // Assuming you handle password hashing
      existingUser.phone = phone;
      existingUser.birthdate = birthdate;
      existingUser.city = city;
      existingUser.country = country;
      existingUser.photo = photo;
      existingUser.category = category;
      if ( userAuth.isAdmin ){
        existingUser.isAdmin = isAdmin;   
      }
     
      await existingUser.save();
      req.flash('succes', "Modification non autorisée");
      res.render('users/list',{ token: req.session.token, succes: req.flash('errors')})
    }
  }catch (error){
  console.log(error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("user/create", { token: req.session.token, errors: req.flash('errors') });
  }
}

const getHome = async (req,res) => {
  console.log(req.session.token)
  try{
    const user =  await UserModel.aggregate([{ $sample: { size: 1 } }]);
    return res.render("user/home", { token: req.session.token, isAdmin:req.session.isAdmin, errors: req.flash('errors'),user : user[0],utilsData });
  }catch (error){
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
  }
}

const getDeleteUserControlleur = async (req,res) => {
  try{
    const userId = req.params.userId
    await UserModel.deleteOne({_id:userId})
    res.redirect('/user/all')
  } catch (error) {
    console.log(error)
    redirect('/user/all')
  }
}
const getUCreateUserControlleur = async (req,res) =>{
   // faire le rendu du pug
}

const getListUserControlleur = async (req,res) => {
  const users = await UserModel.find()
  res.render("user/list",{users,utilsData})
}

export default  {
  getCreateUserControlleur,
  postCreateUserControlleur,
  getUpdateUserControlleur,
  postUpdateUserControlleur,
  getHome,
  getDeleteUserControlleur,
  getUCreateUserControlleur,
  getListUserControlleur
}