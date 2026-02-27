const API_KEY = 'd8cb770a6aa5d6de388a710ec356e281';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const requests = {
  fetchTrending: '/trending/all/week',
  fetchNetflixOriginals: '/discover/tv?with_networks=213',
  fetchTopRated: '/movie/top_rated',
  fetchActionMovies: '/discover/movie?with_genres=28',
  fetchComedyMovies: '/discover/movie?with_genres=35',
  fetchHorrorMovies: '/discover/movie?with_genres=27',
  fetchRomanceMovies: '/discover/movie?with_genres=10749',
  fetchDocumentaries: '/discover/movie?with_genres=99',
};

async function fetchCategory(pathWithParams) {
  const hasQuery = pathWithParams.includes('?');
  const url = `${BASE_URL}${pathWithParams}${hasQuery ? '&' : '?'}api_key=${API_KEY}&language=en-US`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export { API_KEY, BASE_URL, IMAGE_BASE_URL, requests, fetchCategory };

