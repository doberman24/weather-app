// const data = {
//     "coord":{
//         "lon":30.2642,
//         "lat":59.8944
//     },
//     "weather":[
//         {
//             "id":803,
//             "main":"Drizzle",
//             "description":"облачно с прояснениями",
//             "icon":"04d"
//         }
//     ],
//     "base":"stations",
//     "main":{
//         "temp":292.07,
//         "feels_like":292.13,
//         "temp_min":292.07,
//         "temp_max":292.23,
//         "pressure":1011,
//         "humidity":81
//     },
//     "visibility":10000,
//     "wind":{
//         "speed":6,
//         "deg":230
//     },
//     "clouds":{
//         "all":75
//     },
//     "dt":1695292322,
//     "sys":{
//         "type":2,
//         "id":197864,
//         "country":"RU",
//         "sunrise":1695267582,
//         "sunset":1695312289
//     },
//     "timezone":10800,
//     "id":498817,
//     "name":"Санкт-Петербург",
//     "cod":200
// }

weather_sky_ru = {
    Clouds: 'Облачно',
    Clear: 'Ясно',
    Thunderstorm: 'Гроза',
    Drizzle: 'Моросящий дождь',
    Rain: 'Дождь',
    Snow: 'Снег',
    Mist: 'Слабый туман',
    Smoke: 'Дымка',
    Haze: 'Сильный туман',
    Dust: 'Пыль',
    Fog: 'Туман',
    Sand: 'Песок',
    Ash: 'Пепел',
    Squall: 'Шквал',
    Tornado: 'Торнадо'
}

let a = 'Drizzle'

console.log(weather_sky_ru[a]);

fetch('https://api.openweathermap.org/data/2.5/weather?q=Санкт-Петербург&lang=ru&appid=b831ada007b57869cb1e689b842fdb54')
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        const city = document.querySelector('.city h1');
        const temperature = document.querySelectorAll('.temperature');
        const feels_like = document.querySelector('.feels')
        const humidity = document.querySelector('.value li:first-child');
        const pressure = document.querySelector('.pressure');
        const cloudy_img = document.querySelector('.now .cloudy');
        const short_sky = document.querySelector('.main-weath .sky');
        const now_date = document.querySelector('.now-date');
        const short_now_day = document.querySelector('.day.now h4');
        const get_date_info = document.querySelector('.get-date-info');
        const description = document.querySelector('.expand-temp .sky');
        
        city.textContent = data.name;
        
        temperature.forEach(elem => elem.textContent = String(Math.round(data.main.temp - 273)) + '°');

        feels_like.textContent = Math.round(data.main.feels_like - 273);
        humidity.textContent = String(data.main.humidity) + '%';
        pressure.textContent = Math.round(data.main.pressure * 0.75);
        cloudy_img.innerHTML = '<img src="https://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@4x.png">'
        short_sky.textContent = weather_sky_ru[data.weather[0]['main']];
        description.textContent = data.weather[0]['description'];

        let get_date = new Date(data.dt * 1000);
        let options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'long'};
        get_date_info.append(get_date.toLocaleString('ru-RU', options));

        get_date = new Date();
        options = {weekday: 'long', day: 'numeric', month: 'long'};
        now_date.textContent = `${get_date.getHours()}:${get_date.getMinutes()} ${get_date.toLocaleString('ru-RU', options)}`;

        const week_short = get_date.toLocaleString('ru-RU', {weekday: 'short'})
        const day_short = get_date.toLocaleString('ru-RU', {day: 'numeric', month: 'short'});
        short_now_day.textContent = `${week_short} / ${day_short}`;
    })
    .catch(if_error => console.log(if_error));