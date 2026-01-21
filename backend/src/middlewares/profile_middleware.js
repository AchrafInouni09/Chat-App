const { User } = require("../models/users");

async function get_my_profile_mw(req, res) {
  try {
    const userModel = new User();
    const me = await userModel.getById(req.user.id);

    if (!me) return res.status(404).json({ message: "User not found" });
    return res.json({ user: me });
  } catch (err) {
    console.error("get_my_profile_mw error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function update_my_profile_mw(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing. Check Content-Type header.",
      });
    }

    // ✅ Handle avatar upload if present
    let avatar_url = null;
    if (req.file) {
      avatar_url = req.file.filename; // just the filename
    }

    const userModel = new User();

    // Add avatar_url to payload if file uploaded
    const updatePayload = { ...req.body };
    if (avatar_url) {
      updatePayload.avatar_url = avatar_url;
    }

    const updated = await userModel.updateProfile(req.user.id, updatePayload);
    return res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });

    console.error("update_my_profile_mw error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function delete_my_profile_mw(req, res) {
  try {
    const userModel = new User();
    const ok = await userModel.deleteById(req.user.id);
    if (!ok) return res.status(404).json({ message: "User not found" });
    return res.status(204).send();
  } catch (err) {
    console.error("delete_my_profile_mw error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  get_my_profile_mw,
  update_my_profile_mw,
  delete_my_profile_mw,
};
