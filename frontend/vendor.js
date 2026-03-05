const API_BASE = (() => {
  if (window.location.protocol === "file:") {
    return "http://localhost:4000/api";
  }

  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:4000/api";
  }

  return `${window.location.origin}/api`;
})();

const get = (id) => document.getElementById(id);
const vendorSession = get("vendorSession");

let state = {
  products: [],
  orders: [],
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

function currencySymbol(code) {
  return ({ NGN: "₦", USD: "$", GBP: "£", EUR: "€" })[code] || "";
}

function renderStats() {
  get("statProducts").textContent = String(state.products.length);
  get("statOrders").textContent = String(state.orders.length);
  get("statPending").textContent = String(
    state.orders.filter((order) => ["Pending", "Processing"].includes(order.status)).length
  );

  const revenue = state.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  get("statRevenue").textContent = `₦${revenue.toLocaleString()}`;
}

function applyVendorPlanUI() {
  const usageNode = get("vendorPlanUsage");
  const createBtn = get("createProductBtn");
  const subscription = state.subscription;

  if (!subscription || !usageNode || !createBtn) return;

  const maxProducts = subscription.limits?.maxProducts;
  const products = subscription.usage?.products || 0;
  const maxStaff = subscription.limits?.maxStaff;
  const staffCount = subscription.usage?.staffCount || 0;
  const staffText = maxStaff == null ? `${staffCount}/∞ staff` : `${staffCount}/${maxStaff} staff`;

  if (maxProducts == null) {
    usageNode.textContent = `Plan ${subscription.subscriptionPlan}: unlimited products, ${staffText}.`;
  } else {
    const remaining = Math.max(0, maxProducts - products);
    usageNode.textContent = `Plan ${subscription.subscriptionPlan}: ${products}/${maxProducts} products used (${remaining} remaining), ${staffText}.`;

    if (remaining <= 0) {
      createBtn.disabled = true;
      setStatus(get("productStatus"), "Product limit reached for your current plan.", "error");
    }
  }

  const planSelect = get("upgradePlanSelect");
  if (planSelect) {
    planSelect.value = subscription.subscriptionPlan;
  }
}

function renderProducts() {
  const list = get("productsList");
  if (!list) return;

  if (!state.products.length) {
    list.innerHTML = '<div class="list-item">No products yet.</div>';
    return;
  }

  list.innerHTML = state.products
    .map((product) => {
      const symbol = currencySymbol(product.currency);
      return `
        <div class="list-item">
          <strong>${product.name}</strong>
          <div>${product.description}</div>
          <div class="meta">${symbol}${product.price} • ${product.currency} • Stock: ${product.stockQuantity}</div>
        </div>
      `;
    })
    .join("");
}

function renderOrders() {
  const list = get("ordersList");
  if (!list) return;

  if (!state.orders.length) {
    list.innerHTML = '<div class="list-item">No orders yet.</div>';
    return;
  }

  list.innerHTML = state.orders
    .map((order) => {
      const symbol = currencySymbol(order.currency);
      const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
      const options = statuses
        .map((status) => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`)
        .join("");

      const updateButton = hasPermission("manage_orders")
        ? `<button class="btn secondary" data-update-order>Update</button>`
        : "";

      return `
        <div class="list-item" data-order-id="${order.id}">
          <strong>Order #${order.id} • ${order.productName}</strong>
          <div>Customer: ${order.customerName} • Qty: ${order.quantity}</div>
          <div class="meta">${symbol}${order.totalAmount} • ${order.currency} • ${order.status}</div>
          <div class="inline-action">
            <select class="status-select" data-order-status>${options}</select>
            ${updateButton}
          </div>
        </div>
      `;
    })
    .join("");

  list.querySelectorAll("[data-update-order]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const container = event.target.closest("[data-order-id]");
      const orderId = container?.getAttribute("data-order-id");
      const status = container?.querySelector("[data-order-status]")?.value;
      if (!orderId || !status) return;

      try {
        await api(`/orders/${orderId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status })
        });
        setStatus(get("ordersStatus"), `Order #${orderId} updated to ${status}.`, "success");
        await loadOrders();
      } catch (error) {
        setStatus(get("ordersStatus"), error.message, "error");
      }
    });
  });
}

function renderBilling() {
  const list = get("vendorBillingList");
  if (!list) return;

  if (!state.billing.length) {
    list.innerHTML = '<div class="list-item">No billing transactions yet.</div>';
    return;
  }

  list.innerHTML = state.billing
    .map((item) => `
      <div class="list-item">
        <strong>${item.plan}</strong>
        <div class="meta">${item.currency} ${Number(item.amount || 0).toFixed(2)} • ${item.status} • ${item.createdAt}</div>
      </div>
    `)
    .join("");
}

