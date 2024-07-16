const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

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

const allowedOrigins = [
  "https://yase-valuation-widget-0f6fe864605b.herokuapp.com",
];

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "none");
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/send-email-full" && req.method === "POST") {
    let body = "";
    console.log("full email");
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const processedSaleData = data.processedSaleData;
        const processedRentData = data.processedRentData;
        const userInput = data.userInput;

        sendInternalEmail(userInput);

        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: userInput.emailInput,
          bcc: process.env.EMAIL_ADDRESS,
          subject: "Your Property Valuation with Yase Property",
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
          <p style="font-size: 16px;">Hi ${userInput.firstName},</p>
          <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
          <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average}  and can potentially achieve a price of ${processedSaleData.maximum} and an estimated rental price of ${processedRentData.rent}.</p>
          <p style="font-size: 16px;">If you would like to discuss how to get the most out of your property, please get in touch by replying to this email.</p>
          <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
          <a href="https://yaseproperty.com">
            <img src="https://i.postimg.cc/j2hNHR12/YASE-LOGO-PNG.png" alt="Your Image" style="max-width: 150px; height: auto;">
          </a>
        </div>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email: ", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error sending email");
          } else {
            console.log("Email sent: ", info.response);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Email sent successfully");
          }
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error parsing JSON");
      }
    });

    //below is case for 'sale only' email
  } else if (req.url === "/send-email-sale" && req.method === "POST") {
    let body = "";
    console.log("sale email");
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const processedSaleData = data.processedSaleData;
        const userInput = data.userInput;

        sendInternalEmail(userInput);

        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: userInput.emailInput,
          bcc: process.env.EMAIL_ADDRESS,
          subject: "Your Property Valuation and Next Steps with Yase Property",
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
          <p style="font-size: 16px;">Hi ${userInput.firstName},</p>
          <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
          <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average} and can potentially achieve a price of ${processedSaleData.maximum}.</p>
          <p style="font-size: 16px;">If you would like to discuss how to get the most out of your property, please get in touch by replying to this email.</p>
          <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
          <a href="https://yaseproperty.com">
            <img src="https://i.postimg.cc/j2hNHR12/YASE-LOGO-PNG.png" alt="Your Image" style="max-width: 150px; height: auto;">
          </a>
        </div>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email: ", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error sending email");
          } else {
            console.log("Email sent: ", info.response);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Email sent successfully");
          }
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error parsing JSON");
      }
    });
  }
  //below is case for 'internal' email
  else if (req.url === "/send-email-internal" && req.method === "POST") {
    let body = "";
    console.log("internal email");
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const userInput = data.userInput;

        sendInternalEmail(userInput);

        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: process.env.EMAIL_ADDRESS,
          subject: "Client failed to get valuation",
          html: `<p>The following client has failed to get their valuation</p>
          <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
          <p>Email address: ${userInput.emailInput} </p>
          <p>Number: ${userInput.phoneInput} </p>
          <p>Postcode: ${userInput.postcode} </p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email: ", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error sending email");
          } else {
            console.log("Email sent: ", info.response);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Email sent successfully");
          }
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error parsing JSON");
      }
    });
  }
  //email for booking valuations
  else if (req.url === "/book-val" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const userInput = data.userInput;

        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: process.env.EMAIL_ADDRESS,
          subject: "Client has requested to book valuation ",
          html: `<p>Following client has requested to book an accurate valuation/p>
          <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
          <p>Email address: ${userInput.emailInput} </p>
          <p>Number: ${userInput.phoneInput} </p>
          <p>Postcode: ${userInput.postcode} </p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email: ", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error sending email");
          } else {
            console.log("Email sent: ", info.response);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Email sent successfully");
          }
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error parsing JSON");
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

function sendInternalEmail(userInput) {
  console.log(userInput);

  const mailOptions = {
    from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.EMAIL_ADDRESS,
    subject: "NEW VALUATION",
    html: `<p>Following client has used property valuation calculator</p>
    <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
    <p>Email address: ${userInput.emailInput} </p>
    <p>Number: ${userInput.phoneInput} </p>
    <p>Postcode: ${userInput.postcode} </p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email: ", err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

//listening to requests to server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

transporter.on("error", (err) => {
  console.error("Mail transporter error:", err);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
