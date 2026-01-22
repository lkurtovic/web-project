import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from './mongo.js';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ GEO
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city,
      )}&count=1&language=en&format=json`,
    );
    const geoData = await geoRes.json();

    if (!geoData.results?.length) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { latitude, longitude, timezone, country } = geoData.results[0];

    // 2️⃣ DB CHECK
    const db = await getDb();
    const collection = db.collection('cost_of_living');

    const dbEntry = await collection.findOne({ city, country });

    let selectedCosts;

    if (dbEntry) {
      console.log('✅ Loaded from DB');
      selectedCosts = dbEntry.costs;
    } else {
      console.log('❌ Not in DB → API');

      const costRes = await fetch(
        `https://zylalabs.com/api/226/cities+cost+of+living+and+average+prices+api/3775/cost+of+living+by+city+v2?country=${encodeURIComponent(
          country,
        )}&city=${encodeURIComponent(city)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ZYLA_API_KEY}`,
          },
        },
      );

      const costData = await costRes.json();

      selectedCosts = {
        mealInexpensive: costData['Meal at an Inexpensive Restaurant'],
        mcDonaldsMeal:
          costData["Combo Meal at McDonald's (or Equivalent Fast-Food Meal)"],
        softDrink:
          costData['Soft Drink (Coca-Cola or Pepsi, 12 oz Small Bottle)'],
        bottledWater: costData['Bottled Water (12 oz)'],
        apples: costData['Apples (1 lb)'],
        bananas: costData['Bananas (1 lb)'],
        freshWhiteBread: costData['Fresh White Bread (1 lb Loaf)'],
        eggs: costData['Eggs (12, Large Size)'],
      };

      await collection.insertOne({
        city,
        country,
        costs: selectedCosts,
        createdAt: new Date(),
      });
    }

    // 3️⃣ WEATHER
    const weatherRes = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2025-01-01&end_date=2025-12-31&daily=temperature_2m_max,precipitation_sum&timezone=${encodeURIComponent(
        timezone,
      )}`,
    );

    const weatherData = await weatherRes.json();

    const averagedData = [];
    const chunkSize = 4;

    for (let i = 0; i < weatherData.daily.time.length; i += chunkSize) {
      const temps = weatherData.daily.temperature_2m_max.slice(
        i,
        i + chunkSize,
      );
      const prec = weatherData.daily.precipitation_sum.slice(i, i + chunkSize);

      averagedData.push({
        avgTemperature: temps.reduce((a, b) => a + b, 0) / temps.length,
        avgPrecipitation: prec.reduce((a, b) => a + b, 0) / prec.length,
      });
    }

    // 4️⃣ FLIGHT DATA
    const flightRes = await axios.get(
      'https://www.searchapi.io/api/v1/search',
      {
        params: {
          engine: 'google_flights_calendar',
          flight_type: 'one_way',
          departure_id: 'JFK',
          arrival_id: 'MAD',
          outbound_date: '2026-01-24',
          outbound_date_start: '2026-01-24',
          outbound_date_end: '2026-06-24',
          api_key: process.env.SEARCHAPI_KEY,
        },
      },
    );

    const calendar = flightRes.data?.calendar || [];

    const flightPrices = calendar.map((item) => ({
      date: item.departure,
      count: item.price,
    }));

    res.json({ city, data: averagedData, selectedCosts, flightPrices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
