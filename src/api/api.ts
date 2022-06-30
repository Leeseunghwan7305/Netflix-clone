import axios from "axios";

const BASE_PATH = "https://api.themoviedb.org/3";
console.log(process.env.REACT_APP_MOVIE);
export async function getMovies() {
  let response = await axios.get<IGetMoviesResult>(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE}&language=en-US&page=1`
  );
  return response.data;
}

export interface IGetMoviesResult {
  dates: Dates;
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export interface Dates {
  maximum: Date;
  minimum: Date;
}

export interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: OriginalLanguage;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export enum OriginalLanguage {
  En = "en",
  Ja = "ja",
}
