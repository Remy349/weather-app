// Import modules
import moment from 'moment'
// Import styles
import './style.css'
// Import images
import searchImgUrl from './assets/search.png'
import error404ImgUrl from './assets/error-404.png'
import error400ImgUrl from './assets/error-400.png'

/* ===> Hide principal content <=== */
// Get id of the principal content div to hide it
const hideContentBtn = document.getElementById('hideContentBtn'),
    hideContent = document.getElementById('hideContent')
// Validate if the hideContentBtn exists
if (hideContentBtn) {
    hideContentBtn.addEventListener('click', () => {
        hideContent.style.display = 'none'
    })
}

/* ===> Start working on api call and show results <=== */
// API key
const APIKEY = import.meta.env.VITE_API_KEY
// Get form id and city name value for use it in the api call
const searchForm = document.getElementById('searchForm')
const cityName = document.getElementById('cityName')
// Get search results id to show the data result from the api
const searchResults = document.getElementById('searchResults')
// Show results without search
searchResults.innerHTML = `
    <div class="principal__search-without">
        <div class="principal__search-without_container">
            <p class="principal__search-without_info">
                Start your search by
                <br>
                entering a city name!
            </p>
            <img
                src=${searchImgUrl}
                class="principal__search-without_img"
                alt="Image before the search results"
            />
            <p class="principal__search-without_text">
                Without results
            </p>
        </div>
    </div>
`

searchForm.addEventListener('submit', (e) => {
    // Prevent form submission
    e.preventDefault()
    
    currentWeatherApiCall(cityName.value)
})

// Function to make the current weather api call
const currentWeatherApiCall = async (cityNameValue) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${APIKEY}`
        // Make the request to the api
        const res = await fetch(url, { method: "GET" })

        if (res.ok) {
            const data = await res.json()
            // Create an object to store the data received from the api
            const currentWeatherData = {
                name: data.name,
                weather: [
                    {
                        description: data.weather[0].description,
                        icon: data.weather[0].icon,
                        main: data.weather[0].main
                    }
                ],
                main: {
                    feelsLike: data.main.feels_like,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    temp: data.main.temp,
                    tempMin: data.main.temp_min,
                    tempMax: data.main.temp_max
                },
                sys: {
                    country: data.sys.country,
                    sunrise: data.sys.sunrise,
                    sunset: data.sys.sunset
                },
                wind: { speed: data.wind.speed },
                visibility: data.visibility,
                coord: {
                    lon: data.coord.lon,
                    lat: data.coord.lat
                }
            }
            console.log(currentWeatherData)
            showApiCallResultsHtml(currentWeatherData)
        } else {
            // Handling errors from the request to the api
            const { cod, message } = await res.json()

            showErrorsHtml(cod, message)
        }
    } catch (err) {
        console.log(err)
    }
}

// Function to create and add a card showing the results in the html content
const showApiCallResultsHtml = (dataResults) => {
    searchResults.innerHTML = `
        <div class="principal__search-result">
            <section class="principal__search-result_card">
                <article class="principal__search-result_card_container">
                    <div class="principal__search-result_card_header">
                        <h3>${dataResults.name}, ${dataResults.sys.country}</h3>
                    </div>
                    <div class="principal__search-result_card_content">
                        <div class="principal__search-result_card_content_header">
                            ${convertTemperature(dataResults.main.temp)}°C
                            <p>
                                ${dataResults.weather[0].description} - ${dataResults.weather[0].main}
                            </p>
                        </div>
                        <div class="principal__search-result_card_content_data">
                            <div>Feels Like: ${convertTemperature(dataResults.main.feelsLike)}°C</div>
                            <div>Humidity: ${dataResults.main.humidity}%</div>
                            <div>Sunrise: ${convertTimezone(dataResults.sys.sunrise)}</div>
                            <div>Sunset: ${convertTimezone(dataResults.sys.sunset)}</div>
                        </div>
                        <div class="principal__search-result_card_content_btns">
                            <button class="principal__search-result_card_content_btns_favorite">
                                <i class="fi fi-rr-star principal__search-result_card_content_btns_icon"></i>
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    `
}

// Function to show the errors from the api call
const showErrorsHtml = (codeResponse, messageResult) => {
    // Handling error 400 from the api response
    if (codeResponse == 400) {
        searchResults.innerHTML = `
            <div class="principal__search-error">
                <div class="principal__search-error_container">
                    <p class="principal__search-error_info">
                        ${messageResult}
                    </p>
                    <img
                        src=${error400ImgUrl}
                        class="principal__search-error_img"
                        alt="Image to show error 400"
                    />
                    <p class="principal__search-error_text">
                        Without results
                    </p>
                </div>
            </div>
        `
    } else if (codeResponse == 404) {
        // Handling error 404 not found from the api response
        searchResults.innerHTML = `
            <div class="principal__search-error">
                <div class="principal__search-error_container">
                    <p class="principal__search-error_info">
                        ${messageResult}
                    </p>
                    <img
                        src=${error404ImgUrl}
                        class="principal__search-error_img"
                        alt="Image to show error 404 not found"
                    />
                    <p class="principal__search-error_text">
                        Without results
                    </p>
                </div>
            </div>
        `
    }
}

// Function to convert the timezone for each country
const convertTimezone = (timeValue) => {
    let seconds = 3600
    return moment.utc(timeValue, 'X').add(seconds, 'seconds').format('HH:mm a')
}

// Function to convert temperature
const convertTemperature = (temp) => {
    return Math.ceil(temp - 273.15)
}
