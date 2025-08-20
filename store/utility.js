const MatchWordToURL = (URL, Word) => URL.includes(Word);
const Logger = require("pino")({
    level: (process.env.Channel == "development") ? "debug" : "info",
});

const GenUfrag = (offer) => offer?.match(/ice-ufrag:(...)/gm)[0].replace("ice-ufrag", "");

module.exports = {
    Logger,
    GenUfrag,
    MatchWordToURL
};