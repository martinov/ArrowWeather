var Arrow = require('arrow');

var WeatherRoute = Arrow.Router.extend({
	name: 'weather',
	path: '/weather',
	method: 'GET',
	description: '5 day weather information',
	action: function (req, resp, next) {

    req.server.getAPI('/api/weather', 'GET').execute({
      loc: 'Sofia'
    }, function(err, result) {
      if (err) {
        req.log.error(err);
        next(err);
      }
      else {
        var maxTemp1 = -Infinity, maxTemp2 = -Infinity,
          minTemp1 = Infinity, minTemp2 = Infinity;
        for (var i = 0, n = result.days.length; i < n; i++) {
          var min = result.days[i].tempMin;
          var max = result.days[i].tempMax;

          if (minTemp1 > min) {
            minTemp2 = minTemp1;
            minTemp1 = min;
          }
          else if (minTemp1 < min && minTemp2 > min) {
            minTemp2 = min;
          }
          if (maxTemp1 < max) {
            maxTemp2 = maxTemp1;
            maxTemp1 = max;
          }
          else if (maxTemp1 > max && maxTemp2 < max) {
            maxTemp2 = max;
          }
        }
        result.minTemperatures = `${minTemp1}, ${minTemp2}`;
        result.maxTemperatures = `${maxTemp1}, ${maxTemp2}`;
        resp.render('weather', result);
      }
    });
	}
});

module.exports = WeatherRoute;
