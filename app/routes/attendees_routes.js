
  const express = require('express')

  const passport = require('passport')
  const requireToken = passport.authenticate('bearer', { session: false })
  
  const Attendees = require('../models/attendees_model')
  const User = require('../models/user')
  
  const customErrors = require('../../lib/custom_errors')
  const handle404 = customErrors.handle404 
  const requireOwnership = customErrors.requireOwnership 
  
  const router = express.Router()
  
  //index attendees
  // router.get('/examples', requireToken, (req, res, next) => {
  router.get('/students/:student_id/attendees', requireToken, (req, response, next) => {
    Attendees.find({"student":req.params.student_id})
    .then((attendees)=> {
      response.status(200).json({attendees:attendees})
    })
      .catch(next)
  })
    //show attendees
  router.get('/attendees/:id', requireToken, (req, res, next) => {
        // get the ID from the params
        const id = req.params.id
        Attendees.findById(id)
        .then(handle404)
        .then(attendees => {
          requireOwnership(req, attendees)
          res.status(200).json({attendees: attendees})
        })
        .catch(next)
  })
    //create attendees
  router.post('/students/:student_id/attendees/', requireToken, (req, res, next) => {
      const newAttendees = req.body.attendees
      const studentId = req.params.student_id
      newAttendees.student = studentId
      newAttendees.owner = req.user.id
      let newDay;
      let newMonth;
      let Lastday;
      let Lastmonth;
      let newAttend;
      Attendees.create(newAttendees)
      .then((attendee) => {
        newAttend = attendee
        newDay = attendee.createdAt.getDate()
        newMonth = attendee.createdAt.getMonth() + 1
        console.log('newday:' + newDay + ',newMonth:'+newMonth)
        console.log(attendee.createdAt)
      })
              .then( attendees => {
                Attendees.find({"student":studentId})
                .then((attendeesOfStudent) => {
                 Lastday = attendeesOfStudent[attendeesOfStudent.length-2].createdAt.getDate()
                // the month in js start at 0, so 0 => Jan
                 Lastmonth = attendeesOfStudent[attendeesOfStudent.length-2].createdAt.getMonth() + 1
                console.log('day:' +  Lastday + ',month:' + Lastmonth)
                console.log(attendeesOfStudent[attendeesOfStudent.length-2].createdAt)
                
                if( Lastmonth != newMonth || Lastday != newDay  ){
                  // console.log('created')
                  res.status(201).json({ attendees: attendees })
                }else{
                  // console.log('deleted')
                  requireOwnership(req, newAttend)
                   newAttend.remove()
                   res.sendStatus(204)
                  
                }
              })  

                
      })
     .catch(next)
     
      
      //  Attendees.create(newAttendees)
      //  .then( attendees => {
      //    res.status(201).json({ attendees: attendees })
      //  })
      // .catch(next)
  })
  //delete attendees
  router.delete('/attendees/:id', requireToken, (req, res, next) => {
    const id = req.params.id 
    Attendees.findById(id)
    .then( (attendees) => {
      requireOwnership(req, attendees)
      return attendees.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  })
//update attendees
  router.put('/attendees/:id', requireToken, (req, res, next) => {
    delete req.body.attendees.owner
    let studentId
    const id = req.params.id 
    const updatedAttendees = req.body.attendees
    Attendees.findById(id)
    .then( (attendees) => {
      requireOwnership(req, attendees)
      studentId = attendees.student
      return attendees.update(updatedAttendees)
    })
    .then( () => res.status(200).json({studentId: studentId}))
    .catch(next)
  })
  
  module.exports = router