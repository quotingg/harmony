const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const Cheerio = require('cheerio');
const Express = require('express');
const Axios = require('axios');
const Https = require('https');
const App = Express();

// Configuration
const MaxStreamBitrateKbps = 300000;
const MaxFramesPerSecond = Math.round(MaxStreamBitrateKbps * 0.0022);
const Target = "https://doctoraux.com";
const Port = 8004;

/** @type {import('http-proxy-middleware/dist/types').RequestHandler<Express.Request, Express.Response>} */
const Intermediary = createProxyMiddleware({
    selfHandleResponse: true,
    followRedirects: true,
    changeOrigin: true,
    target: Target,
    agent: new Https.Agent({ keepAlive: true }),
    on: {
        proxyRes: responseInterceptor(async (ResponseBuffer, _ProxyResponse, Request) => {
            const Response = ResponseBuffer.toString('utf8');

            // Modify Offer Sdp for FEC
            if (Request.url.includes("startSession")) { 
                return Response.replace(
                    "a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id",
                    "a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\\r\\na=extmap:12 urn:ietf:params:rtp-hdrext:fec"
                );
            }

            return Response;
        })
    }
});

const Instance = Axios.create({
    baseURL: Target,
    timeout: 3000,
});

// Routing
App.get('/', (_Request, Response) => Instance.get('/apps/Blox-fruit/19901/Blox-fruit.html').then((Result) => {
    const Stream = Cheerio.load(Result.data);
    const Data = JSON.parse(Stream("#__NEXT_DATA__").text());

    // Declare variables
    const PageProps = Data.props.pageProps;
    const AppInfo = PageProps.appInfo;
    const UiConf = AppInfo.playFeFeatures.uiConfig;

    // Use local `/assets/`
    PageProps.authUseThirdPartyFlow = true;
    AppInfo.authUseThirdPartyFlow = true;

    // User-interface configuration
    Object.assign(UiConf, {
        ...UiConf,
        enableWelcomeToast: false,
        enableSupportWidget: false,
        enableSearch: false,
        enableHeader: false,
        mobileMenu: {
            enabled: false,
            enableBrandLogo: false,
            enableProfileAction: false,
        },
    });

    // Disable advertisements
    PageProps.features.ads = false;
    AppInfo.playFeFeatures.ads = {
        desktop: {
            enablePrerollAds: false,
            enableMidrollAds: false,
            enableDisplayAds: false,
            enableRewardedAds: false,
        },

        mobile: {
            enablePrerollAds: false,
            enableMidrollAds: false,
            enableDisplayAds: false,
            enableRewardedAds: false,
        }
    };

    // Modify AnswerSdp for FEC
    AppInfo.playFeFeatures.feAnswerSdpModifications.push({
        "pattern": "extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id",
        "replacement": "a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=extmap:12 urn:ietf:params:rtp-hdrext:fec"
    },)

    // Package up the data
    Stream("#__NEXT_DATA__").text(JSON.stringify(Data));
    Stream("body").append(`<script>
        let SessionStore = window.sessionStorage;
        SessionStore.setItem("maxFps", ${MaxFramesPerSecond}); 
        SessionStore.setItem("maxStreamBitrateKbps", ${MaxStreamBitrateKbps}); 
        SessionStore.setItem("utm_campaign", "carl");
        SessionStore.setItem("framebufferSizeWidth", window.innerWidth);
        SessionStore.setItem("framebufferSizeHeight", window.innerHeight);
    </script>`);

    Response.send(Stream.html());
}).catch((Error) => {
    console.warn(Error);
    Response.status(500).send("An error occurred: " + Error);
}));

App.use(Express.urlencoded({ extended: true }))
App.use("/", Intermediary)

App.listen(Port, () => {
    console.log(`Listening on ${Port}.`);
})
