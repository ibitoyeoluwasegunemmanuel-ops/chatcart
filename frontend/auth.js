const API_BASE = (() => {
  if (window.location.protocol === "file:") {
    return "http://localhost:4000/api";
  }

  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:4000/api";
  }

  return `${window.location.origin}/api`;
})();
const ROLE_KEY = "chatcart-selected-role";

const ROLE_PLAN_OPTIONS = {
  vendor: [
    { value: "vendor_starter", label: "Vendor Starter" },
    { value: "vendor_growth", label: "Vendor Growth" },
    { value: "vendor_scale", label: "Vendor Scale" }
  ],
  content_creator: [
    { value: "creator_starter", label: "Creator Starter" },
    { value: "creator_pro", label: "Creator Pro" },
    { value: "creator_studio", label: "Creator Studio" }
  ]
};

function get(id) {
  return document.getElementById(id);
}

function setStatus(text, type = "") {
  const status = get("formStatus");
  if (!status) return;
  status.className = `status ${type}`.trim();
  status.textContent = text;
}

function setBtnLoading(button, loading, label = "Processing...") {
  if (!button) return;
  if (loading) {
    button.dataset.label = button.textContent;
    button.textContent = label;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label || button.textContent;
    button.disabled = false;
  }
}

function updatePlanOptions() {
  const role = get("role")?.value;
  const planSelect = get("subscriptionPlan");
  if (!role || !planSelect) return;

  const plans = ROLE_PLAN_OPTIONS[role] || [];
  planSelect.innerHTML = plans
    .map((plan) => `<option value="${plan.value}">${plan.label}</option>`)
    .join("");
}

function getRolePreference() {
  const params = new URLSearchParams(window.location.search);
  const queryRole = params.get("role");

  if (queryRole === "vendor" || queryRole === "content_creator") {
    localStorage.setItem(ROLE_KEY, queryRole);
    return queryRole;
  }

  const savedRole = localStorage.getItem(ROLE_KEY);
  if (savedRole === "vendor" || savedRole === "content_creator") {
    return savedRole;
  }

  return "vendor";
}

function applyRolePreference() {
  const roleField = get("role");
  if (!roleField) return;

  const preferredRole = getRolePreference();
  roleField.value = preferredRole;
  localStorage.setItem(ROLE_KEY, preferredRole);
}

async function request(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function routeAfterLogin(user) {
  const destination = user?.role === "content_creator" ? "creator.html" : "vendor.html";
  window.location.assign(destination);
  setTimeout(() => {
    const current = window.location.pathname.toLowerCase();
    const expected = destination.replaceAll("\\", "/").toLowerCase();
    if (!current.endsWith(expected)) {
      window.location.replace(destination);
    }
  }, 600);
}

async function handleSignup(event) {
  event.preventDefault();
  const button = get("submitBtn");
  setBtnLoading(button, true, "Creating...");

  try {
    const payload = {
      name: get("name").value.trim(),
      email: get("email").value.trim(),
      password: get("password").value,
      role: get("role").value,
      subscriptionPlan: get("subscriptionPlan").value
    };

    await request("/auth/signup", payload);
    setStatus("Signup successful. Proceed to login.", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    setBtnLoading(button, false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const button = get("submitBtn");
  setBtnLoading(button, true, "Signing in...");

  try {
    const payload = {
      email: get("email").value.trim(),
      password: get("password").value,
      role: get("role").value
    };

    const data = await request("/auth/login", payload);
    localStorage.setItem("chatcart-session", JSON.stringify(data));
    setStatus("Login successful. Redirecting...", "success");
    routeAfterLogin(data.user);
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    setBtnLoading(button, false);
  }
}

function boot() {
  const roleField = get("role");
  applyRolePreference();

  if (roleField) {
    roleField.addEventListener("change", () => {
      localStorage.setItem(ROLE_KEY, roleField.value);
      updatePlanOptions();
    });
  }

  const signupForm = get("signupForm");
  if (signupForm) {
    updatePlanOptions();
    signupForm.addEventListener("submit", handleSignup);
  }

  const loginForm = get("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

boot();
