const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'exposgratuites@gmail.com', // Replace this with your Email Id.
        pass: 'dcle kwwk vepy nzwk' // Replace this with your Password.
    }
});

let mailOptions = {
    from: 'exposgratuites@gmail.com', // Replace this with your Email Id.
    to: ['drppxy@gmail.com'], // Replace this recipient Email address
    cc: 'octacoderfyi@gmail.com',
    subject: 'Email With Attachments Testing',
    html: `<h1 style="color: Aqua">Welcome To OctaCoder</h1> <p>Please Subscribe OctaCoder Youtube Channel</p>
    <h4 style="color: red">"Learn The Way, Create Your Own Way"</h4>
    <a href="https://www.youtube.com/@octacoder">Félicitations vous avez gagné un YAEL RO</a>`,
    attachments:[
        {
            filename: 'image.png',
            path: 'https://media.licdn.com/dms/image/C4E03AQFz69kjoOrMyg/profile-displayphoto-shrink_800_800/0/1645005813743?e=2147483647&v=beta&t=SGr0ddxlQX89BqB8yW6G5bqRRnVf6vjg_NW8z-6z_Xs' 
        },
    ]
};

transporter.sendMail(mailOptions, (error, info) => {
    if(error){
        console.log('Erroe Occured ' + error);
    }else {
        console.log("Email Sent Successfully to " + mailOptions.to);
    }
});

