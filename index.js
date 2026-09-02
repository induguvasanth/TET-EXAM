const $ = id => document.getElementById(id);

async function loadTests() {
  const select = $("tests");
  const message = $("msg");

  select.innerHTML = '<option value="">Loading tests...</option>';
  select.disabled = true;
  message.textContent = "";

  try {
    const data = await apiGet("getTests");

    if (!Array.isArray(data.tests) || data.tests.length === 0) {
      throw new Error(
        "No active tests found. In the Tests sheet, check that the active column contains TRUE."
      );
    }

    select.innerHTML =
      '<option value="">-- Select Test --</option>' +
      data.tests.map(test => {
        const id = String(test.testId || "").trim();
        const name = String(test.testName || "").trim() || id || "Unnamed Test";
        return `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`;
      }).join("");

    select.disabled = false;

  } catch (error) {
    console.error("loadTests failed:", error);

    select.innerHTML = '<option value="">ERROR: Tests not loaded</option>';
    select.disabled = false;

    message.textContent = "API Error: " + error.message;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

$("start").onclick = () => {
  const name = $("name").value.trim();
  const mobile = $("mobile").value.trim();
  const testId = $("tests").value;

  if (!name) {
    $("msg").textContent = "Enter your name.";
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    $("msg").textContent = "Enter a valid 10 digit mobile number.";
    return;
  }

  if (!testId) {
    $("msg").textContent = "Please select a test.";
    return;
  }

  sessionStorage.setItem(
    "tetStudent",
    JSON.stringify({ name, mobile, testId })
  );

  location.href = "exam.html";
};

loadTests();
