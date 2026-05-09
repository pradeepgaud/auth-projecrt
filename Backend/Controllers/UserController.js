import userModle from "../Models/UserModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId; // FIX: Now reading from req.userId

    const user = await userModle.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
