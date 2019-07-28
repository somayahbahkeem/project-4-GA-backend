
  const express = require('express')
  
  const passport = require('passport')
  const requireToken = passport.authenticate('bearer', { session: false })
  
  const Cours = require('../models/cours_model')
  // const User = require('../models/user')
  
  const customErrors = require('../../lib/custom_errors')
  const handle404 = customErrors.handle404 
  const requireOwnership = customErrors.requireOwnership 
  
  const router = express.Router()
  
  //index cources
  // router.get('/examples', requireToken, (req, res, next) => {
  router.get('/cources', requireToken, (req, response, next) => {
    Cours.find({"owner":req.user.id})
    .then((cources)=> {
      response.status(200).json({cources:cources})
    })
      .catch(next)
  })
    //show cources
  router.get('/cources/:id', requireToken, (req, res, next) => {
        // get the ID from the params
        const id = req.params.id
        Cours.findById(id)
        .then(handle404)
        .then(cours => {
          requireOwnership(req, cours)
          res.status(200).json({cours: cours})
        })
        .catch(next)
  })

    //create cources
  router.post('/cources', requireToken, (req, res, next) => {
      const newCours = req.body.cours
      
      newCours.owner = req.user.id
      console.log(newCours)

      Cours.create(newCours)
      .then( cours => {
        res.status(201).json({ cours: cours })
      })
      .catch(next)
  })
  //delete cources
  router.delete('/cources/:id', requireToken, (req, res, next) => {
    const id = req.params.id 
    Cours.findById(id)
    .then( (cours) => {
      requireOwnership(req, cours)
      return cours.remove()
    })
    .then( () => {
      res.sendStatus(204)
    })
    .catch(next)
  })

//update cources
  router.put('/cources/:id', requireToken, (req, res, next) => {
    delete req.body.cours.owner
  
    const id = req.params.id 
    const updatedCours = req.body.cours
    console.log("course update", updatedCours)
    Cours.findById(id)
    .then( (cours) => {
      console.log("cours", cours)
      requireOwnership(req, cours)
      return cours.update(updatedCours)
    })
    .then( cours => res.status(200).json({cours: cours}))
    .catch(next)
  })
  
  module.exports = router