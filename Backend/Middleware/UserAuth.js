// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.json({ success: false, message: `Not Authorized, Login Again` });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode?.id) {
//       req.userId = tokenDecode.id; // FIX: Do not use req.body
//       next();
//     } else {
//       return res.json({
//         success: false,
//         message: `Not Authorized Login Again`,
//       });
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export default userAuth;

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // ✅ Check cookie first, then Authorization header (for production cross-origin)
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login Again" });
  }
};

export default userAuth;
