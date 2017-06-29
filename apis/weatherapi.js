'use strict';

const Arrow = require('arrow');
const weather = require('openweather-apis');
const moment = require('moment');

const WeatherAPI = Arrow.API.extend({
	name: 'weatherapi',
	group: 'weatherapi',
	path: '/api/weather',
	method: 'GET',
	description: 'this is an api that shows 5 day weather forecast',
	parameters: {
		loc: {
			description: 'location for the forecast',
			optional: true,
		}
	},
	action: function (req, resp, next) {

		weather.setAPPID(req.server.config.openweathermaps.appId);
		weather.setLang(req.server.config.openweathermaps.lang);
		weather.setUnits(req.server.config.openweathermaps.units);

		weather.setCity('Sofia'); // use req.parameters instead

		weather.getWeatherForecastForDays(5, function(err, result) {
			if (err) {
				resp.json({
					error: err
				}, next);
			}
			else {
				// Find min and max temps first.
				var body = {
					location: result.city.name,
					lon_lat: `${result.city.coord.lon}, ${result.city.coord.lat}`,
					days: [],
				};
				for (day in result.list) {
					var dayDate = moment(result.list[day].dt * 1000);
					//req.log.info(result.list[day]);
					body.days[day] = {
						dateStr: dayDate.format('DD.MM.YYYY'),
						dayOfWeek: dayDate.format('dddd'),
						tempMin: result.list[day].temp.min,
						tempMax: result.list[day].temp.max,
						summary: result.list[day].weather[0].description,
					};
				}
				resp.json(body, next);
			}
	 });
	}
});

module.exports = WeatherAPI;
