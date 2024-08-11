export const fetchUserTopTracks = async (token) => {
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };
  
  export const fetchUserPlaylists = async (token) => {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };
  