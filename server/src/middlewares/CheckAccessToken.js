import jwt from "jsonwebtoken";

const CheckToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json({
      status: 401,
      message: 'token is required'
    });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({
        sttaus: 401,
        message: "invalid token",
      })
      req.current_user = decoded
      next();
    })
  } catch (error) {
    console.error(error);
    res.status(401).send({
      status: 401,
      message: "something wrong with token"
    });
  }
}

export default CheckToken