import jwt from 'jsonwebtoken';

export const generateToken = (user, message, statusCode, res) => {

  const token = jwt.sign(
    {
      id: user._id, 
      role: user.role, 
    },
    process.env.JWT_SECRET_KEY, 
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  // Determine the cookie name based on the user's role
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

  // Set the token as a cookie in the response
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // Add additional cookie options if needed
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
