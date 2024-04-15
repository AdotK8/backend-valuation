const nodemailer = require("nodemailer");
//obtaining secured credentils
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

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

//setting up server
const server = http.createServer((req, res) => {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle requests to the /send-email endpoint
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

        console.log(userInput.emailInput);
        console.log(userInput.firstName);
        console.log(userInput.postcode);
        console.log(processedSaleData.average);
        console.log(processedSaleData.minimum);
        console.log(processedSaleData.maximum);
        console.log(processedRentData.rent);

        //define specific mailoptions here

        //configure email options
        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: userInput.emailInput,
          bcc: process.env.EMAIL_ADDRESS,
          subject: "Your Property Valuation and Next Steps with Yase Property",
          html: `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
          <h2 style="color: #007bff;">Hi ${userInput.firstName},</h2>
          <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
          <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average}, and an estimated rental price of ${processedRentData.rent}.</p>
          <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
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

        //define specific mailoptions here
        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: userInput.emailInput,
          // bcc: process.env.EMAIL_ADDRESS,
          subject: "Your Property Valuation and Next Steps with Yase Property",
          html: `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
          <h2 style="color: #007bff;">Hi ${userInput.firstName},</h2>
          <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
          <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average}.</p>
          <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
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

        //define specific mailoptions here
        const mailOptions = {
          from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
          to: userInput.emailInput,
          // bcc: process.env.EMAIL_ADDRESS,
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
  } else {
    // Respond with 404 for other routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

//listening to requests to server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

transporter.on("error", (err) => {
  console.error("Mail transporter error:", err);
});

// Add error event listener to server
server.on("error", (err) => {
  console.error("Server error:", err);
});
