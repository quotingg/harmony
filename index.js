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
const Caching = require("@fastify/caching");
const Fastify = require('fastify')({ trustProxy: true });
const Express = require('express');

const Ikados = require("./routes/ikanos.js");
const Cheeri = require("./routes/cheeri.js");
const Env = process.env;

Fastify.register(Caching, {
    privacy: Caching.privacy.FOREVER,
    expiresIn: 3600,
});

Fastify.register(require('@fastify/express')).after(() => {
    Fastify.use(Express.urlencoded({ extended: true }));
    Fastify.use(Compression({ level: 8 }));

    Fastify.use("/", Cheeri);
    Fastify.use(Ikados);
});

Fastify.listen({ port: Env.Port }, () => {
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
    Fastify.close();
});