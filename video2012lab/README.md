# Video 2012 Lab — Revenge Classic (v0.3)

## STATUS: NO CONFIRMED FIX

**Device feedback, 2026-10-22:** The plug-in did **not** resolve error 2012 in an Android-to-Android Discord camera / screenshare call with sound but no image. Treat it as an **unverified experiment**, not as a codec fix.

The current JS patch only looks for three optional setters:
- `setAv1Enabled`
- `setHevcEnabled`
- `setH265Enabled`

It does not intercept native WebRTC/MediaCodec and may find zero setters in real builds. It was only syntax-/mock-tested, never demonstrated to modify the negotiated codec or resolve the error on a real device. Disable/remove it when troubleshooting.

## Diagnostic cross-check (before any further plugin)

Given:
- Android A streams video/audio; Android B hears audio but sees error 2012
- Android B can watch A's **desktop** stream
- A can watch B's **Android** camera/screen share

Test A's Android camera/screen stream while watching from **a desktop Discord account** (separate login/account).

- Desktop also cannot see video: investigate A's Android sender encoder (Discord release / Android MediaCodec logs).
- Desktop sees video: investigate Android-to-Android codec negotiation/decoding on B. Test an older clean Discord release **on B**.
- A second mobile viewer would further narrow whether only B is affected.

Some Android users reported recovery after installing Discord **343.12 Stable** in September-October 2026, but this is anecdotal and not universal. Test without a modified client and preserve login/2FA access.

## Native diagnostic via ADB

If the problem persists and the user consents, collect a **local** logcat while reproducing error 2012:

```sh
adb devices
adb logcat -c
adb logcat -v time > discord2012.log
```

Start the broken stream and have the affected viewer join, then stop with Ctrl+C. Inspect locally for `MediaCodec`, `CCodec`, `CodecException`, `DEAD_OBJECT`, `WebRTC`, `Decoder`, and `Encoder`. **Do not publicly upload the raw log**: system logs may contain account/session/network or other sensitive information. Redact before sharing relevant excerpts.

## Legacy install for code inspection

`https://raw.githubusercontent.com/comradr/1ss/main/video2012lab/`

Files: `manifest.json` + `index.js`. This is no longer recommended as a fix.

No network access, telemetry or account data collection is included in `index.js`; turning the plugin off and restarting Discord removes its temporary JS setter wrappers.
