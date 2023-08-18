import init, { convert_pcap_to_hc22000 } from "./wasm/pkg/pcap_to_hc22000.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convert") {
    (async () => {
      await init();
      try {
        const buffer = new Uint8Array(request.data).buffer;
        const bytes = convert_pcap_to_hc22000(new Uint8Array(buffer)).buffer;
        const response = {
          bytes: Array.from(new Uint8Array(bytes)),
        };

        sendResponse(response);
      } catch (e) {
        sendResponse({ error: true });
      }
    })();
    return true;
  }
});
