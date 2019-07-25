const mongoose = require('mongoose')

const coursSchema = new mongoose.Schema({
    courceName: {
        type: String,
        required: true
    },
    imge: {
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

coursSchema.virtual('students', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'cours'
  });

const Cours = mongoose.model('Cours', coursSchema)

module.exports = Cours