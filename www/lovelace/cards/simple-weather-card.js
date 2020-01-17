class SimpleWeatherCard extends Polymer.Element {

  static get template() {
    return Polymer.html`
        <style>
          .weather-card {
            margin-top: -20px;
            padding: 0px 20px 20px;
            display:flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .weather-card > * {
            flex: 1 1 auto;
          }

          .weather-info {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .weather-icon {
            width: 22em;
            height: 22em;
            margin: -3em -5em;
          }

          .temperature-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          }

          .temperature {
            font-size: 4.5em;
            line-height: 1.5em;
          }

          .diff {
            text-align: center;
          }
        </style>
      <ha-card id="simpleWeatherCard" header="Weather">
        <div class="weather-card">  
          <div id="weatherInfo" class="weather-info">
            <img class="weather-icon" src="/local/icons/weather_icons/animated/thunder.svg" />
          </div>
          <div class="temperature-info">
            <div id="temperature" class="temperature">18</div>
            <div id="diff" class="diff">2 degrees colder <br />than today</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  set hass(hass) {
    this._hass = hass;
    moment.locale(hass.language);
    const transformDayNight = {
      "below_horizon": "night",
      "above_horizon": "day",
    }
    this.sunLocation = transformDayNight[hass.states['sun.sun'].state];
    this.weatherIcons = {
      'clear-night': `${this.sunLocation}`,
      'cloudy': 'cloudy',
      'fog': 'cloudy',
      'hail': 'rainy-7',
      'lightning': 'thunder',
      'lightning-rainy': 'thunder',
      'partlycloudy': `cloudy-${this.sunLocation}-3`,
      'pouring': 'rainy-6',
      'rainy': 'rainy-5',
      'snowy': 'snowy-6',
      'snowy-rainy': 'rainy-7',
      'sunny': `${this.sunLocation}`,
      'windy': 'cloudy',
      'windy-variant': `cloudy-${this.sunLocation}-3`,
      'exceptional': '!!',
    }

    this.weatherEntity = hass.states[this.config.entity];
    this.currentCondition = this.weatherEntity.state;

    this.displayWeatherInfo();
  }

  displayWeatherInfo() {
    if(this.$) {
      if(moment().format('HH') > 12) {
        this.displayWeatherForTomorrow(this.weatherEntity.attributes.forecast[0], this.weatherEntity.attributes.forecast[1]);
        this.weatherYesterday = this.weatherEntity.attributes.forecast[0];
      } else {
        this.displayWeatherForToday(this.weatherYesterday, this.weatherEntity.attributes.forecast[0]);
      }
    }
  }

  displayWeatherForTomorrow(today, tomorrow) {
    this.$.diff.innerHTML = this._getDifference(tomorrow, today, 'today');
    this.$.simpleWeatherCard.header = 'Weather tomorrow';
    this.$.weatherInfo.innerHTML = `<img class="weather-icon" src="/local/icons/weather_icons/animated/${this.weatherIcons[tomorrow.condition]}.svg#svgView(viewBox(0,0,100,100)" />`;
    this.$.temperature.innerHTML = `${tomorrow.temperature} ${this._hass.config.core.unit_system['temperature']}`;
  }

  displayWeatherForToday(yesterday, today) {
    if(this.yesterday) {
      this.$.diff.innerHTML = this._getDifference(today, yesterday, 'yesterday');
    } else {
      this.$.diff.innerHTML = '';
    }
    this.$.simpleWeatherCard.header = 'Weather today';
    this.$.weatherInfo.innerHTML = `<img class="weather-icon" src="/local/icons/weather_icons/animated/${this.weatherIcons[today.condition]}.svg" />`;
    this.$.temperature.innerHTML = `${today.temperature} ${this._hass.config.core.unit_system['temperature']}`;
  }

  _getDifference(dateFuture, dateNow, strDay) {
    const tempDiff = (dateFuture.temperature - dateNow.temperature);
    if(tempDiff == 0) {
      return `About the same as ${strDay}`;
    } else {
      let colderOrWarmer = 'warmer';
      let degreeVsDegrees = 'degree';
      if(Math.abs(tempDiff) > 1) {
        degreeVsDegrees = 'degrees';
      }
      if(tempDiff < 0) {
        colderOrWarmer = 'colder';
      }
      return `${Math.abs(tempDiff)} ${degreeVsDegrees} ${colderOrWarmer} <br /> than ${strDay}`;
    }
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('simple-weather-card', SimpleWeatherCard);