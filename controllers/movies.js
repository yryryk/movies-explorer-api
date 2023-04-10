const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const ConflictError = require('../utils/ConflictError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
  Movie.findOne({ movieId })
    .then((movieOne) => {
      if (movieOne) {
        return next(new ConflictError('Этот фильм уже добавлен'));
      }
      return Movie.create({
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
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Вы ещё можете всё исправить!'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndDelete(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Этой карточки не существует');
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Вы ещё можете всё исправить!'));
      }
      return next(err);
    });
};
