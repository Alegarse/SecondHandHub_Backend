const express = require("express");
const { upload } = require('../core/middlewares/multer')
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

// User endpoints
router.get("/profile", verifyValidToken, getUserProfile);
router.post(
  "/profile/img",
  verifyValidToken,
  upload.single("image"),
  uploadPhotoProfile
);
router.patch("/update", verifyValidToken, updateUserById);
router.delete("/delete", verifyValidToken, deleteUserById);

// Favorites products endpoints from user
router.patch("/favorite/:idProduct", verifyValidToken, addToFavorite);
router.patch(
  "/removefavorite/:idProduct",
  verifyValidToken,
  removeFromFavorite
);

// Exports the router
module.exports = router;
