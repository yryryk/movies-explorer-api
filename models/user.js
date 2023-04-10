const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { EMAIL_REGEX } = require('../utils/constants');
const UnautorizedError = require('../utils/UnautorizedError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return EMAIL_REGEX.test(v);
        },
      },
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email }).select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(new UnautorizedError('Пользователь не найден'));
            }
            return bcrypt.compare(password, user.password)
              .then((equal) => {
                if (equal) {
                  return user;
                }
                return Promise.reject(new UnautorizedError('Пользователь не найден'));
              });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
