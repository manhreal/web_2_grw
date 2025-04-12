// models/advising.js

import mongoose from 'mongoose';

const AdvisingSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please enter full name'],
        },
        email: {
            type: String,
            required: [true, 'Please enter email'],
        },
        phone: {
            type: String,
            required: [true, 'please enter phone number'],
        },
        address: {
            type: String,
            required: [true, 'Please enter address'],
        },
        notes: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Advising = mongoose.model("Advising", AdvisingSchema);

export default Advising;