// models/student.js

import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a student image'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add a student name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    achievement: {
        type: String,
        required: [true, 'Please add a student achievement'],
        trim: true,
        maxlength: [200, 'Achievement can not be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a student description'],
        trim: true,
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Student = mongoose.model('Student', StudentSchema);

export default Student;