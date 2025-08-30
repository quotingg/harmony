const MatchWordToURL = (URL, Word) => URL.includes(Word);
const Logger = require("pino")({
    level: (process.env.Channel == "development") ? "debug" : "info",
});

module.exports = {
    Logger,
    GenUfrag,
    MatchWordToURL
};