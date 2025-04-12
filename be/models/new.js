// models/new.js

import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a news image'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Please add a news title'],
        trim: true,
        maxlength: [200, 'Title can not be more than 200 characters']
    },
    summary: {
        type: String,
        required: [true, 'Please add a news summary'],
        trim: true,
        maxlength: [500, 'Summary can not be more than 500 characters']
    },
    link: {
        type: String,
        required: [true, 'Pllease add a link to the news'],
        trim: true
    },
    publishedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const News = mongoose.model('New', NewsSchema);

export default News;