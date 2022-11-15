"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.createElement("div");
CONTAINER.classList.add("container", "mb-32");
const selectedGenras = [];
const mainContainer = document.querySelector(".mainContainer");
mainContainer.appendChild(CONTAINER);
const date = new Date();
const currentDate =
  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
const release = `&primary_release_date.gte=1992-01-01&primary_release_date.lte=${currentDate}`;

const deletingContainerContent = () => {
  while (CONTAINER.firstChild) {
    CONTAINER.firstChild.remove();
  }
};
// Don't touch this function please
const autorun = async (path, query = "") => {
  const movies = await fetchMovies(path, query);
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
const fetchMovies = async (path, query = "") => {
  const url = constructUrl(path) + query;
  const res = await fetch(url);
  return res.json();
};

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
  movies.forEach((movie) => {
    genresDetailsItem(movie.genre_ids, movie.id);
    const movieDiv = document.createElement("div");
    movieDiv.id = "movieCard";
    movieDiv.classList.add(
      "w-80",
      "rounded-lg",
      "shadow-md",
      "shadow-gray-300",
      "hover:shadow-lg",
      "overflow-hidden",
      "duration-3000",
      "transition",
      "relative"
    );
    movieDiv.innerHTML = `
    <div class="relative overflow-hidden">
    <div id="overview" class="absolute font-bold text-gray-90 bg-opacity-60 transition duration-3000 p-6 bg-gray-50 top-0 right-0 bottom-0 translate-y-full hover:translate-y-0 ">
    Overview :<br>
     ${movie.overview}</div>
    <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt"${
      movie.title
    } class="w-full">
    </div>
    
    <div class="px-4 py-6 flex flex-col gap-4">
    <div class="relative flex items-center justify-between font-bold">
    <h3 class="text-xl">${movie.title}</h3>
      <span id="vote" class="absolute -top-12 right-4 bg-gray-900 p-2 rounded-full text-${voteColor(
        parseFloat(movie.vote_average).toFixed(1)
      )}-500 shadow-xl shadow-${voteColor(
      parseFloat(movie.vote_average).toFixed(1)
    )}-300"><p>${parseFloat(movie.vote_average).toFixed(1)}</p></span>
    </div>
      <ul id=${movie.id} class="flex gap-4 items-center text-sm flex-wrap"></ul>
    </div>
    `;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    newDiv.appendChild(movieDiv);
    CONTAINER.appendChild(newDiv);
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

        <div class="pt-20">
        <p id="director-name"> <b>Director's Name</b> ?? </p>
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
const genresDetailsItem = async (ids, movieId) => {
  const genre = await fetchGenresName();
  const res = fun(genre.genres, ids, movieId);
  return res;
};
const fun = (path, id, movieId) => {
  const arr = [];
  const movie = document.getElementById(movieId);
  path.forEach((ele) => {
    const idArray = id;
    for (let i = 0; i < idArray.length; i++) {
      if (ele.id == idArray[i]) {
        arr.push(ele.name);
      }
    }
  });
  arr.forEach((ele) => {
    const li = document.createElement("li");
    li.classList.add(
      "px-2",
      "py-1",
      "bg-gray-900",
      "text-gray-50",
      "rounded-full",
      "bg-opacity-50"
    );
    li.innerHTML = `${ele}`;
    movie.appendChild(li);
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
      // getFilterdMoviesByGenres();
      autorun(`discover/movie`, `&with_genres=${selectedGenras.join(",")}`);
    });
    listElement.appendChild(licontent);
    listElement.setAttribute("id", ele.name);
    listContainer.appendChild(listElement);
  });
};

//Fetching Actors and Single Actors //

const actorsSection = async () => {
  const actors = await fetchActors(); // added new for actors
  renderActors(actors.results); // added new for actors
};

// Actor Details Function
const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  const movieCredits = await fetchMovieCredits(actor.id);
  renderActor(actorRes, movieCredits);
};

// fetch Actors Function
const fetchActors = async () => {
  const url2 = constructUrl(`person/popular`);
  const res = await fetch(url2);
  return res.json();
};

