const ROLE_KEY = "chatcart-selected-role";
const API_BASE = (() => {
  if (window.location.protocol === "file:") {
    return "http://localhost:4000/api";
  }

  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:4000/api";
  }

  return `${window.location.origin}/api`;
})();

function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);

  document.querySelectorAll(".role-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.role === role);
  });

  const roleLabel = role === "vendor" ? "Vendor" : "Content Creator";
  const note = document.getElementById("selectedRoleText");
  if (note) {
    note.textContent = `Selected: ${roleLabel}`;
  }
}

function getRole() {
  const saved = localStorage.getItem(ROLE_KEY);
  return saved === "content_creator" ? "content_creator" : "vendor";
}

function routeTo(page) {
  const role = getRole();
  window.location.href = `${page}?role=${encodeURIComponent(role)}`;
}

function boot() {
  document.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => setRole(card.dataset.role));
  });

  const loginBtn = document.getElementById("goLogin");
  const signupBtn = document.getElementById("goSignup");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => routeTo("login.html"));
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => routeTo("signup.html"));
  }

  const leadBtn = document.getElementById("leadBtn");
  const leadName = document.getElementById("leadName");
  const leadEmail = document.getElementById("leadEmail");
  const leadStatus = document.getElementById("leadStatus");

  if (leadBtn && leadName && leadEmail && leadStatus) {
    leadBtn.addEventListener("click", async () => {
      const name = leadName.value.trim();
      const email = leadEmail.value.trim();

      if (!name || !email) {
        leadStatus.textContent = "Enter your name and email to continue.";
        return;
      }

      leadBtn.disabled = true;
      const initialText = leadBtn.textContent;
      leadBtn.textContent = "Submitting...";

      try {
        const role = getRole();
        const response = await fetch(`${API_BASE}/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            roleInterest: role,
            source: "landing_sales_playbook"
          })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || "Could not submit request.");
        }

        leadStatus.textContent = "Success. Check your email for the playbook next steps.";
        leadName.value = "";
        leadEmail.value = "";
      } catch (error) {
        leadStatus.textContent = error.message;
      } finally {
        leadBtn.disabled = false;
        leadBtn.textContent = initialText;
      }
    });
  }

  setRole(getRole());
}

boot();
