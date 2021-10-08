var express = require('express');
var router = express.Router();
var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')
var wishlistModel = require('../models/wishlist')

router.post('/sign-up', async function (req, res, next) {

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if (data != null) {
    error.push('utilisateur déjà présent')
  }

  if (req.body.usernameFromFront == ''
    || req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }


  if (error.length == 0) {

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })

    saveUser = await newUser.save()


    if (saveUser) {
      result = true
      token = saveUser.token
    }
  }


  res.json({ result, saveUser, error, token })
})

router.post('/sign-in', async function (req, res, next) {

  var result = false
  var user = null
  var error = []
  var token = null

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })


    if (user) {
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }

    } else {
      error.push('email incorrect')
    }
  }


  res.json({ result, user, error, token })


})


router.post('/wishlist', async function (req, res, next) {
  var result = false
  var user = await userModel.findOne({ token: req.body.token })
  console.log(req.body.token)

  if (user != null) {
    var newWishlist = new wishlistModel({
      title: req.body.title,
      urlToImage: req.body.img,
      description: req.body.desc,
      content: req.body.content,
      userId: user._id,
    })
  }
  var wishlistSave = await newWishlist.save()

  if (wishlistSave.name) {
    result = true
  }
  console.log(result)
  res.json({ result })

});

router.delete('/wishlist', async function (req, res, next) {
  var result = false
  var user = await userModel.findOne({ token: req.body.token })
  console.log(req.body.token)
  if (user != null) {
    var delDb = await wishlistModel.deleteOne({ title: req.body.title, userId: user._id })
    console.log(req.body.title,)
    if (delDb.deletedCount == 1) {
      result = true
    }
  }
  res.json({ result })
})


module.exports = router;
