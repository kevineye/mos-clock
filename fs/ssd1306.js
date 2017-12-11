load('api_arduino_ssd1306.js');

Adafruit_SSD1306._spl = ffi('void ssd1306_splash(void *)');
Adafruit_SSD1306._proto.splash = function() { Adafruit_SSD1306._spl(this.ssd); };

let SSD1306 = {

    init: function () {
        let display = Adafruit_SSD1306.create_i2c(Cfg.get('app.ssd1306_reset_pin'), Adafruit_SSD1306.RES_128_64);
        display.begin(Adafruit_SSD1306.SWITCHCAPVCC, 0x3C, true);

        display.splash();
        display.display();

        return display;
    },

    poweredByDarkSky: function(display) {
        ffi('void ssd1306_darksky(void *)')(display.ssd);
    }
};
