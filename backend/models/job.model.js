import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes leading and trailing whitespace
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    salary: {
        type: Number,
        required: true,
        min: [0, 'Salary must be a positive number']
    },
    experienceLevel: {
        type: Number,
        required: true,
        min: [0, 'Experience level must be a positive number']
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Temporary'], // Define allowed job types
        trim: true
    },
    position: {
        type: Number,
        required: true,
        min: [1, 'Position must be at least 1']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);