const express = require('express');
const app = express();
const cors = require('cors');
const mongoConnection = require('./db');
const User = require('./Models/User');
const CPost = require('./Models/Cpost');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const nodemailer = require("nodemailer");
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
mongoConnection();

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"

}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

const salt = bcrypt.genSaltSync(10)
const secret = "UsmanKhalil"
const tokenStore = new Map();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'usmanlocalb4533@gmail.com',
        pass: 'ojnpllumvgqevpih'
    }
});
// Register End point
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const findDuplicate = await User.findOne({ email })
    if (findDuplicate) {
        return res.json({ status: 409, message: "User With Email already exists" })
    }
    try {
        const userDoc = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, salt)
        });
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
//Log in End Point
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email })
    if (!userDoc) {
        return res.json({ status: 404, message: "User not found! Please Register" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({ username: userDoc.username, id: userDoc._id }, secret, {}, (error, token) => {
            if (error) throw error;
            res.cookie("token", token).json({ id: userDoc._id, username: userDoc.username, message: "Succesfully logged In" });
        })
    }
    else {
        res.json({ success: 'false', message: "Bad Credentials" })
    }
})
//Logging Out The User
app.post("/logout", (req, res) => {
    res.cookie("token", "").json({ message: "logged out" });
})
//Check if the use is logged in
app.get('/profile', (req, res) => {
    const { token } = req.cookies
    try {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info)
        });
    } catch (error) {
        console.log(error.message)
    }

})
//End Point For Creating The Post 
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await CPost.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json({ postDoc, message: "Post created successfully" });
    })

});
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await CPost.findById(id)
        if (!postDoc) {
            return res.status(404).json({ message: "Post not found" })
        }
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(404).json({ "status": "Not Allowed" });
        }
        // await postDoc.update({
        //     title,
        //     summary,
        //     content,
        //     cover: newPath ? newPath : postDoc.cover
        // })
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
        try {
            const updatedPost = await postDoc.save();
            res.json({ postDoc: updatedPost, message: "Post Updated Successfully" });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while updating the post" });
        }
    })
})
//Fetching all the posts 
app.get('/post', async (req, res) => {
    (res.json(
        await CPost.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
    ))
});
//Fetch Specific Post With Id
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await CPost.findById(id).populate('author', ['username']);
    res.json(postDoc);
})
//Forget Password
app.post('/forgetpassword', async (req, res) => {
    const { email } = req.body;
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');

    // Store the token with the associated email
    tokenStore.set(email, token);
    const findMail = await User.findOne({ email })
    if (!findMail) {
        return res.json({ status: 404, message: "User not found" })
    }
    const expirationTime = Date.now() + 3600000;
    // Create a password recovery link with the token
    const recoveryLink = `http://localhost:3000/reset-password?email=${email}&token=${token}&expires=${expirationTime}`;

    // Send the password recovery email
    transporter.sendMail({
        from: 'usmanlocalb4533@gmail.com',
        to: email,
        subject: 'Password Recovery',
        text: `Click on the following link to reset your password: ${recoveryLink}`,
        html: `<p>Click <a href="${recoveryLink}">here</a> to reset your password.</p>`
    }, (error, info) => {
        if (error) {
            console.log('Error sending email:', error.message);
            res.json({ status: 500, message: 'Error sending email! Try Again Later' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
})
//
app.post('/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;
    const expirationTime = req.query.expires;
    if (Date.now() > expirationTime) {
        // Link has expired, handle accordingly
        return res.status(400).json({ error: 'Recovery link has expired.' });
    }


    try {
        // Check if the token matches the stored token for the email
        const storedToken = tokenStore.get(email);
        if (token !== storedToken) {
            return res.status(400).json({ error: 'Invalid token.' });
        }

        // Find the user by email
        const user = await User.findOne({ email: "usmankhalil.201905593@gcuf.edu.pk" });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update the user's password and save
        user.password = bcrypt.hashSync(newPassword, salt);
        await user.save();

        // Clear the token from the store
        tokenStore.delete(email);

        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'An error occurred while resetting the password.' });
    }
});
//Delete the Post
app.delete('/delete/:id', async (req, res) => {
    try {
        const delDoc = await User.findByIdAndDelete(req.body.id);
        if (!delDoc) {
            return res.json({ success: 'false', message: "Couldn't find" });
        }
        res.json({ success: "true", message: 'Delete successfully' });
    } catch (error) {
        res.json({ status: 404, message: error.message });
    }
});
app.listen(4000)