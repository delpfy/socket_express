import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(403).json({
      success: false,
      error: "User is not authorized",
    });
  } else {
    try {
      req.userId = jwt.verify(token, "greeneyes")._id;
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        error: "User is not authorized",
      });
    }
  }
};
