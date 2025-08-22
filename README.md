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
        - [x] RTCPeerConfiguration
            - [x] RTCPeerConfiguration constructor [editing](./store/configuration.js)
            - [x] advanced resolution editing using [these properties](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties)
            - [x] simple resolution editing (aspect ratio, height, width)
            - [ ] make double table editing to allow primary/secondary to have same properties
        - [ ] 
    - [ ] other stuff
        - [ ] add custom ice candidates and more than one
- [ ] performance
    - [x] make scripts into modules
    - [x] SDP
        - [x] simulcast attribute
        - [x] scalabilityMode (SVC)
        - [x] x-google-max/start/min
        - [x] gop (group of pictures)
        - [x] profile-level-id (depends on the user)
    - [x] calculations
        - [x] x-google-max/start/min
        - [x] gop
        - [x] fps management
- [ ] make routing more different (cache and on error get new asset)
- [ ] find way around `ServiceNotInRegion (2101)` error
- [x] proper framebuffer size

> [!NOTE]
> some things may be removed if they are unable to be added