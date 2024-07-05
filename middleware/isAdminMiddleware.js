import UserModel from '../Models/User.model.js';

/***
 * isAdminMiddleware is a middleware that checks if the auth user is admin
 */
const isAdminMiddelware = async (req, res, next) => {
  try {
    // Get the id of the authentified user from req
    const userId = req.auth.userId;

    const userAuth = await UserModel.findOne({ _id: userId });
    if (!userAuth.isAdmin) {
      req.flash('errors', "Vous n'avez pas acces à page");
      return res.render('user/create', {
        token: req.session.token,
        errors: req.flash('errors'),
      });
    }
    next();
  } catch (error) {
    req.flash('errors', "Erreur dans la création de l'utilisateur");
    return res.render('user/create', {
      token: req.session.token,
      errors: req.flash('errors'),
    });
  }
};

export default isAdminMiddelware;
