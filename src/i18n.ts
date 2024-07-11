import i18n from "i18n";
import path from "path";

i18n.configure({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  objectNotation: true,
  cookie: "locale",
});

export default i18n;
