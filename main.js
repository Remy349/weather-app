// Import styles
import './style.css'
// Import images
import searchImgUrl from './assets/search.png'
import error404ImgUrl from './assets/error-404.png'
import error400ImgUrl from './assets/error-400.png'

/* ==> Hide principal content <== */

// Get id of the principal content div to hide it
const hideContentBtn = document.getElementById('hideContentBtn'),
    hideContent = document.getElementById('hideContent')
// Validate if the hideContentBtn exists
if (hideContentBtn) {
    hideContentBtn.addEventListener('click', () => {
        hideContent.style.display = 'none'
    })
}

/* ==> Start working on the apis call and show results <== */

// Global variable to store all the favorite cities
let FAVORITE_CITIES = []

// API key
const API_KEY = import.meta.env.VITE_API_KEY
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
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${API_KEY}`
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
            // Call this function to show the results from the api call
            showApiCallResultsHtml(currentWeatherData)
            // Call this function to make an extra api call
            apiCallForecast(currentWeatherData)
        } else {
            // Handling errors from the request to the api
            const { cod, message } = await res.json()

            showErrorsHtml(cod, message)
        }
    } catch (err) {
        console.log(err)
    }
}

// Function to make the 5 days / 3 hours forecast data call
const apiCallForecast = async (dataResults) => {
    try {
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${dataResults.coord.lat}&lon=${dataResults.coord.lon}&cnt=5&appid=${API_KEY}`
        // Make the request to the api
        const resForecast = await fetch(urlForecast, { method: "GET" })

        if (resForecast.ok) {
            const dataForecast = await resForecast.json()
            // Create an empty array to store the necesary data from the api call result
            let forecastArray = []

            for (let i in dataForecast.list) {
                let selectedData = {
                    dt_txt: dataForecast.list[i].dt_txt,
                    main: {
                        temp: dataForecast.list[i].main.temp
                    },
                    weather: [
                        {
                            description: dataForecast.list[i].weather[0].description,
                            main: dataForecast.list[i].weather[0].main,
                            icon: dataForecast.list[i].weather[0].icon
                        }
                    ]
                }
                // Add new objects to the array that is gonna be use
                forecastArray.push(selectedData)
            }
            // Call this function to show the results from the forecast api call
            showForecastApiCallResultsHtml(forecastArray)
        } else {
            const errorForecast = await resForecast.json()

            console.log(errorForecast)
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
                            <div>Visibility: ${convertVisibility(dataResults.visibility)}km</div>
                            <div>Wind Speed: ${dataResults.wind.speed}m/s</div>
                        </div>
                        <div class="principal__search-result_card_content_btns">
                            <button class="principal__search-result_card_content_btns_favorite" id="addFavorite">
                                <i class="fi fi-rr-star principal__search-result_card_content_btns_icon"></i>
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
        <div class="principal__search-forecast">
            <div class="principal__search-forecast_container" id="forecastResults"></div>
        </div>
    `

    return {
        forecastResults: document.getElementById('forecastResults'),
        addFavorite: document.getElementById('addFavorite')
    }
}

//Function to create and add many cards showing the results from the forecast api call
const showForecastApiCallResultsHtml = (dataForecastResults) => {
    dataForecastResults.forEach((dfResult) => {
        let sectionForecast = createNode('section'),
            articleForecast = createNode('article')

        sectionForecast.classList.add('principal__search-forecast_card')
        articleForecast.classList.add('principal__search-forecast_card_container')

        appendNode(forecastResults, sectionForecast)
        appendNode(sectionForecast, articleForecast)

        articleForecast.innerHTML = `
            <div class="principal__search-forecast_card_header">
                <p>${convertTemperature(dfResult.main.temp)}°C</p>
            </div>
            <div class="principal__search-forecast_card_content">
                <div class="principal__search-forecast_card_content_top">
                    <p>${dfResult.dt_txt}</p>
                </div>
                <div class="principal__search-forecast_card_content_line"></div>
                <div class="principal__search-forecast_card_content_bottom">
                    <div class="principal__search-forecast_card_content_bottom_data">
                        <div>${dfResult.weather[0].description}</div>
                        <div>${dfResult.weather[0].main}</div>
                    </div>
                    <div class="principal__search-forecast_card_content_bottom_icon">
                        <img
                            src="https://openweathermap.org/img/wn/${dfResult.weather[0].icon}.png"
                            alt="Current weather icon"
                        />
                    </div>
                </div>
            </div>
        `
    })
    // Call function to add favorite cities
    addFavoriteCities()
}

// Working on the function to add cities to the favorite weather section
const addFavoriteCities = () => {
    let isAdded = false

    addFavorite.addEventListener('click', () => {
        if (isAdded === false) {
            addFavorite.innerHTML = `
                <i class="fi fi-sr-star principal__search-result_card_content_btns_added"></i>
            `
            isAdded = true
        } else {
            addFavorite.innerHTML = `
                <i class="fi fi-rr-star principal__search-result_card_content_btns_icon"></i>
            `
            isAdded = false
        }
    })
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

// Function to convert the visibility
const convertVisibility = (value) => value / 1000

// Function to convert temperature
const convertTemperature = (temp) => Math.ceil(temp - 273.15)

// Functions to create and add new html tags to the html content
const createNode = (element) => document.createElement(element)

const appendNode = (parent, child) => parent.appendChild(child)
