import './style.css'

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

searchForm.addEventListener('submit', (e) => {
    // Prevent form submission
    e.preventDefault()
    
    currentWeatherApiCall(cityName.value)
})

// Function to make the api call
const currentWeatherApiCall = async (cityNameValue) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameValue}&appid=${APIKEY}`
        await fetch(url, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => console.log(err))
    } catch (err) {
        console.log(err)
    }
}
