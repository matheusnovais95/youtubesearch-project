const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const apiKey = 'AIzaSyAM1RGmIfGJtxyg1U3XoXhzbH6-04h_ENE';

let favorites = [];

app.get('/videos', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                maxResults: 20,
                q: query,
                key: apiKey,
            }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/favorites', (req, res) => {
    res.json(favorites);
});

app.post('/favorites', (req, res) => {
    const video = req.body;
    if (!favorites.some(fav => fav.id.videoId === video.id.videoId)) {
        favorites.push(video);
    }
    res.json(favorites);
});

app.delete('/favorites', (req, res) => {
    const videoId = req.body.id.videoId;
    favorites = favorites.filter(fav => fav.id.videoId !== videoId);
    res.json(favorites);
});

app.listen(port, () => {
    console.log(`BFF listening at http://localhost:${port}`);
});
