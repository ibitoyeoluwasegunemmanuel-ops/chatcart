const API_BASE = (() => {
  if (window.CHATCART_API_BASE) {
    return window.CHATCART_API_BASE;
  }

  if (window.location.protocol === "file:") {
    return "http://localhost:4000/api";
  }

  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:4000/api";
  }

  return `${window.location.origin}/api`;
})();

const get = (id) => document.getElementById(id);
const sessionPill = get("creatorSession");
const aiStatus = get("aiStatus");
const scheduleStatus = get("scheduleStatus");

let state = {
  drafts: JSON.parse(localStorage.getItem("creator-drafts") || "[]"),
  posts: [],
  subscription: null,
  billing: [],
  staff: [],
  availablePermissions: []
};

function setStatus(el, text, type = "") {
  if (!el) return;
  el.className = `status ${type}`.trim();
  el.textContent = text;
}

function getSession() {
  const raw = localStorage.getItem("chatcart-session");
  return raw ? JSON.parse(raw) : null;
}

function hasPermission(permission) {
  const session = getSession();
  if (!session?.user) return false;
  if (!session.user.isStaff) return true;
  return Array.isArray(session.user.permissions) && session.user.permissions.includes(permission);
}

function setBtnLoading(btn, loading, label = "Working...") {
  if (!btn) return;
  if (loading) {
    btn.dataset.label = btn.textContent;
    btn.textContent = label;
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.label || btn.textContent;
    btn.disabled = false;
  }
}

