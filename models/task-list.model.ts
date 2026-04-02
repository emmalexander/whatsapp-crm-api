import mongoose from "mongoose";

const taskListScehma = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Task list name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: [],
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const TaskList = mongoose.model('TaskList', taskListScehma);

export default TaskList;