function renderPermissionOptions(containerId, selectedPermissions = [], inputName = "staffPermission") {
  const node = get(containerId);
  if (!node) return;

  node.innerHTML = state.availablePermissions
    .map((permission) => {
      const checked = selectedPermissions.includes(permission) ? "checked" : "";
      return `
        <label class="list-item" style="padding:6px 10px;display:inline-flex;align-items:center;gap:6px;">
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
  const list = get("staffList");
  const session = getSession();
  if (!list) return;

  if (!state.staff.length) {
    list.innerHTML = '<div class="list-item">No staff profiles yet.</div>';
    return;
  }

  list.innerHTML = state.staff
    .map((staff) => {
      const activeLabel = staff.isActive ? "Active" : "Inactive";
      const permissionBadges = (staff.permissions || [])
        .map((permission) => `<span class="list-item" style="padding:3px 8px;display:inline-block;margin:3px 4px 0 0;">${permissionLabel(permission)}</span>`)
        .join("");

      const canManageStaff = !session?.user?.isStaff || hasPermission("manage_staff");
      const actions = canManageStaff
        ? `
          <button class="btn secondary" data-staff-toggle data-staff-id="${staff.id}" data-staff-next="${!staff.isActive}">${staff.isActive ? "Deactivate" : "Activate"}</button>
          <button class="btn secondary" data-staff-edit data-staff-id="${staff.id}">Edit Permissions</button>
        `
        : "";

      return `
        <div class="list-item" data-staff-row="${staff.id}">
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

  list.querySelectorAll("[data-staff-toggle]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const id = Number(event.target.getAttribute("data-staff-id"));
      const next = event.target.getAttribute("data-staff-next") === "true";
      await updateStaffStatus(id, next);
    });
  });

  list.querySelectorAll("[data-staff-edit]").forEach((button) => {
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
            <label class="list-item" style="padding:6px 10px;display:inline-flex;align-items:center;gap:6px;">
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
    const createBtn = get("createStaffBtn");
    const upgradeBtn = get("upgradePlanBtn");
    if (createBtn) createBtn.disabled = true;
    if (upgradeBtn) upgradeBtn.disabled = true;
    setStatus(get("staffStatus"), "Staff account: CEO/owner or staff with Team permission can manage staff.", "error");
  }

  if (isStaff && !hasPermission("manage_products")) {
    const createProductBtn = get("createProductBtn");
    if (createProductBtn) createProductBtn.disabled = true;
  }
}

async function loadProducts() {
  try {
    const products = await api("/vendors/me/products");
    state.products = Array.isArray(products) ? products : [];
    renderProducts();
    renderStats();
  } catch (error) {
    setStatus(get("productStatus"), error.message, "error");
  }
}

async function loadOrders() {
  try {
    const orders = await api("/vendors/me/orders");
    state.orders = Array.isArray(orders) ? orders : [];
    renderOrders();
    renderStats();
  } catch (error) {
    setStatus(get("ordersStatus"), error.message, "error");
  }
}

async function loadSettings() {
  try {
    const settings = await api("/settings/me");
    get("profileName").value = settings.profile_name || "";
    get("companyName").value = settings.company_name || "";
    get("bio").value = settings.bio || "";
    get("preferredCurrency").value = settings.preferred_currency || "NGN";
  } catch (error) {
    setStatus(get("settingsStatus"), error.message, "error");
  }
}

async function loadSubscriptionUsage() {
  try {
    state.subscription = await api("/subscription/usage");
    applyVendorPlanUI();
  } catch (_error) {
    // ignore
  }
}

