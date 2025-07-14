const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {

  try {
    const {
      firstName,
      lastName,
      birthDate,
      email,
      password,
      phone,
      dni,
      location,
    } = req.body;

    const newUser = {
      firstName,
      lastName,
      birthDate,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      dni,
      location,
    };

    const userExist = await userModel.find({ email: email });

    if (userExist.length <= 0) {
      await userModel.create(newUser);

      res.status(201).send({
        status: 'Success',
        message: 'User created',
      });
    } else {
        res.status(409).send({
        status: 'ERR_EMAIL_EXIST',
        message: 'Email already exists',
      });
    }
  } catch (error) {
    res.status(500).send({ status: 'ERR_UNK', error: error.message });
  }
};

module.exports = {
  signup,
};
