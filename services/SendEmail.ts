const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const htmlTemplate = (firstName, lastName) => {
    return `
     <!DOCTYPE html>
     <html>
       <head>
         <style>
           body {
             font-family: Arial, sans-serif;
             margin: 0;
             padding: 0;
             background-color: #f9f9f9;
             color: #333;
           }
           .email-container {
             max-width: 600px;
             margin: 20px auto;
             padding: 20px;
             background-color: #ffffff;
             border: 1px solid #e0e0e0;
             border-radius: 8px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
           }
           .header {
             text-align: center;
             font-size: 24px;
             color: #4caf50;
             margin-bottom: 20px;
           }
           .content {
             font-size: 16px;
             line-height: 1.5;
             color: #333;
           }
           .footer {
             text-align: center;
             font-size: 12px;
             color: #666;
             margin-top: 20px;
           }
         </style>
       </head>
       <body>
         <div class="email-container">
           <div class="header">
             Thank You!
           </div>
           <div class="content">
             <p>Dear <strong> ${firstName} ${lastName}</strong>,</p>
             <p>
               Thank you for submitting the contact form successfully. We have received your information and will create a case for you in our system!
             </p>
             <p>
               Best regards,
             </p>
           </div>
           <div class="footer">
             <p>
               Contact Form Demo
             </p>
           </div>
         </div>
       </body>
     </html>
    `
};

exports.sendEmailToPatient = (patientCustomer, firstName, lastName) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        auth: {
          user: process.env.HOST_EMAIL,
          pass: process.env.HOST_PASSWORD
        }
    });
      
    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: patientCustomer,
        subject: 'Successful Contact Form Submission',
        html: htmlTemplate(firstName, lastName),
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
};

