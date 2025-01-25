import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DisplayAnime from "../../components/DisplayAnime";
import axios from "axios";
import { mocked } from "jest-mock";

// Mock the anime list data
const mockAnimeList = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  title_english: `Anime ${i + 1}`,
  large_image_url: `https://example.com/image${i + 1}.jpg`,
  url: `https://example.com/anime${i + 1}`,
}));

jest.mock("axios"); // Mocking axios for API requests
const mockedAxios = mocked(axios);

describe("DisplayAnime Component", () => {
  test("renders anime grid and handles pagination then check there is no next page when end is reached", async () => {
    // Mock the API response with two pages of data
    mockedAxios.get
      .mockResolvedValueOnce({
        data: mockAnimeList,
      })
      .mockResolvedValueOnce({
        data: mockAnimeList, // Mock second page data
      });

    render(<DisplayAnime />);

    // Check if the anime grid is rendered (at least 1 anime item should be present)
    await waitFor(() => {
      expect(screen.getByText("Anime 1")).toBeInTheDocument();
      expect(screen.getByText("Anime 13")).toBeInTheDocument();
    });

    // Check the initial page value (should be 1)
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();

    // Simulate clicking the "Forward" button to go to the next page
    fireEvent.click(screen.getByText(/forward/i));

    // Wait for the page number input to update
    await waitFor(() => {
      // The input value should now be 2
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });

    // Check if the next page of anime items is rendered (Anime Three and Anime Four should appear)
    expect(screen.getByText("Anime 25")).toBeInTheDocument();
    expect(screen.getByText("Anime 30")).toBeInTheDocument();

    // Check if the forward button is disabled (as there's no next page)
    const forwardButton = screen.getByText(/forward/i);
    expect(forwardButton).toBeDisabled();
  });
});
