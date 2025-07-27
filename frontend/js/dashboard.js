// Dashboard functionality
class DashboardManager {
  constructor() {
    this.currentUser = null
    this.orders = []
    this.currentFilter = "all"
    this.currentTab = "orders"
    this.init()
  }

  init() {
    this.checkAuth()
    this.setupEventListeners()
    this.loadUserData()
    this.loadOrders()
    this.updateStats()
  }

  checkAuth() {
    const savedUser = localStorage.getItem("currentUser")
    if (!savedUser) {
      window.location.href = "../index.html"
      return
    }

    this.currentUser = JSON.parse(savedUser)
    this.updateUserInfo()
  }

  updateUserInfo() {
    const userAvatar = document.getElementById("userAvatar")
    const userName = document.getElementById("userName")
    const profileAvatar = document.getElementById("profileAvatar")

    if (userAvatar) userAvatar.src = this.currentUser.photoURL || "https://via.placeholder.com/40"
    if (userName) userName.textContent = this.currentUser.displayName || "مستخدم"
    if (profileAvatar) profileAvatar.src = this.currentUser.photoURL || "https://via.placeholder.com/120"
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const tab = item.dataset.tab
        this.switchTab(tab)
      })
    })

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setFilter(btn.dataset.filter)
      })
    })

    // Profile form
    const profileForm = document.querySelector(".profile-form-fields")
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.updateProfile()
      })
    }

    // Settings toggles
    document.querySelectorAll('.settings-section input[type="checkbox"]').forEach((toggle) => {
      toggle.addEventListener("change", () => {
        this.updateSetting(toggle.id, toggle.checked)
      })
    })

    // Logout
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
      e.preventDefault()
      this.logout()
    })
  }

  switchTab(tabName) {
    this.currentTab = tabName

    // Update menu items
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active")
    })
    document.getElementById(`${tabName}-tab`).classList.add("active")

    // Load tab-specific data
    if (tabName === "profile") {
      this.loadProfileData()
    } else if (tabName === "settings") {
      this.loadSettings()
    }
  }

  setFilter(filter) {
    this.currentFilter = filter

    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active")

    // Filter and render orders
    this.renderOrders()
  }

  async loadOrders() {
    const ordersContainer = document.getElementById("ordersContainer")
    if (!ordersContainer) return

    // Show loading state
    ordersContainer.innerHTML = `
            <div class="loading-orders">
                <div class="loading-spinner"></div>
            </div>
        `

    try {
      // Load orders from localStorage (in real app, this would be from API)
      const savedOrders = localStorage.getItem("userOrders")
      this.orders = savedOrders ? JSON.parse(savedOrders) : []

      // Add some demo orders if none exist
      if (this.orders.length === 0) {
        this.orders = this.generateDemoOrders()
        localStorage.setItem("userOrders", JSON.stringify(this.orders))
      }

      await this.delay(1000) // Simulate loading
      this.renderOrders()
    } catch (error) {
      console.error("Error loading orders:", error)
      this.showError("حدث خطأ في تحميل الطلبات")
    }
  }

  generateDemoOrders() {
    const games = ["PUBG Mobile", "Free Fire", "FIFA Mobile", "PES Mobile"]
    const statuses = ["completed", "pending", "cancelled"]
    const orders = []

    for (let i = 0; i < 5; i++) {
      const game = games[Math.floor(Math.random() * games.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const price = Math.floor(Math.random() * 100) + 20
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))

      orders.push({
        orderNumber: "GZ" + (Date.now() + i).toString().slice(-8),
        game: { title: game },
        package: { amount: `${Math.floor(Math.random() * 1000) + 100} عملة` },
        total: price.toFixed(2),
        status: status,
        createdAt: date.toISOString(),
        playerId: "123456789",
        email: this.currentUser.email || "user@example.com",
      })
    }

    return orders
  }

  renderOrders() {
    const ordersContainer = document.getElementById("ordersContainer")
    if (!ordersContainer) return

    let filteredOrders = this.orders

    if (this.currentFilter !== "all") {
      filteredOrders = this.orders.filter((order) => order.status === this.currentFilter)
    }

    if (filteredOrders.length === 0) {
      ordersContainer.innerHTML = `
                <div class="empty-state">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <rect x="10" y="20" width="60" height="40" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M20 30h40M20 40h30M20 50h20" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <h3>لا توجد طلبات</h3>
                    <p>لم تقم بأي طلبات بعد</p>
                </div>
            `
      return
    }

    ordersContainer.innerHTML = ""

    filteredOrders.forEach((order) => {
      const orderCard = this.createOrderCard(order)
      ordersContainer.appendChild(orderCard)
    })
  }

  createOrderCard(order) {
    const orderCard = document.createElement("div")
    orderCard.className = "order-card"

    const statusText = this.getStatusText(order.status)
    const date = new Date(order.createdAt).toLocaleDateString("ar-SA")

    orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-number">#${order.orderNumber}</span>
                <span class="order-status ${order.status}">${statusText}</span>
            </div>
            
            <div class="order-details">
                <div class="order-detail">
                    <label>اللعبة:</label>
                    <span>${order.game.title}</span>
                </div>
                <div class="order-detail">
                    <label>الباقة:</label>
                    <span>${order.package.amount}</span>
                </div>
                <div class="order-detail">
                    <label>المبلغ:</label>
                    <span>${order.total} ريال</span>
                </div>
                <div class="order-detail">
                    <label>التاريخ:</label>
                    <span>${date}</span>
                </div>
            </div>
            
            <div class="order-actions">
                ${
                  order.status === "pending"
                    ? '<button class="btn btn-outline btn-small">إلغاء الطلب</button>'
                    : '<button class="btn btn-primary btn-small">إعادة الطلب</button>'
                }
                <button class="btn btn-outline btn-small">عرض التفاصيل</button>
            </div>
        `

    return orderCard
  }

  getStatusText(status) {
    const statusMap = {
      pending: "معلق",
      completed: "مكتمل",
      cancelled: "ملغي",
    }
    return statusMap[status] || status
  }

  updateStats() {
    const totalOrders = this.orders.length
    const completedOrders = this.orders.filter((order) => order.status === "completed").length
    const pendingOrders = this.orders.filter((order) => order.status === "pending").length
    const totalSpent = this.orders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + Number.parseFloat(order.total), 0)

    document.getElementById("totalOrders").textContent = totalOrders
    document.getElementById("completedOrders").textContent = completedOrders
    document.getElementById("pendingOrders").textContent = pendingOrders
    document.getElementById("totalSpent").textContent = `${totalSpent.toFixed(2)} ريال`
  }

  loadUserData() {
    // Load user profile data
    const profileName = document.getElementById("profileName")
    const profileEmail = document.getElementById("profileEmail")
    const profilePhone = document.getElementById("profilePhone")

    if (profileName) profileName.value = this.currentUser.displayName || ""
    if (profileEmail) profileEmail.value = this.currentUser.email || ""
    if (profilePhone) profilePhone.value = this.currentUser.phone || ""
  }

  loadProfileData() {
    // This would typically load from API
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      document.getElementById("profileName").value = profile.name || ""
      document.getElementById("profileEmail").value = profile.email || ""
      document.getElementById("profilePhone").value = profile.phone || ""
      document.getElementById("profileCountry").value = profile.country || ""
    }
  }

  loadSettings() {
    // Load user settings
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      document.getElementById("emailNotifications").checked = settings.emailNotifications !== false
      document.getElementById("smsNotifications").checked = settings.smsNotifications || false
      document.getElementById("profileVisibility").checked = settings.profileVisibility !== false
    }
  }

  async updateProfile() {
    const profileData = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      phone: document.getElementById("profilePhone").value,
      country: document.getElementById("profileCountry").value,
    }

    try {
      // Simulate API call
      await this.delay(1000)

      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(profileData))

      // Update current user
      this.currentUser.displayName = profileData.name
      this.currentUser.email = profileData.email
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser))

      this.showSuccess("تم حفظ الملف الشخصي بنجاح")
      this.updateUserInfo()
    } catch (error) {
      console.error("Error updating profile:", error)
      this.showError("حدث خطأ في حفظ الملف الشخصي")
    }
  }

  updateSetting(settingId, value) {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}")
    savedSettings[settingId] = value
    localStorage.setItem("userSettings", JSON.stringify(savedSettings))

    this.showSuccess("تم حفظ الإعدادات")
  }

  logout() {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userProfile")
    localStorage.removeItem("userSettings")
    window.location.href = "../index.html"
  }

  // Utility methods
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  showSuccess(message) {
    const toastr = window.toastr // Declare toastr variable
    if (typeof toastr !== "undefined") {
      toastr.success(message)
    } else {
      alert(message)
    }
  }

  showError(message) {
    const toastr = window.toastr // Declare toastr variable
    if (typeof toastr !== "undefined") {
      toastr.error(message)
    } else {
      alert(message)
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dashboardManager = new DashboardManager()
})
