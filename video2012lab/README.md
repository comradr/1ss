# Video 2012 Lab — Revenge Classic (v0.3)

Experimental JS plugin for Discord error 2012 (Video Viewer Timeout). **Not a confirmed fix.**

## Install

In Revenge Classic > Plugins > +, paste this base URL:

`https://raw.githubusercontent.com/comradr/1ss/main/video2012lab/`

Revenge will fetch `manifest.json` and `index.js` from the folder.

## Behavior

The plugin looks for JavaScript setters `setAv1Enabled`, `setHevcEnabled`, and `setH265Enabled`. If available, it wraps them to pass `false` instead of a Boolean value. It logs the result to `[Video2012]` in the client's debug console. No external requests or data collection.

It does **not** patch native WebRTC, Android MediaCodec or VPN/network settings. There is no guarantee it will change the transmitted video format or resolve error 2012. If it finds 0/3 setter hooks, it cannot modify those codec flags.

## Testing

Enable it on the **sending Android phone**, reload Discord, attempt camera and screenshare, then review `[Video2012]` logs. To undo: disable and restart Discord.

The legacy loader evaluates `index.js` as an expression, so the bundle starts with an IIFE rather than a variable declaration. Use at your own risk.