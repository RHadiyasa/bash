import nodemailer from "nodemailer";

const sendResetPasswordEmail = async (user, token) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const message = `
    <h1>Reset Password BashApp</h1>
    <p>Kamu menerima email ini karena ada permintaan reset password untuk akun kamu.</p>
    <p>Klik link di bawah untuk reset password (berlaku 15 menit):</p>
    <a href="${resetUrl}" style="background:#16a34a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a>
    <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "BashApp - Reset Password",
    html: message,
  });
};

export default sendResetPasswordEmail;
