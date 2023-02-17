import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_URL = 'https://api.themoviedb.org/3/';
const base_url = 'https://image.tmdb.org/t/p/original/';
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);

  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    // if [], run once when the row load and don't run again
    // [movies] , run all the time till the movies changes.

    async function fetchData() {
      // const fetchData = async() => {

      const request = await axios.get(`${base_URL}${fetchUrl}`);

      //https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213
      // console.log(request.data.results);

      setMovies(request.data.results);
      //   console.log(request);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  // console.table(movies);

  const opts = {
    height: '300',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleclick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || '')
        .then((url) => {
          const URLParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(URLParams.get('v'));
        })
        .catch((error) => console.log(error));
    }
    //movie?.title || movie?.name || movie?.original_name
  };
  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleclick(movie)}
            className={`row_poster ${isLargeRow && 'row_posterLarge'}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.original_name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
