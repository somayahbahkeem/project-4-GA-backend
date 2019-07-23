const mongoose = require('mongoose')

const coursesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, {
    timestamps: true
})

const Courses = mongoose.model('Courses', coursesSchema)

module.exports = Courses