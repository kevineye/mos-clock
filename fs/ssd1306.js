load('api_arduino_ssd1306.js');

Adafruit_SSD1306._spl = ffi('void ssd1306_splash(void *)');
Adafruit_SSD1306._proto.splash = function() { Adafruit_SSD1306._spl(this.ssd); };

Adafruit_SSD1306._sfn = ffi('void ssd1306_set_font(void *, char *)');
Adafruit_SSD1306._proto.setFont = function(fontName) { Adafruit_SSD1306._sfn(this.ssd, fontName); };

let SSD1306 = {

    init: function (rotation) {
        let display = Adafruit_SSD1306.create_i2c(Cfg.get('app.ssd1306_reset_pin'), Adafruit_SSD1306.RES_128_64);
        display.begin(Adafruit_SSD1306.SWITCHCAPVCC, 0x3C, true);
        if (rotation === undefined) {
            rotation = Cfg.get('app.ssd1306_rotation');
        }
        display.setRotation(rotation);
        display.splash();
        display.display();

        return display;
    },

    poweredByDarkSky: function(display) {
        ffi('void ssd1306_darksky(void *)')(display.ssd);
    }
};
