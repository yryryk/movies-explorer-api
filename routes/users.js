const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getCurrentUser);

router.patch('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
