require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const msg = {
      to: process.env.BUSINESS_EMAIL,
      from: process.env.RECEIVERS_EMAIL,
      subject: `New Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await sgMail.send(msg);

    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error(error.response?.body || error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});