
  const express = require('express')

  const passport = require('passport')
  const requireToken = passport.authenticate('bearer', { session: false })
  
  const Courses = require('../models/courses_model')
  const User = require('../models/user')
  
  const customErrors = require('../../lib/custom_errors')
  const handle404 = customErrors.handle404 
  const requireOwnership = customErrors.requireOwnership 
  
  const router = express.Router()
  
  //index courses
  // router.get('/examples', requireToken, (req, res, next) => {
  router.get('/courses', requireToken, (req, response, next) => {
    Courses.find({"owner":req.user.id})
    .then((courses)=> {
      response.status(200).json({courses:courses})
    })
      .catch(next)
  })
    //show courses
  router.get('/courses/:id', requireToken, (req, res, next) => {
        // get the ID from the params
        const id = req.params.id
        Courses.findById(id)
        .then(handle404)
        .then(courses => {
          requireOwnership(req, courses)
          res.status(200).json({courses: courses})
        })
        .catch(next)
  })
    //create courses
  router.post('/courses', requireToken, (req, res, next) => {
      const newCourses = req.body.student
      
      newCourses.owner = req.user.id
      console.log(newCourses)

      Courses.create(newCourses)
      .then( courses => {
        res.status(201).json({ courses: courses })
      })
      .catch(next)
  })
  //delete courses
  router.delete('/courses/:id', requireToken, (req, res, next) => {
    const id = req.params.id 
    Courses.findById(id)
    .then( (courses) => {
      requireOwnership(req, courses)
      return courses.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  })
//update courses
  router.put('/courses/:id', requireToken, (req, res, next) => {
    delete req.body.courses.owner
  
    const id = req.params.id 
    const updatedCourses = req.body.courses
    Courses.findById(id)
    .then( (courses) => {
      requireOwnership(req, courses)
      return courses.update(updatedcourses)
    })
    .then( courses => res.status(200).json({courses: courses}))
    .catch(next)
  })
  
  module.exports = router