const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { EMAIL_REGEX } = require('../utils/constants');

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getCurrentUser);

router.patch('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(EMAIL_REGEX),
  }),
}), updateUser);

module.exports = router;
