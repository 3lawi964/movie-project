"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.createElement("div");
CONTAINER.classList.add("container");
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
      } else if (eachMovieGenreId === 35) {
        genre.push("Comedy");
      } else if (eachMovieGenreId === 99) {
        genre.push("Documentary");
      } else if (eachMovieGenreId === 10751) {
        genre.push("Family");
      } else if (eachMovieGenreId === 10402) {
        genre.push("Music");
      } else if (eachMovieGenreId === 10749) {
        genre.push("Romance");
      } else if (eachMovieGenreId === 10770) {
        genre.push("Tv Movie");
      } else if (eachMovieGenreId === 37) {
        genre.push("Western");
      }
      return genre;
    });

    const movieDiv = document.createElement("div");
    movieDiv.classList.add(
      "movieContainer",
      "shadow-md",
      "rounded-lg",
      "overflow-hidden",
      "shadow-gray-300",
      "w-80",
      "hover:shadow-gray-400",
      "hover:shadow-lg"
    );
    movieDiv.innerHTML = `
             <div class="image-container relative w-full ">
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
              <div class="flex justify-center items-center bg-gray-900 py-auto"><p class= " md:text-xl text-2xl font-bold font-mono  text-white h-20 md:h-28 lg:h-36 xl:h-28 m-auto p-3">${
                movie.title
              }</p></div>

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
  console.log(similarMovies)

  //To get the Director's Name
  const name = []

  const names = credits.crew.map(eachCrewObject => {
       if(eachCrewObject.known_for_department === "Directing"){
           name.push(eachCrewObject.name) 
          }   
      return name     
  })
  
  const directorsname = name[0]

  //To get the movie's Genres

  let movieGenres = movie.genres
  const movieArrayGenre = []

  movieGenres.map( eachGenreElement =>{
      movieArrayGenre.push(eachGenreElement.id)
  })


  //To Get similar Movies 
  // if Similar Movies genres include MovieArrayGenre then need the title and image 
  const similarMovResults = similarMovies.results
  
  console.log(similarMovResults)

CONTAINER.innerHTML = `
      <h1 class="text-center text-4xl pt-3 pb-8" id="movie-title"><b>${movie.title}</b></h1>
      <div class="grid grid-cols-3 lg:flex bg-white text-black mx-auto w-full">
         <div class="col-md-4">
           <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
          </div>

          <div class=" bg-white text-black w-full px-3">
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <p id="movie-language"><b>Movie's Language:</b> ${movie.original_language}</p>
            <p id="movie-rating"> <b>Movie Ratings </b>  ${movie.vote_average} </p>
            <p id="recieved-votes"> <b> Recieved Votes: </b> ${movie.vote_count} votes</p>
            <p id="director-name"> <b>Director's Name</b> ${directorsname} </p>
            <h3 class="pt-6"><b>Overview:</b></h3>
            <p id="movie-overview">${movie.overview}</p>
          </div>
          
          <div class=" w-full px-3">
              <p id="production-company"><b>Production Company:</b> ${movie.production_companies[0].name}</p>
              <img class="w-52 h-auto pt-2"id="production-company-logo" src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path}> 
              <h3 class="pt-3"><b>5 Main Actors:</b></h3>
              <ul class=" pt-2 list-unstyled">
                  <li><a href="/">* ${credits.cast[0].name} </a></li>
                  <li><a href="/">* ${credits.cast[1].name} </a></li>
                  <li><a href="/">* ${credits.cast[2].name} </a></li>
                  <li><a href="/">* ${credits.cast[3].name} </a></li>
                  <li><a href="/">* ${credits.cast[4].name} </a></li>
              </ul>
          </div>

      </div>    


      <div id="Related-Movies-Section class="text-center mx-auto px-3">
      <h3 class="py-6 px-3 text-2xl"><b>Related Movies:</b></h3>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-3 mx-auto">
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[0].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[0].title}</b></p>
             </div>
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[1].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[1].title}</b></p>
             </div>
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[2].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[2].title}</b></p>
             </div>
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[3].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[3].title}</b></p>
             </div>
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[4].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[4].title}</b></p>
             </div>
             <div class="w-52">
                  <img src=${BACKDROP_BASE_URL + similarMovResults[5].backdrop_path}>
                  <p class="pt-2 text-center"><b>${similarMovResults[5].title}</b></p>
             </div>
         </div>
      </div>
          
      <div class="movie-trailer pt-10 w-full text-center mx-auto">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/d4m9WCxb-J8" title="YouTube video player" 
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen></iframe>
      </div>

  `;
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
  CONTAINER.innerHTML = `
  <h1 class="text-center text-4xl pt-3 pb-8" id="actor-name"><b>${actor.name}</b> </h1>
<div class="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-20 bg-white text-black mx-auto">
    <div class= "mx-auto">
        <img id="actor-backdrop"  src=${PROFILE_BASE_URL + actor.profile_path} alt="${actor.name}">
    </diV>

   <div class=" bg-white text-black w-full mx-auto px-2 pt-4 md:pt-0">
       <p id="actor-gender"><b>Gender:</b> ${actor.gender}</p>
       <p id="actor-popularity"><b>Popularity:</b> ${actor.popularity} </p>
       <p id="actor-birthday"><b>Birthday:</b> ${actor.birthday} </p>
       <p id="actor-deathday">${actor.deathday}</p>
       <h3 class="pt-6"><b>Biography:</b></h3>
       <p id="actor-biography">${actor.biography}</p>
   </div>
   
   <div class="mx-auto pr-2 pt-4 md:pt-0 w-full lg:pl-5">
   <h3><b>List of Movies the Actor Participated in:</b></h3>
   <ul class="pt-2">
        <li> ${movieCredits.cast[0].title}</li>
        <li> ${movieCredits.cast[1].title}</li>  
        <li> ${movieCredits.cast[2].title}</li>
        <li> ${movieCredits.cast[3].title}</li>
        <li> ${movieCredits.cast[4].title}</li>
        <li> ${movieCredits.cast[5].title} </li>
        <li> ${movieCredits.cast[6].title} </li>
    </ul> 
   </div> 
</div>`;
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
  .getElementById("upComing")
  .addEventListener("click", () => autorun(`movie/upcoming`));
document.getElementById("actors").addEventListener("click", actorsSection);