function permissionLabel(permission) {
  return permission
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function api(path, options = {}) {
  const session = getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function applyCreatorPlanUI() {
  const usageNode = get("creatorPlanUsage");
  const subscription = state.subscription;
  const generateBtn = get("generateBtn");
  const variantBtn = get("variantBtn");
  const publishBtn = get("publishBtn");

  if (!usageNode || !subscription || !generateBtn || !variantBtn || !publishBtn) {
    return;
  }

  const maxPosts = subscription.limits?.maxMonthlyPosts;
  const maxAi = subscription.limits?.maxMonthlyAiGenerations;
  const maxStaff = subscription.limits?.maxStaff;
  const postUsed = subscription.usage?.monthlyPosts || 0;
  const aiUsed = subscription.usage?.monthlyAiGenerations || 0;
  const staffUsed = subscription.usage?.staffCount || 0;

  const postText = maxPosts == null ? `${postUsed}/∞ posts` : `${postUsed}/${maxPosts} posts`;
  const aiText = maxAi == null ? `${aiUsed}/∞ AI` : `${aiUsed}/${maxAi} AI`;
  const staffText = maxStaff == null ? `${staffUsed}/∞ staff` : `${staffUsed}/${maxStaff} staff`;
  usageNode.textContent = `Plan ${subscription.subscriptionPlan}: ${postText}, ${aiText}, ${staffText}.`;

  const planSelect = get("creatorUpgradePlanSelect");
  if (planSelect) {
    planSelect.value = subscription.subscriptionPlan;
  }

  const postBlocked = maxPosts != null && postUsed >= maxPosts;
  const aiBlocked = maxAi != null && aiUsed >= maxAi;

  publishBtn.disabled = postBlocked;
  generateBtn.disabled = aiBlocked;
  variantBtn.disabled = aiBlocked;

  if (postBlocked) {
    setStatus(scheduleStatus, "Monthly post limit reached for your current plan.", "error");
  }

  if (aiBlocked) {
    setStatus(aiStatus, "Monthly AI generation limit reached for your current plan.", "error");
  }
}

function computeQuality(content) {
  const text = String(content || "");
  const hasHook = /(stop|wait|imagine|discover|finally|secret|before|after|you)/i.test(text);
  const hasCta = /(buy|shop|click|dm|order|try|join|get started|learn more)/i.test(text);
  const hasHashtags = /#\w+/.test(text);
  const goodLength = text.length >= 120 && text.length <= 550;

  let score = 0;
  if (hasHook) score += 25;
  if (hasCta) score += 25;
  if (hasHashtags) score += 25;
  if (goodLength) score += 25;

  get("qualityScore").textContent = `${score}%`;

  const checks = [
    `${hasHook ? "✅" : "⚠️"} Hook present`,
    `${hasCta ? "✅" : "⚠️"} CTA present`,
    `${goodLength ? "✅" : "⚠️"} Optimal length`,
    `${hasHashtags ? "✅" : "⚠️"} Hashtags included`
  ];

  get("qualityChecklist").innerHTML = checks.map((item) => `<li>${item}</li>`).join("");
  return score;
}

function buildAdvancedOutput(baseText) {
  const tone = get("toneType").value;
  const goal = get("goalType").value;
  const platform = get("platformType").value;

  return `🔥 ${tone} ${platform} copy (${goal})\n\n${baseText}\n\n✨ Hook Variant: “You’re one post away from your next customer.”\n📣 CTA Variant: “DM us now to secure your order today.”\n#ChatCart #ContentMarketing #DigitalSales`;
}

function buildScriptFramework() {
  const topic = (get("scriptTopic").value || "your product").trim();
  const type = get("scriptType").value;

  get("hookText").textContent = `If you struggle with ${topic}, this ${type.toLowerCase()} will change your workflow today.`;
  get("bodyText").textContent = "Problem → Promise → Proof: show what usually goes wrong, explain your solution, then demonstrate clear outcome in 3 steps.";
  get("ctaText").textContent = 'Comment "START" and I’ll send the exact process so you can apply this immediately.';
}

function renderPosts() {
  const list = get("postsList");
  if (!list) return;

  const all = [...state.posts, ...state.drafts.map((item) => ({ ...item, status: "Draft" }))];
  if (!all.length) {
    list.innerHTML = '<div class="post-item">No posts yet. Generate content and schedule your first campaign.</div>';
  } else {
    list.innerHTML = all
      .map(
        (post) => `
          <div class="post-item">
            <strong>${post.platform || "Creator"} • ${post.status || "Scheduled"}</strong>
            <div>${post.content || post.output || ""}</div>
            <div class="meta">${post.scheduledAt || post.scheduled_at || post.createdAt || "Just now"}</div>
          </div>
        `
      )
      .join("");
  }

  const scheduled = all.filter((item) => (item.status || "").toLowerCase().includes("scheduled")).length;
  const published = all.filter((item) => (item.status || "").toLowerCase().includes("posted") || (item.status || "").toLowerCase().includes("published")).length;
  const draftCount = state.drafts.length;
  const avg = all.length
    ? Math.round(all.reduce((sum, item) => sum + computeQuality(item.content || item.output || ""), 0) / all.length)
    : 0;

  get("statDrafts").textContent = String(draftCount);
  get("statScheduled").textContent = String(scheduled);
  get("statPublished").textContent = String(published);
  get("statScore").textContent = `${avg}%`;
}

function renderBilling() {
  const list = get("creatorBillingList");
  if (!list) return;

  if (!state.billing.length) {
    list.innerHTML = '<div class="post-item">No billing transactions yet.</div>';
    return;
  }

  list.innerHTML = state.billing
    .map((item) => `
      <div class="post-item">
        <strong>${item.plan}</strong>
        <div class="meta">${item.currency} ${Number(item.amount || 0).toFixed(2)} • ${item.status} • ${item.createdAt}</div>
      </div>
    `)
    .join("");
}

function renderPermissionOptions(containerId, selectedPermissions = [], inputName = "creatorStaffPermission") {
  const node = get(containerId);
  if (!node) return;

  node.innerHTML = state.availablePermissions
    .map((permission) => {
      const checked = selectedPermissions.includes(permission) ? "checked" : "";
      return `
        <label class="post-item" style="padding:6px 10px;display:inline-flex;align-items:center;gap:6px;">
          <input type="checkbox" data-permission-checkbox name="${inputName}" value="${permission}" ${checked} />
          <span>${permissionLabel(permission)}</span>
        </label>
      `;
    })
    .join("");
}

function getSelectedPermissions(scopeSelector = "[data-permission-checkbox]") {
  return Array.from(document.querySelectorAll(scopeSelector))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function renderStaff() {
  const list = get("creatorStaffList");
  const session = getSession();
  if (!list) return;

  if (!state.staff.length) {
    list.innerHTML = '<div class="post-item">No staff profiles yet.</div>';
    return;
  }

  list.innerHTML = state.staff
    .map((staff) => {
      const activeLabel = staff.isActive ? "Active" : "Inactive";
      const permissionBadges = (staff.permissions || [])
        .map((permission) => `<span class="post-item" style="padding:3px 8px;display:inline-block;margin:3px 4px 0 0;">${permissionLabel(permission)}</span>`)
        .join("");

      const canManageStaff = !session?.user?.isStaff || hasPermission("manage_staff");
      const actions = canManageStaff
        ? `
          <button class="btn secondary" data-creator-staff-toggle data-staff-id="${staff.id}" data-staff-next="${!staff.isActive}">${staff.isActive ? "Deactivate" : "Activate"}</button>
          <button class="btn secondary" data-creator-staff-edit data-staff-id="${staff.id}">Edit Permissions</button>
        `
        : "";

      return `
        <div class="post-item" data-staff-row="${staff.id}">
          <strong>${staff.name} (${staff.staffTitle || "Staff"})</strong>
          <div>${staff.email}</div>
          <div class="meta">${activeLabel} • Created ${staff.createdAt}</div>
          <div>${permissionBadges || '<span class="meta">No permissions assigned.</span>'}</div>
          <div class="inline-action">${actions}</div>
          <div class="inline-action" data-staff-editor="${staff.id}" style="display:none;"></div>
        </div>
      `;
    })
    .join("");

  list.querySelectorAll("[data-creator-staff-toggle]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const id = Number(event.target.getAttribute("data-staff-id"));
      const next = event.target.getAttribute("data-staff-next") === "true";
      await updateStaffStatus(id, next);
    });
  });

  list.querySelectorAll("[data-creator-staff-edit]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const staffId = Number(event.target.getAttribute("data-staff-id"));
      const staff = state.staff.find((item) => item.id === staffId);
      const editor = list.querySelector(`[data-staff-editor="${staffId}"]`);
      if (!staff || !editor) return;

      const isOpen = editor.style.display !== "none";
      if (isOpen) {
        editor.style.display = "none";
        editor.innerHTML = "";
        return;
      }

      editor.style.display = "flex";
      editor.style.flexDirection = "column";
      editor.innerHTML = `
        <div data-editor-options></div>
        <button class="btn secondary" data-save-staff-perms="${staffId}">Save Permissions</button>
      `;

      const optionsNode = editor.querySelector("[data-editor-options]");
      optionsNode.innerHTML = state.availablePermissions
        .map((permission) => {
          const checked = (staff.permissions || []).includes(permission) ? "checked" : "";
          return `
            <label class="post-item" style="padding:6px 10px;display:inline-flex;align-items:center;gap:6px;">
              <input type="checkbox" data-staff-editor-checkbox value="${permission}" ${checked} />
              <span>${permissionLabel(permission)}</span>
            </label>
          `;
        })
        .join("");

      const saveButton = editor.querySelector(`[data-save-staff-perms="${staffId}"]`);
      saveButton.addEventListener("click", async () => {
        const permissions = Array.from(editor.querySelectorAll("[data-staff-editor-checkbox]"))
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);
        await updateStaffPermissions(staffId, permissions);
      });
    });
  });
}

