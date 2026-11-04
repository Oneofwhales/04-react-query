import { useState } from "react";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
  }
  function handleClose() {
    setSelectedMovie(null);
  }

  async function handleSearch(query: string) {
    setMovies([]);
    setIsError(false);
    try {
      setIsLoading(true);
      const searchMovies = await fetchMovies(query);
      if (searchMovies.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(searchMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && !isLoading && !isError && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
    </div>
  );
}

export default App;
