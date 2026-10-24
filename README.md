# SignalRGBChromaMute
A signal RGB plugin designed to prevent chroma lighting schema conflicts while allowing Chroma to still function for Razer special functions

## The problem
Razer Synapse and SignalRGB both write lighting to Razer devices. When both run, they fight for control and the LEDs flicker between the two.

## How it works
Synapse stops pushing its own lighting while a Chroma SDK app is active. This plugin registers with Synapse as a Chroma SDK app, keeps that session alive, and never sends a lighting effect. Synapse goes quiet and SignalRGB is the only thing driving the LEDs. Synapse itself keeps running, so DPI, macros, and other device features still work.

This is the same thing that happens when you leave Razer's [Chroma SDK sample application](https://github.com/chroma-sdk/chroma-native-sample-application) open in the background, without needing an extra app.

It talks to the Chroma REST API that Synapse hosts at `http://localhost:54235/razer/chromasdk`: it registers once, sends a heartbeat every 2 seconds, and registers again if Synapse restarts.

## Install
1. Copy `RazerChromaMute.js` into your SignalRGB plugins folder (`Documents\WhirlwindFX\Plugins`).
2. Restart SignalRGB.
3. In Synapse, make sure Chroma Apps is turned on (Chroma > Chroma Apps).
4. In SignalRGB, turn off "Automatically Close Conflicting Programs" (Settings > Windows Settings) so Synapse can keep running.

## Status
Early version, not yet tested on real hardware. Reports welcome.
