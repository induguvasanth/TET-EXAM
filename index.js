const $ = (id) => document.getElementById(id);

async function loadTests() {
  const select = $("tests");
  const msg = $("msg");

  select.innerHTML = '<option value="">Loading tests...</option>';
  select.disabled = true;
  msg.textContent = "Connecting to Apps Script...";
  msg.className = "msg";

  try {
    const data = await apiGet("getTests");

    if (!Array.isArray(data.tests)) {
      throw new Error("API response does not contain a tests array.");
    }

    if (data.tests.length === 0) {
      throw new Error("No active tests were returned.");
    }

    select.innerHTML = '<option value="">-- Select Test --</option>';

    data.tests.forEach((test) => {
      const option = document.createElement("option");
      option.value = String(test.testId || "");
      option.textContent = String(test.testName || test.testId || "Unnamed Test");
      select.appendChild(option);
    });

    select.disabled = false;
    msg.textContent = data.tests.length + " test(s) loaded successfully.";
    msg.className = "msg success";

  } catch (error) {
    console.error("loadTests error:", error);
    select.innerHTML = '<option value="">ERROR - Tests not loaded</option>';
    select.disabled = false;
    msg.textContent = "API Error: " + error.message;
    msg.className = "msg error";
  }
}

$("start").addEventListener("click", () => {
  const name = $("name").value.trim();
  const mobile = $("mobile").value.trim();
  const testId = $("tests").value;

  if (!name) return $("msg").textContent = "Please enter your name.";
  if (!/^\d{10}$/.test(mobile)) return $("msg").textContent = "Please enter a valid 10 digit mobile number.";
  if (!testId) return $("msg").textContent = "Please select a test.";

  sessionStorage.setItem("tetStudent", JSON.stringify({ name, mobile, testId }));
  location.href = "exam.html";
});

loadTests();
