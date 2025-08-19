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

                return Buffer.from(JSON.stringify(Packet));
            };

            if (MatchWordToURL(Request.url, "_app-")) { 
                const Primary = Resolution.Primary;
                const Secondary = Resolution.Secondary;

                return Buffer.from(ResponseBuffer.toString('utf8')
                    .replace("1280x720", `${Primary.Height}x${Primary.Width}`)
                    .replace("exact:640", `exact:${Primary.Height}`)
                    .replace("exact:480", `exact:${Primary.Width}`)

                    .replace("exact:320", `exact:${Secondary.Height}`)
                    .replace("exact:240", `exact:${Secondary.Width}`)
                    .replace("=320", `=${Secondary.Height}`)
                    .replace("=240", `=${Secondary.Width}`)

                    .replaceAll(`!1,video:{`, `!1,video:{aspectRatio:{exact:${Resolution.AspectRatio}},`)
                    .replace("{iceServers:[]}", JSON.stringify(RTCPeerConfig))
                );
            };

            return ResponseBuffer;
        })
    }
});

module.exports = Ikanos;