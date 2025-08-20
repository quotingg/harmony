const {
    DoubleSdpModifications,
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
    xfwd: false,
    on: {
        proxyRes: responseInterceptor(async (ResponseBuffer, _, Request) => {
            if (MatchWordToURL(Request.url, "startSession")) {
                const Packet = JSON.parse(ResponseBuffer.toString('utf-8'));
                
                // TODO: Automate replacing
                Object.assign(Packet, {
                    ...Packet,
                    offerSdp: Packet.offerSdp?.
                        replace(DoubleSdpModifications[0].pattern, DoubleSdpModifications[0].replacement).
                        replace(DoubleSdpModifications[1].pattern, DoubleSdpModifications[1].replacement),
                    secondSessionDetected: false
                })

                return JSON.stringify(Packet);
            };

            if (MatchWordToURL(Request.url, "_app-")) { 
                const Primary = Resolution.Primary;
                const Secondary = Resolution.Secondary;

                return ResponseBuffer.toString('utf8')
                    .replace("1280x720", `${Primary.Height}x${Primary.Width}`)
                    .replace("exact:640", `exact:${Primary.Height}`)
                    .replace("exact:480", `exact:${Primary.Width}`)

                    .replace("exact:320", `exact:${Secondary.Height}`)
                    .replace("exact:240", `exact:${Secondary.Width}`)
                    .replace("=320", `=${Secondary.Height}`)
                    .replace("=240", `=${Secondary.Width}`)

                    .replaceAll(`!1,video:{`, `!1,video:{aspectRatio:{exact:${Resolution.AspectRatio}},`)
                    .replace("{iceServers:[]}", JSON.stringify(RTCPeerConfig))
                    .replace(`ServiceNotInRegion="2101"`, `ServiceNotInRegion="9999"`);
            };

            if (MatchWordToURL(Request.url, "reportEvent")) {
                const yay = JSON.parse(ResponseBuffer.toString('utf8'));

                if (yay.clientIpInfo) {
                    console.log("rewriting");
                    yay.clientIpInfo.browserCode = "mobl";
                }

                return JSON.stringify(yay);
            }

            return ResponseBuffer;
        })
    }
});

module.exports = Ikanos;