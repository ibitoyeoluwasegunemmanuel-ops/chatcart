const API_BASE = window.CHATCART_API_BASE || "http://localhost:4000/api";
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const CURRENCY_SYMBOL = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const uploadForm = document.getElementById("uploadForm");
const settingsForm = document.getElementById("settingsForm");

const authStatus = document.getElementById("authStatus");
const vendorStatus = document.getElementById("vendorStatus");
const socialStatus = document.getElementById("socialStatus");
const automationStatus = document.getElementById("automationStatus");
const settingsStatus = document.getElementById("settingsStatus");

const navUser = document.getElementById("navUser");
const sessionName = document.getElementById("sessionName");
const sessionRole = document.getElementById("sessionRole");

const skeletonLayer = document.getElementById("skeletonLayer");
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.getElementById("sidebarToggle");

const vendorProductsList = document.getElementById("vendorProductsList");
const ordersTableBody = document.getElementById("ordersTableBody");
const activityList = document.getElementById("activityList");
const socialPostsList = document.getElementById("socialPostsList");

const productImagesInput = document.getElementById("productImages");
const editingProductId = document.getElementById("editingProductId");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const refreshVendorBtn = document.getElementById("refreshVendorBtn");
const autoSuggestionBtn = document.getElementById("autoSuggestionBtn");
const autoOrderBtn = document.getElementById("autoOrderBtn");
const autoCampaignBtn = document.getElementById("autoCampaignBtn");
const socialPublishBtn = document.getElementById("socialPublishBtn");
const socialScheduleBtn = document.getElementById("socialScheduleBtn");
const scheduleFields = document.getElementById("scheduleFields");

const statProducts = document.getElementById("statProducts");
const statOrders = document.getElementById("statOrders");
const statRevenue = document.getElementById("statRevenue");
const statPendingOrders = document.getElementById("statPendingOrders");

const salesChart = document.getElementById("salesChart");
const ordersChart = document.getElementById("ordersChart");
const growthChart = document.getElementById("growthChart");

let dashboardState = {
  products: [],
  orders: [],
  settings: null,
  analytics: null
};

function setStatus(element, message, type = "") {
  if (!element) return;
  element.className = `status ${type}`.trim();
  element.textContent = message;
}

function setButtonLoading(button, isLoading, loadingText = "Working...") {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent || "";
    }
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add("is-loading");
  } else {
    button.disabled = false;
    button.classList.remove("is-loading");
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}

function getSession() {
  const raw = localStorage.getItem("chatcart-session");
  return raw ? JSON.parse(raw) : null;
}

