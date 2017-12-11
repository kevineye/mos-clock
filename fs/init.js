load('api_config.js');
load('api_log.js');
load('api_math.js');
load("api_net.js");
load('api_timer.js');
load('darksky.js');
load('geoip.js');
load('ssd1306.js');

let display = SSD1306.init();
Timer.set(500, 0, function () {
    SSD1306.poweredByDarkSky(display);
}, null);

Timer.set(1000, 0, function () {
    DarkSky.callback = updateDisplay;
    let offset = 60000 - (Math.round(Timer.now()*1000) % 60000) + 10;
    Log.info("time is " + Timer.fmt("%c") + ", syncing display in " + JSON.stringify(offset) + " ms");
    Timer.set(offset, 0, function() {
        Timer.set(60000, Timer.REPEAT, updateDisplay, null);
    }, null);
    updateDisplay();
}, null);

let weather = {};
let location = {};

Net.setStatusEventHandler(function (event) {
    if (event === Net.STATUS_GOT_IP) {
        Log.info("network connected, starting app");
        location = GeoIP.init(function() {
            weather = DarkSky.init(location);
        });
    }
}, null);

function updateDisplay() {
    let now = Timer.now();
    if (weather.offset) {
        now += weather.offset * 3600;
    }
    let dateText = Timer.fmt("%a %b %e, %Y", now);
    let timeText = Timer.fmt("%I:%M", now);
    let amPmText = Timer.fmt("%P,%p", now).slice(0,2); // seems to be a bug with Timer.fmt("%P") by itself

    let weatherText;
    if (weather.currently) {
        weatherText = JSON.stringify(Math.round(weather.currently.temperature)) + "\xf7";
        if (weather.currently.summary.length > 14) {
            weatherText += " " + weather.currently.summary;
        } else {
            weatherText += "F \xf8 " + weather.currently.summary;
            if (weatherText.length > 21) {
                weatherText = weatherText.slice(0, 21);
            }
        }
    } else {
        weatherText = "Loading forecast...";
    }
    display.setTextColor(Adafruit_SSD1306.WHITE);
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.write(timeText);
    display.setTextSize(1);
    display.write(amPmText);
    let timeWidth = display.getCursorX() + 2;
    display.setCursor(0, 0);
    display.write(dateText);
    let dateWidth = display.getCursorX();
    display.setCursor(0, 0);
    display.write(weatherText);
    let weatherWidth = display.getCursorX();
    display.clearDisplay();
    display.drawFastHLine(0, 48, 128, Adafruit_SSD1306.WHITE);
    display.setCursor(64-Math.floor(dateWidth/2), 4);
    display.write(dateText);
    display.setCursor(64-Math.floor(timeWidth/2), 22);
    display.setTextSize(2);
    display.write(timeText);
    display.setCursor(display.getCursorX()+2, display.getCursorY()+6);
    display.setTextSize(1);
    display.write(amPmText);
    display.setCursor(64-Math.floor(weatherWidth/2), 52);
    display.write(weatherText);
    display.display();
}
