const {
    StreamBitrateKbps,
    FramesPerSecond,

    DoubleSdpModifications
} = require("../store/configuration");
const { Logger } = require("../store/utility");

const Cheerio = require('cheerio');
const Express = require("express");
const Router = Express.Router();
const Axios = require("axios");
const Https = require("https");

const Axia = Axios.create({
    httpsAgent: new Https.Agent({
        rejectUnauthorized: true,
        maxSockets: 15,
        keepAlive: true,
    }),

    baseURL: process.env.Target
});

Router.get("/", (_, Response) => {
    Response.send(process.env.Channel);
});

Router.get("/apps/*.html", async (Request, Response) => Axia.get(Request.url).then((Packet) => {

    const Cheeri = Cheerio.load(Packet.data);
    const Package = JSON.parse(Cheeri("#__NEXT_DATA__").text());

    // Declare endpoints
    const PageProps = Package.props.pageProps;
    const AppInfo = PageProps.appInfo;

    const PlayFeFeatures = AppInfo.playFeFeatures;
    const UiConfig = PlayFeFeatures.uiConfig;
    const Features = PageProps.features;

    // Edit configuration
    PageProps.authUseThirdPartyFlow = true;
    AppInfo.authUseThirdPartyFlow = true;

    // Spoof domains
    PageProps.playDomain = Request.hostname;
    PageProps.ssrOrigin = Request.hostname;
    AppInfo.playDomain = Request.hostname;

    // TODO: fix this it introduces more overhead with traffic
    DoubleSdpModifications.forEach((Element) => PlayFeFeatures.feAnswerSdpModifications.push(Element));
    PlayFeFeatures.enablePlayModeWithPd = true;
    PlayFeFeatures.enableAiScreenshot = false;
    PlayFeFeatures.enableAiBot = false;
    PlayFeFeatures.ads = {
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

    Object.assign(UiConfig, {
        ...UiConfig,
        enableIframeHeader: false,
        enableWelcomeToast: false,
        enableSupportWidget: false,
        enableSearch: false,
        enableHeader: false,
        mobileMenu: {
            enabled: false,
            enableBrandLogo: false,
            enableProfileAction: false,
        },
        footer: {
            enabled: false,
            enableBrandLogo: false,
        }
    })

    Features.enableHotjar = false;

    // Pre-apply edits
    Cheeri("head").append(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`);
    Cheeri('script[defer]:not([src*="chunks/main"])').attr("type", "module");
    Cheeri("script[defer]:not([src])").remove();

    // Apply edits
    Cheeri("#__NEXT_DATA__").text(JSON.stringify(Package));
    Cheeri("body").append(`<script>
        sessionStorage.setItem("maxStreamBitrateKbps", ${StreamBitrateKbps});
        sessionStorage.setItem("maxFps", ${FramesPerSecond});
        sessionStorage.setItem("framebufferSizeHeight", window.innerHeight);
        sessionStorage.setItem("framebufferSizeWidth",  window.innerWidth + visualViewport.offsetTop);

        sessionStorage.setItem("utm_campaign", "carl");
    </script>`);

    Response.type("text/html").send(Cheeri.html());
    
}).catch((ErrorSign) => {

    Logger.warn(`Malfunction on: ${Request.url}`);
    Logger.error(ErrorSign.stack);
    Response.status(500).send(`Encountered error: "${ErrorSign.message}"`);

}));

module.exports = Router;