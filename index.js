const {response} = require('express');
const express = require('express');
const https = require('https');
var requests = require("requests");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
const fs = require('fs');


const homeFile = fs.readFileSync("home.html", "utf-8");
const settingFile = fs.readFileSync("setting.html", "utf-8");
const detailFile = fs.readFileSync("nav.html", "utf-8");

const replaceVal = (tempVal, orgVal) =>{
        let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
        temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
        temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
        temperature = temperature.replace("Delhi", orgVal.name);
        temperature = temperature.replace("India", orgVal.sys.country);
        temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
        temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
        temperature = temperature.replace("{%pressure%}", orgVal.main.pressure);
        temperature = temperature.replace("{%feel_like%}", orgVal.main.feels_like);
        temperature = temperature.replace("{%visibility%}", orgVal.visibility);
        temperature = temperature.replace("{%wind_speed%}", orgVal.wind.speed);
        console.log(orgVal.weather[0].main);
        return temperature;
    }
    const replaceValErr = (tempVal) =>{
        let temperature = tempVal.replace("Check the weather forecast", "Enter valid city name");
        temperature = tempVal.replace("{%tempval%}", "29");
        temperature = temperature.replace("{%tempstatus%}", "Haze");
        return temperature;
    }
    var dt="Lucknow";
app.get('/',(req,res)=>{
    var qu = dt;
//qu = req.body.cityName;
const url = "https://api.openweathermap.org/data/2.5/weather?q="+qu+"&appid=dbc380358a61b939895de978ac83fc31&units=metric"
   

    https.get(url, (response)=>{
        //console.log(response.statusCode);
        response.on('data', (data)=>{
             //console.log(data);
            const weatherData = JSON.parse(data);
             console.log(weatherData);
            const arrData = [weatherData];
            //console.log(arrData[0].main.temp );
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            // console.log(temp);
            res.write(realTimeData);
            // res.write("The temperature in "+qu+" is "+temp + "degree celcius")
            // res.write("The max temperature in Pune is "+temp + "degree celcius")
            // res.write("The min temperature in Pune is "+temp + "degree celcius")
        })
    })
    console.log("The request is received");
    console.log(qu);
})
app.get('/default',(req,res)=>{
    var qu = "Delhi";
const url = "https://api.openweathermap.org/data/2.5/weather?q="+qu+"&appid=dbc380358a61b939895de978ac83fc31&units=metric"
   

    https.get(url, (response)=>{
       
        response.on('data', (data)=>{
            const weatherData = JSON.parse(data);
             console.log(weatherData);
            const arrData = [weatherData];
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
            // const temp = weatherData.main.temp;
            // const description = weatherData.weather[0].description;
            
            res.write(realTimeData);
        })
    })
    console.log("The request is received");
    console.log(qu);
})
// app.get('/setting',(req,res)=>{
//     var qu = "Delhi";
// const url = "https://api.openweathermap.org/data/2.5/weather?q="+qu+"&appid=dbc380358a61b939895de978ac83fc31&units=metric"
   

//     https.get(url, (response)=>{
       
//         response.on('data', (data)=>{
//             const weatherData = JSON.parse(data);
//              console.log(weatherData);
//             const arrData = [weatherData];
//           const realTimeData = settingFile;
        
            
//             res.write(realTimeData);
//         })
//     })
//     console.log("The request is received");
//     console.log(qu);
// })
app.get('/more_details',(req,res)=>{
    var qu = dt;
const url = "https://api.openweathermap.org/data/2.5/weather?q="+qu+"&appid=dbc380358a61b939895de978ac83fc31&units=metric"
   
    https.get(url, (response)=>{
       
        response.on('data', (data)=>{
            const weatherData = JSON.parse(data);
             console.log(weatherData);
            const arrData = [weatherData];
          const realTimeData = arrData
          .map((val) => replaceVal(detailFile, val))
          .join("");
            // const temp = weatherData.main.temp;
            // const description = weatherData.weather[0].description;
            
            res.write(realTimeData);
        })
    })
    console.log("The request is received");
    console.log(qu);
})
app.post('/', (req,res)=>{
var qu = "Delhi";
qu = req.body.cityName;
dt=qu;
const url = "https://api.openweathermap.org/data/2.5/weather?q="+qu+"&appid=dbc380358a61b939895de978ac83fc31&units=metric"

    https.get(url, (response)=>{
        response.on('data', (data)=>{
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const arrData = [weatherData];
            console.log(arrData);

            if(weatherData.cod!='404'){
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            console.log(temp);
            res.write(realTimeData);}
            else{
                console.log("No data found");
                const rtmp=replaceValErr(homeFile);
                res.write(rtmp);
            }
        })
    })

   
})
app.listen(8000, ()=> console.log("our server is running at port 8000"))