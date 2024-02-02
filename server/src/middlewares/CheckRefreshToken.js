import jwt from "jsonwebtoken";

const CheckRefreshToken = ( req, res, next ) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) return res.status(401).json({
      status: 401,
      message: 'token is required'
    });
    jwt.verify( refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) { 
        return res.status(401).json({
          status: 401,
          message: "invalid refresh token"
        })
      }
      req.current_user = decoded
      next();
    });
  } catch (error) {
    console.log(error);
  }
}

export default CheckRefreshToken