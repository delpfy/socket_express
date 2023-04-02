import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    
        jwt.verify(token, "greeneyes");
        
        const userRole = jwt.decode(token, "greeneyes")._role;
        if (userRole != "manager") {
          return res.status(403).json({
            success: false,
            error: "Operation is availible only for manager type",
          });
        } else {
          next();
        }
      
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "User is not authorized",
    });
  }
};
