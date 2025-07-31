const { generateSecureToken } = require("../core/auth/auth-token");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { sendResetEmail, generateRandomPassword } = require("../utils/utils");

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      email,
      password,
      location,
    } = req.body;

    const newUser = {
      firstName,
      lastName,
      birthDate,
      email,
      password: await bcrypt.hash(password, 10),
      location,
    };

    const userExist = await userModel.find({ email: email });

    if (userExist.length <= 0) {
      await userModel.create(newUser);

      res.status(201).send({
        status: "Success",
        message: "User created successfully",
      });
    } else {
      res.status(409).send({
        status: "ERR_EMAIL_EXIST",
        message: "Email already exists",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "ERR_REGISTER", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({ email: email })
      .select("name email password isActive");

    if (!user) {
      return res.status(403).send({
        status: "ERR_LOGIN",
        message: "Las credenciales introducidas no son correctas",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).send({
        status: "ERR_LOGIN",
        message: "Las credenciales introducidas no son correctas",
      });
    }
    if (!user.isActive) {
      return res.status(403).send({
        status: "ERR_LOGIN_DIS",
        message: "Este usuario tiene el acceso restringido temporalmente",
      });
    }
    // Token Zone
    const payload = {
      _id: user._id,
      name: user.name,
    };
    const token = generateSecureToken(payload, false);
    const token_refresh = generateSecureToken(payload, true);

    //Update last access
    const newUser = { lastAccess: Date.now() };
    const updatedUser = await userModel.findByIdAndUpdate(user._id, newUser, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(403).send({
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
};

const getTokens = (req, res) => {
  try {
    const payload = {
      _id: req.payload._id,
      name: req.payload.name,
    };

    const token = generateSecureToken(payload, false);
    const token_refresh = generateSecureToken(payload, true);

    res.status(200).send({ status: "Success", token, token_refresh });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const verifyToken = (req,res) => {
  res.status(200).send({ status: "Success" });
}

const verifyMail = async (req, res) => {
  console.log("aqui");
  try {
    const {
      email,
    } = req.body;

    const userExist = await userModel.find({ email: email });

    if (userExist.length <= 0) {

      res.status(409).send({
        status: "Failed",
        message: "User mail not exist",
      });
    } else {
      res.status(201).send({
        status: "Success",
        message: "User email exists",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "ERR_CHK_MAIL", error: error.message });
  }
}

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '15m' });

  await sendResetEmail(user.email, token);
  res.status(200).json({ status: 'Success', message: 'Reset link sent' });
};

const resetPasswordFromToken = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await sendResetEmail(user.email, `Tu nueva contraseña es: ${newPassword}`, true);

    res.send(`
    <html>
      <head>
        <title>Reseteo de contraseña</title>
      </head>
      <body>
        <script>
          alert("La contraseña se ha reseteado y enviado por email. Esta ventana se cerrará.");
          window.close();
        </script>
        <p>si la ventana no se cierra automaticamente, puedes cerrarla manualmente.</p>
      </body>
    </html>
  `);

  } catch (error) {
    res.status(400).json({status:'Failed', message: error.message });
  }
};

module.exports = {
  signup,
  login,
  getTokens,
  verifyToken,
  verifyMail,
  requestPasswordReset,
  resetPasswordFromToken
};
