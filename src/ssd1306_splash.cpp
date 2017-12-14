#include "mgos_arduino_ssd1306.h"
#include "mongoose_logo.h"
#include "dark_sky_logo.h"
#include "Fonts/FreeSansBold12pt7b.h"
#include "common/cs_dbg.h"

#ifdef __cplusplus
extern "C" {
#endif

void ssd1306_splash(Adafruit_SSD1306 *ssd) {
  if (ssd == nullptr) return;
  ssd->clearDisplay();
  ssd->drawXBitmap(0, 0, (uint8_t*)mongoose_logo_bits, mongoose_logo_width, mongoose_logo_height, WHITE);
  ssd->display();
}

void ssd1306_darksky(Adafruit_SSD1306 *ssd) {
  if (ssd == nullptr) return;
  ssd->clearDisplay();
  ssd->drawXBitmap(0, 0, (uint8_t*)dark_sky_logo_bits, dark_sky_logo_width, dark_sky_logo_height, WHITE);
  ssd->display();
}

void ssd1306_set_font(Adafruit_SSD1306 *ssd, char *fontName) {
  if (ssd == nullptr) return;
  if (strcmp(fontName, "") == 0 || strcmp(fontName, "default") == 0) {
    ssd->setFont(NULL);
  } else if (strcmp(fontName, "FreeSansBold12pt7b") == 0) {
    ssd->setFont(&FreeSansBold12pt7b);
  } else {
    LOG(LL_WARN, ("unknown font '%s', using default", fontName));
    ssd->setFont(NULL);
  }
}

#ifdef __cplusplus
}
#endif
