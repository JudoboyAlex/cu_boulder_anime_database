import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import "./DisplayAnime.css";

interface Anime {
  id: number;
  url: string;
  large_image_url: string;
  title_english: string;
}

const DisplayAnime: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null);

  const ITEMS_PER_PAGE = 24;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const fetchAnime = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Anime[]>(
        `${backendUrl}/fetch-anime`
      );
      setAnimeList(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data || "Failed to fetch anime data.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAnimeList = searchResults
    ? searchResults.slice(startIndex, endIndex)
    : animeList.slice(startIndex, endIndex);

  const totalPages = Math.ceil(
    (searchResults ? searchResults.length : animeList.length) / ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setInputPage(nextPage.toString());
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setInputPage(prevPage.toString());
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputPage(event.target.value);
  };

  const handlePageJump = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      let pageNumber = parseInt(inputPage, 10);
      if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
      } else if (pageNumber > totalPages) {
        pageNumber = totalPages;
      }
      setCurrentPage(pageNumber);
      setInputPage(pageNumber.toString());
    }
  };

  const handleInputBlur = () => {
    let pageNumber = parseInt(inputPage, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    setCurrentPage(pageNumber);
    setInputPage(pageNumber.toString());
  };

  const handleSearch = () => {
    const filteredResults = animeList.filter((anime) =>
      anime.title_english.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
    setCurrentPage(1);
    setInputPage("1");
  };

  const handleClear = () => {
    setSearchResults(null);
    setSearchQuery("");
    setCurrentPage(1);
    setInputPage("1");
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(); // Trigger search on Enter key
    }
  };

  return (
    <div className="container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown} // Handle Enter key
          placeholder="Search for anime..."
        />
        <button onClick={handleSearch}>Search</button>

        {/* Clear Button */}
        {searchResults && <button onClick={handleClear}>Clear</button>}
      </div>

      <h2>{searchResults ? "Search Results" : "Anime Sorted By Popularity"}</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="anime-grid">
        {!loading &&
          !error &&
          currentAnimeList.map((anime) => (
            <div key={anime.id} className="anime-item">
              <a href={anime.url} target="_blank" rel="noopener noreferrer">
                <img src={anime.large_image_url} alt={anime.title_english} />
                <p>{anime.title_english}</p>
              </a>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Back
        </button>
        <span>
          Page{" "}
          <input
            type="text"
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handlePageJump}
            onBlur={handleInputBlur}
          />{" "}
          of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Forward
        </button>
      </div>
    </div>
  );
};

export default DisplayAnime;
