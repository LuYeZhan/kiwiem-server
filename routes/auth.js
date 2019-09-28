'use strict';

const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('./../models/User');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin
} = require('../helpers/middlewares');

router.get('/me', isLoggedIn(), (req, res, next) => {
  res.json(req.session.currentUser);
});

router.post(
  '/login',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/signup',
  isNotLoggedIn(),
  validationLoggin(),
  console.log('signup antes de ejecutarse'),
  async (req, res, next) => {
    const { name, surname, email, password, userType } = req.body;
    try {
      const user = await User.findOne({ email }, 'email');
      console.log('signup despues del await');
      if (user) {
        return next(createError(422));
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        if (userType === 'volunteer') {
          const profilePic = 'https://www.avoskinbeauty.com/blog/wp-content/uploads/ok-18.jpg';
          const newUser = await User.create({ name, surname, email, password: hashPass, userType, profilePic });
          req.session.currentUser = newUser;
          res.status(200).json(newUser);
        } else {
          const profilePic = 'https://st4.depositphotos.com/1010815/21061/v/600/depositphotos_210616400-stock-video-friendly-caucasian-old-man-waving.jpg';
          const newUser = await User.create({ name, surname, email, password: hashPass, userType, profilePic });
          console.log('usuario creado');
          req.session.currentUser = newUser;
          res.status(200).json(newUser);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post('/logout', isLoggedIn(), (req, res, next) => {
  delete req.session.currentUser;
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

module.exports = router;
