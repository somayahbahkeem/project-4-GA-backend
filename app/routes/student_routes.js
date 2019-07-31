
  const express = require('express')

  const passport = require('passport')
  const requireToken = passport.authenticate('bearer', { session: false })
  
  const Student = require('../models/student_model')
  const User = require('../models/user')
  
  const customErrors = require('../../lib/custom_errors')
  const handle404 = customErrors.handle404 
  const requireOwnership = customErrors.requireOwnership 
  
  const router = express.Router()
  
  //index students
  // router.get('/examples', requireToken, (req, res, next) => {
  router.get('/cources/:cources_id/students', requireToken, (req, response, next) => {
    Student.find({"cours":req.params.cources_id})
    .then((students)=> {
      response.status(200).json({students:students})
    })
      .catch(next)
  })

  router.get('/cources/:cources_id/students/AttendeesRecurd', (req, response, next) => {
    Student.find({"cours":req.params.cources_id})
    .populate('attendees')
    .then((students)=> {
      response.status(200).json({students:students})
    })
      .catch(next)
  })
    //show student
  router.get('/students/:id', requireToken, (req, res, next) => {
        // get the ID from the params
        const id = req.params.id
        Student.findById(id)
        .then(handle404)
        .then(student => {
          requireOwnership(req, student)
          res.status(200).json({student: student})
        })
        .catch(next)
  }) 
    //create student
  router.post('/cources/:cources_id/students/', requireToken, (req, res, next) => {
      const newStudent = req.body.student
      
      const courcesId = req.params.cources_id
      newStudent.cours = courcesId
      newStudent.owner = req.user.id
      console.log(newStudent)

      Student.create(newStudent)
      .then( student => {
        res.status(201).json({ student: student })
      })
      .catch(next)
  })
  //delete student
  router.delete('/students/:id', requireToken, (req, res, next) => {
    const id = req.params.id 
    Student.findById(id)
    .then( (student) => {
      requireOwnership(req, student)
      return student.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  })
//update student
  router.put('/students/:id', requireToken, (req, res, next) => {
    delete req.body.student.owner
  
    const id = req.params.id 
    const updatedStudent = req.body.student
    Student.findById(id)
    .then( (student) => {
      requireOwnership(req, student)
      return student.update(updatedStudent)
    })
    .then( student => res.status(200).json({student: student}))
    .catch(next)
  })

      // search student
      router.get('/students/search/:email', (req, response, next) => {
        const email=req.params.email
        console.log(email)
        Student.findOne({email: email})
        .populate('attendees')
        .then((student)=> {
          console.log(student)
          // return 
          response.status(200).json({student:student})
        })
        // .then (response.status(200).json({Student:Student}))
          .catch(next)
      })
  
  module.exports = router