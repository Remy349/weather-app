const m=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&e(c)}).observe(document,{childList:!0,subtree:!0});function n(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerpolicy&&(a.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?a.credentials="include":t.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function e(t){if(t.ep)return;t.ep=!0;const a=n(t);fetch(t.href,a)}};m();var h="/weather-app/assets/search.57f45165.png",f="/weather-app/assets/error-404.29413cba.png",u="/weather-app/assets/error-400.bab7560e.png";const l=document.getElementById("hideContentBtn"),g=document.getElementById("hideContent");l&&l.addEventListener("click",()=>{g.style.display="none"});const d="d9f822faf0998dacf631404f994a3c6f",w=document.getElementById("searchForm"),b=document.getElementById("cityName"),o=document.getElementById("searchResults");o.innerHTML=`
    <div class="principal__search-without">
        <div class="principal__search-without_container">
            <p class="principal__search-without_info">
                Start your search by
                <br>
                entering a city name!
            </p>
            <img
                src=${h}
                class="principal__search-without_img"
                alt="Image before the search results"
            />
            <p class="principal__search-without_text">
                Without results
            </p>
        </div>
    </div>
`;w.addEventListener("submit",r=>{r.preventDefault(),v(b.value)});const v=async r=>{try{const i=`https://api.openweathermap.org/data/2.5/weather?q=${r}&appid=${d}`,n=await fetch(i,{method:"GET"});if(n.ok){const e=await n.json(),t={name:e.name,weather:[{description:e.weather[0].description,icon:e.weather[0].icon,main:e.weather[0].main}],main:{feelsLike:e.main.feels_like,humidity:e.main.humidity,pressure:e.main.pressure,temp:e.main.temp,tempMin:e.main.temp_min,tempMax:e.main.temp_max},sys:{country:e.sys.country,sunrise:e.sys.sunrise,sunset:e.sys.sunset},wind:{speed:e.wind.speed},visibility:e.visibility,coord:{lon:e.coord.lon,lat:e.coord.lat}};x(t),y(t)}else{const{cod:e,message:t}=await n.json();$(e,t)}}catch(i){console.log(i)}},y=async r=>{try{const i=`https://api.openweathermap.org/data/2.5/forecast?lat=${r.coord.lat}&lon=${r.coord.lon}&cnt=3&appid=${d}`,n=await fetch(i,{method:"GET"});if(n.ok){const e=await n.json();let t=[];for(let a in e.list){let c={dt_txt:e.list[a].dt_txt,main:{temp:e.list[a].main.temp},weather:[{description:e.list[a].weather[0].description,main:e.list[a].weather[0].main,icon:e.list[a].weather[0].icon}]};t.push(c)}k(t)}else{const e=await n.json();console.log(e)}}catch(i){console.log(i)}},x=r=>(o.innerHTML=`
        <div class="principal__search-result">
            <section class="principal__search-result_card">
                <article class="principal__search-result_card_container">
                    <div class="principal__search-result_card_header">
                        <h3>${r.name}, ${r.sys.country}</h3>
                    </div>
                    <div class="principal__search-result_card_content">
                        <div class="principal__search-result_card_content_header">
                            ${s(r.main.temp)}\xB0C
                            <p>
                                ${r.weather[0].description} - ${r.weather[0].main}
                            </p>
                        </div>
                        <div class="principal__search-result_card_content_data">
                            <div>Feels Like: ${s(r.main.feelsLike)}\xB0C</div>
                            <div>Humidity: ${r.main.humidity}%</div>
                            <div>Visibility: ${L(r.visibility)}km</div>
                            <div>Wind Speed: ${r.wind.speed}m/s</div>
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
    `,{forecastResults:document.getElementById("forecastResults"),addFavorite:document.getElementById("addFavorite")}),k=r=>{r.forEach(i=>{let n=_("section"),e=_("article");n.classList.add("principal__search-forecast_card"),e.classList.add("principal__search-forecast_card_container"),p(forecastResults,n),p(n,e),e.innerHTML=`
            <div class="principal__search-forecast_card_header">
                <p>${s(i.main.temp)}\xB0C</p>
            </div>
            <div class="principal__search-forecast_card_content">
                <div class="principal__search-forecast_card_content_top">
                    <p>${i.dt_txt}</p>
                </div>
                <div class="principal__search-forecast_card_content_line"></div>
                <div class="principal__search-forecast_card_content_bottom">
                    <div class="principal__search-forecast_card_content_bottom_data">
                        <div>${i.weather[0].description}</div>
                        <div>${i.weather[0].main}</div>
                    </div>
                    <div class="principal__search-forecast_card_content_bottom_icon">
                        <img
                            src="https://openweathermap.org/img/wn/${i.weather[0].icon}.png"
                            alt="Current weather icon"
                        />
                    </div>
                </div>
            </div>
        `}),z()},z=()=>{let r=!1;addFavorite.addEventListener("click",()=>{r===!1?(addFavorite.innerHTML=`
                <i class="fi fi-sr-star principal__search-result_card_content_btns_added"></i>
            `,r=!0):(addFavorite.innerHTML=`
                <i class="fi fi-rr-star principal__search-result_card_content_btns_icon"></i>
            `,r=!1)})},$=(r,i)=>{r==400?o.innerHTML=`
            <div class="principal__search-error">
                <div class="principal__search-error_container">
                    <p class="principal__search-error_info">
                        ${i}
                    </p>
                    <img
                        src=${u}
                        class="principal__search-error_img"
                        alt="Image to show error 400"
                    />
                    <p class="principal__search-error_text">
                        Without results
                    </p>
                </div>
            </div>
        `:r==404&&(o.innerHTML=`
            <div class="principal__search-error">
                <div class="principal__search-error_container">
                    <p class="principal__search-error_info">
                        ${i}
                    </p>
                    <img
                        src=${f}
                        class="principal__search-error_img"
                        alt="Image to show error 404 not found"
                    />
                    <p class="principal__search-error_text">
                        Without results
                    </p>
                </div>
            </div>
        `)},L=r=>r/1e3,s=r=>Math.ceil(r-273.15),_=r=>document.createElement(r),p=(r,i)=>r.appendChild(i);
