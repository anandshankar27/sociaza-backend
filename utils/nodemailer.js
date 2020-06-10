const nodemailer = require("nodemailer")

// Send Verification Email to User using Nodemailer
module.exports.sendVerificationEmailtoUser = (user) => {

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    })

    var mailOptions = {
        from: process.env.email,
        to: user.email,
        subject: 'Sociaza Account Verification',
        html: `
            <h1>Hello ${user.name}</h1>
            <br>
            <form method="POST" action="http://localhost:5000/auth/verify/${user.verificationToken}">
                <button name="secretToken"> Verify Your Account </button>
            </form>
            <a target="blank" href="http://localhost:5000/auth/verify/${user.verificationToken}">
                http://localhost:5000/auth/verify/${user.verificationToken}
            </a>
            `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

    return 'done'
}




