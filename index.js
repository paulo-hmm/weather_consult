import express from "express";
import axios from "axios";
import bodyParse from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public/style"));

app.use(bodyParse.urlencoded({ extended: true}));

const API_KEY = "0bc555eefc39553a88801ab4fc515a64";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q="

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req,res) => {
    const weatherCity = req.body.city;
    try {
        const response = await axios.get(
            API_URL + `${weatherCity}&lang=pt_br&appid=${API_KEY}`,
        );
        
        const iconCode = response.data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const weatherData = {
            temperature: Math.floor(response.data.main.temp - 273.15),
            temperatureMin: Math.floor(response.data.main.temp_min - 273.15),
            temperatureMax: Math.floor(response.data.main.temp_max - 273.15),
            humidity: response.data.main.humidity,
            descriptionWeather: response.data.weather[0].description,
            speed: Math.floor(response.data.wind.speed * 4.26),
            icon: iconURL,
            city: weatherCity,
          };

        res.render("index.ejs", {weatherData});
    } catch (error) {
        res.status(404).send(error.message);
        console.log("Deu ruim");
    }
});

app.listen(port, () => {
    console.log(`Open at port ${port}`);
});