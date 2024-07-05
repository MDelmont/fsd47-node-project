import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_AUTH;
/***
 * authMiddleware is a middleware that checks if user is authenticated
 */
const authMiddleware = (req, res, next) => {
  console.log('start check auth');
  // Get the token from the session
  const token = req.session.token;
  // Check if there is a token
  if (!token) {
    return res.redirect('auth/login');
  }

  try {
    // Verify the token with jwt
    const decoded = jwt.verify(token, secretKey);

    // add user id to the req auth
    req.auth = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    console.error('Error in authMiddleware');
    console.error(error);
    return res.redirect('auth/login');
  }
};

export default authMiddleware;
