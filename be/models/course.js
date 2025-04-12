// models/course.js

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Please add a course image'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [200, 'Title can not be more than 200 characters']
    },
    link: {
        type: String,
        required: [true, 'Please add a link to the course'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;