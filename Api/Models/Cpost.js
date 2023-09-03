const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CPsotSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    authorProfile: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]

},
    {
        timestamps: true
    }
);
const CPostModel = model('CPost', CPsotSchema)
module.exports = CPostModel;