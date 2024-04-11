const nodemailer = require("nodemailer");
//obtaining secured credentils
const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.EMAIL_ADDRESS);
console.log(process.env.EMAIL_PASSWORD);

//create nodemailer transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: `Yase Propety <${process.env.EMAIL_ADDRESS}>`,
  to: "ahmedkhan895.ak@gmail.com",
  subject: "Test email",
  text: "This is a test email sent using Nodemailer.",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("Error sending email: ", err);
  } else {
    console.log("Email sent: ", info.response);
  }
});
