const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

// Express 5 does not accept app.get('*'), so this fallback avoids Railway crashes.
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shadow Rift Gacha RPG running on port ${PORT}`);
});
