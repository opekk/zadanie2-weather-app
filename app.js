const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Lista predefiniowana
const locations = {
  "Poland": ["Warsaw", "Krakow", "Gdansk"],
  "Germany": ["Berlin", "Munich", "Hamburg"],
  "France": ["Paris", "Lyon", "Marseille"]
};

// Logi uruchomienia
console.log(`[START] Date: ${new Date().toISOString()}`);
console.log(`[START] Author: Maciej Ołdakowski`);
console.log(`[START] Listening on TCP port ${port}`);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const html = `
    <h2>Select Country and City</h2>
    <form method="POST">
      <label>Country:</label>
      <select name="country" onchange="this.form.submit()">
        <option disabled selected value>-- choose country --</option>
        ${Object.keys(locations).map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </form>`;
  res.send(html);
});

app.post('/', async (req, res) => {
  const country = req.body.country;
  const city = req.body.city;

  if (city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await axios.get(url);
      const weather = response.data;
      res.send(`
        <h3>Weather in ${city}</h3>
        <ul>
          <li>Temperature: ${weather.main.temp}°C</li>
          <li>Humidity: ${weather.main.humidity}%</li>
          <li>Description: ${weather.weather[0].description}</li>
        </ul>
        <a href="/">Back</a>
      `);
    } catch (e) {
      res.send(`<p>Error fetching weather for ${city}. Make sure the city name is valid.</p><a href="/">Back</a>`);
    }
  } else {
    const cities = locations[country];
    res.send(`
      <h2>${country}</h2>
      <form method="POST">
        <input type="hidden" name="country" value="${country}">
        <label>City:</label>
        <select name="city">
          ${cities.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button type="submit">Get Weather</button>
      </form>
      <a href="/">Back</a>
    `);
  }
});

app.listen(port, '0.0.0.0');

