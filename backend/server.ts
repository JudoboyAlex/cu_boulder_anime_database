import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import axios from "axios";
import cors from "cors";

//For env File
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Enable CORS
app.use(cors());

// Define a Mongoose schema and model
const AnimeSchema = new mongoose.Schema({
  mal_id: Number,
  url: String,
  large_image_url: String,
  title_english: String,
});

const Anime = mongoose.model("Anime", AnimeSchema, "animeCollection");

// MongoDB connection
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Utility function to add a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch anime data from the Jikan API with pagination and rate-limiting
const fetchAnimeData = async () => {
  const baseUrl = "https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=";
  let animeList: any[] = [];
  let currentPage = 1;
  const totalPages = 1139; // Total number of pages in the API
  const delayBetweenRequests = 1000 / 3; // 3 requests per second = ~333ms, but set to 350ms for safety

  try {
    console.log("Fetching anime data from all pages...");
    while (currentPage <= totalPages) {
      const url = `${baseUrl}${currentPage}`;
      console.log(`Fetching page ${currentPage}...`);

      try {
        const response = await axios.get(url);

        // Map the data for the current page
        const currentAnimeList = response.data.data.map((anime: any) => ({
          id: anime.mal_id,
          url: anime.url,
          large_image_url: anime.images.jpg.large_image_url,
          title_english: anime.title_english || anime.title,
        }));

        // Add the current page's data to the total anime list
        animeList = animeList.concat(currentAnimeList);

        // Move to the next page
        currentPage++;

        // Delay before making the next request
        await delay(delayBetweenRequests);
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.warn("Rate limit reached. Retrying after delay...");
          await delay(60000); // Wait 1 minute if rate-limited
        } else {
          throw error; // Propagate other errors
        }
      }
    }

    console.log("Successfully fetched all anime data!");
    return animeList;
  } catch (error) {
    console.error("Error fetching anime data:", error);
    throw error; // Propagate the error to handle it in the route
  }
};

// Save anime data to MongoDB
const saveAnimeData = async (animeList: any[]) => {
  try {
    await Anime.insertMany(animeList, { ordered: false });
    console.log("Anime data saved to MongoDB successfully!");
  } catch (error) {
    console.error("Error saving anime data to MongoDB:", error);
    throw error; // Propagate the error to handle it in the route
  }
};

// Express route to fetch anime data
app.get("/fetch-anime", async (req: Request, res: Response): Promise<void> => {
  try {
    const existingAnimeCount = await Anime.countDocuments();

    if (existingAnimeCount > 0) {
      // If data exists, return it directly
      const animeList = await Anime.find();
      console.log("Fetched data from MongoDB.");
      res.status(200).json(animeList);
      return;
    }

    // Otherwise, fetch data from API and save it to MongoDB
    const animeList = await fetchAnimeData();
    console.log("Fetched data from API.");
    await saveAnimeData(animeList);

    res.status(200).json(animeList);
  } catch (error) {
    console.error("Error in /fetch-anime:", error);
    res.status(500).send("Failed to fetch or save anime data.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});