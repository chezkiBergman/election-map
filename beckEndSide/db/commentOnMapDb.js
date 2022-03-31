
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    city: {
        type: String,
        require: true,

    },
    comment: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        require: true
    },
    image:{
        type: String,
        require:true
       
        }
});


export const Comment = mongoose.model("Comment", userSchema)







