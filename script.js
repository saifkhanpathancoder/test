const imageHeadContainer = document.querySelector('.explore__huge-container');
const container = document.querySelector('.movie-container__innercontainer');
const singlecontainer = document.querySelector(
  '.movie-container__image-wrapper'
);
const trendingContainer = document.querySelector(
  '.explore__content-innercontainer'
);
const movieId = document.location.search.replace('?id=', '');

if (movieId) {
  document.querySelector('.explore').style.display = 'none';
} else {
  document.querySelector('.movie-container').style.display = 'none';
}

const imgNotFound =
  'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const renderMarkup = (image, title, id, type) => {
  const movieImage = image
    ? `https://image.tmdb.org/t/p/w300${image}`
    : imgNotFound;

  markup = `<div class="explore__image-wrapper"id="${id}" onclick="openSingleMovie(id)">
    <img src= "${movieImage}" alt=" pic" class="explore__image-2">
    <div class="explore__heading-sub">${title.slice(0, 10)} ${
    title.length > 11 ? '...' : ''
  } </div>`;
  if (type === 'movies') {
    imageHeadContainer.insertAdjacentHTML('beforeend', markup);
  } else if (type === 'similarMovies') {
    singlecontainer.insertAdjacentHTML('beforeend', markup);
  }
};

const renderAnomieMovie = (
  title,
  status,
  rating,
  language,
  popularity,
  img,
  description
) => {
  const movieImg = img ? `https://image.tmdb.org/t/p/w300${img}` : imgNotFound;

  const markup = `<div class="single-movie-container">
      <div class="movie-container__holder">
        <div class="movie-container__imagehead">
          <img
            src="${movieImg}"
            alt="img"
            class="movie-container__image"
          />
        </div>

        <div class="movie-container__movieheadings">
          <h1 class="movie-container__heading-primary">Name:</h1>
          <h2 class="movie-container__heading-secondary">${title}</h2>
          <h1 class="movie-container__heading-primary">Status:</h1>
          <h2 class="movie-container__heading-secondary">${status}</h2>
          <h1 class="movie-container__heading-primary">Rating:</h1>
          <h2 class="movie-container__heading-secondary">${rating}</h2>
          <h1 class="movie-container__heading-primary">Lang:</h1>
          <h2 class="movie-container__heading-secondary">${language}</h2>
          <h1 class="movie-container__heading-primary">Popularity:</h1>
          <h2 class="movie-container__heading-secondary">${popularity}
            Action,Adventures,Fantasy
          </h2>
        </div>
      </div>
      <div class="movie-container__paraHolder">
        <p class="movie-container__head">Sypnosis:</p>
        <p class="movie-container__para">${description}</p>
      </div>
    </div>`;
  container.insertAdjacentHTML('afterbegin', markup);
};

const exploreTrending = (title, overview, img) => {
  const bgImg = `
   background-image: linear-gradient(
       to right bottom,
     rgba(0, 0, 0, 0.6) 20%,
     rgba(0, 0, 0, 0.6) 50%
     ),
  url(https://image.tmdb.org/t/p/w300${img});`;

  const markup = `<div class="explore__image-content" style= "${bgImg}"> 
  <div class="explore__text-content">
    <div class="explore__heading-small">${title}</div>
    <div class="explore__paragraph">
     ${overview}
    </div>
  </div>
</div>`;
  trendingContainer.insertAdjacentHTML('beforeend', markup);
};

const fetchingData = async () => {
  const allMovieUrl =
    'https://api.themoviedb.org/3/movie/popular?api_key=235b01f43eb27b7fdd95c3cbcd0b2c6b&language=en-US&page=1';
  const singleMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=235b01f43eb27b7fdd95c3cbcd0b2c6b&language=en-US`;
  const similarMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=235b01f43eb27b7fdd95c3cbcd0b2c6b&language=en-US&page=1`;
  const topRatedMovie =
    'https://api.themoviedb.org/3/movie/top_rated?api_key=235b01f43eb27b7fdd95c3cbcd0b2c6b&language=en-US&page=1';

  try {
    if (movieId) {
      // fetch single movie and similar movie
      const [singleMovie, similarMovie] = await Promise.all([
        fetch(singleMovieUrl),
        fetch(similarMovieUrl),
      ]);

      const singleMovieData = await singleMovie.json();
      const similarMovieData = await similarMovie.json();

      renderAnomieMovie(
        singleMovieData.title,
        singleMovieData.status,
        singleMovieData.vote_average,
        singleMovieData.original_language,
        singleMovieData.popularity,
        singleMovieData.poster_path,
        singleMovieData.overview
      );

      similarMovieData.results.slice(0, 6).forEach(item => {
        renderMarkup(item.poster_path, item.title, item.id, 'similarMovies');
      });
    } else {
      // fetch all the movie
      const [allPostUrl, trendingPost] = await Promise.all([
        fetch(allMovieUrl),
        fetch(topRatedMovie),
      ]);

      const allMovieData = await allPostUrl.json();
      const topRatedData = await trendingPost.json();
      console.log(allMovieData);
      console.log(topRatedData);

      console.log('testing'),
        topRatedData.results.slice(4, 7).forEach(item => {
          exploreTrending(item.title, item.overview, item.backdrop_path);
        });
      allMovieData.results.forEach(item => {
        renderMarkup(item.poster_path, item.title, item.id, 'movies');
      });
    }
  } catch (err) {}
};
fetchingData();

const openSingleMovie = id => {
  console.log('testing', id);
  document.location.search = `id=${id}`;
};
