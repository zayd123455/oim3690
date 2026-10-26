const songs = [
  "Blinding Lights",
  "HUMBLE.",
  "Bohemian Rhapsody",
  "Mr. Brightside",
  "Lose Yourself",
];

const playlist = document.getElementById("playlist");

// One <li> per song, added to the list in order.
for (const song of songs) {
  const item = document.createElement("li");
  item.textContent = song;
  playlist.appendChild(item);
}
