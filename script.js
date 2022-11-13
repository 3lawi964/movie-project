"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.createElement("div");
CONTAINER.classList.add("container");
const selectedGenras = [];
const mainContainer = document.querySelector(".mainContainer");
mainContainer.appendChild(CONTAINER);

const deletingContainerContent = () => {
  while (CONTAINER.firstChild) {
    CONTAINER.firstChild.remove();
  }
};
// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  genresDetails();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const credits = await fetchCredits(movie.id); //added new to get actors & director
  const similarMovies = await fetchSimilarMovies(movie.id); //added new to get similar movies
  renderMovie(movieRes, credits, similarMovies);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

/* Need to add 
// 1) Get Top Rated        movie/top_rated
// 2) Get Popular          movie/popular
// 3) Get Upcoming         movie/upcoming
// 4) Get Release Dates    movie/{movie_id}/release_dates
// 5) Get Genre
*/

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

//This is for fetching Credits (created new)
// Don't touch this function please. This function is to fetch credits for one movie.
const fetchCredits = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

//This is for fetching Similar Movies (created new)
// Don't touch this function please. This function is to fetch similar movies for one movie.
const fetchSimilarMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  deletingContainerContent();
  const newDiv = document.createElement("div");
  newDiv.classList.add(
    "grid",
    "grid-cols-1",
    "gap-6",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "lg:px-20"
  );
  movies.map((movie) => {
    //To Create genres' name for each movie based on genre_ids
    const movieGenreIdArray = movie.genre_ids;
    const genre = [];
    movieGenreIdArray.map((eachMovieGenreId) => {
      if (eachMovieGenreId === 27) {
        genre.push("Horror");
      } else if (eachMovieGenreId === 53) {
        genre.push("Thriller");
      } else if (eachMovieGenreId === 28) {
        genre.push("Action");
      } else if (eachMovieGenreId === 14) {
        genre.push("Fantasy");
      } else if (eachMovieGenreId === 878) {
        genre.push("Science Fiction");
      } else if (eachMovieGenreId === 9648) {
        genre.push("Mystery");
      } else if (eachMovieGenreId === 18) {
        genre.push("Drama");
      } else if (eachMovieGenreId === 12) {
        genre.push("Adventure");
      } else if (eachMovieGenreId === 80) {
        genre.push("Crime");
      } else if (eachMovieGenreId === 16) {
        genre.push("Animation");
      } else if (eachMovieGenreId === 36) {
        genre.push("History");
      } else if (eachMovieGenreId === 10752) {
        genre.push("War");
      }
      return genre;
    });

    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieContainer");
    movieDiv.innerHTML = `
             <div class="image-container relative w-full border-8 border-black">
                <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster class="home-movie-image opacity-100 block w-full h-auto transition ease-in duration-500">
                <div class="middle transition ease-in duration-500 opacity-0 absolute -translate-y-2/4 -translate-x-2/4 text-justify w-72">
                    <div class="textonimage bg-black text-white text-xs w-full p-3"><b>Rating:</b> ${
                      movie.vote_average
                    } <br><b>Genres:</b> ${genre} <br><b>Description:</b> ${
      movie.overview
    }</div>
                </div>
              </div>
              <h1 class= "text-center md:text-4xl text-2xl font-bold font-mono bg-black text-white h-20 md:h-28 lg:h-36 xl:h-28 m-auto p-3">${
                movie.title
              }</h1>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    newDiv.appendChild(movieDiv);
    CONTAINER.appendChild(newDiv);
    mainContainer.appendChild(CONTAINER);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, similarMovies) => {
  CONTAINER.innerHTML = `
    <div class="row bg-black text-white mx-auto w-full">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8 bg-black text-white w-full">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3 class="pt-6"><b>Overview:</b></h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
                <li><a href="/"> ${credits.cast[0].name} </a></li>
                <li><a href="/"> ${credits.cast[1].name} </a></li>
                <li><a href="/"> ${credits.cast[2].name} </a></li>
                <li><a href="/"> ${credits.cast[3].name} </a></li>
                <li><a href="/"> ${credits.cast[4].name} </a></li>
            </ul>

            <div class="m-auto"> 
            <p id="movie-language"><b>Movie Language:</b> ${
              movie.original_language
            }
            </div>
            
            <div>




            <!-- make sure to delete code from line "187" to line "204" cuz it's keep throwing an error in the console -->
            
            
            
            
            
            <p id="production-company"><b>Production Company:</b> ${
              movie.production_companies[0].name
            }</p>
            <img id="production-company-logo" src=${
              BACKDROP_BASE_URL + movie.production_companies[0].logo_path
            }>
            </div>
            
        
         <div class="movie-trailer pt-10 w-full text-center mx-auto">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/d4m9WCxb-J8" title="YouTube video player" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>

        <iframe width="560" height="315" src="https://www.youtube.com/embed/mkomfZHG5q4" title="YouTube video player" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>
        </div> 

        <div class="pt-20">
        <p id="director-name"> <b>Director's Name</b>  ${
          credits.crew[15].name
        } </p>
        </div>

        <div class="pt-20">
        <p id="movie-rating"> <b>Movie Ratings </b>  ${movie.vote_average} </p>
        <p id="recieved-votes"> <b> Recieved Votes: </b> ${
          movie.vote_count
        } votes</p>
        </div>
            </div>`;
};

// FETCH GENRES AND IMPLEMENT THE FILTERING BASED ON GENDER
const fetchGenresName = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};
const genresDetails = async () => {
  const genre = await fetchGenresName();
  renderGenres(genre.genres);
};
// FITCH FILTERD GENRAS
const fetchGenresFilterd = async () => {
  const url =
    constructUrl(`discover/movie`) + `&with_genres=${selectedGenras.join(",")}`;
  const res = await fetch(url);
  return res.json();
};
const getFilterdMoviesByGenres = async () => {
  const genres = await fetchGenresFilterd();
  rendermoviesBasedOnGenres(genres.results);
};

const rendermoviesBasedOnGenres = (movies) => {
  deletingContainerContent();
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    CONTAINER.classList.add(
      "grid",
      "grid-cols-1",
      "gap-6",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "lg:px-20"
    );
    movieDiv.setAttribute("id", "movieCard");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    mainContainer.appendChild(CONTAINER);
  });
};
const renderGenres = (genre) => {
  const listContainer = document.getElementById("genreList");

  genre.forEach((ele) => {
    const listElement = document.createElement("li");
    const licontent = document.createElement("p");
    listElement.classList.add(
      "text-sm",
      "hover:bg-gray-100",
      "text-gray-700",
      "block",
      "px-4",
      "py-2"
    );
    licontent.innerText = `${ele.name}`;
    listElement.addEventListener("click", () => {
      if (selectedGenras.length === 0) {
        selectedGenras.push(ele.id);
      } else {
        if (selectedGenras.includes(ele.id)) {
          selectedGenras.forEach((id, indx) => {
            if (id === ele.id) {
              selectedGenras.splice(indx, 1);
            }
          });
        } else {
          selectedGenras.push(ele.id);
        }
      }
      getFilterdMoviesByGenres();
    });
    listElement.appendChild(licontent);
    listElement.setAttribute("id", ele.name);
    listContainer.appendChild(listElement);
  });
};

//! fetch the top rated movies

const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  return res.json();
};

const topRated = async () => {
  const movieRes = await fetchTopRated();
  renderTopRate(movieRes.results);
};
const renderTopRate = (movies) => {
  console.log(movies);
  deletingContainerContent();
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    CONTAINER.classList.add(
      "grid",
      "grid-cols-1",
      "gap-6",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "lg:px-20"
    );
    movieDiv.setAttribute("id", "movieCard");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    mainContainer.appendChild(CONTAINER);
  });
};
//! ends here
//! fetch most popular
const fetchPopular = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  return res.json();
};

const mostPopular = async () => {
  const movieRes = await fetchPopular();
  renderPopular(movieRes.results);
};
const renderPopular = (movies) => {
  deletingContainerContent();
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    CONTAINER.classList.add(
      "grid",
      "grid-cols-1",
      "gap-6",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "lg:px-20"
    );
    movieDiv.setAttribute("id", "movieCard");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    mainContainer.appendChild(CONTAINER);
  });
};
//! ends here
//! fetch latest movies

const fetchLatest = async () => {
  const date = new Date();
  const currentDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const release = `&primary_release_date.gte=1992-01-01&primary_release_date.lte=${currentDate}`;
  const url = constructUrl(`discover/movie`) + release;
  const res = await fetch(url);
  return res.json();
};

const latestMovies = async () => {
  const movieRes = await fetchLatest();
  console.log(movieRes.results);
  renderLatest(movieRes.results);
};
const renderLatest = (movies) => {
  deletingContainerContent();
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    CONTAINER.classList.add(
      "grid",
      "grid-cols-1",
      "gap-6",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "lg:px-20"
    );
    movieDiv.setAttribute("id", "movieCard");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    mainContainer.appendChild(CONTAINER);
  });
};
//! ends here
//! fetch upcoming
const fetchUpComing = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  return res.json();
};

const upComingMovies = async () => {
  const movieRes = await fetchUpComing();
  renderUpComing(movieRes.results);
};
const renderUpComing = (movies) => {
  deletingContainerContent();
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    CONTAINER.classList.add(
      "grid",
      "grid-cols-1",
      "gap-6",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "lg:px-20"
    );
    movieDiv.setAttribute("id", "movieCard");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    mainContainer.appendChild(CONTAINER);
  });
};
//! ends here
document.addEventListener("DOMContentLoaded", autorun);
document.getElementById("top").addEventListener("click", topRated);
document.getElementById("popular").addEventListener("click", mostPopular);
document.getElementById("latest").addEventListener("click", latestMovies);
document.getElementById("nowPlaying").addEventListener("click", autorun);
document.getElementById("upComing").addEventListener("click", upComingMovies);
