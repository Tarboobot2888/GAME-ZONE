// Recharge page functionality
class RechargeManager {
  constructor() {
    this.selectedGame = null
    this.selectedPackage = null
    this.selectedPaymentMethod = null
    this.games = []
    this.packages = {}
    this.init()
  }

  init() {
    this.loadGames()
    this.setupEventListeners()
    this.checkSelectedGame()
    this.setupFormValidation()
  }

  setupEventListeners() {
    // Form submission
    document.getElementById("submitOrder")?.addEventListener("click", (e) => {
      e.preventDefault()
      this.submitOrder()
    })

    // Payment method selection
    document.querySelectorAll(".payment-method").forEach((method) => {
      method.addEventListener("click", () => {
        this.selectPaymentMethod(method.dataset.method)
      })
    })
  }

  async loadGames() {
    const gamesGrid = document.getElementById("gamesGrid")
    if (!gamesGrid) return

    try {
      // Simulate API call
      await this.delay(500)

      this.games = [
        {
          id: 1,
          title: "PES Mobile",
          description: "شحن عملات PES Mobile",
          image: "../../assets/images/pes-mobile.jpg",
          category: "sports",
        },
        {
          id: 2,
          title: "FIFA Mobile",
          description: "شحن نقاط FIFA Mobile",
          image: "../../assets/images/fifa-mobile.jpg",
          category: "sports",
        },
        {
          id: 3,
          title: "PUBG Mobile",
          description: "شحن UC PUBG Mobile",
          image: "../../assets/images/pubg-mobile.jpg",
          category: "battle-royale",
        },
        {
          id: 4,
          title: "Free Fire",
          description: "شحن جواهر Free Fire",
          image: "../../assets/images/free-fire.jpg",
          category: "battle-royale",
        },
        {
          id: 5,
          title: "Call of Duty Mobile",
          description: "شحن CP Call of Duty",
          image: "../../assets/images/cod-mobile.jpg",
          category: "fps",
        },
        {
          id: 6,
          title: "Mobile Legends",
          description: "شحن جواهر Mobile Legends",
          image: "../../assets/images/ml-mobile.jpg",
          category: "moba",
        },
      ]

      this.packages = {
        1: [
          // PES Mobile
          { id: 1, amount: "100 عملة", price: 5, bonus: null },
          { id: 2, amount: "500 عملة", price: 20, bonus: "+50 عملة مجاناً" },
          { id: 3, amount: "1000 عملة", price: 35, bonus: "+150 عملة مجاناً" },
          { id: 4, amount: "2500 عملة", price: 80, bonus: "+500 عملة مجاناً" },
        ],
        2: [
          // FIFA Mobile
          { id: 1, amount: "150 نقطة", price: 10, bonus: null },
          { id: 2, amount: "750 نقطة", price: 40, bonus: "+100 نقطة مجاناً" },
          { id: 3, amount: "1500 نقطة", price: 75, bonus: "+300 نقطة مجاناً" },
          { id: 4, amount: "4000 نقطة", price: 180, bonus: "+800 نقطة مجاناً" },
        ],
        3: [
          // PUBG Mobile
          { id: 1, amount: "60 UC", price: 15, bonus: null },
          { id: 2, amount: "325 UC", price: 70, bonus: "+25 UC مجاناً" },
          { id: 3, amount: "660 UC", price: 140, bonus: "+60 UC مجاناً" },
          { id: 4, amount: "1800 UC", price: 350, bonus: "+200 UC مجاناً" },
        ],
        4: [
          // Free Fire
          { id: 1, amount: "100 جوهرة", price: 8, bonus: null },
          { id: 2, amount: "520 جوهرة", price: 35, bonus: "+20 جوهرة مجاناً" },
          { id: 3, amount: "1080 جوهرة", price: 70, bonus: "+80 جوهرة مجاناً" },
          { id: 4, amount: "2200 جوهرة", price: 140, bonus: "+200 جوهرة مجاناً" },
        ],
        5: [
          // Call of Duty Mobile
          { id: 1, amount: "80 CP", price: 12, bonus: null },
          { id: 2, amount: "400 CP", price: 50, bonus: "+20 CP مجاناً" },
          { id: 3, amount: "800 CP", price: 95, bonus: "+80 CP مجاناً" },
          { id: 4, amount: "2000 CP", price: 220, bonus: "+200 CP مجاناً" },
        ],
        6: [
          // Mobile Legends
          { id: 1, amount: "86 جوهرة", price: 6, bonus: null },
          { id: 2, amount: "172 جوهرة", price: 12, bonus: "+14 جوهرة مجاناً" },
          { id: 3, amount: "514 جوهرة", price: 35, bonus: "+51 جوهرة مجاناً" },
          { id: 4, amount: "1050 جوهرة", price: 70, bonus: "+105 جوهرة مجاناً" },
        ],
      }

      this.renderGames()
    } catch (error) {
      console.error("Error loading games:", error)
      this.showError("حدث خطأ في تحميل الألعاب")
    }
  }

