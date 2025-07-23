const userModel = require('../models/userModel');
const sharp = require('sharp');
const bcrypt = require("bcrypt");
const cloudinary = require('../core/utils/cloudinary');
const fs = require('fs');

async function insertInitialUsers(mockUsers) {
  try {
    const usersHashedPass = await Promise.all(
      mockUsers.map(async (user) => {
        const passwordHashed = await bcrypt.hash(user.password, 10);
        return { ...user, password: passwordHashed}
      })
    )
    await userModel.insertMany(usersHashedPass);
    console.log('Initial users inserted successfully');
    return true;
  } catch (error) {
    console.error(`Initial users insert failed: ${error.message}`);
    return false;
  }
}

// Get UserInfo After Login To access to profile
const getUserProfile = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(200).send("Don't exist user with this id");
    }
    res.status(200).send({ status: 'Success', data: user });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

// Update data user
const updateUserById = async (req, res) => {
  try {
    const idUserToUpdate = req.payload._id;
    const updateUser = req.body;
    const user = await userModel.findByIdAndUpdate(idUserToUpdate, updateUser, {
      new: true,
    });
    if (!user) {
      res.status(200).send("Can't find this user");
    }
    res.status(200).send({ status: 'Success', message: 'User updated' });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

const uploadPhotoProfile = async (req, res) => {
  try {
    const idUserToUpdate = req.payload._id;
    console.log(`Id User: ${idUserToUpdate}`);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures',
    });
    console.log("Aqui")
    fs.unlinkSync(req.file.path);

    const updatedUser = await userModel.findByIdAndUpdate(
      idUserToUpdate,
      { profilePictureUrl: result.secure_url },
      { new: true }
    );

    res.status(200).send({ status: 'Success', message: 'Imagen de perfil actualizada', imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

// Entire delete user data
const deleteUserById = async (req, res) => {
  try {
    const idUserToDelete = req.payload._id;
    const user = await userModel.findByIdAndDelete(idUserToDelete);
    if (!user) {
      res.status(200).send("Can't find this user");
    }
    res.status(200).send({ status: 'Success', message: 'Usuario Eliminado' });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

const addToFavorite = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idFavorite } = req.params;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(200).send('There is no user with that ID');
    }

    if (user.favourites.includes(idFavorite)) {
      return res.status(200).send('This product is already in favorites');
    } else {
      user.favourites.push(idFavorite);
      user.save();
      res.status(200).send({ status: 'Success', data: user });
    }
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

const removeFromFavorite = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idFavorite } = req.params;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(200).send('There is no user with that ID');
    }
    if (!user.favourites.includes(idFavorite)) {
      return res.status(200).send('This product is not in favorites');
    } else {
      user.favourites.pull(idFavorite);
      user.save();
      res.status(200).send({ status: 'Success', data: user });
    }
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

module.exports = {
  insertInitialUsers,
  getUserProfile,
  updateUserById,
  deleteUserById,
  addToFavorite,
  removeFromFavorite,
  uploadPhotoProfile,
};
