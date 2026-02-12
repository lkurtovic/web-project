import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from './mongo.js';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- ✈️ POMOĆNE FUNKCIJE ---
let airportDatabase = [];
async function loadAirports() {
  try {
    const res = await axios.get(
      'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
    );
    airportDatabase = Object.values(res.data);
    console.log(`✈️ Učitano ${airportDatabase.length} aerodroma!`);
  } catch (err) {
    console.error('Greška pri učitavanju aerodroma');
  }
}
loadAirports();

function getIataCode(cityName) {
  if (!cityName) return null;
  const searchName = cityName.toLowerCase().trim();
  const found = airportDatabase.find(
    (a) => a.city?.toLowerCase() === searchName && a.iata?.length === 3,
  );
  return found ? found.iata : null;
}

// --- 1️⃣ RUTA: WEATHER ---
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length)
      return res.status(404).json({ error: 'City not found' });

    const { latitude, longitude, timezone, country } = geoData.results[0];
    const weatherRes = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2025-01-01&end_date=2025-12-31&daily=temperature_2m_max,precipitation_sum&timezone=${encodeURIComponent(timezone)}`,
    );
    const weatherData = await weatherRes.json();

    const averagedData = [];
    for (let i = 0; i < weatherData.daily.time.length; i += 7) {
      const temps = weatherData.daily.temperature_2m_max.slice(i, i + 7);
      const prec = weatherData.daily.precipitation_sum.slice(i, i + 7);
      averagedData.push({
        avgTemperature: temps.reduce((a, b) => a + b, 0) / temps.length,
        avgPrecipitation: prec.reduce((a, b) => a + b, 0) / prec.length,
      });
    }
    res.json({
      country,
      lat: latitude,
      lon: longitude,
      forecast: averagedData,
    });
  } catch (err) {
    res.status(500).json({ error: 'Weather API Error' });
  }
});

// --- 2️⃣ RUTA: COSTS ---
app.get('/api/costs', async (req, res) => {
  const { city, country } = req.query;
  if (!city || !country)
    return res.status(400).json({ error: 'City/Country missing' });

  try {
    const db = await getDb();
    const costCol = db.collection('cost_of_living');
    let dbEntry = await costCol.findOne({
      city: { $regex: new RegExp(`^${city}$`, 'i') },
    });

    if (dbEntry) return res.json(dbEntry.costs);

    const costRes = await fetch(
      `https://zylalabs.com/api/226/cities+cost+of+living+and+average+prices+api/3775/cost+of+living+by+city+v2?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`,
      { headers: { Authorization: `Bearer ${process.env.ZYLA_API_KEY}` } },
    );
    const costData = await costRes.json();

    const selectedCosts = {
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

    await costCol.insertOne({
      city,
      country,
      costs: selectedCosts,
      createdAt: new Date(),
    });
    res.json(selectedCosts);
  } catch (err) {
    res.status(500).json({ error: 'Costs API Error' });
  }
});

// --- 3️⃣ RUTA: FLIGHTS ---
app.get('/api/flights', async (req, res) => {
  try {
    const { city, uid } = req.query;
    const db = await getDb();
    const arrivalIata = getIataCode(city);
    if (!arrivalIata) return res.status(200).json([]);

    let searchStart = 0;
    let searchDuration = 6;
    let departureIata = 'BUD';

    if (uid) {
      const user = await db.collection('users').findOne({ uid });
      if (user) {
        searchStart = user.search_start ?? 0;
        searchDuration = user.search_duration ?? 6;
        departureIata = user.home_iata || 'BUD';
      }
    }

    const now = new Date();
    let startDate =
      Number(searchStart) === 0
        ? new Date(now.setDate(now.getDate() + 5))
        : new Date(now.getFullYear(), now.getMonth() + Number(searchStart), 1);

    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + Number(searchDuration),
      1,
    );

    const formatDate = (d) => d.toISOString().split('T')[0];
    const fStart = formatDate(startDate);
    const fEnd = formatDate(endDate);

    const response = await axios.get('https://www.searchapi.io/api/v1/search', {
      params: {
        engine: 'google_flights_calendar',
        departure_id: departureIata,
        arrival_id: arrivalIata,
        outbound_date: fStart,
        outbound_date_start: fStart,
        outbound_date_end: fEnd,
        flight_type: 'one_way',
        currency: 'EUR',
        api_key: process.env.SEARCHAPI_KEY,
      },
    });

    const flightPrices = (response.data?.calendar || []).map((item) => ({
      date: item.departure,
      count: item.price,
    }));
    res.json(flightPrices);
  } catch (err) {
    res.status(200).json([]);
  }
});

