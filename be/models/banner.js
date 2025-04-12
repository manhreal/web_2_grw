// models/banner.js

import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a banner image'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add a banner name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Banner = mongoose.model('Banner', BannerSchema);

export default Banner;