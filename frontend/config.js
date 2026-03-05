window.CHATCART_API_BASE = window.CHATCART_API_BASE || (() => {
	const host = window.location.hostname;

	if (window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(host)) {
		return "http://localhost:4000/api";
	}

	if (host.endsWith("onrender.com")) {
		return "https://chatcart-api.onrender.com/api";
	}

	return `${window.location.origin}/api`;
})();
