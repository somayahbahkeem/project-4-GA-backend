
const express = require('express')
const router = express.Router()
var MailConfig = require('../../config/email');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;
const Student = require('../models/student_model')

router.get('/email/template/:student_id', (req, res, next) => {
    const student_id = req.params.student_id 
    Student.findById(student_id)
    .then((student)=>{
      console.log(student)

      MailConfig.ViewOption(gmailTransport,hbs);
      let HelperOptions = {
        from: '"GA Admin" <SumayahBahkeem @gmail.com>',
        to:student.email,
        subject: 'Warning Message!',
        template: 'test',
        context: {
          name:student.firstName,
          email: student.email,
        }
      };
      gmailTransport.sendMail(HelperOptions, (error,info) => {
        if(error) {
          console.log(error);
          res.json(error);
        }
        console.log("email is send");
        console.log(info);
        res.json(info)
      });




    })



});

module.exports = router