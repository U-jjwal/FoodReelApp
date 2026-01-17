import mongoose, { mongo } from 'mongoose'

const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    }
    
}, {
    timestamps: true
})

export const saveModel = mongoose.model('saveModel', saveSchema)