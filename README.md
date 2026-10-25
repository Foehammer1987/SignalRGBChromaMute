# SignalRGB Razer Chroma Mute: fix Razer Synapse conflicts with SignalRGB

A SignalRGB plugin that stops Razer Synapse and Razer Chroma from fighting SignalRGB for control of your RGB lighting. Use it if your Razer keyboard, mouse, headset or other Chroma device flickers, flashes, or keeps switching back to Synapse lighting while SignalRGB is running. Synapse stays open, so DPI, macros, key bindings and other Razer features keep working.

## The problem: Synapse fighting SignalRGB

Razer Synapse and SignalRGB both send lighting to Razer devices. When both are running, they fight for control. You see this as:

- Chroma flickering between SignalRGB effects and Synapse effects
- Razer devices resetting to Synapse lighting a few seconds after SignalRGB sets them
- Lighting that stutters or flashes while the two programs take turns

The usual workarounds are closing Synapse (and losing your Razer settings) or leaving Razer's Chroma SDK sample app or a third party app open in the background. This plugin does the same job from inside SignalRGB, with nothing extra to run.

## How it works

Synapse stops pushing its own lighting while a Chroma SDK app is active. This plugin registers with Synapse as a Chroma SDK app, keeps that session alive, and never sends a lighting effect. Synapse goes quiet and SignalRGB is the only thing driving the LEDs.

This is the same thing that happens when you leave Razer's [Chroma SDK sample application](https://github.com/chroma-sdk/chroma-native-sample-application) open in the background, without needing an extra app.

It talks to the Chroma REST API that Synapse hosts at `http://localhost:54235/razer/chromasdk`: it registers once, sends a heartbeat every 2 seconds, and registers again if Synapse restarts.

## Install

1. Copy `RazerChromaMute.js` into your SignalRGB plugins folder (`Documents\WhirlwindFX\Plugins`).
2. Restart SignalRGB.
3. In Synapse, make sure Chroma Apps is turned on (Chroma > Chroma Apps).
4. Stop SignalRGB from closing Synapse. SignalRGB closes Razer's processes by default, and the plugin needs Synapse running. In SignalRGB's conflicting programs settings, turn on **Prevent Closing** for each of these:
   - `RazerAppEngine.exe`
   - `RzSynapse.exe`
   - `Razer Synapse 3.exe`
   - `Razer Synapse Service.exe`

## FAQ

**Why do my Razer lights flicker with SignalRGB?**
Razer Synapse and SignalRGB are both sending lighting to the same device. This plugin tells Synapse a Chroma app is in control, so Synapse stops sending its lighting and the flickering stops.

**Do I have to uninstall or close Razer Synapse?**
No. Synapse needs to keep running for this plugin to work, and you keep DPI settings, macros, key remaps and firmware updates.

**Does it work with Synapse 3 and Synapse 4?**
It uses the standard Chroma SDK REST API that Synapse provides, so it should work with any Synapse version that has Chroma Apps. It has been confirmed on the author's setup. Please open an issue with your Synapse version if it does or doesn't work for you.

**SignalRGB keeps closing Synapse. What do I do?**
That's SignalRGB's conflicting programs feature. Turn on **Prevent Closing** for the Razer processes listed in step 4 of the install steps.

**It isn't working. What should I check?**
Make sure Synapse is running, Chroma Apps is turned on in Synapse, and the plugin shows up in SignalRGB after a restart. If another Chroma app (a game with Chroma support, for example) takes over, Synapse may show that app's lighting until it closes.

**Does it change my lighting?**
No. The plugin never sends any lighting effect. It only holds the Chroma session so SignalRGB can control your Razer devices.

## Status

Early version. Confirmed working on the author's setup. Reports welcome.
