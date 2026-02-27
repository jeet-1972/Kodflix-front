import React, { useEffect, useState } from 'react';
import { fetchCategory, IMAGE_BASE_URL } from '../api/tmdb.js';

import './Row.css';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCategory(fetchUrl);
        if (!isCancelled) {
          setMovies(data.results || []);
        }
      } catch (err) {
        console.error(`Failed to load row "${title}" from TMDB`, err);
        if (!isCancelled) {
          setError('Unable to load this row right now.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [fetchUrl, title]);

  return (
    <section className="row">
      <h2 className="row__title">{title}</h2>
      {isLoading && <p className="row__status">Loading…</p>}
      {error && !isLoading && <p className="row__status row__status--error">{error}</p>}
      <div className="row__posters">
        {movies.map((movie) => {
          const key = movie.id || movie.name;
          const imagePath = isLargeRow
            ? movie.poster_path || movie.backdrop_path
            : movie.backdrop_path || movie.poster_path;

          if (!imagePath) return null;

          return (
            <article
              key={key}
              className={`row__poster ${isLargeRow ? 'row__poster--large' : ''}`}
            >
              <img
                src={`${IMAGE_BASE_URL}${imagePath}`}
                alt={movie?.name || movie?.title || 'Movie'}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Row;

