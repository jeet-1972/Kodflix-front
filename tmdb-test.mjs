const API_KEY = 'd8cb770a6aa5d6de388a710ec356e281';
const BASE_URL = 'https://api.themoviedb.org/3';

async function main() {
  const url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB test failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(
    'TMDB test fetch succeeded. Number of results:',
    Array.isArray(data.results) ? data.results.length : 0
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

