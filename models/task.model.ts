import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500,
    },
    isStarred: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    dueDate: {
        type: Date,
        required: [true, 'Please enter a due date'],
        validate: {
            validator: (value: Date)=> value > new Date(),
            message: 'Due date must be in the future'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    taskListId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskList',
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

export default Task;