async function loadAvailablePlans() {
  try {
    const data = await api("/subscription/plans");
    const planSelect = get("upgradePlanSelect");
    if (!planSelect) return;

    const labels = {
      vendor_starter: "Vendor Starter",
      vendor_growth: "Vendor Growth",
      vendor_scale: "Vendor Scale"
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
    renderPermissionOptions("staffPermissionOptions");
  } catch (_error) {
    state.availablePermissions = [];
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
    setStatus(get("staffStatus"), error.message, "error");
  }
  renderStaff();
}

async function createStaffProfile() {
  const button = get("createStaffBtn");
  setBtnLoading(button, true, "Creating...");

  try {
    const payload = {
      name: get("staffName").value.trim(),
      email: get("staffEmail").value.trim(),
      password: get("staffPassword").value,
      staffTitle: get("staffTitle").value.trim() || "Staff",
      permissions: getSelectedPermissions("#staffPermissionOptions [data-permission-checkbox]")
    };

    await api("/staff", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    get("staffName").value = "";
    get("staffEmail").value = "";
    get("staffPassword").value = "";
    get("staffTitle").value = "";
    renderPermissionOptions("staffPermissionOptions");

    setStatus(get("staffStatus"), "Staff profile created successfully.", "success");
    await loadStaff();
    await loadSubscriptionUsage();
  } catch (error) {
    setStatus(get("staffStatus"), error.message, "error");
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
    setStatus(get("staffStatus"), "Staff status updated.", "success");
    await loadStaff();
  } catch (error) {
    setStatus(get("staffStatus"), error.message, "error");
  }
}

async function updateStaffPermissions(staffId, permissions) {
  try {
    await api(`/staff/${staffId}/permissions`, {
      method: "PATCH",
      body: JSON.stringify({ permissions })
    });
    setStatus(get("staffStatus"), "Staff permissions updated.", "success");
    await loadStaff();
  } catch (error) {
    setStatus(get("staffStatus"), error.message, "error");
  }
}

async function upgradePlan() {
  const btn = get("upgradePlanBtn");
  const selectedPlan = get("upgradePlanSelect")?.value;
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
      vendorSession.textContent = `${session.user.name} (${selectedPlan})`;
    }

    setStatus(get("upgradeStatus"), "Plan upgraded successfully.", "success");
    await loadSubscriptionUsage();
    await loadBillingHistory();
  } catch (error) {
    setStatus(get("upgradeStatus"), error.message, "error");
  } finally {
    setBtnLoading(btn, false);
  }
}

async function createProduct() {
  const button = get("createProductBtn");
  setBtnLoading(button, true, "Creating...");

  try {
    await api("/products", {
      method: "POST",
      body: JSON.stringify({
        name: get("productName").value.trim(),
        description: get("productDescription").value.trim(),
        price: Number(get("productPrice").value),
        currency: get("productCurrency").value,
        stockQuantity: Number(get("productStock").value || 0),
        images: []
      })
    });

    setStatus(get("productStatus"), "Product created successfully.", "success");
    get("productName").value = "";
    get("productDescription").value = "";
    get("productPrice").value = "";
    get("productStock").value = "";
    await loadProducts();
    await loadSubscriptionUsage();
  } catch (error) {
    setStatus(get("productStatus"), error.message, "error");
  } finally {
    setBtnLoading(button, false);
  }
}

async function saveSettings() {
  const button = get("saveSettingsBtn");
  setBtnLoading(button, true, "Saving...");

  try {
    await api("/settings/me", {
      method: "PATCH",
      body: JSON.stringify({
        profileName: get("profileName").value.trim(),
        companyName: get("companyName").value.trim(),
        bio: get("bio").value.trim(),
        preferredCurrency: get("preferredCurrency").value
      })
    });
    setStatus(get("settingsStatus"), "Settings updated.", "success");
  } catch (error) {
    setStatus(get("settingsStatus"), error.message, "error");
  } finally {
    setBtnLoading(button, false);
  }
}

function initSession() {
  const session = getSession();
  if (!session?.user) {
    window.location.href = "login.html";
    return;
  }

  if (session.user.role !== "vendor") {
    window.location.href = "creator.html";
    return;
  }

  vendorSession.textContent = `${session.user.name} (${session.user.subscriptionPlan || "vendor_starter"})`;
  if (session.user.isStaff && session.user.staffTitle) {
    vendorSession.textContent = `${session.user.name} • ${session.user.staffTitle}`;
  }
}

function attachEvents() {
  get("createProductBtn").addEventListener("click", createProduct);
  get("refreshProductsBtn").addEventListener("click", loadProducts);
  get("refreshOrdersBtn").addEventListener("click", loadOrders);
  get("saveSettingsBtn").addEventListener("click", saveSettings);
  get("upgradePlanBtn").addEventListener("click", upgradePlan);
  get("createStaffBtn").addEventListener("click", createStaffProfile);
  get("refreshStaffBtn").addEventListener("click", loadStaff);
  get("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("chatcart-session");
    window.location.href = "login.html";
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
loadAvailablePermissions();
loadAvailablePlans();
loadSubscriptionUsage();
loadProducts();
loadOrders();
loadSettings();
loadBillingHistory();
loadStaff();
