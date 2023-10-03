const find_input = document.querySelector('.find-city input')
const find_button = document.querySelector('.find-city button')

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

const pop = document.querySelector('.pop');

const weather_sky_ru = {
    Clouds: 'Облачно',
    Clear: 'Ясно',
    Thunderstorm: 'Гроза',
    Drizzle: 'Моросящий дождь',
    Rain: 'Дождь',
    Snow: 'Снег',
    Mist: 'Туман',
    Smoke: 'Дымка',
    Haze: 'Слабый туман',
    Dust: 'Пыль',
    Fog: 'Сильный туман',
    Sand: 'Песок',
    Ash: 'Пепел',
    Squall: 'Шквал',
    Tornado: 'Торнадо'
};

const get_current_place = () => {
    fetch('http://ip-api.com/json/?lang=ru')
    .then(response => response.json())
    .then(data => {
        const current_place = data.city;
        out_data_weather(current_place);
        four_day_data(current_place);

    })
    .catch(if_error => console.log(if_error));
}

get_current_place();

const get_find_city = () => {
    if (find_input.value) {
        out_data_weather(find_input.value);
        four_day_data(find_input.value);
        find_input.value = '';
    }
}

find_button.onclick = get_find_city;
document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
        get_find_city();
    }
});

//Вычисление направления ветра
function direction(deg) {
    let wind_direction = '';
    if (deg >= 6 && deg < 86) {
        wind_direction = 'СЗ';
    } else if (deg >= 86 && deg < 96) {
        wind_direction = 'З';
    } else if (deg >= 96 && deg < 176) {
        wind_direction = 'ЮЗ';
    } else if (deg >= 176 && deg < 186) {
        wind_direction = 'Ю';
    } else if (deg >= 186 && deg < 266) {
        wind_direction = 'ЮВ';
    } else if (deg >= 266 && deg < 276) {
        wind_direction = 'В';
    } else if (deg >= 276 && deg < 356) {
        wind_direction = 'СВ';
    } else {
        wind_direction = 'С';
    }
    return wind_direction;
}

const out_info = (data) => {
    city.textContent = data.name; //Выводим название города
    temperature.forEach(elem => elem.textContent = Math.round(data.main.temp - 273) + '°'); //Выводим температуру в 2-х местах
    feels_like.textContent = Math.round(data.main.feels_like - 273); //Выводим температуру по ощущению
    humidity.textContent = data.main.humidity + '%'; //Влажность
    pressure.textContent = Math.round(data.main.pressure * 0.75) + ' мм рт. ст.'; //Давление
    //Выводим инфу об облачности:
    cloudy_img.innerHTML = '<img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png">' //иконка
    short_sky.textContent = weather_sky_ru[data.weather[0].main]; //короткое описание с переводом на русский язык
    get_main_back(data.weather[0].main);
    description.textContent = data.weather[0].description; //полное описание состояния погоды
    wing.textContent = `${data.wind.speed} м/с ${direction(data.wind.deg)}`; //Вывод направления ветра
}

//Формирование даты в удобочитаемый формат
const f_date = (options, dt = NaN) => {
    let date = dt ? new Date(dt * 1000) : new Date();
    date = date.toLocaleDateString('ru-RU', options);
    return date;
}

//Формирование текущей даты и даты получения информации
const out_date = (data) => {
    let options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'long'}; //дата ОБНОВЛЕНИЯ данных - опции для вывода
    get_date_info.textContent = `Обновлено ${(f_date(options, data.dt))}`; //перевод даты в нужный формат и вывод ее
        
    options = {weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'}; //получаем ТЕКУЩЕЕ время и дату
    const now_date_str = f_date(options).split(' в '); //разбиваем полученную строку на массив,
    const time = now_date_str[1]; //и сохраняем дату
    const date = now_date_str[0]; //и время
    now_date.textContent = `${time} ${date}`; //Выводим время и дату в нужном формате
        
    const date_short = f_date({weekday: 'short', day: 'numeric', month: 'short'}).split(',');
    short_now_day.textContent = `${date_short[0]} / ${date_short[1]}`; //вывод текущей даты в СОКРАЩЕННОМ виде под основной температурой
}

const out_data_weather = (find_city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${find_city}&lang=ru&appid=b831ada007b57869cb1e689b842fdb54`)
        .then(response => {
                return response.json();
        })
        .then(data => {
            out_info(data);
            out_date(data);
        })
        .catch(if_error => console.log(if_error));
}

const four_day_data = (find_city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${find_city}&appid=b831ada007b57869cb1e689b842fdb54`)
        .then(response => response.json())
        .then(data => {

            get_picture(data.city.name);

            pop.textContent = Math.round(data.list[0].pop * 100) + '%';

            let count_day = 1;

            for (let i = 0; i < data.list.length - 8; i++) {
                const day_week = new Date(data.list[i].dt * 1000);
                
                if (day_week.getHours() == 0 && day_week.getMinutes() == 0 && day_week.getSeconds() == 0) {
                    const cur_day = day_week.toLocaleDateString('ru-RU', {weekday: 'short', day: 'numeric', month: 'short'}).toUpperCase().split(', ');
                    const week = document.querySelector(`.day-${count_day} .w`);
                    const day = document.querySelector(`.day-${count_day} .d`);
                    week.textContent = cur_day[0];
                    day.textContent = cur_day[1];
                    i += 5;
                    const get_means_temp = (data.list[i - 1].main.temp + data.list[i].main.temp + data.list[i + 1].main.temp + data.list[i + 2].main.temp) / 4;
            
                    const day_temp = document.querySelector(`.day-${count_day} .tempera`);
                    const day_icon = document.querySelector(`.day-${count_day} .cloudy`);
                    count_day++;
                    
                    const title_weather = data.list[i].weather[0].description;
                    day_temp.textContent = Math.round(get_means_temp - 273) + '°';
                    day_icon.innerHTML = `<img title="${title_weather}" src='https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png'>`;
                }
            }
            
        })
        .catch(if_error => console.log(if_error));
}

const get_picture = (city) => {
    fetch(`https://api.unsplash.com/search/photos?client_id=VEJHd0OxvPZ6hmkTrgdUFxYAe4BPpUWZqkQuaWq-wWA&query=${city}`)
    .then(response => response.json())
    .then(data => {
        set_picture_back(data.results);
    })
    .catch(if_error => console.log(if_error));
}

const set_picture_back = (picture) => {
    picture = picture[get_rand_element(picture)].urls.regular;
    const back = document.querySelector('.info-block-back');
    back.style.background = `linear-gradient(#5e5e5e99, #5e5e5e99), url(${picture}) no-repeat center`;
    back.style.backgroundSize = 'cover';
}

const get_rand_element = (elements) => {
    let element = Math.floor(Math.random() * elements.length);
    return element;
}

const get_main_back = (weather) => {
    const main_back = document.querySelector('.background');
    main_back.style.background = `url(../img/${weather}.jpg) no-repeat center top`;
    main_back.style.backgroundSize = 'cover';
}