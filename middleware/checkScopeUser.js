import UserModel from "../Models/User.model.js"

/***
 * checkScopeUser is a fonction midleware for check if userauth can update user 
 */
const checkScopeUser = async (req, res, next) => {
    try{
    // Get the token from the request headers
    const userId = req.auth.userId
    const userModifyId = req.params.userId
    // Check if there is a token
    if (userId != userModifyId) {

        req.flash('errors', "Vous n'avez pas acces à cette modification");
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') });
    }

    const userAuth = await UserModel.findOne({ _id: userId});
    if(!userAuth.isAdmin){
        req.flash('errors', "Vous n'avez pas acces à cette modification");
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') });
    }
    next()
    } catch (error) {
        req.flash('errors', "Erreur dans la création de l'utilisateur");
        return res.render("user/create", { token: req.session.token, errors: req.flash('errors') });
    }
};

export default checkScopeUser;