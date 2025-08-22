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

            if (MatchWordToURL(Request.url, "3998")) {
                const Packet = ResponseBuffer.toString('utf-8');
                return Packet.replace("p.wD.FailureServiceNotInRegion", 9999)
            }

            if (MatchWordToURL(Request.url, "1390")) {
                const Packet = ResponseBuffer.toString('utf-8');
                return Packet.replaceAll("p.wD.FailureServiceNotInRegion", 9999)
            }

            if (MatchWordToURL(Request.url, "6248")) {
                const Packet = ResponseBuffer.toString('utf-8');
                return Packet.replaceAll("d.wD.FailureServiceNotInRegion", 9999)
            }

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

                    .replace(`BwX:()=>ei`, `BwX:()=>z`)
                    .replace(`{B.A.sessionComplete=e,(0,F.sx)("SessionCompleted",Object.assign({},e)),ec(),(0,P.p4)();let{play:t}=T.A.getState(),n=(0,P.P0)((0,H.kj)())&&A.q1Y.includes(e.reason);if(!(0,P.qv)()&&"FeAdBlockerDetected"===e.reason&&!t.error)return void T.A.dispatch((0,K.iJ)("ForbiddenAdBlockerAndroid"));if(e.reason===S.wD.FailureServiceNotInRegion)return void T.A.dispatch({type:w.A.SET_ERROR,payload:{error:S.wD.Failure,errorCode:"2101",clientId:"",sessionId:"",isAndroidConnected:!1,errorDescription:""}});if((0,P.P0)((0,H.kj)())&&"OtherSessionInitiated"===e.reason)return void T.A.dispatch({type:w.A.SESSION_MIGRATED,payload:{sessionMigrated:!0}});if(t.isRecording&&T.A.dispatch({type:w.A.UPDATE_IS_RECORDING,payload:{showRecordingModalBeforeExit:!0,showRecordingModalBeforeExitSource:A.q1Y.includes(e.reason)?"inactiveTimeout":"sessionComplete"}}),e.reason===A.E2K.BCPU_SPOT_INTERRUPTION&&!t.isRecording){let t=e.reason;T.A.dispatch({type:w.A.SESSION_DISCONNECT_TOAST,payload:{sessionDisconnectScreenType:t}})}if(e.reason===A.E2K.PROXY_PLAYTIME_EXCEEDED){let t=e.reason;T.A.dispatch({type:w.A.SESSION_DISCONNECT_TOAST,payload:{sessionDisconnectScreenType:t,showDisconnectScreen:!0,showDisconnectWarning:!1}});return}if(!n&&t.sessionDisconnectScreenType)return void T.A.dispatch({type:w.A.SESSION_DISCONNECT_TOAST,payload:{showDisconnectWarning:!1,showDisconnectScreen:!0}});if(T.A.dispatch({type:w.A.SESSION_INACTIVE,payload:{sessionComplete:!0}}),!n&&0!==t.disconnecTimer&&Date.now()-t.disconnecTimer>55)return void eI();if(A.q1Y.includes(e.reason))T.A.dispatch({type:w.A.UPDATE_INACTIVE_TIMEOUT,payload:{inactiveTimeout:!0}});else{if(null==(c=null==(a=null==(i=k.XJ.appInfo)?void 0:i.playFeFeatures)?void 0:a.tryAndDownload)?void 0:c.isEnabled)return void T.A.dispatch({type:w.A.SHOW_TRY_NOW,payload:{endingTryNow:!0}});if(t.error)return;e.reason===A.E2K.TIME_LIMIT?T.A.dispatch({type:O.A.TOGGLE_LOGIN,payload:{showLogin:!0}}):T.A.dispatch({type:w.A.SET_ERROR,payload:{error:S.wD.Failure,errorCode:"2001",clientId:"",sessionId:"",isAndroidConnected:!1,errorDescription:e.reason}})}break}`, `{(0,F.sx)("AndroidReady",{packageName:e.packageName,repeatCount:(0,K.Cr)(),splitScreenPerc:e.splitScreenPercentage,screenorientation:e.screenorientation});try{(null==(n=null==(t=window.screen)?void 0:t.orientation)?void 0:n.addEventListener)&&window.screen.orientation.addEventListener("change",eL)}catch(e){(0,h.Ay)(e)}let{ads:r}=T.A.getState(),{enableRewardedAds:i}=(0,q.nF)();!r.rewardAdsLoadAdsSdk&&i&&T.A.dispatch({type:E.A.UPDATE_REWARDED_SDK_STATE,payload:{rewardAdsLoadAdsSdk:!0}}),T.A.dispatch({type:w.A.GAME_DISPLAYED,payload:{gameDisplayed:!0}}),(0,P.N5)(k.XJ.appInfo.packageName,e.packageName)&&eN(e),"true"===e.showGoogleLoginPopup&&T.A.dispatch({type:w.A.SHOW_GOOGLE_ACCOUNT_REQUIRED_POPUP,payload:{showGoogleAccountRequiredPopup:!0}}),(0,K.jn)(),(0,F.sx)("AppReady"),eC(),v.zR.splitScreenPerc=(0,X.A)(Number(e.splitScreenPercentage)||0,2),(0,H.Ay)("APP_LAUNCHED","","NowggIfpSdkEvent"),setTimeout(()=>{var e,t,n;let{o}=T.A.getState().play;(null==(n=null==(t=null==(e=k.XJ.appInfo)?void 0:e.playFeFeatures)?void 0:t.tryAndDownload)?void 0:n.isEnabled)&&o&&T.A.dispatch({type:w.A.SHOW_LOGIN_TIP,payload:{loginTip:!0}})},6e5),ei("0"),ea("0"),(null==(o=null===k.XJ||void 0===k.XJ?void 0:k.XJ.features)?void 0:o.enableMotionSensor)&&(0,P.Fr)()&&((0,P.OF)()?document.addEventListener("mouseup",()=>{if(window.DeviceMotionEvent){let e=DeviceOrientationEvent.requestPermission;"function"==typeof e&&e().then(e=>{"granted"===e&&window.addEventListener("devicemotion",Y)}).catch(console.error)}},{once:!0}):window.addEventListener("devicemotion",Y)),(0,P.xl)()&&navigator&&navigator.maxTouchPoints>0&&"en"===j.Ay.resolvedLanguage&&er("soft_keyboard::disable"),ed(),eR(k.XJ.appInfo.packageName),ee=!0;let a=parseInt(e.streamingWidth,10),s=parseInt(e.streamingHeight,10);if(eU=a>=s,e.screenorientation&&(0,x.x9)(e.screenorientation),y.ly.native=k.XJ.appInfo.playFeFeatures.enableNativeKeyboard,T.A.dispatch({type:w.A.START_CONNECTION,payload:{isAndroidConnected:!0}}),window.InputMapperApi.sendKeyToAndroid=L.UK,ey||ex(k.XJ.appInfo.packageName),ey=!0,(k.XJ.appInfo.playFeFeatures.disableImap||!(0,R.TH)())&&T.A.dispatch({type:_.A.SET_LEGACY_CONTROLS,payload:{legacyControls:!1}}),Number.isNaN(a)||Number.isNaN(s))("smartphone"===e.deviceType||"phablet"===e.deviceType)&&(0,x.u1)(2,1);else{let e=(0,P.p_)(a,s);(0,x.u1)(s/e,a/e)}B.A.type=e.deviceType,ep(),(0,$.G)();break}`)
                    .replaceAll(`!1,video:{`, `!1,video:{aspectRatio:{exact:${Resolution.AspectRatio}},`)
                    .replace("{iceServers:[]}", JSON.stringify(RTCPeerConfig))
            };

            return ResponseBuffer;
        })
    }
});

module.exports = Ikanos;