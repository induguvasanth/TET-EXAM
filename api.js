/**
 * JSONP GET helper for Google Apps Script.
 * This avoids cross-origin fetch/redirect problems on GitHub Pages.
 */
function apiGet(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = "__tetApi_" + Date.now() + "_" +
      Math.random().toString(36).slice(2);

    const url = new URL(API_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("_", Date.now().toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const script = document.createElement("script");
    let finished = false;

    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
    };

    const fail = (message) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error(message));
    };

    const timer = setTimeout(() => {
      fail("API request timed out after 15 seconds.");
    }, 15000);

    window[callbackName] = (data) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      cleanup();

      if (!data || data.ok !== true) {
        reject(new Error((data && data.error) || "API returned ok=false."));
        return;
      }

      resolve(data);
    };

    script.onerror = () => {
      clearTimeout(timer);
      fail("Could not load Apps Script API.");
    };

    script.src = url.toString();
    document.head.appendChild(script);
  });
}
