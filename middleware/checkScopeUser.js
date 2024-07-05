/***
 * checkScopeUser is a middleware that checks if auth user can update user profile
 */
const checkScopeUser = async (req, res, next) => {
  try {
    // Get the id of the authentified user from req
    const userId = req.auth.userId;
    // Get the id from the params
    const userModifyId = req.params.userId;
    // Check if the 2 ids we got are equivalent or if the auth user is admin and if not, redirect
    // because a user cannot update the profile of another user except if he is admin
    if (userId != userModifyId && !req.session.isAdmin) {
      return res.redirect('/user/list');
    }

    next();
  } catch (error) {
    return res.redirect('/user/list');
  }
};

export default checkScopeUser;