function saveSession(session) {
  localStorage.setItem("chatcart-session", JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem("chatcart-session");
}

function setLoading(isLoading) {
  if (!skeletonLayer) return;

  if (isLoading) {
    skeletonLayer.classList.remove("hidden");
  } else {
    skeletonLayer.classList.add("hidden");
  }
}

function formatMoney(amount, currency = "NGN") {
  const symbol = CURRENCY_SYMBOL[currency] || "";
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

function updateHeaderSession(session) {
  if (navUser) {
    navUser.textContent = session ? `${session.user.name} (${session.user.role})` : "Not signed in";
  }

  if (sessionName) {
    sessionName.textContent = session ? session.user.name : "User";
  }

  if (sessionRole) {
    sessionRole.textContent = session ? session.user.role : "role";
  }
}

function applySidebarState() {
  if (!appShell) return;
  const isCollapsed = localStorage.getItem("chatcart-sidebar") === "collapsed";
  appShell.classList.toggle("sidebar-collapsed", isCollapsed);
}

function updateScheduleFieldsVisibility() {
  if (!scheduleFields) return;
  const selectedMode = document.querySelector("input[name='postMode']:checked")?.value || "now";
  scheduleFields.classList.toggle("hidden", selectedMode !== "schedule");
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    if (!appShell) return;
    const nextCollapsed = !appShell.classList.contains("sidebar-collapsed");
    appShell.classList.toggle("sidebar-collapsed", nextCollapsed);
    localStorage.setItem("chatcart-sidebar", nextCollapsed ? "collapsed" : "expanded");
  });
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

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function collectProductImages() {
  if (!productImagesInput || !productImagesInput.files || !productImagesInput.files.length) {
    return undefined;
  }

  const files = Array.from(productImagesInput.files).slice(0, 4);
  const imageData = await Promise.all(files.map(readFileAsDataURL));
  return imageData;
}

function renderProducts(products) {
  if (!vendorProductsList) return;

  if (!products.length) {
    vendorProductsList.innerHTML = '<div class="item">No products uploaded yet.</div>';
    return;
  }

  vendorProductsList.innerHTML = products
    .map((product) => {
      const images = Array.isArray(product.images) ? product.images : [];
      const imagesMarkup = images.length
        ? `<div class="image-strip">${images
            .slice(0, 4)
            .map((image) => `<img class="image-thumb" src="${image}" alt="product" />`)
            .join("")}</div>`
        : "";

      return `
        <div class="item" data-product-id="${product.id}">
          <div class="item-title">${product.name}</div>
          <div class="item-meta">${formatMoney(product.price, product.currency)} • ${product.currency} • Stock: ${product.stockQuantity}</div>
          <div class="item-meta">${product.description}</div>
          ${imagesMarkup}
          <div class="product-actions">
            <button type="button" class="btn-secondary" data-action="edit-product" data-id="${product.id}">Edit</button>
            <button type="button" class="btn-danger" data-action="delete-product" data-id="${product.id}">Delete</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderOrders(orders) {
  if (!ordersTableBody) return;

  if (!orders.length) {
    ordersTableBody.innerHTML = '<tr><td colspan="8">No orders yet.</td></tr>';
    return;
  }

  ordersTableBody.innerHTML = orders
    .map((order) => {
      const normalizedStatus = String(order.status || "Pending").toLowerCase();
      return `
        <tr>
          <td>#${order.id}</td>
          <td>${order.customerName}</td>
          <td>${order.productName}</td>
          <td>${order.quantity}</td>
          <td>${formatMoney(order.totalAmount, order.currency)}</td>
          <td><span class="status-pill ${normalizedStatus}">${order.status}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <select data-order-id="${order.id}" class="order-status-select">
              ${["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
                .map((status) => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
            <button type="button" class="btn-secondary" data-action="update-order" data-id="${order.id}">Save</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderActivity(items) {
  if (!activityList) return;

  if (!items.length) {
    activityList.innerHTML = '<div class="item">No recent activity.</div>';
    return;
  }

  activityList.innerHTML = items
    .map(
      (activity) => `
        <div class="item">
          <div class="item-title">${activity.activityType}</div>
          <div class="item-meta">${activity.message}</div>
          <div class="item-meta">${new Date(activity.createdAt).toLocaleString()}</div>
        </div>
      `
    )
    .join("");
}

function renderSocialPosts(posts) {
  if (!socialPostsList) return;

  if (!posts.length) {
    socialPostsList.innerHTML = '<div class="item">No scheduled or published posts yet.</div>';
    return;
  }

  socialPostsList.innerHTML = posts
    .map(
      (post) => `
        <div class="item">
          <div class="item-title">${post.platform} • ${post.status}</div>
          <div class="item-meta">${post.content}</div>
          <div class="item-meta">${post.mode === "schedule" ? `Scheduled: ${post.scheduledAt || "N/A"}` : `Posted: ${post.postedAt || "N/A"}`}</div>
        </div>
      `
    )
    .join("");
}

function drawLineChart(canvas, series, color) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!series || !series.length) {
    ctx.fillStyle = "#8893b5";
    ctx.font = "12px Inter";
    ctx.fillText("No data", 10, 20);
    return;
  }

  const values = series.map((item) => Number(item.total || 0));
  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1 || 1);

  ctx.beginPath();
  values.forEach((value, index) => {
    const x = index * stepX;
    const y = height - (value / max) * (height - 20) - 10;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function updateStats(analytics) {
  if (!analytics) return;

  if (statProducts) statProducts.textContent = String(analytics.totalProducts || 0);
  if (statOrders) statOrders.textContent = String(analytics.totalOrders || 0);
  if (statRevenue) statRevenue.textContent = formatMoney(analytics.revenue || 0, dashboardState.settings?.preferred_currency || "NGN");
  if (statPendingOrders) statPendingOrders.textContent = String(analytics.pendingOrders || 0);

  drawLineChart(salesChart, analytics.salesSeries, "#4f6dff");
  drawLineChart(ordersChart, analytics.orderSeries, "#1fb878");
  drawLineChart(growthChart, analytics.growthSeries, "#e15368");
}

async function loadDashboardData() {
  try {
    setLoading(true);

    const [products, orders, settings, analytics, activities, socialPosts, socialConnections] = await Promise.all([
      api("/vendors/me/products"),
      api("/orders/vendor"),
      api("/settings/me"),
      api("/analytics/summary"),
      api("/automation/activity"),
      api("/social/posts"),
      api("/social/connections")
    ]);

    dashboardState.products = products;
    dashboardState.orders = orders;
    dashboardState.settings = settings;
    dashboardState.analytics = analytics;

    renderProducts(products);
    renderOrders(orders);
    renderActivity(activities);
    renderSocialPosts(socialPosts);
    updateStats(analytics);
    applySettingsToForm(settings);
    applySocialConnectionChecks(socialConnections);

    setStatus(vendorStatus, "Dashboard loaded successfully.", "success");
  } catch (error) {
    setStatus(vendorStatus, error.message, "error");
  } finally {
    setLoading(false);
  }
}

function applySettingsToForm(settings) {
  if (!settings) return;

  const preferredCurrency = document.getElementById("preferredCurrency");
  const profileName = document.getElementById("profileName");
  const companyName = document.getElementById("companyName");
  const profileBio = document.getElementById("profileBio");

  if (preferredCurrency) preferredCurrency.value = settings.preferred_currency || "NGN";
  if (profileName) profileName.value = settings.profile_name || "";
  if (companyName) companyName.value = settings.company_name || "";
  if (profileBio) profileBio.value = settings.bio || "";

  const productCurrency = document.getElementById("productCurrency");
  if (productCurrency && settings.preferred_currency) {
    productCurrency.value = settings.preferred_currency;
  }
}

function applySocialConnectionChecks(connections) {
  document.querySelectorAll("#socialConnections input[type='checkbox']").forEach((checkbox) => {
    const platform = checkbox.dataset.platform;
    const found = connections.find((item) => item.platform === platform);
    checkbox.checked = Boolean(found?.isConnected);
  });
}

function startEditProduct(productId) {
  const product = dashboardState.products.find((item) => item.id === Number(productId));
  if (!product) return;

  editingProductId.value = String(product.id);
  document.getElementById("productName").value = product.name;
  document.getElementById("productDescription").value = product.description;
  document.getElementById("productPrice").value = String(product.price);
  document.getElementById("productCurrency").value = product.currency;
  document.getElementById("productStock").value = String(product.stockQuantity || 0);

  if (saveProductBtn) saveProductBtn.textContent = "Update Product";
  setStatus(vendorStatus, `Editing product #${product.id}`, "success");
}

function clearProductForm() {
  if (!uploadForm) return;
  uploadForm.reset();
  if (editingProductId) editingProductId.value = "";
  if (saveProductBtn) saveProductBtn.textContent = "Create Product";
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const productId = editingProductId?.value ? Number(editingProductId.value) : null;
  const images = await collectProductImages();

  const payload = {
    name: document.getElementById("productName").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    currency: document.getElementById("productCurrency").value,
    stockQuantity: Number(document.getElementById("productStock").value)
  };

  if (images && images.length) {
    payload.images = images;
  }

  setButtonLoading(saveProductBtn, true, productId ? "Updating..." : "Creating...");
  try {
    if (productId) {
      await api(`/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      setStatus(vendorStatus, "Product updated.", "success");
    } else {
      await api("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatus(vendorStatus, "Product created.", "success");
    }

    clearProductForm();
    loadDashboardData();
  } catch (error) {
    setStatus(vendorStatus, error.message, "error");
  } finally {
    setButtonLoading(saveProductBtn, false);
  }
}

async function deleteProduct(productId) {
  try {
    await api(`/products/${productId}`, { method: "DELETE" });
    setStatus(vendorStatus, "Product deleted.", "success");
    loadDashboardData();
  } catch (error) {
    setStatus(vendorStatus, error.message, "error");
  }
}

async function updateOrderStatus(orderId) {
  const select = document.querySelector(`select[data-order-id='${orderId}']`);
  if (!select) return;

  try {
    await api(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: select.value })
    });
    setStatus(vendorStatus, "Order status updated.", "success");
    loadDashboardData();
  } catch (error) {
    setStatus(vendorStatus, error.message, "error");
  }
}

async function handleSocialPost(mode) {
  const contentInput = document.getElementById("socialPostInput");
  const platformSelect = document.getElementById("socialPlatformSelect");
  const dateInput = document.getElementById("scheduleDate");
  const timeInput = document.getElementById("scheduleTime");

  const content = contentInput?.value?.trim();
  const platform = platformSelect?.value;

  if (!content) {
    setStatus(socialStatus, "Post content is required.", "error");
    return;
  }

  let scheduledAt = null;
  if (mode === "schedule") {
    if (!dateInput?.value || !timeInput?.value) {
      setStatus(socialStatus, "Please choose schedule date and time.", "error");
      return;
    }
    scheduledAt = `${dateInput.value}T${timeInput.value}:00`;
  }

  const targetButton = mode === "now" ? socialPublishBtn : socialScheduleBtn;
  setButtonLoading(targetButton, true, mode === "now" ? "Publishing..." : "Scheduling...");
  try {
    await api("/social/posts", {
      method: "POST",
      body: JSON.stringify({
        platform,
        content,
        mode,
        scheduledAt
      })
    });

    setStatus(socialStatus, mode === "now" ? "Post published." : "Post scheduled.", "success");
    if (contentInput) contentInput.value = "";
    loadDashboardData();
  } catch (error) {
    setStatus(socialStatus, error.message, "error");
  } finally {
    setButtonLoading(targetButton, false);
  }
}

async function updateSocialConnection(platform, isConnected) {
  try {
    await api("/social/connections", {
      method: "POST",
      body: JSON.stringify({ platform, isConnected })
    });

    setStatus(socialStatus, `${platform} connection updated.`, "success");
  } catch (error) {
    setStatus(socialStatus, error.message, "error");
  }
}

async function generateAIContent(contentType, promptText) {
  setButtonLoading(autoSuggestionBtn, true, "Generating...");
  try {
    const response = await api("/automation/generate", {
      method: "POST",
      body: JSON.stringify({
        contentType,
        productName: promptText || "ChatCart Product",
        description: promptText || "High-converting automation tool"
      })
    });

    const output = document.getElementById("aiOutput");
    if (output) output.value = response.output;
    setStatus(automationStatus, "AI content generated successfully.", "success");
  } catch (error) {
    setStatus(automationStatus, error.message, "error");
  } finally {
    setButtonLoading(autoSuggestionBtn, false);
  }
}

async function saveSettings(event) {
  event.preventDefault();

  const submitButton = settingsForm?.querySelector("button[type='submit']");
  setButtonLoading(submitButton, true, "Saving...");

  const payload = {
    preferredCurrency: document.getElementById("preferredCurrency")?.value,
    profileName: document.getElementById("profileName")?.value?.trim(),
    companyName: document.getElementById("companyName")?.value?.trim(),
    bio: document.getElementById("profileBio")?.value?.trim(),
    currentPassword: document.getElementById("currentPassword")?.value,
    newPassword: document.getElementById("newPassword")?.value
  };

  if (!payload.newPassword) {
    delete payload.currentPassword;
  }

  try {
    const settings = await api("/settings/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    dashboardState.settings = settings;
    applySettingsToForm(settings);
    setStatus(settingsStatus, "Settings saved.", "success");
  } catch (error) {
    setStatus(settingsStatus, error.message, "error");
  } finally {
    setButtonLoading(submitButton, false);
  }
}

function attachDashboardHandlers() {
  if (uploadForm) {
    uploadForm.addEventListener("submit", handleProductSubmit);
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", clearProductForm);
  }

  if (vendorProductsList) {
    vendorProductsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.dataset.action;
      const id = Number(target.dataset.id);
      if (!action || !id) return;

      if (action === "edit-product") {
        startEditProduct(id);
      }

      if (action === "delete-product") {
        deleteProduct(id);
      }
    });
  }

  if (ordersTableBody) {
    ordersTableBody.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.dataset.action;
      const id = Number(target.dataset.id);
      if (action === "update-order" && id) {
        updateOrderStatus(id);
      }
    });
  }

  if (refreshVendorBtn) {
    refreshVendorBtn.addEventListener("click", loadDashboardData);
  }

  if (autoSuggestionBtn) {
    autoSuggestionBtn.addEventListener("click", () => {
      const type = document.getElementById("aiContentType")?.value || "caption";
      const prompt = document.getElementById("aiPrompt")?.value || "";
      generateAIContent(type, prompt);
    });
  }

  if (autoOrderBtn) {
    autoOrderBtn.addEventListener("click", () => generateAIContent("post", "Summarize orders and customer trends"));
  }

  if (autoCampaignBtn) {
    autoCampaignBtn.addEventListener("click", () => generateAIContent("ad", "Create a campaign for top products"));
  }

  if (socialPublishBtn) {
    socialPublishBtn.addEventListener("click", () => handleSocialPost("now"));
  }

  if (socialScheduleBtn) {
    socialScheduleBtn.addEventListener("click", () => handleSocialPost("schedule"));
  }

  document.querySelectorAll("#socialConnections input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      updateSocialConnection(target.dataset.platform, target.checked);
    });
  });

  if (settingsForm) {
    settingsForm.addEventListener("submit", saveSettings);
  }

  document.querySelectorAll("input[name='postMode']").forEach((radio) => {
    radio.addEventListener("change", updateScheduleFieldsVisibility);
  });

  updateScheduleFieldsVisibility();
}

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const signupButton = signupForm.querySelector("button[type='submit']");
    setButtonLoading(signupButton, true, "Creating...");

    const payload = {
      name: document.getElementById("signupName").value.trim(),
      email: document.getElementById("signupEmail").value.trim(),
      password: document.getElementById("signupPassword").value,
      role: document.getElementById("signupRole").value
    };

    try {
      await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setStatus(authStatus, "Signup successful. Please login.", "success");
      signupForm.reset();

      if (currentPage === "signup.html") {
        setTimeout(() => {
          window.location.href = "login.html";
        }, 700);
      }
    } catch (error) {
      setStatus(authStatus, error.message, "error");
    } finally {
      setButtonLoading(signupButton, false);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginButton = loginForm.querySelector("button[type='submit']");
    setButtonLoading(loginButton, true, "Signing in...");

    const payload = {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value
    };

    try {
      const session = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      saveSession(session);
      setStatus(authStatus, "Login successful. Redirecting...", "success");
      loginForm.reset();

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 420);
    } catch (error) {
      setStatus(authStatus, error.message, "error");
    } finally {
      setButtonLoading(loginButton, false);
    }
  });
}

function handleRouteGuards() {
  const session = getSession();

  if (currentPage === "dashboard.html" && !session) {
    window.location.href = "login.html";
    return false;
  }

  updateHeaderSession(session);
  return true;
}

document.querySelectorAll("[data-action='logout']").forEach((button) => {
  button.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
});

applySidebarState();

if (handleRouteGuards() && currentPage === "dashboard.html") {
  attachDashboardHandlers();
  loadDashboardData();
}
