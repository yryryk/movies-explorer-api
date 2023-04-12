const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const ForbiddenError = require('../utils/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Вы ещё можете всё исправить!'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((foundMovie) => {
      if (!foundMovie) {
        throw new NotFoundError('Этого фильма не существует');
      }
      if (String(req.user._id) !== String(foundMovie.owner)) {
        throw new ForbiddenError('Невозможно удалить');
      }
      return Movie.findByIdAndDelete(req.params._id)
        .then((movie) => {
          if (!movie) {
            throw new NotFoundError('Этого фильма не существует');
          }
          return res.send(movie);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            return next(new BadRequestError('Вы ещё можете всё исправить!'));
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Вы ещё можете всё исправить!'));
      }
      return next(err);
    });
};
