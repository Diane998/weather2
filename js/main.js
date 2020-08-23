(function () {
  const apiKey = '93cf5e542275086ede53540b5690de67';
  const url = 'https://api.openweathermap.org/data/2.5';
  let forecastObj = { list: [] };
  let locationObj;

  const left = document.querySelector('.left');
  const right = document.querySelector('.right');
  const search = document.querySelector('.search');

  let getCoordinates = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getCoordinates()
    .then((pos) => {
      fetch(
        `${url}/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${apiKey}`
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("Can't find your location");
          }
        })
        .then((res) => {
          locationObj = res.city;
          let forecastArr = res.list
            .filter((v, i) => i % 8 === 0)
            .map((obj) => {
              obj[obj.weather[0].main] = true;
              return obj;
            });
          forecastArr[0].location = locationObj;
          forecastObj.list = forecastArr;
          console.log(forecastObj);
          renderLeft(forecastObj);
          renderRight(forecastObj);
        });
    })
    .catch((err) => console.log(err.message));

  search.onkeydown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      getCity(e.target.value);
      e.target.value = '';
    }
  };

  let getCity = (term) => {
    fetch(`${url}/forecast?q=${term}&units=metric&appid=${apiKey}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Can't find your location");
        }
      })
      .then((res) => {
        locationObj = res.city;
        let forecastArr = res.list
          .filter((v, i) => i % 8 === 0)
          .map((obj) => {
            obj[obj.weather[0].main] = true;
            return obj;
          });
        forecastArr[0].location = locationObj;
        forecastObj.list = forecastArr;
        console.log(forecastObj);
        renderLeft(forecastObj);
        renderRight(forecastObj);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let renderLeft = (arr) => {
    let rawTemplate = document.querySelector('#forecast-template').innerHTML;
    let compileTemplate = Handlebars.compile(rawTemplate);
    let generatedTemplate = compileTemplate(arr);
    left.innerHTML = generatedTemplate;
  };

  let renderRight = (arr) => {
    let rawTemplate = document.querySelector('#weather-template').innerHTML;
    let compileTemplate = Handlebars.compile(rawTemplate);
    let generatedTemplate = compileTemplate(arr);
    right.innerHTML = generatedTemplate;
  };

  Handlebars.registerHelper('getDate', (date) => getDayOfWeek(date));

  Handlebars.registerHelper('getWindDirection', (deg) => degToCompass(deg));

  Handlebars.registerHelper('capitalize', (str) => capitalize(str));

  let getDayOfWeek = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek)
      ? null
      : [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][dayOfWeek];
  };

  let capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  let degToCompass = (num) => {
    let val = Math.floor(num / 22.5 + 0.5);
    let arr = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    return arr[val % 16];
  };
})();
