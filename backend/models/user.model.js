import mongoose from "mongoose";

const todaySchema = new mongoose.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false }, 
    archived: { type: Boolean, default: false },
}, { timestamps: true });

const upcomingSchema = new mongoose.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }, 
}, { timestamps: true });

const impSchema = new mongoose.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }, 
}, { timestamps: true });

const weeklySchema = new mongoose.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }, 
}, { timestamps: true });

const longTermGoalsSchema = new mongoose.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }, 
}, { timestamps: true });

const notesSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }, 
}, { timestamps: true });

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        todayTasks: [todaySchema],
        upcomingTasks: [upcomingSchema],
        impTasks: [impSchema],
        weeklyTasks: [weeklySchema],
        longTermGoals: [longTermGoalsSchema],
        notes: [notesSchema],
        
    }, 
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Define the standalone functions
const findOne = async (criteria) => {
    return await User.findOne(criteria);
};

const findById = async (id) => {
    return await User.findById(id);
};

const findByIdAndUpdate = async (id, update) => {
    return await User.findByIdAndUpdate(id, update, { new: true });
};

export default User;
export { findOne, findById, findByIdAndUpdate };