// models/partner.js

import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a partner image'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add a partner name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Partner = mongoose.model('Partner', PartnerSchema);

export default Partner;