const MatchWordToURL = (URL, Word) => URL.includes(Word);
const Logger = require("pino")({
    level: (process.env.Channel == "development") ? "debug" : "info",
    transport: {
        target: "pino-pretty",
    }
});

module.exports = {
    Logger,
    MatchWordToURL
};