//fetch Movie Credits Function for each Actor
const fetchMovieCredits = async (actorId) => {
  const url2 = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url2);
  return res.json();
};

//fetch Single Actor Function
const fetchActor = async (actorId) => {
  const url2 = constructUrl(`person/${actorId}`);
  const res = await fetch(url2);
  return res.json();
};

// renderActors Function
const renderActors = (actors) => {
  deletingContainerContent();
  const newDiv2 = document.createElement("div");
  newDiv2.classList.add(
    "grid",
    "grid-cols-1",
    "gap-6",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "lg:px-20"
  );
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.classList.add("actorContainer");
    actorDiv.innerHTML = `
      <div class= "w-80 mx-auto">
        <div class="image-container relative w-full border-8 border-black">
          <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
      actor.name
    }" poster class=" home-actor-image opacity-100 block w-full h-auto">  
        </div>
        <h1 class= "text-center text-2xl md:text-3xl font-bold font-mono bg-black text-white h-20 md:h-28 lg:h-36 xl:h-28 m-auto p-3">${
          actor.name
        }</h1>
     </div> `;
    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });

    newDiv2.appendChild(actorDiv);
    CONTAINER.appendChild(newDiv2);
  });
};

//render Single Actor Function
const renderActor = (actor, movieCredits) => {
  //console.log(actor, movieCredits)

  CONTAINER.innerHTML = `
<div class="row bg-white text-black mx-auto w-full">
   <div class="col-md-4">
        <img id="actor-backdrop" src=${PROFILE_BASE_URL + actor.profile_path}>
   </div>

   <div class="col-md-8 bg-white text-black w-full">
       <h2 id="actor-name"><b>Name:</b> ${actor.name}</h2>
       <p id="actor-gender"><b>Gender:</b> ${actor.gender}</p>
       <p id="actor-popularity"><b>Popularity:</b> ${actor.popularity} </p>
       <p id="actor-birthday"><b>Birthday:</b> ${actor.birthday} </p>
       <p id="actor-deathday"><b>Deathday:</b> ${actor.deathday} </p>
       <h3 class="pt-6"><b>Biography:</b></h3>
       <p id="actor-biography">${actor.biography}</p>
   </div>
   
   <h3>List of Movies the Actor Participated in:</h3>
   <ul id="list-of-movies-actor-participated-in" class="list-unstyled" >
        <li> 
           <a href="#"> ${movieCredits.cast[0].title}</a>
        </li>
           
        <li> 
           <a href="#"> ${movieCredits.cast[1].title}</a>
        </li>
           
        <li> 
           <a href="#"> ${movieCredits.cast[2].title} </a>
        </li>
           
        <li> 
           <a href="#">${movieCredits.cast[3].title} </a>
        </li>
           
        <li> 
           <a href="#"> ${movieCredits.cast[4].title}</a>
        </li>

        <li> 
           <a href="#"> ${movieCredits.cast[5].title}</a>
        </li>

        <li> 
          <a href="#"> ${movieCredits.cast[6].title}</a>
         </li>
    </ul> 
</div>`;
};
const voteColor = (vote) => {
  if (vote >= 8.5) {
    return `green`;
  } else if (vote < 8.5 && vote >= 7) {
    return `yellow`;
  } else if (vote < 7 && vote >= 5) {
    return `orange`;
  } else {
    return `red`;
  }
};
const form = document.getElementById("searchForm");
const searchInput = document.getElementById("simple-search");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value;

  if (searchValue) {
    autorun(`search/movie`, `&query=${searchValue}`);
  }
});
document.addEventListener("DOMContentLoaded", () =>
  autorun(`movie/now_playing`)
);
document
  .getElementById("top")
  .addEventListener("click", () => autorun(`movie/top_rated`));
document
  .getElementById("popular")
  .addEventListener("click", () => autorun(`movie/popular`));
document
  .getElementById("latest")
  .addEventListener("click", () => autorun(`discover/movie`, release));
document
  .getElementById("nowPlaying")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("home")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("logo")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("upComing")
  .addEventListener("click", () => autorun(`movie/upcoming`));
document.getElementById("actors").addEventListener("click", actorsSection);
