const {
    SdpModifications,
    RTCPeerConfig,
    Resolution
} = require("../store/configuration");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { MatchWordToURL } = require("../store/utility");

const Https = require("node:https");
const Ikanos = createProxyMiddleware({
    selfHandleResponse: true,
    changeOrigin: true,
    target: process.env.Target,
    agent: new Https.Agent({
        rejectUnauthorized: true,
        keepAlive: true
    }),
    on: {
        proxyRes: responseInterceptor(async (ResponseBuffer, _, Request) => {
            if (MatchWordToURL(Request.url, "startSession")) {
                const Packet = JSON.parse(ResponseBuffer.toString('utf-8'));

                for (let i = 0; i < SdpModifications.length; i++) {
                    let RegMod = new RegExp(SdpModifications[i].pattern, "gm");
                    Packet.offerSdp = Packet.offerSdp?.replace(
                        RegMod,
                        SdpModifications[i].replacement
                    );
                }

                return JSON.stringify(Packet);
            };

            if (MatchWordToURL(Request.url, "1390")) {
                const RBuffer = ResponseBuffer.toString('utf-8')
                const Primary = Resolution.Primary;
                    
                return RBuffer
                    .replaceAll("||720", `||${Primary.video.height.exact || Primary.video.height.max || Primary.video.height.min}`)
             }

            if (MatchWordToURL(Request.url, "_app-")) { 
                const Primary = Resolution.Primary;
                const Secondary = Resolution.Secondary;

                const PHeight = Primary.video.height.exact
                    || Primary.video.height.max
                    || Primary.video.height.min;
                const PWidth = Primary.video.width.exact
                    || Primary.video.width.max
                    || Primary.video.width.min;

                const SHeight = Secondary.video.height.exact
                    || Secondary.video.height.max
                    || Secondary.video.height.min;
                const SWidth = Secondary.video.width.exact
                    || Secondary.video.width.max
                    || Secondary.video.width.min;

                return ResponseBuffer.toString('utf8')
                    .replace("1280x720", `${PWidth}x${PHeight}`)
                    .replace("||1280", `||${PWidth}`)
                    .replace("||720", `||${PHeight}`)

                    .replace(`{audio:!1,video:{width:{exact:640},height:{exact:480}}}`, JSON.stringify(Primary))
                    .replace(`{audio:!1,video:{width:{exact:320},height:{exact:240}}}`, JSON.stringify(Secondary))

                    .replace("=320", `=${SWidth}`)
                    .replace("=240", `=${SHeight}`)

                    .replace("{iceServers:[]}", JSON.stringify(RTCPeerConfig))
            };

            return ResponseBuffer;
        })
    }
});

module.exports = Ikanos;