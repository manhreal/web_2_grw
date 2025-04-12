// models/teacher.js

import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a teacher image'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add a teacher name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    experience: {
        type: String,
        required: [true, 'Please add a teacher experience'],
        maxlength: [500, 'Experience can not be more than 500 characters']
    },
    graduate: {
        type: String,
        required: [true, 'Please add a teacher graduate'],
        trim: true,
        maxlength: [500, 'Graduate can not be more than 500 characters']
    },
    achievements: {
        type: String,
        required: [true, 'Please add a teacher achievements'],
        trim: true,
        maxlength: [500, 'Achievements can not be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

export default Teacher;