const express = require("express");
const multer = require("multer");
const { verifyValidToken } = require("../core/middlewares/auth");
const {
  getUserProfile,
  updateUserById,
  deleteUserById,
  addToFavorite,
  removeFromFavorite,
  uploadPhotoProfile,
} = require("../controllers/userController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// User endpoints
router.get("/profile", verifyValidToken, getUserProfile);
router.post(
  "/profile/img",
  verifyValidToken,
  upload.single("profileImage"),
  uploadPhotoProfile
);
router.patch("/update/:idUserToUpdate", verifyValidToken, updateUserById);
router.delete("/delete/:idUserToDelete", verifyValidToken, deleteUserById);

// Favorites products endpoints from user
router.patch("/favorite/:idFavorite", verifyValidToken, addToFavorite);
router.patch(
  "/removefavorite/:idFavorite",
  verifyValidToken,
  removeFromFavorite
);

// Exports the router
module.exports = router;
