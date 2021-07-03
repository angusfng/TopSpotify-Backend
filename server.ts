import express from "express";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";

// Setup
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Spotify API wrapper
const spotifyAPI = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get("/", (req, res) => {
  res.send("Top Spotify authorization");
});

// Refresh the access token using refresh token
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  spotifyAPI.setRefreshToken(refreshToken);

  spotifyAPI
    .refreshAccessToken()
    .then((data) => {
      console.log("The access token has been refreshed!");
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log("refresh error");
      console.error(error.body.error_description);
      res.sendStatus(400);
    });
});

// Get access token using authorization code
app.post("/getAccess", (req, res) => {
  const authCode = req.body.authCode;

  spotifyAPI
    .authorizationCodeGrant(authCode)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log("access error");
      console.error(error.body.error_description);
      res.sendStatus(400);
    });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
