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
// day_of_week = {
//     Mon: 'пн',
//     Tue
// }

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
        const short_now_day = document.querySelector('.now h4');
        const get_date_info = document.querySelector('.get-date-info');
        const description = document.querySelector('.expand-temp .sky');
        const wing = document.querySelector('.value li:last-child');
        
        //Выводим название города
        city.textContent = data.name;
        
        //Выводим температуру в 2-х местах
        temperature.forEach(elem => elem.textContent = String(Math.round(data.main.temp - 273)) + '°');

        //Выводим температуру по ощущению
        feels_like.textContent = Math.round(data.main.feels_like - 273);
            //Влажность
        humidity.textContent = String(data.main.humidity) + '%';
            //Давление
        pressure.textContent = Math.round(data.main.pressure * 0.75);
        
        //Выводим инфу об облачности:
            //иконка
        cloudy_img.innerHTML = '<img src="https://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@4x.png">'
            //короткое описание с переводом на русский язык
        short_sky.textContent = weather_sky_ru[data.weather[0]['main']];
            //полное описание состояния погоды
        description.textContent = data.weather[0]['description'];

        //Формирование текущей даты и даты получения информации
        //Попробовать переделать в отдельную функцию
            //дата обновления данных
        let get_date = new Date(data.dt * 1000);
        let options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'long'};
            //перевод даты в нужный формат и вывод ее
        get_date_info.append(get_date.toLocaleString('ru-RU', options));
            //текущая дата
        get_date = new Date();
        options = {weekday: 'long', day: 'numeric', month: 'long'};
            //перевод даты в нужный формат и вывод ее
        now_date.textContent = `${get_date.getHours()}:${get_date.getMinutes()} ${get_date.toLocaleString('ru-RU', options)}`;
            //вывод текущей даты в сокращенном виде под основной температурой
        const week_short = get_date.toLocaleString('ru-RU', {weekday: 'short'})
        const day_short = get_date.toLocaleString('ru-RU', {day: 'numeric', month: 'short'});
        short_now_day.textContent = `${week_short} / ${day_short}`;

        //Вычисление направления ветра
        let wind_direction = '';
        if (data.wind.deg >= 6 && data.wind.deg < 86) {
            wind_direction = 'СЗ';
        } else if (data.wind.deg >= 86 && data.wind.deg < 96) {
            wind_direction = 'З';
        } else if (data.wind.deg >= 96 && data.wind.deg < 176) {
            wind_direction = 'ЮЗ';
        } else if (data.wind.deg >= 176 && data.wind.deg < 186) {
            wind_direction = 'Ю';
        } else if (data.wind.deg >= 186 && data.wind.deg < 266) {
            wind_direction = 'ЮВ';
        } else if (data.wind.deg >= 266 && data.wind.deg < 276) {
            wind_direction = 'В';
        } else if (data.wind.deg >= 276 && data.wind.deg < 356) {
            wind_direction = 'СВ';
        } else {
            wind_direction = 'С';
        }
        //Вывод направления ветра
        wing.textContent = `${wind_direction} ${data.wind.speed} м/с`;
    })
    .catch(if_error => console.log(if_error));

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=Санкт-Петербург&lang=ru&appid=b831ada007b57869cb1e689b842fdb54')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const pop = document.querySelector('.pop');

        pop.textContent = Math.round(data.list[0].pop * 100);

        let count_day = 1;
        let count_weather = 1
        data.list.forEach((date) => {
            const day_week = new Date(date.dt * 1000);
            if (day_week.getHours() == 0) {
                const day = document.querySelector(`.day-${count_day} h4`);
                
                day.textContent = day_week.toLocaleDateString('ru-RU', {weekday: 'short'}).toUpperCase();
                count_day++;
            }
            if (day_week.getHours() == 12) {
                const day_temp = document.querySelector(`.day-${count_weather} .tempera`);
                const day_icon = document.querySelector(`.day-${count_weather} .cloudy`);

                day_temp.textContent = Math.round(date.main.temp - 273) + '°';
                day_icon.innerHTML = `<img src='https://openweathermap.org/img/wn/${date.weather[0]['icon']}@2x.png'>`;

                console.log(day_week.toLocaleDateString('ru-RU', {weekday: 'short', hour: 'numeric'}));
                count_weather++;
            }

        });

        
    })
    .catch(if_error => console.log(if_error));