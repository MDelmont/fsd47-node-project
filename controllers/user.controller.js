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
    const title = 'Ajouter un utilisateur';
    res.render('user/form', {session: req.session, title})
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const  postCreateUserControlleur = async (req,res) => {
  const title = 'Ajouter un utilisateur';
  try{
   
    // check missing fields
    const requiredFields = [ 'gender','firstname',"lastname","email","password",
                              "confirmPassword","phone","birthdate","city","country",
                            "photo","category"];
      const missingFields = utilsForm.checkMissingField(req,requiredFields)
      if (missingFields.length > 0) {
        for (let field of missingFields){
          req.flash('errors', `Le champs "${field}" est requis.`);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors') ,user :req.body,title});
      }

      let {gender,firstname,lastname,email,password,
        confirmPassword,phone,birthdate,city,country,
        photo,category,isAdmin} = req.body;

      email = email.toLowerCase()

      // check password
      const errors = await utilsForm.checkPasswordCondition(password,confirmPassword)
      // return error if password condition not pass
      if (errors.length > 0) {
        for (let error of errors){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors') ,user :req.body,title});
      }

      // check gender
      const errorsGender = await utilsForm.checkGenderValue(gender)
      if (errorsGender.length > 0) {
        for (let error of errorsGender){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors') ,user :req.body,title});
      }

      // check category
      const errorsCategory = await utilsForm.checkCategoryValue(category)
      if (errorsCategory.length > 0) {
        for (let error of errorsCategory){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors') ,user :req.body,title});
      }

      // check Phone
      const errorsPhone= await utilsForm.checkPhoneFormat(phone)
      if (errorsPhone.length > 0) {
        for (let error of errorsPhone){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", {session: req.session, errors: req.flash('errors') ,user :req.body, title});
      }

      // check birthdate
      const errorsBirthdate= await utilsForm.checkDateFormat(birthdate)
      if (errorsBirthdate.length > 0) {
        for (let error of errorsBirthdate){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors'),user :req.body, title });
      }

      // check photo
      const errorsPhoto= await utilsForm.checkUrlFormat(photo)
      if (errorsPhoto.length > 0) {
        for (let error of errorsPhoto){
          req.flash('errors', error.msg);
        }
        return res.render("user/form", { session: req.session, errors: req.flash('errors'),user :req.body, title });
      }
      // check if user exist
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {

        req.flash('errors', "Un utilisateur existe déjà avec cette adresse email.");
        return res.render("user/form", { session: req.session, errors: req.flash('errors'),user :req.body, title});
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
        isAdmin : Boolean(isAdmin)
      });
      // save user in database
      const userSave = await newUser.save();

      // redirect to login page
      if (userSave){
        return res.redirect("/auth/login");
      } else {
        // If mongoose error
        req.flash('errors', "Une erreur interne est survenu");
        return res.render("user/form", { session: req.session, errors: req.flash('errors'),user :req.body, title});
      }
     
  }catch (error){
  console.log(error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("user/form", {session: req.session, errors: req.flash('errors'),user :req.body, title});
  }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUpdateUserControlleur = async (req,res) => {
    const userAuthId = req.auth.userId
    const userId = req.params.userId;
    const title = userId == userAuthId ? 'Modifier mon profil' :  'Modifier le profil'

    try {
        
        const user = await UserModel.findOne({_id: userId}).lean();

        const formattedUser = {
            ...user,
            birthdate: utilsData.formatDateYYYYMMDD(user.birthdate)
        }

        return res.render("user/form", { user: formattedUser, title, session: req.session, errors: req.flash('errors')});

    } catch (error) {
        console.log(error);
        req.flash('errors', "Une erreur interne est survenu");
        return res.render("user/form", { title, session: req.session, errors: req.flash('errors')});
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const  postUpdateUserControlleur = async (req,res) => {
    const userId = req.auth.userId
    const userModifyId = req.params.userId
    const title = userId == userModifyId ? 'Modifier mon profil' :  'Modifier le profil'
  try{

    // check missing fields
    const requiredFields = [ 'gender','firstname',"lastname","email","phone","birthdate","city","country",
    "photo","category"];
    const missingFields = utilsForm.checkMissingField(req,requiredFields)
    
    if (missingFields.length > 0) {
        for (let field of missingFields){
            req.flash('errors', `Le champs "${field}" est requis.`);
        }

        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
    }

    let {gender,firstname,lastname,email,password,
    confirmPassword,phone,birthdate,city,country,
    photo,category,isAdmin} = req.body;
    email = email.toLowerCase()

    if(password) {
        // check password
        const errors = await utilsForm.checkPasswordCondition(password,confirmPassword)
        // return error if password condition not pass

        if (errors.length > 0) {
        for (let error of errors){
        req.flash('errors', error.msg);
        }
            return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
        }
    }

    // check gender
    const errorsGender = await utilsForm.checkGenderValue(gender)
    if (errorsGender.length > 0) {
    for (let error of errorsGender){
    req.flash('errors', error.msg);
    }
        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}

    // check category
    const errorsCategory = await utilsForm.checkCategoryValue(category)
    if (errorsCategory.length > 0) {
    for (let error of errorsCategory){
    req.flash('errors', error.msg);
    }
        return res.render(`user/form`, { title,session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}

    // check Phone
    const errorsPhone= await utilsForm.checkPhoneFormat(phone)
    if (errorsPhone.length > 0) {
    for (let error of errorsPhone){
    req.flash('errors', error.msg);
    }
        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}

    // check birthdate
    const errorsBirthdate= await utilsForm.checkDateFormat(birthdate)
    if (errorsBirthdate.length > 0) {
    for (let error of errorsBirthdate){
    req.flash('errors', error.msg);
    }
        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}

    // check photo
    const errorsPhoto= await utilsForm.checkUrlFormat(photo)
    if (errorsPhoto.length > 0) {
    for (let error of errorsPhoto){
    req.flash('errors', error.msg);
    }
        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}
    const userAuth = await UserModel.findOne({ _id:userId });
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // Update user fields with values from req.body
      existingUser.gender = gender;
      existingUser.firstname = firstname;
      existingUser.lastname = lastname;
      existingUser.email = email;
      if(password) existingUser.password = password; // Assuming you handle password hashing
      existingUser.phone = phone;
      existingUser.birthdate = birthdate;
      existingUser.city = city;
      existingUser.country = country;
      existingUser.photo = photo;
      existingUser.category = category;
      if ( userAuth.isAdmin){
        existingUser.isAdmin = Boolean(isAdmin);   
      } 
      await existingUser.save();
      req.flash('success', "Modification réalisée avec succès !");
      res.render('user/form',{ title,session: req.session, success: req.flash('success'), user: {...req.body, _id: userModifyId}})
    }
  }catch (error){
  console.log(error);
    req.flash('errors', "Une erreur interne est survenu");
        return res.render(`user/form`, { title, session: req.session, errors: req.flash('errors') , user: {...req.body, _id: userModifyId}});
}
}

const getHome = async (req,res) => {
  try{
    const user =  await UserModel.aggregate([{ $sample: { size: 1 } }]);
    return res.render("user/home", { session: req.session, errors: req.flash('errors'),user : user[0],utilsData });
  }catch (error){
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("auth/login", { session: req.session, errors: req.flash('errors') });
  }
}

const getDeleteUserControlleur = async (req,res) => {
  try{
    const userId = req.params.userId
    await UserModel.deleteOne({_id:userId})
    res.redirect('/user/list')
  } catch (error) {
    console.log(error)
    res.redirect('/user/list')
  }
}

const getListUserControlleur = async (req,res) => {
  const {search,searchBy,category} = req.query
  let filter = {};
  if (search && searchBy) {
    if (searchBy === 'name') {
      filter.$or = [
          { firstname: { $regex: search, $options: 'i' } },
          { lastname: { $regex: search, $options: 'i' } }
      ];
    } else if (searchBy==='localisation'){
        filter.$or = [
          { city: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
      ];
        
    } else {
      filter[searchBy] = { $regex: search, $options: 'i' };
    }
  }
  if (category && category !== 'all') {
      filter.category = category;
  }
  const users = await UserModel.find(filter)
  res.render("user/list",{session: req.session, users,utilsData, historyData : {search,searchBy,category}})
}

export default  {
  getCreateUserControlleur,
  postCreateUserControlleur,
  getUpdateUserControlleur,
  postUpdateUserControlleur,
  getHome,
  getDeleteUserControlleur,
  getListUserControlleur
}