function applyStaffAccessUI() {
  const session = getSession();
  const isStaff = Boolean(session?.user?.isStaff);

  if (isStaff && !hasPermission("manage_staff")) {
    const createBtn = get("creatorCreateStaffBtn");
    const upgradeBtn = get("creatorUpgradePlanBtn");
    if (createBtn) createBtn.disabled = true;
    if (upgradeBtn) upgradeBtn.disabled = true;
    setStatus(get("creatorStaffStatus"), "Staff account: CEO/owner or staff with Team permission can manage staff.", "error");
  }
}

async function loadAvailablePlans() {
  try {
    const data = await api("/subscription/plans");
    const planSelect = get("creatorUpgradePlanSelect");
    if (!planSelect) return;

    const labels = {
      creator_starter: "Creator Starter",
      creator_pro: "Creator Pro",
      creator_studio: "Creator Studio"
    };

    planSelect.innerHTML = (data.plans || [])
      .map((plan) => `<option value="${plan}">${labels[plan] || plan}</option>`)
      .join("");

    if (data.currentPlan) {
      planSelect.value = data.currentPlan;
    }
  } catch (_error) {
    // ignore
  }
}

async function loadAvailablePermissions() {
  try {
    const data = await api("/staff/permissions");
    state.availablePermissions = Array.isArray(data.permissions) ? data.permissions : [];
    renderPermissionOptions("creatorStaffPermissionOptions");
  } catch (_error) {
    state.availablePermissions = [];
  }
}

