const { generateSecureToken } = require('../core/auth/auth-token');
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

const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({ email: email })
      .select("name email password isActive");

    if (!user) {
      return res
        .status(403)
        .send({
          status: "ERR_LOGIN",
          message: "Las credenciales introducidas no son correctas",
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(403)
        .send({
          status: "ERR_LOGIN",
          message: "Las credenciales introducidas no son correctas",
        });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .send({
          status: "ERR_LOGIN_DIS",
          message: "Este usuario tiene el acceso restringido temporalmente",
        });
    }
    // Token Zone
    const payload = {
      _id: user._id,
      name: user.name
    };
    const token = generateSecureToken(payload, false);
    const token_refresh = generateSecureToken(payload, true);

    //Update last access
    const newUser = { lastAccess: Date.now() };
    const updatedUser = await userModel.findByIdAndUpdate(user._id, newUser, {
      new: true,
    });
    if (!updatedUser) {
      return res
        .status(403)
        .send({
          status: "ERR_LOGIN_U",
          message: "Error al actualizar datos de usuario",
        });
    }
    res
      .status(200)
      .send({ status: "Success", data: updatedUser, token, token_refresh });
  } catch (error) {
    res.status(500).send({ status: "ERR_UNK", error: error.message });
  }

}

module.exports = {
  signup,
  login
};
