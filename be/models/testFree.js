// models/testFree.js

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    id: {
        type: String, required: true
    },
    type: {
        type: String,
        enum: [
            "pronunciation",
            "stress",
            "fill_in_blank",
            "multi_choice",
            "error_identification",
            "reading_comprehension",
        ],
        required: [true, "Question type is required"],
    },
    questionText: {
        type: String, required: [true, "Question is required"],
    },
    options: [
        {
            text: {
                type: String, required: [true, "Option text is required"],
            }, 
            underlinedIndexes: {
                type: [Number], 
                default: [],
            },
        },
    ],
    correctAnswer: {
        type: String, required: [true, "Correct answer is required"],
    },
});

const testFreeSchema = new mongoose.Schema({
    title: {
        type: String, required: [true, "Test title is required"],
    },
    readingPassage: {
        type: String, default: ""
    }, 
    questions: [questionSchema],
});

const TestFree = mongoose.model("TestFree", testFreeSchema);

export default TestFree;