async function loadPosts() {
  try {
    const posts = await api("/social/posts");
    state.posts = Array.isArray(posts) ? posts : [];
  } catch (_error) {
    state.posts = [];
  }
  renderPosts();
}

async function loadSubscriptionUsage() {
  try {
    state.subscription = await api("/subscription/usage");
    applyCreatorPlanUI();
  } catch (_error) {
    // ignore
  }
}

async function loadBillingHistory() {
  try {
    const rows = await api("/subscription/history");
    state.billing = Array.isArray(rows) ? rows : [];
  } catch (_error) {
    state.billing = [];
  }
  renderBilling();
}

async function loadStaff() {
  try {
    const rows = await api("/staff");
    state.staff = Array.isArray(rows) ? rows : [];
  } catch (error) {
    state.staff = [];
    setStatus(get("creatorStaffStatus"), error.message, "error");
  }
  renderStaff();
}

async function createStaffProfile() {
  const button = get("creatorCreateStaffBtn");
  setBtnLoading(button, true, "Creating...");

  try {
    await api("/staff", {
      method: "POST",
      body: JSON.stringify({
        name: get("creatorStaffName").value.trim(),
        email: get("creatorStaffEmail").value.trim(),
        password: get("creatorStaffPassword").value,
        staffTitle: get("creatorStaffTitle").value.trim() || "Staff",
        permissions: getSelectedPermissions("#creatorStaffPermissionOptions [data-permission-checkbox]")
      })
    });

    get("creatorStaffName").value = "";
    get("creatorStaffEmail").value = "";
    get("creatorStaffPassword").value = "";
    get("creatorStaffTitle").value = "";
    renderPermissionOptions("creatorStaffPermissionOptions");

    setStatus(get("creatorStaffStatus"), "Staff profile created successfully.", "success");
    await loadStaff();
    await loadSubscriptionUsage();
  } catch (error) {
    setStatus(get("creatorStaffStatus"), error.message, "error");
  } finally {
    setBtnLoading(button, false);
  }
}

