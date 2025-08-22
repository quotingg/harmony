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
        - [ ] advanced resolution editing using [these properties](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties)
        - [x] simple resolution editing (aspect ratio, height, width)
    - [ ] other stuff
        - [ ] add custom ice candidates and more than one
        - [x] RTCPeerConfiguration constructor [editing](./store/configuration.js)
- [ ] performance
    - [x] make scripts into modules
    - [x] SDP
        - [x] simulcast attribute
        - [x] scalabilityMode (SVC)
        - [x] x-google-max/start/min
    - [x] calculations
        - [x] x-google-max/start/min
        - [x] exact fps
- [ ] make routing more different (cache and on error get new asset)
- [ ] support sites rather than local (vercel)
- [x] proper framebuffer size

> [!NOTE]
> some things may be removed if they are unable to be added