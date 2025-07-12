const { createProxyMiddleware } = require('http-proxy-middleware');
const Cheerio = require('cheerio');
const Express = require('express');
const Axios = require('axios');
const Https = require('https');
const App = Express();

// Configuration
const MaxStreamBitrateKbps = 81000;
const MaxFramesPerSecond = 110;
const Target = "https://doctoraux.com";
const Port = 8004;

/** @type {import('http-proxy-middleware/dist/types').RequestHandler<Express.Request, Express.Response>} */
const Intermediary = createProxyMiddleware({
    changeOrigin: true,
    target: Target,
    agent: new Https.Agent({ keepAlive: true })
});

// Routing
App.get('/', (Request, Response) => Axios.get(`${Target}/apps/Blox-fruit/19901/Blox-fruit.html`).then((Result) => {
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
    UiConf.enableWelcomeToast = false;
    UiConf.enableSupportWidget = false;
    UiConf.enableHeader = false;
    UiConf.enableSearch = false;
    //UiConf.mobileMenu.enabled = false;

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

    // Package up the data
    Stream("#__NEXT_DATA__").text(JSON.stringify(Data));
    Stream("body").append(`<script>let SessionStore = window.sessionStorage; SessionStore.setItem("maxFps", ${MaxFramesPerSecond}); SessionStore.setItem("maxStreamBitrateKbps", ${MaxStreamBitrateKbps}); SessionStore.setItem("framebufferSizeWidth", window.innerWidth);</script>`);

    Response.send(Stream.html());
}).catch((Error) => {
    console.warn(Error);
    Response.status(500).send("An error occurred: " + Error);
}));

App.use(Express.urlencoded({ extended: true }))
App.use("/", Intermediary)

App.listen(Port, () => {
    console.log(`Bitrate Kbps: ${MaxStreamBitrateKbps}, Fps: ${MaxFramesPerSecond}`);
    console.log(`Listening on ${Port}.`);
})