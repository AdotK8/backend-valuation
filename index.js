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
//configure email options
const mailOptions = {
  from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
  to: "ahmedkhan895.ak@gmail.com",
  //   bcc: process.env.EMAIL_ADDRESS,
  subject: "Test email subject",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

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

        //define specific mailoptions here

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
