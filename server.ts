import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";

// Setup
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Delete later
app.get("/", (req, res) => {
  res.send("hello world");
});

// Spotify API wrapper
const spotifyAPI = new SpotifyWebApi({
  clientId: "4bed51c856c54870906b1fd174911b53",
  clientSecret: "b6c02dcb075a4aa9926fce20c69062a9",
  redirectUri: "http://localhost:3000",
});

// Refresh the access token
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
      console.error(error.body.error_description);
      res.sendStatus(400);
    });
});

// Login to spotify using authorization code
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
      console.error(error.body.error_description);
      res.sendStatus(400);
    });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
