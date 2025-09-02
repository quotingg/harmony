const StreamBitrateKbps = Math.round(600000);
const FramesPerSecond = Math.round(StreamBitrateKbps * 0.0022);

const GoogleMaxiBitrate = Math.round(StreamBitrateKbps / 3);
const GoogleMiniBitrate = Math.round(7000);
const GoogleStrtBitrate = Math.round(GoogleMiniBitrate * 2.5);
const GroupOfPictures = Math.round(FramesPerSecond * 2.4);

const SdpModifications = [
    {
        "pattern": "extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id",
        "replacement": "extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=extmap:12 urn:ietf:params:rtp-hdrext:fec\r\na=extmap:13 http://www.webrtc.org/experiments/rtp-hdrext/corruption-detection",
    },
    {
        "pattern": "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f",
        "replacement": `level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f;scalabilityMode=S3T3Q5;gop=${GroupOfPictures}\r\na=x-google-max-bitrate:${GoogleMaxiBitrate}\r\na=x-google-start-bitrate:${GoogleStrtBitrate}\r\na=x-google-min-bitrate:${GoogleMiniBitrate}\r\na=simulcast send 1;2;3 recv 4;5;6\r\na=transport-cc:4`,
    },
    {
        "pattern": "extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01",
        "replacement": "extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/transport-wide-cc-02"
    },
    // https://datatracker.ietf.org/doc/html/rfc5109
    {
        "pattern": "ulpfec/90000",
        "replacement": "flexfec/90000\r\na=fmtp:107 max-repair-attempts=5; max-repair-bytes=1700; ToP=4; R=4\r\na=rtcp-fb:107 nack\r\na=rtcp-fb:107 nack pli"
    },
    {
        "pattern": "a=rtpmap:(\\d+) rtx\\/90000",
        "replacement": "a=rtpmap:$1 rtx/90000\r\na=rtcp-fb:$1 nack\r\na=rtcp-fb:$1 pli"
    },
    {
        "pattern": "t=0 0",
        "replacement": "t=0 0\r\na=interleaved:0-1"
    }
];

// https://developer.mozilla.org/docs/Web/API/RTCPeerConnection/RTCPeerConnection
const RTCPeerConfig = {
    rtcpMuxPolicy: "require",
    bundlePolicy: "balanced",
    iceServers: []
};

// https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties
const Resolution = {
    Primary: {
        audio: !1,
        video: {
            aspectRatio: {
                exact: 16 / 9
            },
            width: {
                exact: 2560
            },
            height: {
                exact: 1440
            }
        }
    },

    Secondary: {
        audio: !1,
        video: {
            aspectRatio: {
                exact: 16 / 9
            },
            width: {
                exact: 1920
            },
            height: {
                exact: 1080
            }
        }
    },
}

module.exports = {
    StreamBitrateKbps,
    FramesPerSecond,

    GoogleMaxiBitrate,
    GoogleMiniBitrate,

    SdpModifications,
    RTCPeerConfig,
    Resolution
}; 