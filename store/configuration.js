const StreamBitrateKbps = Math.round(600000);
const FramesPerSecond = Math.round(StreamBitrateKbps * 0.0022);

const GoogleMaxBitrate = Math.round(StreamBitrateKbps / 3);
const GoogleStaBitrate = Math.round(GoogleMaxBitrate / 3);
const GoogleMinBitrate = Math.round(7000);

const DoubleSdpModifications = [
    {
        "pattern": "extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id",
        "replacement": "a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=extmap:12 urn:ietf:params:rtp-hdrext:fec",
    },
    {
        "pattern": "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f",
        "replacement": `level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f;scalabilityMode=S3T3Q5;gop=${FramesPerSecond * 2.5}\r\na=x-google-max-bitrate:${GoogleMaxBitrate}\r\na=x-google-start-bitrate:${GoogleStaBitrate}\r\na=x-google-min-bitrate:${GoogleMinBitrate}\r\na=simulcast send 1;2;3 recv 4;5;6`,
    },
];

// https://developer.mozilla.org/docs/Web/API/RTCPeerConnection/RTCPeerConnection
const RTCPeerConfig = {
    rtcpMuxPolicy: "require",
    bundlePolicy: "balanced",
    iceServers: [] 
};

// TODO: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
const Resolution = {
    Primary: {
        Height: 4320,
        Width: 7680
    },

    Secondary: {
        Height: 2160,
        Width: 3840
    },

    AspectRatio: 16 / 9
}

module.exports = {
    StreamBitrateKbps,
    FramesPerSecond,

    GoogleMaxBitrate,
    GoogleMinBitrate,

    DoubleSdpModifications,
    RTCPeerConfig,
    Resolution
}; 