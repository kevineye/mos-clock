load('api_http.js');
load('api_log.js');

let GeoIP = {
    location: {},
    callback: null,

    init: function (cb) {
        GeoIP.location = {};
        GeoIP.callback = cb;
        HTTP.query({
            url: 'http://ip-api.com/json',
            success: function(body) {
                let data = JSON.parse(body);
                Log.info("found location: " + data.city + ", " + data.region);
                GeoIP.location.lat = data.lat;
                GeoIP.location.lon = data.lon;
                if (GeoIP.callback) GeoIP.callback(GeoIP.location);
            },
            error: function(err) {
                Log.error("could not get location from IP address: " + err);
            }
        });
        return GeoIP.location;
    }
};
