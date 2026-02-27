import React, { useEffect, useState } from 'react';
import { fetchCategory, IMAGE_BASE_URL, requests } from '../api/tmdb.js';

import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const data = await fetchCategory(requests.fetchNetflixOriginals);
        const results = data.results || [];
        if (!results.length) return;
        const randomIndex = Math.floor(Math.random() * results.length);
        if (!isCancelled) {
          setMovie(results[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to load banner data from TMDB', error);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  const truncate = (str, n) =>
    str && str.length > n ? `${str.slice(0, n - 1)}…` : str;

  const backgroundImage =
    movie && (movie.backdrop_path || movie.poster_path)
      ? `${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`
      : null;

  return (
    <section
      className="banner"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%), url(${backgroundImage})`,
            }
          : undefined
      }
    >
      <div className="banner__content">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name || 'Featured'}
        </h1>
        <p className="banner__buttons">
          <button className="banner__button banner__button--primary">
            Play
          </button>
          <button className="banner__button banner__button--secondary">
            More Info
          </button>
        </p>
        <p className="banner__description">
          {truncate(movie?.overview || 'Enjoy the latest movies and TV shows.', 160)}
        </p>
      </div>
      <div className="banner__fadeBottom" />
    </section>
  );
}

export default Banner;

