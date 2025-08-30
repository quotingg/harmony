// Initialize Dotenv
require("dotenv").config({ quiet: true });

const {
    StreamBitrateKbps,
    FramesPerSecond,
    GoogleMaxiBitrate,
    GoogleMiniBitrate,
    SdpModifications,
} = require("./store/configuration.js");
const { Logger } = require("./store/utility.js");

const Compression = require("compression");
const Express = require('express');
const App = Express();

const Ikados = require("./routes/ikanos.js");
const Cheeri = require("./routes/cheeri.js");
const Env = process.env;

App.set("trust proxy", true);
App.use(Express.urlencoded({ extended: true }));
App.use(Compression());

App.use("/", Cheeri);
App.use(Ikados);

App.listen(Env.Port, () => {
    Logger.info(`Running server on port ${Env.Port} with Channel: ${Env.Channel}`);
    Logger.debug({
        MaximumStreamBitrateKbps: StreamBitrateKbps,
        MaximumFramesPerSecond: FramesPerSecond,
        GoogleMaxBitrate: GoogleMaxiBitrate,
        GoogleMinBitrate: GoogleMiniBitrate,
        SDPModifications: SdpModifications
    }, "Dispatch configuration");
});

// https://expressjs.com/advanced/healthcheck-graceful-shutdown.html
process.addListener('SIGTERM', () => {
    App.close();
});