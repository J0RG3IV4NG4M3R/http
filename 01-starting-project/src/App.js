import React, { useCallback, useEffect, useState } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-course-http-41d19-default-rtdb.firebaseio.com/movies.json"
      );

      // Fetch API no real error, Axios real error
      // We have to chek the response before we try to parse the reponse
      // Because json data sometimes fails
      // Question: I don't understand Error
      if (!response.ok) {
        throw new Error("Error number: XXX");
      }

      const data = await response.json();
      console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseData: data[key].releaseData,
        });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseData: movieData.release_date,
      //   };
      // });
      //setMovies(transformedMovies);

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-course-http-41d19-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          // Question: What is this?
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p></p>;

  console.log(movies.length);

  if (movies.length === 0) {
    content = <p>No movies</p>;
  } else if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (isLoading) {
    content = <p>Loading ...</p>;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button id="searchButton" onClick={fetchMoviesHandler}>
          {" "}
          Fetch movies{" "}
        </button>
      </section>
      <section>
        {content}
        {/* {!isLoading && <p>Click on the button to search movies</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading, plase wait ...</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