async function updateStaffStatus(staffId, isActive) {
  try {
    await api(`/staff/${staffId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive })
    });
    setStatus(get("creatorStaffStatus"), "Staff status updated.", "success");
    await loadStaff();
  } catch (error) {
    setStatus(get("creatorStaffStatus"), error.message, "error");
  }
}

async function updateStaffPermissions(staffId, permissions) {
  try {
    await api(`/staff/${staffId}/permissions`, {
      method: "PATCH",
      body: JSON.stringify({ permissions })
    });
    setStatus(get("creatorStaffStatus"), "Staff permissions updated.", "success");
    await loadStaff();
  } catch (error) {
    setStatus(get("creatorStaffStatus"), error.message, "error");
  }
}

async function upgradePlan() {
  const btn = get("creatorUpgradePlanBtn");
  const selectedPlan = get("creatorUpgradePlanSelect")?.value;
  if (!selectedPlan) return;

  setBtnLoading(btn, true, "Upgrading...");
  try {
    await api("/subscription/upgrade", {
      method: "PATCH",
      body: JSON.stringify({ subscriptionPlan: selectedPlan })
    });

    const session = getSession();
    if (session?.user) {
      session.user.subscriptionPlan = selectedPlan;
      localStorage.setItem("chatcart-session", JSON.stringify(session));
    }

    setStatus(get("creatorUpgradeStatus"), "Plan upgraded successfully.", "success");
    await loadSubscriptionUsage();
    await loadBillingHistory();
  } catch (error) {
    setStatus(get("creatorUpgradeStatus"), error.message, "error");
  } finally {
    setBtnLoading(btn, false);
  }
}

async function generateContent(variants = false) {
  const btn = variants ? get("variantBtn") : get("generateBtn");
  setBtnLoading(btn, true, variants ? "Generating..." : "Building...");

  try {
    const context = get("contentContext").value.trim();
    const contentType = get("contentType").value;

    const result = await api("/automation/generate", {
      method: "POST",
      body: JSON.stringify({
        contentType,
        productName: context || "Product",
        description: context || "Promotion context"
      })
    });

    const polished = buildAdvancedOutput(result.output || "");
    if (variants) {
      const v1 = polished;
      const v2 = polished.replace("DM us now", "Click the link now");
      const v3 = polished.replace("one post away", "one campaign away");
      get("aiOutput").value = `${v1}\n\n--- Variant 2 ---\n${v2}\n\n--- Variant 3 ---\n${v3}`;
    } else {
      get("aiOutput").value = polished;
    }

    computeQuality(get("aiOutput").value);
    setStatus(aiStatus, "Advanced content generated successfully.", "success");
    await loadSubscriptionUsage();
  } catch (error) {
    setStatus(aiStatus, error.message, "error");
  } finally {
    setBtnLoading(btn, false);
  }
}

function saveDraft() {
  const output = get("aiOutput").value.trim();
  if (!output) {
    setStatus(aiStatus, "Generate content first before saving draft.", "error");
    return;
  }

  state.drafts.unshift({
    id: `d-${Date.now()}`,
    output,
    platform: get("platformType").value,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem("creator-drafts", JSON.stringify(state.drafts));
  setStatus(aiStatus, "Draft saved locally.", "success");
  renderPosts();
}

async function publishPost() {
  const btn = get("publishBtn");
  setBtnLoading(btn, true, "Publishing...");

  try {
    const content = get("postContent").value.trim() || get("aiOutput").value.trim();
    if (!content) {
      throw new Error("Add content before publishing.");
    }

    const mode = get("postMode").value;
    const platform = get("postPlatform").value;
    let scheduledAt = null;

    if (mode === "schedule") {
      const date = get("postDate").value;
      const time = get("postTime").value;
      if (!date || !time) {
        throw new Error("Choose date and time for scheduled post.");
      }
      scheduledAt = `${date}T${time}:00`;
    }

    await api("/social/posts", {
      method: "POST",
      body: JSON.stringify({ platform, content, mode, scheduledAt })
    });

    setStatus(scheduleStatus, mode === "schedule" ? "Post scheduled successfully." : "Post published successfully.", "success");
    get("postContent").value = "";
    await loadPosts();
    await loadSubscriptionUsage();
  } catch (error) {
    setStatus(scheduleStatus, error.message, "error");
  } finally {
    setBtnLoading(btn, false);
  }
}

function initSession() {
  const session = getSession();
  if (!session?.user) {
    window.location.href = "login.html";
    return;
  }

  if (session.user.role !== "content_creator") {
    window.location.href = "vendor.html";
    return;
  }

  sessionPill.textContent = `${session.user.name} (${session.user.role})`;
  if (session.user.isStaff && session.user.staffTitle) {
    sessionPill.textContent = `${session.user.name} • ${session.user.staffTitle}`;
  }
}

function attachEvents() {
  get("generateBtn").addEventListener("click", () => generateContent(false));
  get("variantBtn").addEventListener("click", () => generateContent(true));
  get("saveDraftBtn").addEventListener("click", saveDraft);
  get("buildScriptBtn").addEventListener("click", buildScriptFramework);
  get("publishBtn").addEventListener("click", publishPost);
  get("loadPostsBtn").addEventListener("click", loadPosts);
  get("creatorUpgradePlanBtn").addEventListener("click", upgradePlan);
  get("creatorCreateStaffBtn").addEventListener("click", createStaffProfile);
  get("creatorRefreshStaffBtn").addEventListener("click", loadStaff);
  get("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("chatcart-session");
    window.location.href = "login.html";
  });

  get("aiOutput").addEventListener("input", (event) => {
    computeQuality(event.target.value);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((node) => node.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

initSession();
applyStaffAccessUI();
attachEvents();
renderPosts();
loadAvailablePermissions();
loadAvailablePlans();
loadSubscriptionUsage();
loadPosts();
loadBillingHistory();
loadStaff();
