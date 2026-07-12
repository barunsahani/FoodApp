const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

  const token = user.getJWTToken();

  const cookieDays = parseInt(process.env.JWT_EXPIRES_TIME, 10) || parseInt(process.env.JWT_EXPIRE, 10) || 90;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

module.exports = sendToken;