export const getRecommendations = async (userTopTracks) => {
  const apiKey = import.meta.env.VITE_HF_API_TOKEN;

  if (!apiKey) {
    console.error("API Key for Hugging Face is missing!");
    return [];
  }

  const trackList = userTopTracks.map(track => `${track.name} by ${track.artists[0].name}`).join(", ");
  const prompt = `Given the following tracks: ${trackList}, suggest 5 new songs.`;

  const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
    }),
  });

  if (!response.ok) {
    console.error("Error from Hugging Face API:", response.statusText);
    return [];
  }

  const data = await response.json();

  if (!data || !data.length) {
    console.error("No recommendations returned from the Hugging Face API.");
    return [];
  }

  return data[0].generated_text.trim();
};
