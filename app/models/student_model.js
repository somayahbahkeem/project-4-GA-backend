const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:  {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
   
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    cours:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cours',
        required:true
    }
}, {
    timestamps: true
})

studentSchema.virtual('attendees', {
    ref: 'Attendees',
    localField: '_id',
    foreignField: 'student'
  });

const Student = mongoose.model('Student', studentSchema)

module.exports = Student