import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // Removing word "Bearer" from token.
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  console.log("req.headers.authorization " + req.headers.authorization);
  if (!token) {
    // If failed to get token, user is not authorized.
    return res.status(403).json({
      success: false,
      error: "Token not found",
    });
  } else {
    // If succeeded to get token, decrypting the token to get field "_id".
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
