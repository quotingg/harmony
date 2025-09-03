# harmony
a [now.gg](https://now.gg) bypass/proxy that focuses on performance and customization

## setup
to download npm resources
```
npm i
```
to start harmony
```
npm run start
```

## roadmap
everything im planning to add sooner/later or is already added

- [ ] customizable options
    - [ ] resolution
        - [x] editing
            - [x] advanced resolution editing using [these properties](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties)
            - [x] simple resolution editing (aspect ratio, height, width)
        - [x] RTCPeerConfiguration constructor [editing](./store/configuration.js)
    - [ ] other stuff
        - [ ] ability to add custom ice candidates and more than one
- [ ] performance
    - [x] make scripts into modules
    - [ ] SDP
        - [x] simulcast attribute
        - [x] scalabilityMode (SVC)
        - [x] x-google-max/start/min
        - [x] gop (group of pictures)
        - [x] corruption-detection extmap
        - [ ] flexfec
            - [ ] FEC-FR ssrc-group
            - [ ] adaptive redundancy
            - [x] base declaration
    - [ ] calculations
        - [x] x-google-max/start/min
        - [x] gop
        - [x] fps management
- [ ] caching
    - [ ] make routing more different (cache /apps/ and on error get new asset)
    - [ ] cache `SdpModifications` so we don't need to parse every request for it
- [x] use fastify
- [ ] maybe add docs
- [ ] change / to be a working frontend
- [x] proper framebuffer size

> [!NOTE]
> some things may be removed if they are unable to be added