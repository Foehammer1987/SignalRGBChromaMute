// Razer Chroma Mute for SignalRGB
//
// Stops Razer Synapse from fighting SignalRGB over lighting. It does what the
// Razer ChromaSDK sample app does when left open: it registers itself as a
// Chroma SDK application, keeps the session alive, and never sends an effect.
// While it holds the SDK, Synapse stops pushing its own effects, so SignalRGB's
// direct device control is the only thing writing to the LEDs.
//
// Uses the Chroma REST API that Synapse hosts on localhost:54235.

export function Name() { return "Razer Chroma Mute"; }
export function Version() { return "0.1.0"; }
export function Type() { return "network"; }
export function Publisher() { return "Foehammer1987"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() { return [0, 0]; }
export function DefaultScale() { return 1.0; }

export function Initialize() {}
export function Render() {}
export function Shutdown() {}

const CHROMA_SDK_URL = "http://localhost:54235/razer/chromasdk";
const HEARTBEAT_MS = 2000;	// Chroma drops a session after ~15 s without one
const RETRY_MS = 10000;		// how often to retry when Synapse isn't running

const APP_INFO = {
	title: "SignalRGB Chroma Mute",
	description: "Holds the Chroma SDK idle so SignalRGB can control Razer lighting",
	author: {
		name: "Foehammer1987",
		contact: "https://github.com/Foehammer1987"
	},
	device_supported: ["keyboard", "mouse", "headset", "mousepad", "keypad", "chromalink"],
	category: "application"
};

export function DiscoveryService() {
	this.sessionUri = null;
	this.pending = false;
	this.lastAttempt = 0;
	this.lastHeartbeat = 0;

	this.Initialize = function() {
		service.log("Razer Chroma Mute starting");
		this.register();
	};

	this.Update = function() {
		const now = Date.now();

		if (this.pending) {
			return;
		}

		if (this.sessionUri === null) {
			if (now - this.lastAttempt >= RETRY_MS) {
				this.register();
			}
		} else if (now - this.lastHeartbeat >= HEARTBEAT_MS) {
			this.heartbeat();
		}
	};

	this.register = function() {
		this.pending = true;
		this.lastAttempt = Date.now();

		XmlHttp.Request("POST", CHROMA_SDK_URL, APP_INFO, (xhr) => {
			this.pending = false;

			if (xhr.status !== 200) {
				service.log("Chroma SDK not reachable (is Synapse running?), retrying");

				return;
			}

			const response = parseJson(xhr.responseText);

			if (!response || !response.uri) {
				service.log("Chroma SDK refused registration: " + xhr.responseText);

				return;
			}

			this.sessionUri = response.uri;
			this.lastHeartbeat = Date.now();
			service.log("Holding Chroma SDK session " + response.sessionid + " at " + this.sessionUri);
		});
	};

	this.heartbeat = function() {
		this.pending = true;
		this.lastHeartbeat = Date.now();

		XmlHttp.Request("PUT", this.sessionUri + "/heartbeat", null, (xhr) => {
			this.pending = false;

			// Synapse restarted or dropped the session; register again.
			if (xhr.status !== 200) {
				service.log("Chroma SDK session lost, re-registering");
				this.sessionUri = null;
				this.lastAttempt = 0;
			}
		});
	};
}

function parseJson(text) {
	try {
		return JSON.parse(text);
	} catch (e) {
		return null;
	}
}

class XmlHttp {
	static Request(method, url, data, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				callback(xhr);
			}
		};

		xhr.send(data === null ? null : JSON.stringify(data));
	}
}
