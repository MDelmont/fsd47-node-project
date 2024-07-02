/***
 * checkScopeUser is a fonction midleware for check if userauth can update user 
 */
const checkScopeUser = async (req, res, next) => {
    try{
    // Get the token from the request headers
    const userId = req.auth.userId
    const userModifyId = req.params.userId
    // Check if there is a token
    if (userId != userModifyId && !req.session.isAdmin) {
        return res.redirect("/user/list");
    }

    next()
    } catch (error) {
        return res.redirect("/user/list");
    }
};

export default checkScopeUser;