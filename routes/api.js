'use strict';

const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const mongoose = require('mongoose');

const Trip = require('../models/Trip.js');
const User = require('../models/User.js');
const Message = require('../models/Message.js');
const Chat = require('../models/Chat.js');

const {
  validationFormTrip
} = require('../helpers/middlewaresTrips.js');

const {
  isLoggedIn
} = require('../helpers/middlewares');

router.get('/em', async (req, res, next) => {
  try {
    const listOfTrips = await Trip.find();
    res.status(200).json({ listOfTrips });
  } catch (error) {
    next(error);
  }
});

router.get('/me', async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const listOfMyTrips = await Trip.find({ owner: userId });
    res.status(200).json({ listOfMyTrips });
  } catch (error) {
    next(error);
  }
});

router.post('/trip/add', validationFormTrip(), async (req, res, next) => {
  const newTrip = req.body;
  newTrip.owner = req.session.currentUser._id;
  const listOfTrips = await Trip.find();
  try {
    listOfTrips.forEach(trip => {
      if (newTrip.title === trip.title && newTrip.owner === trip.owner) {
        return next(createError(428));
      }
    });
    const createdTrip = await Trip.create(newTrip);
    res.status(200).json(createdTrip);
    await User.findByIdAndUpdate(newTrip.owner, { $push: { myTrips: createdTrip._id } });
  } catch (error) {
    next(error);
  }
});

router.put('/trip/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  const tripUpdated = req.body;

  try {
    const updated = await Trip.findByIdAndUpdate(id, tripUpdated, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/trip/delete/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Trip.findByIdAndDelete(id);
    res.status(200).json({ message: 'trip deleted' });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/pushmessage',
  isLoggedIn(),
  async (req, res, next) => {
    console.log(req.body);
    const { body, user, idChat } = req.body;
    if (body && user && idChat) {
      const message = await Message.create({
        user,
        message: body
      });
      await Chat.findByIdAndUpdate(idChat, { $push: { messages: message._id } });
    }
  }
);
router.post(
  '/checkchat',
  isLoggedIn(),
  async (req, res, next) => {
    const { users } = req.body;
    const chats = await Chat.findOne({ users: { $all: users } });
    if (chats !== null) {
      res.status(200).json(chats);
    } else {
      const chat = await Chat.create({
        users,
        messages: []
      });
      await User.findByIdAndUpdate(users[0], { $push: { chats: chat } });
      await User.findByIdAndUpdate(users[1], { $push: { chats: chat } });
      res.status(200).json(chat);
    }
  }
);

router.post(
  '/getchat',
  isLoggedIn(),
  async (req, res, next) => {
    const { idChat, user } = req.body;
    const isIdValid = mongoose.Types.ObjectId.isValid(idChat);
    if (isIdValid) {
      const isValid = await Chat.findOne({ $and: [{ _id: idChat }, { users: { $in: user } }] });
      if (isValid) {
        return res.status(200).json(isValid);
      } else {
        return res.status(306).send({ message: 'No tienes acceso al chat' });
      }
    } else {
      return res.status(306).send({ message: 'La id no es válida' });
    }
  }
);

module.exports = router;