  renderGames() {
    const gamesGrid = document.getElementById("gamesGrid")
    if (!gamesGrid) return

    gamesGrid.innerHTML = ""

    this.games.forEach((game) => {
      const gameCard = document.createElement("div")
      gameCard.className = "game-card-small"
      gameCard.dataset.gameId = game.id

      gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}" 
                     onerror="this.src='../../assets/images/placeholder-game.jpg'">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-price">من ${this.getMinPrice(game.id)} ريال</p>
                </div>
            `

      gameCard.addEventListener("click", () => {
        this.selectGame(game)
      })

      gamesGrid.appendChild(gameCard)
    })
  }

  getMinPrice(gameId) {
    const packages = this.packages[gameId]
    if (!packages || packages.length === 0) return 0
    return Math.min(...packages.map((p) => p.price))
  }

  selectGame(game) {
    this.selectedGame = game

    // Update UI
    document.querySelectorAll(".game-card-small").forEach((card) => {
      card.classList.remove("selected")
    })
    document.querySelector(`[data-game-id="${game.id}"]`).classList.add("selected")

    // Show selected game section
    this.showSelectedGame(game)

    // Load packages
    this.loadPackages(game.id)

    // Show recharge form
    document.getElementById("rechargeForm").classList.remove("hidden")

    // Update summary
    this.updateSummary()
  }

  showSelectedGame(game) {
    const selectedGameSection = document.getElementById("selectedGameSection")
    const selectedGameImage = document.getElementById("selectedGameImage")
    const selectedGameTitle = document.getElementById("selectedGameTitle")
    const selectedGameDescription = document.getElementById("selectedGameDescription")

    selectedGameImage.src = game.image
    selectedGameImage.alt = game.title
    selectedGameTitle.textContent = game.title
    selectedGameDescription.textContent = game.description

    selectedGameSection.classList.remove("hidden")
  }

  loadPackages(gameId) {
    const packagesGrid = document.getElementById("packagesGrid")
    if (!packagesGrid) return

    const packages = this.packages[gameId] || []
    packagesGrid.innerHTML = ""

    packages.forEach((pkg) => {
      const packageCard = document.createElement("div")
      packageCard.className = "package-card"
      packageCard.dataset.packageId = pkg.id
      packageCard.dataset.price = pkg.price

      packageCard.innerHTML = `
                <div class="package-amount">${pkg.amount}</div>
                <div class="package-price">${pkg.price} ريال</div>
                ${pkg.bonus ? `<div class="package-bonus">${pkg.bonus}</div>` : ""}
            `

      packageCard.addEventListener("click", () => {
        this.selectPackage(pkg)
      })

      packagesGrid.appendChild(packageCard)
    })
  }

  selectPackage(pkg) {
    this.selectedPackage = pkg

    // Update UI
    document.querySelectorAll(".package-card").forEach((card) => {
      card.classList.remove("selected")
    })
    document.querySelector(`[data-package-id="${pkg.id}"]`).classList.add("selected")

    // Update summary
    this.updateSummary()
  }

  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method

    // Update UI
    document.querySelectorAll(".payment-method").forEach((methodEl) => {
      methodEl.classList.remove("selected")
    })
    document.querySelector(`[data-method="${method}"]`).classList.add("selected")
  }

  updateSummary() {
    const summaryGame = document.getElementById("summaryGame")
    const summaryPackage = document.getElementById("summaryPackage")
    const summaryPrice = document.getElementById("summaryPrice")
    const summaryTax = document.getElementById("summaryTax")
    const summaryTotal = document.getElementById("summaryTotal")

    if (this.selectedGame) {
      summaryGame.textContent = this.selectedGame.title
    }

    if (this.selectedPackage) {
      summaryPackage.textContent = this.selectedPackage.amount
      summaryPrice.textContent = `${this.selectedPackage.price} ريال`

      const tax = this.selectedPackage.price * 0.15
      const total = this.selectedPackage.price + tax

      summaryTax.textContent = `${tax.toFixed(2)} ريال`
      summaryTotal.textContent = `${total.toFixed(2)} ريال`
    }
  }

  setupFormValidation() {
    const form = document.getElementById("rechargeForm")
    const inputs = form?.querySelectorAll("input[required]")

    inputs?.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("input", () => {
        this.clearFieldError(input)
      })
    })
  }

  validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    if (!value) {
      isValid = false
      errorMessage = "هذا الحقل مطلوب"
    } else {
      switch (field.type) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            isValid = false
            errorMessage = "يرجى إدخال بريد إلكتروني صحيح"
          }
          break
        case "tel":
          const phoneRegex = /^[0-9+\-\s()]+$/
          if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false
            errorMessage = "يرجى إدخال رقم هاتف صحيح"
          }
          break
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage)
    } else {
      this.clearFieldError(field)
    }

    return isValid
  }

  showFieldError(field, message) {
    this.clearFieldError(field)

    field.style.borderColor = "#ff6b35"

    const errorDiv = document.createElement("div")
    errorDiv.className = "field-error"
    errorDiv.style.color = "#ff6b35"
    errorDiv.style.fontSize = "0.9rem"
    errorDiv.style.marginTop = "0.5rem"
    errorDiv.textContent = message

    field.parentNode.appendChild(errorDiv)
  }

  clearFieldError(field) {
    field.style.borderColor = "rgba(255, 255, 255, 0.1)"

    const errorDiv = field.parentNode.querySelector(".field-error")
    if (errorDiv) {
      errorDiv.remove()
    }
  }

  async submitOrder() {
    if (!this.validateForm()) {
      return
    }

    const submitBtn = document.getElementById("submitOrder")
    const btnText = submitBtn.querySelector(".btn-text")
    const btnLoading = submitBtn.querySelector(".btn-loading")

    // Show loading state
    btnText.classList.add("hidden")
    btnLoading.classList.remove("hidden")
    submitBtn.disabled = true

    try {
      // Collect form data
      const orderData = {
        game: this.selectedGame,
        package: this.selectedPackage,
        paymentMethod: this.selectedPaymentMethod,
        playerId: document.getElementById("playerId").value,
        playerName: document.getElementById("playerName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        timestamp: new Date().toISOString(),
      }

      // Simulate API call
      await this.delay(2000)

      // Generate order number
      const orderNumber = "GZ" + Date.now().toString().slice(-8)
      const total = (this.selectedPackage.price * 1.15).toFixed(2)

      // Show success modal
      this.showSuccessModal(orderNumber, total)

      // Save order to localStorage (in real app, this would be saved to database)
      this.saveOrder(orderNumber, orderData, total)
    } catch (error) {
      console.error("Error submitting order:", error)
      this.showError("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      // Reset button state
      btnText.classList.remove("hidden")
      btnLoading.classList.add("hidden")
      submitBtn.disabled = false
    }
  }

  validateForm() {
    if (!this.selectedGame) {
      this.showError("يرجى اختيار لعبة")
      return false
    }

    if (!this.selectedPackage) {
      this.showError("يرجى اختيار باقة")
      return false
    }

    if (!this.selectedPaymentMethod) {
      this.showError("يرجى اختيار طريقة الدفع")
      return false
    }

    const requiredFields = ["playerId", "email", "phone"]
    let isValid = true

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (!this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  showSuccessModal(orderNumber, total) {
    const modal = document.getElementById("successModal")
    document.getElementById("orderNumber").textContent = orderNumber
    document.getElementById("paidAmount").textContent = `${total} ريال`

    modal.style.display = "block"
  }

  saveOrder(orderNumber, orderData, total) {
    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]")

    const order = {
      orderNumber,
      ...orderData,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)
    localStorage.setItem("userOrders", JSON.stringify(orders))
  }

  checkSelectedGame() {
    const selectedGameData = localStorage.getItem("selectedGame")
    if (selectedGameData) {
      const game = JSON.parse(selectedGameData)
      // Wait for games to load, then select the game
      setTimeout(() => {
        this.selectGame(game)
      }, 1000)
      localStorage.removeItem("selectedGame")
    }
  }

  // Utility methods
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  showSuccess(message) {
    alert(message)
  }

  showError(message) {
    alert(message)
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.rechargeManager = new RechargeManager()
})
