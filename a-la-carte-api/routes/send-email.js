const connection = require('../connection');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Post request to send email through SendGrid API
module.exports = function(router) {
  router.post('/sendemail', function(req, res) {
    let info = req.body;
    console.log(info);
    let sql = "SET @to = ?; SET @from = ?; SET @subject = ?; SET @text = ?; SET @html = ?; CALL SendEmail(@to, @from, @subject, @text, @html);"
    connection.query(sql, [info.to, info.from, info.subject, info.text, info.html], function(err, rows) {
      if(err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log('\nSuccessful Post to DB');
        let msg = {
            to: info.to,
            from: info.from,
            subject: info.subject,
            text: info.text,
            html: info.html
        };
        sgMail.send(msg);
        console.log("Sent email successfully");
        return res.send(msg);
      }
    });
  });
};

