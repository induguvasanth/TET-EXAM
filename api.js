async function apiGet(action, params = {}) {
  if (!API_URL || API_URL.indexOf("PASTE_") >= 0) {
    throw new Error("API_URL is not configured.");
  }

  const url = new URL(API_URL);
  url.searchParams.set("action", action);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  let response;

  try {
    response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });
  } catch (error) {
    throw new Error(
      "Cannot connect to Apps Script. Check Web App deployment access and browser console. " +
      error.message
    );
  }

  const raw = await response.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      "Apps Script did not return JSON. Response starts with: " +
      raw.substring(0, 150)
    );
  }

  if (!data || data.ok !== true) {
    throw new Error((data && data.error) || "API returned an unknown error.");
  }

  return data;
}

async function apiPost(payload) {
  if (!API_URL || API_URL.indexOf("PASTE_") >= 0) {
    throw new Error("API_URL is not configured.");
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new Error("Cannot connect to Apps Script: " + error.message);
  }

  const raw = await response.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error("Apps Script did not return JSON: " + raw.substring(0, 150));
  }

  if (!data || data.ok !== true) {
    throw new Error((data && data.error) || "API returned an unknown error.");
  }

  return data;
}
