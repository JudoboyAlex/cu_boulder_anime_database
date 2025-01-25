import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { mocked } from "jest-mock";
import DisplayAnime from "../../components/DisplayAnime";

jest.mock("axios");
const mockedAxios = mocked(axios);

const mockAnimeList = [
  {
    id: 1,
    url: "https://example.com/anime1",
    large_image_url: "https://example.com/image1.jpg",
    title_english: "Anime One",
  },
  {
    id: 2,
    url: "https://example.com/anime2",
    large_image_url: "https://example.com/image2.jpg",
    title_english: "Anime Two",
  },
];

describe("DisplayAnime Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state and fetches anime data", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockAnimeList });

    render(<DisplayAnime />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Anime One")).toBeInTheDocument();
      expect(screen.getByText("Anime Two")).toBeInTheDocument();
    });
  });

  test("handles search functionality", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockAnimeList });

    render(<DisplayAnime />);
    await waitFor(() => {
      expect(screen.getByText("Anime One")).toBeInTheDocument();
    });

    // Search for "Anime One"
    const searchInput = screen.getByPlaceholderText(/search for anime/i);
    fireEvent.change(searchInput, { target: { value: "Anime One" } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText("Anime One")).toBeInTheDocument();
      expect(screen.queryByText("Anime Two")).not.toBeInTheDocument();
    });

    // Clear search
    fireEvent.click(screen.getByText(/clear/i));
    await waitFor(() => {
      expect(screen.getByText("Anime Two")).toBeInTheDocument();
    });
  });

  test("handles invalid page number input", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockAnimeList });

    render(<DisplayAnime />);
    await waitFor(() => {
      expect(screen.getByText("Anime One")).toBeInTheDocument();
    });

    const pageInput = screen.getByDisplayValue("1");
    fireEvent.change(pageInput, { target: { value: "999" } });
    fireEvent.keyDown(pageInput, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByDisplayValue("1")).toBeInTheDocument(); // Page resets to valid range
    });
  });
});
