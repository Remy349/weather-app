import './style.css'
import searchImgUrl from './assets/search.png'

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
            const err = await res.json()
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}

// Function to create and add a card showing the results in the html content
const showApiCallResultsHtml = (dataResults) => {
    searchResults.innerHTML = `
        <h1>${dataResults.name}, ${dataResults.sys.country}</h1>
    `
}
