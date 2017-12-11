load('api_config.js');
load('api_http.js');
load('api_log.js');
load('api_timer.js');

let DarkSky = {
    apiKey: Cfg.get('app.darksky_key'),
    location: null,
    timer: null,
    weather: {},
    callback: null,

    init: function (location, callback, interval) {
        if (location) DarkSky.location = location;
        if (callback) DarkSky.callback = callback;
        if (interval === undefined) interval = Cfg.get('app.darksky_interval');
        DarkSky.timer = Timer.set(interval * 1000, Timer.REPEAT, DarkSky.loadWeather, null);
        return DarkSky.loadWeather();
    },

    loadWeather: function(cb) {
        if (cb) DarkSky.callback = cb;
        let url = 'https://api.darksky.net/forecast/' + DarkSky.apiKey + '/' + JSON.stringify(DarkSky.location.lat) + ',' + JSON.stringify(DarkSky.location.lon) + '?exclude=minutely,hourly,daily,alerts,flags';
        Log.info("connecting to " + url);
        HTTP.query({
            url: url,
            success: function (body) {
                let data = JSON.parse(body);
                Log.info("loaded weather: " + data.currently.summary + ", " + JSON.stringify(data.currently.temperature) + "F");
                DarkSky.weather.currently = data.currently;
                DarkSky.weather.offset = data.offset;
                if (DarkSky.callback) DarkSky.callback(DarkSky.weather);
            },
            error: function (err) {
                Log.error("could not get forecast: " + err);
            }
        });
        return DarkSky.weather;
    }
};
