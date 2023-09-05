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
const uploadProfileMiddleware = multer({ dest: 'profileImg/' })
const nodemailer = require("nodemailer");
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
mongoConnection();

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"

}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/profileImg', express.static(__dirname + '/profileImg'));

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
app.post('/register', uploadProfileMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadProfileMiddleware.single('file')
    const { username, email, password } = req.body;
    const findDuplicate = await User.findOne({ email })
    if (findDuplicate) {
        return res.json({ status: 409, message: "User With Email already exists" })
    }
    try {
        const userDoc = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, salt),
            cover: newPath
        });
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
//Update user profile
app.put('/editprofile', uploadProfileMiddleware.single('file'), async (req, res) => {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
        }
        const { id, username, email } = req.body;
        const user = await User.findById(id)
        user.username = username
        user.email = email
        user.cover = newPath

        const updateUser = await user.save();
        res.json({ success: true, message: "User Updated Successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the User" });
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
        jwt.sign({ username: userDoc.username, id: userDoc._id, cover: userDoc.cover }, secret, {}, (error, token) => {
            if (error) throw error;
            res.cookie("token", token).json({ id: userDoc._id, username: userDoc.username, cover: userDoc.cover, message: "Succesfully logged In" });
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
    console.log(req.file)
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const { id, username, cover } = info;
        const postDoc = await CPost.create({
            title,
            summary,
            content,
            cover: newPath,
            authorProfile: cover,
            author: id
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
        const user = await User.findOne({ email });

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
//get User Profile
app.get('/userprofile', async (req, res) => {
    const { token } = req.cookies
    try {
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized Role' });
        }
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            const { id } = info;
            const user = await User.findById({ _id: id })
            res.json(user);
        });
    } catch (error) {
        console.log(error)
    }
})
//Route for change the password if the user is already logged in
app.post('/changePassword', async (req, res) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized Role' });
        }
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            const { id } = info;
            const { newpassword, confirmpassword } = req.body;
            if (newpassword !== confirmpassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const passOk = bcrypt.compareSync(newpassword, user.password);
            if (passOk) {
                return res.status(400).json({ error: 'New password must be different' });
            }
            user.password = bcrypt.hashSync(newpassword, salt);
            await user.save();
            res.json({ success: 'Password reset successful.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
app.post('/post/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { user, text } = req.body;

    try {
        const post = await CPost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            user,
            text,
        };

        post.comments.push(newComment);
        await post.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// app.post('/post/:postId/comments', async (req, res) => {
//     const { postId } = req.params;
//     const { user, text } = req.body;

//     try {
//         const post = await CPost.findById(postId);
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         const newComment = {
//             user,
//             text,
//         };

//         post.comments.push(newComment);
//         await post.save();

//         res.json(post);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
app.listen(4000)
