import { useState, useEffect } from "react";
import { useSpotifyAuth } from "./hooks/useSpotifyAuth";
import { fetchUserTopTracks } from "./api/spotify";
import { getRecommendations } from "./api/openAI";
import "./App.css";

function App() {
  const { token, logout } = useSpotifyAuth();
  const [topTracks, setTopTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUserTopTracks(token).then(async (data) => {
        setTopTracks(data.items);
        const recs = await getRecommendations(data.items);

        if (typeof recs === "string") {
          setRecommendations(recs.split("\n"));
        } else {
          console.error("Received unexpected response from OpenAI:", recs);
        }
      });
    }
  }, [token]);

  const login = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scope = "user-top-read playlist-read-private";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="divBody">
      {/* Obviamente, o token para ocorrer a autenticação. Aparece se você não estiver logado. */}
      {!token ? (
        <button onClick={login} className="loginButton">
          Login with Spotify
        </button>
      ) : (
        <div className="bodyMusic">
          <h1 className="bodyTitle">Music Recommender!</h1>
          <h2 className="bodyParagraph">Your Top Tracks</h2>
          <ul className="bodyPlaylist">
            {/* Obviamente, um slice para poder separar em um array quantas musicas podem aparecer. */}
            {topTracks.slice(0, 24).map((track) => (
              <li key={track.id} className="music-card">
                <div className="music-card-content">
                  <img
                    src={track.album.images[0].url}
                    alt={`${track.name} album cover`}
                    className="coverImage"
                  />
                  <h3 className="music-title">{track.name}</h3>
                  <p className="artist-name">{track.artists[0].name}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl mt-6">Recommended Songs</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>
                <ul>
                {rec}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={logout}
            className="mt-4 px-6 py-2 bg-red-500 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
