const userModel = require('../models/userModel');
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const cloudinary = require('../core/utils/cloudinary')
const fs = require('fs');
const productModel = require('../models/productModel');

async function insertInitialUsers(mockUsers) {
  try {
    const usersHashedPass = await Promise.all(
      mockUsers.map(async (user) => {
        const passwordHashed = await bcrypt.hash(user.password, 10);
        return { ...user, password: passwordHashed };
      })
    );
    await userModel.insertMany(usersHashedPass);
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
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).send({ status: 'Failed', error: 'No se subió ninguna imagen' });
    }
    filePath = req.file.path;
    const idUserToUpdate = req.payload._id;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'profile_pictures',
      overwrite: true,
      invalidate: true
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      idUserToUpdate,
      { profilePictureUrl: result.secure_url },
      { new: true }
    );

    res
      .status(200)
      .send({
        status: 'Success',
        message: 'Imagen de perfil actualizada',
        imageUrl: result.secure_url,
      });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Archivo temporal eliminado:', filePath);
    }
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
    await productModel.deleteMany({ owner: idUserToDelete})
    
    res.status(200).send({ status: 'Success', message: 'Usuario y productos asociados eliminados' });
  } catch (error) {
    res.status(500).send({ status: 'Failed', error: error.message });
  }
};

const addToFavorite = async (req, res) => {
  try {
    const idUser = req.payload._id;
    const { idProduct } = req.params;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(200).send('There is no user with that ID');
    }

    if (user.favorites.includes(idProduct)) {
      return res.status(200).send('This product is already in favorites');
    } else {
      user.favorites.push(idProduct);
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
    const { idProduct } = req.params;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res.status(200).send('There is no user with that ID');
    }
    if (!user.favorites.includes(idProduct)) {
      return res.status(200).send('This product is not in favorites');
    } else {
      user.favorites.pull(idProduct);
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
