import axios from "axios";

const BASE_PATH = "https://api.themoviedb.org/3";
console.log(process.env.REACT_APP_MOVIE);
export async function getMovies() {
  let response = await axios.get(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE}&language=en-US&page=1`
  );
  return response;
}
