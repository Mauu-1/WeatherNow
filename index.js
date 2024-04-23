import express from "express"
import bodyParser from "body-parser"
import axios from "axios"


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let currentDay = 0;

let latitude = 0;
let longitude = 0;
let weatherInfo = [];
  const weatherJSON = [
	{
		
            "code": "0",
			"description":"Clear Sky",
			"image":"/assets/clear-day.svg"
		
	},
	{
		
            "code": "1",
			"description":"Mainly Clear",
			"image":"/assets/cloudy-2-day.svg"
		
	},
	{
		
            "code": "2",
			"description":"Partly Cloudy",
			"image":"/assets/cloudy-3-day.svg"
		
	},
	{
            "code": "3",
			"description":"Overcast",
			"image":"/assets/cloudy.svg"
	},
	{
		
            "code": "45",
			"description":"Fog",
			"image":"/assets/fog.svg"
		
	},
	{
		
            "code": "48",
			"description":"Rime Fog",
			"image":"/assets/frost-day.svg"
		
	},
	{
		
            "code": "51",
			"description":"Light Drizzle",
			"image":"/assets/Light-Drizzle.svg"
		
	},
	{
		
            "code": "53",
			"description":"Moderate Drizzle",
			"image":"/assets/Moderate-Drizzle.svg"
		
	},
	{
		
            "code": "55",
			"description":"Heavy Drizzle",
			"image":"/assets/Heavy-Drizzle.svg"
		
	},
	{
		
            "code": "56",
			"description":"Light Freezing Drizzle",
			"image":"/assets/Light-Freezzing-Drizzle.svg"
		
	},
	{
		
            "code": "57",
			"description":"Heavy Freezing Drizzle",
			"image":"/assets/Heavy-Freezzing-Drizzle.svg"
		
	},
	{
      "code": "61",
			"description":"Light intensity Rain",
			"image":"/assets/Light-Rain.svg"
		
	},
	{
		
            "code": "63",
			"description":"Moderate intensity Rain",
			"image":"/assets/Moderate-Rain.svg"
		
	},
	{
		
            "code": "65",
			"description":"Heavy intensity Rain",
			"image":"/assets/Heavy-Rain.svg"
		
	},
	{
		
            "code": "66",
			"description":"Light Freezing Rain",
			"image":"/assets/Light-Freezing-Rain.svg"
		
	},
	{
      "code": "67",
			"description":" Heavy Freezing Rain",
			"image":"/assets/Heavy-Freezing-Rain.svg"
		
	},
	{
		
            "code": "71",
			"description":"Light Snow fall",
			"image":"/assets/Snow-light-fall.svg"
		
	},
	{
		
            "code": "73",
			"description":"Moderate Snow fall",
			"image":"/assets/Snow-moderate-fall.svg"
		
	},
	{
		
            "code": "75",
			"description":"Heavy Snow fall",
			"image":"/assets/Snow-heavy-fall.svg"
		
	},
	{
		
            "code": "77",
			"description":"Snow Grains",
			"image":"/assets/Snow-grains.svg"
		
	},
	{
		
            "code": "80",
			"description":"Light rain Showers",
			"image":"/assets/Showers-Light-Rain.svg"
		
	},
	{
		
            "code": "81",
			"description":"Moderate rain Showers",
			"image":"/assets/Showers-moderate-Rain.svg"
		
	},
	{
		
            "code": "82",
			"description":"Heavy rain Showers",
			"image":"/assets/Showers-heavy-Rain.svg"
		
	},
	{
		
            "code": "85",
			"description":"Light Snow Showers",
			"image":"/assets/Snow-Showers-Light.svg"
		
	},
	{
		
            "code": "86",
			"description":"Heavy Snow Showers",
			"image":"/assets/Snow-Showers-Heavy.svg"
		
	},
	{
		
            "code": "95",
			"description":"Thunderstorm",
			"image":"/assets/thunderstorm.svg"
		
	},
	{
		
            "code": "96",
			"description":"Light Thunderstorms With Hail",
			"image":"/assets/Thunderstorm-Light.svg"
		
	},
	{
		
            "code": "99",
			"description":"Heavy Thunderstorm With Hail",
			"image":"/assets/Thunderstorm-Heavy.svg"
		
	}
];
	
 
  function getWeatherCode(code){
    return weatherJSON.filter(function(data){return data.code == code});
  }
app.get("/", async (req, res) => {
    res.render("index.ejs");
    
    
  });
  app.get("/weather", async (req,res)=>{
    
    try {
      if (weatherInfo.length === 0) {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,rain&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const result = response.data;
        console.log(result);
        weatherInfo.push(result);
      }
     let dates = weatherInfo[0];
     let currentCode = weatherInfo[0].daily.weather_code[currentDay];
     let answer = getWeatherCode(currentCode);
     let weather = answer[0].description
     let src = answer[0].image

      
      res.render("weather.ejs", {
        data: dates,
        maxTemp: dates.daily.temperature_2m_max[currentDay] + "°C",
        minTemp: dates.daily.temperature_2m_min[currentDay] + "°C",
        currentDay: dates.daily.time[currentDay],
        weather: weather,
        imgSrc: src
        
      });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
      });
    }
    
  });

app.post("/currentLocation",(req,res)=>{
    latitude= req.body["inputLocationLat"];
    longitude = req.body["inputLocationLon"];
    // res.render("weather.ejs");
    // console.log(input, input2);
    res.redirect("/weather");
});

app.post("/currentDay",(req,res)=>{
        if (req.body["choice"] == 100) {
            currentDay
        }else{
            currentDay = req.body["choice"];
        }
        
       
    
    console.log(currentDay);
    res.redirect("/weather");
});
app.listen(port,()=>{
    console.log(`Server running at port: ${port}`);

})