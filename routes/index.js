var express = require('express');
var router = express.Router();
var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var request = require("sync-request");
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

router.get('/get-sources', function (req, res, next) {
  const requete = request('GET', `https://newsapi.org/v2/sources?language=${req.query.langue}&country=${req.query.country}&apiKey=4bc7ad33bbfb4f63a530eacc4b57d768`)
  const result = JSON.parse(requete.body);
  res.json({ sources: result.sources });
})

router.get('/get-articles', function (req, res, next) {
  console.log('req.query.id', req.query.id)
  const requete = request('GET', `https://newsapi.org/v2/top-headlines?sources=${req.query.id}&apiKey=4bc7ad33bbfb4f63a530eacc4b57d768`)
  const result = JSON.parse(requete.body);
  res.json({ articles: result.articles });
})

router.get('/wishlist', async function (req, res, next) {
  var user = await userModel.findOne({ token: req.query.token })
  const list = await wishlistModel.find({ userId: user._id, lang: req.query.lang })
  res.json({ result: list })
});

router.post('/wishlist', async function (req, res, next) {
  var result = false
  var user = await userModel.findOne({ token: req.body.token })

  if (user != null) {
    var newWishlist = new wishlistModel({
      title: req.body.title,
      urlToImage: req.body.img,
      description: req.body.desc,
      content: req.body.content,
      userId: user._id,
      lang: req.body.lang
    })
  }
  var wishlistSave = await newWishlist.save()

  if (wishlistSave.name) {
    result = true
  }
  res.json({ result })

});

router.delete('/wishlist', async function (req, res, next) {
  var result = false
  var user = await userModel.findOne({ token: req.body.token })
  if (user != null) {
    var delDb = await wishlistModel.deleteOne({ title: req.body.title, userId: user._id })
    if (delDb.deletedCount == 1) {
      result = true
    }
  }
  res.json({ result })
})


router.get('/last-langue', async function (req, res, next) {
  const token = req.query.token;
  const user = await userModel.findOne({ token: token });
  if (user && user.lang) {
    res.json({ result: true, lang: user.lang })
  } else {
    res.json({ result: false, lang: '' })
  }
})

router.post('/last-langue', async function (req, res, next) {

  const lang = req.body.lang;
  if (lang) {
    const user = await userModel.findOneAndUpdate(
      { token: req.body.token },
      { lang: lang })
    if (user && user.lang) {
      res.json({ result: true, lang: user.lang })
      return;
    }
  }
  res.json({ result: false, lang: '' })
})
module.exports = router;
