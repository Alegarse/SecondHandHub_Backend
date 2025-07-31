import nodemailer from 'nodemailer';
const PORT = process.env.PORT

export function generateRandomPassword(length = 10) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export async function sendResetEmail(email, token, alreadyReset) {
  const resetLink = `http://localhost:${PORT}/api/auth/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'second.hand.hb@gmail.com',
      pass: 'rszi uuxz otzh yizb',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: '"Secondhand Hub" <second.hand.hb@gmail.com>',
    to: email,
    subject: `${
      alreadyReset ? 'Contraseña restablecida' : 'Recuperación de contraseña'
    }`,
    html: alreadyReset
      ? token
      : `<p>Haz clic aquí para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
  });
}