// --- 4️⃣ RUTA: HOTELS ---
app.get('/api/hotels/stats', async (req, res) => {
  try {
    const { city } = req.query;
    const db = await getDb();
    const stats = await db
      .collection('hotels')
      .aggregate([
        {
          $match: {
            city: { $regex: new RegExp(`^${city}$`, 'i') },
            price: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            avgPrice: { $avg: '$price' },
            hotelCount: { $sum: 1 },
          },
        },
      ])
      .toArray();
    res.json(
      stats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0, hotelCount: 0 },
    );
  } catch (err) {
    res.status(500).json({ error: 'Hotel stats error' });
  }
});

// --- 👤 USER ROUTES (Sada uključuju hranu unutar korisnika) ---

// 1. Kreiranje / Update korisnika pri prijavi
app.post('/api/users', async (req, res) => {
  try {
    const { uid, username, email, home_iata } = req.body;
    const db = await getDb();

    // 1. Provjeravamo postoji li već korisnik u bazi
    const existingUser = await db.collection('users').findOne({ uid });

    // 2. Definiramo defaultne preferencije hrane (prema ID-ovima iz tvog JSON-a)
    const defaultFood = [
      { id: 1, quantity: 1 }, // Meal at an Inexpensive Restaurant
      { id: 3, quantity: 1 }, // Combo Meal at McDonald's
      { id: 7, quantity: 1 }, // Soft Drink (Coca-Cola)
      { id: 8, quantity: 1 }, // Bottled Water
    ];

    // 3. Pripremamo dokument za spremanje
    const updateDoc = {
      $set: {
        uid,
        username: username || existingUser?.username || '',
        email: email || existingUser?.email || '',
        home_iata: home_iata || existingUser?.home_iata || 'BUD',
        search_start: existingUser?.search_start ?? 0,
        search_duration: existingUser?.search_duration ?? 6,
        // Ako korisnik postoji i već ima food_preferences (čak i prazan niz koji je sam ispraznio), ostavi to.
        // Ako je korisnik potpuno novi ili mu je polje undefined, stavi defaultFood.
        food_preferences:
          existingUser?.food_preferences !== undefined
            ? existingUser.food_preferences
            : defaultFood,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    };

    // 4. Izvršavamo update (ili insert ako ne postoji - upsert)
    await db
      .collection('users')
      .updateOne({ uid }, updateDoc, { upsert: true });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('❌ Greška pri registraciji korisnika:', err);
    res.status(500).json({ error: 'Signup error' });
  }
});

// 2. Dohvat cijelog profila (uključujući hranu)
app.get('/api/users/:uid', async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ uid: req.params.uid });
    res.json(
      user || {
        search_start: 0,
        search_duration: 6,
        home_iata: 'BUD',
        food_preferences: [
          { id: 1, quantity: 1 }, // Meal at an Inexpensive Restaurant
          { id: 3, quantity: 1 }, // Combo Meal at McDonald's
          { id: 7, quantity: 1 }, // Soft Drink (Coca-Cola)
          { id: 8, quantity: 1 }, // Bottled Water
        ],
      },
    );
  } catch (err) {
    res.status(500).json({ error: 'Get user error' });
  }
});

// 3. Update samo postavki letova
app.put('/api/users/:uid/preferences', async (req, res) => {
  try {
    const { search_start, search_duration, home_iata } = req.body;
    const db = await getDb();
    await db.collection('users').updateOne(
      { uid: req.params.uid },
      {
        $set: {
          search_start,
          search_duration,
          home_iata,
          updatedAt: new Date(),
        },
      },
    );
    res.json({ message: 'Saved' });
  } catch (err) {
    res.status(500).json({ error: 'Update preferences error' });
  }
});

// 4. Update samo hrane (gađa isti "users" dokument!)
app.put('/api/users/:uid/food-preferences', async (req, res) => {
  try {
    const db = await getDb();
    await db
      .collection('users')
      .updateOne(
        { uid: req.params.uid },
        { $set: { food_preferences: req.body, updatedAt: new Date() } },
      );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Update food error' });
  }
});

// Pomoćna ruta za frontend da lakše dohvati samo hranu
app.get('/api/users/:uid/food-preferences', async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ uid: req.params.uid });
    res.json(user?.food_preferences || []);
  } catch (err) {
    res.json([]);
  }
});

app.listen(3001, () =>
  console.log('🚀 Server running on http://localhost:3001'),
);
