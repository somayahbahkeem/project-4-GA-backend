const mongoose = require('mongoose')

const attendeesSchema = new mongoose.Schema({
    record:  {
        type: String,
        required: true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, {
    timestamps: true
})

const Attendees = mongoose.model('Attendees', attendeesSchema)

module.exports = Attendees