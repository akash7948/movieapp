import React, { useState, useEffect } from "react";
import Search from "./Search";
import Card from "./Card";
import loadingLogo from "../img/logo.png";
import defaultBg from "../img/default-bg.jpg";
import Axios from "axios";

const Main = () => {
  const [movie, setMovie] = useState({});
  const [id, setId] = useState(14163);
  const [trailerUrl, setTrailerUrl] = useState();
  const [imdbUrl, setImdbUrl] = useState();
  const [loading, setLoading] = useState(true);

  const API_key = "3ee3dd446b8afd003b08f596ade66996";
  const url = `https://api.themoviedb.org/3/movie/${id}?&api_key=${API_key}`;

  const fetchMovie = async () => {
    const result = await Axios(url);
    setMovie(result.data);

    if (result.data.imdb_id) {
      setImdbUrl(`https://www.imdb.com/title/${result.data.imdb_id}`);
    } else {
      setImdbUrl(undefined);
    }
  };

  // const updateMovie = async (e) => {
  //     setLoading(true);
  //     e.preventDefault();
  //     const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_key}&query=${e.target.elements.title.value}`;
  //     const result = await Axios(searchUrl);
  //     setId(result.data.results[0].id);
  // };

  const updateMovie = async (id) => {
    setLoading(true);
    const searchUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_key}`;
    const result = await Axios(searchUrl);
    setId(result.data.id);
  };

  const updateBackground = () => {
    const backdropUrl =
      "https://image.tmdb.org/t/p/original/" + movie.backdrop_path;
    movie.backdrop_path
      ? (document.body.style.backgroundImage = `url(${backdropUrl})`)
      : (document.body.style.backgroundImage = `url(${defaultBg})`);
  };

  const fetchTrailer = async () => {
    const searchUrl = `http://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_key}`;
    const result = await Axios(searchUrl);
    if (result.data.results.length !== 0) {
      const key = result.data.results[0].key;
      setTrailerUrl(`https://www.youtube.com/watch?v=${key}`);
    } else {
      setTrailerUrl(undefined);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    updateBackground();
    fetchTrailer();
    setLoading(false);
  });

  return (
    <div className="container">
      {loading ? (
        <span id="loading">
          <div id="loading-ring">
            <img src={loadingLogo} width="150px" alt="The Movie Database"></img>
          </div>
        </span>
      ) : null}
      <Search updateMovie={updateMovie} />
      <Card movie={movie} trailerUrl={trailerUrl} imdbUrl={imdbUrl} />
    </div>
  );
};

export default Main;
