// Main JavaScript file for GameZone
class GameZone {
  constructor() {
    this.currentUser = null
    this.games = []
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.loadGames()
    this.setupAnimations()
    this.checkAuthState()
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        this.navigateToSection(link.getAttribute("href"))
      })
    })

    // Login modal
    const loginBtn = document.getElementById("loginBtn")
    const loginModal = document.getElementById("loginModal")
    const closeModal = document.querySelector(".close")

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        loginModal.style.display = "block"
      })
    }

    if (closeModal) {
      closeModal.addEventListener("click", () => {
        loginModal.style.display = "none"
      })
    }

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = "none"
      }
    })

    // Auth buttons
    document.getElementById("googleLogin")?.addEventListener("click", () => this.loginWithGoogle())
    document.getElementById("githubLogin")?.addEventListener("click", () => this.loginWithGithub())
    document.getElementById("emailLogin")?.addEventListener("click", () => this.loginWithEmail())
    document.getElementById("guestLogin")?.addEventListener("click", () => this.loginAsGuest())
    document.getElementById("logoutBtn")?.addEventListener("click", () => this.logout())

    // Smooth scrolling for hero buttons
    document.querySelectorAll(".hero-buttons .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.textContent.includes("ابدأ الآن")) {
          e.preventDefault()
          this.navigateToSection("#recharge")
        } else if (btn.textContent.includes("تصفح الألعاب")) {
          e.preventDefault()
          this.navigateToSection("#games")
        }
      })
    })
  }

  navigateToSection(target) {
    const element = document.querySelector(target)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })
    document.querySelector(`[href="${target}"]`)?.classList.add("active")
  }

  setupAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
        }
      })
    }, observerOptions)

    // Observe elements for animation
    document.querySelectorAll(".feature-card, .game-card").forEach((el) => {
      observer.observe(el)
    })

    // Logo hover animation
    const logoSvg = document.querySelector(".logo-svg")
    if (logoSvg) {
      logoSvg.addEventListener("mouseenter", () => {
        logoSvg.style.transform = "rotate(360deg) scale(1.1)"
      })

      logoSvg.addEventListener("mouseleave", () => {
        logoSvg.style.transform = "rotate(0deg) scale(1)"
      })
    }

    // Parallax effect for hero shapes
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const shapes = document.querySelectorAll(".shape")

      shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.1
        shape.style.transform = `translateY(${scrolled * speed}px)`
      })
    })
  }

  async loadGames() {
    const gamesGrid = document.getElementById("gamesGrid")
    if (!gamesGrid) return

    // Show loading skeletons
    this.showLoadingSkeletons(gamesGrid)

    try {
      // Simulate API call
      await this.delay(1500)

      const games = [
        {
          id: 1,
          title: "PES Mobile",
          description: "شحن عملات PES Mobile",
          price: "من 5 ريال",
          image: "../assets/images/pes-mobile.jpg",
          category: "sports",
        },
        {
          id: 2,
          title: "FIFA Mobile",
          description: "شحن نقاط FIFA Mobile",
          price: "من 10 ريال",
          image: "../assets/images/fifa-mobile.jpg",
          category: "sports",
        },
        {
          id: 3,
          title: "PUBG Mobile",
          description: "شحن UC PUBG Mobile",
          price: "من 15 ريال",
          image: "../assets/images/pubg-mobile.jpg",
          category: "battle-royale",
        },
        {
          id: 4,
          title: "Free Fire",
          description: "شحن جواهر Free Fire",
          price: "من 8 ريال",
          image: "../assets/images/free-fire.jpg",
          category: "battle-royale",
        },
        {
          id: 5,
          title: "Call of Duty Mobile",
          description: "شحن CP Call of Duty",
          price: "من 12 ريال",
          image: "../assets/images/cod-mobile.jpg",
          category: "fps",
        },
        {
          id: 6,
          title: "Mobile Legends",
          description: "شحن جواهر Mobile Legends",
          price: "من 6 ريال",
          image: "../assets/images/ml-mobile.jpg",
          category: "moba",
        },
      ]

      this.games = games
      this.renderGames(games)
    } catch (error) {
      console.error("Error loading games:", error)
      this.showError("حدث خطأ في تحميل الألعاب")
    }
  }

  showLoadingSkeletons(container) {
    container.innerHTML = ""
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div")
      skeleton.className = "game-card loading"
      skeleton.innerHTML = `
                <div class="game-image skeleton"></div>
                <div class="game-info">
                    <div class="game-title skeleton"></div>
                    <div class="game-description skeleton"></div>
                    <div class="game-price skeleton"></div>
                </div>
            `
      container.appendChild(skeleton)
    }
  }

  renderGames(games) {
    const gamesGrid = document.getElementById("gamesGrid")
    if (!gamesGrid) return

    gamesGrid.innerHTML = ""

    games.forEach((game, index) => {
      const gameCard = document.createElement("div")
      gameCard.className = "game-card slide-up"
      gameCard.style.animationDelay = `${index * 0.1}s`

      gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}" class="game-image" 
                     onerror="this.src='../assets/images/placeholder-game.jpg'">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-price">${game.price}</div>
                </div>
            `

      gameCard.addEventListener("click", () => {
        this.openGameDetails(game)
      })

      gamesGrid.appendChild(gameCard)
    })
  }

  openGameDetails(game) {
    // Navigate to recharge page with game data
    localStorage.setItem("selectedGame", JSON.stringify(game))
    window.location.href = "pages/recharge.html"
  }

  // Authentication methods
  async loginWithGoogle() {
    try {
      // This would integrate with Firebase Auth
      this.showSuccess("جاري تسجيل الدخول بـ Google...")
      // Simulate login
      await this.delay(1000)
      this.handleAuthSuccess({
        uid: "google_user_123",
        displayName: "مستخدم Google",
        email: "user@gmail.com",
        photoURL: "https://via.placeholder.com/40",
      })
    } catch (error) {
      this.showError("فشل في تسجيل الدخول بـ Google")
    }
  }

  async loginWithGithub() {
    try {
      this.showSuccess("جاري تسجيل الدخول بـ GitHub...")
      await this.delay(1000)
      this.handleAuthSuccess({
        uid: "github_user_123",
        displayName: "مستخدم GitHub",
        email: "user@github.com",
        photoURL: "https://via.placeholder.com/40",
      })
    } catch (error) {
      this.showError("فشل في تسجيل الدخول بـ GitHub")
    }
  }

  async loginWithEmail() {
    // This would show email/password form
    const email = prompt("البريد الإلكتروني:")
    const password = prompt("كلمة المرور:")

    if (email && password) {
      try {
        this.showSuccess("جاري تسجيل الدخول...")
        await this.delay(1000)
        this.handleAuthSuccess({
          uid: "email_user_123",
          displayName: "مستخدم",
          email: email,
          photoURL: "https://via.placeholder.com/40",
        })
      } catch (error) {
        this.showError("فشل في تسجيل الدخول")
      }
    }
  }

  async loginAsGuest() {
    try {
      this.showSuccess("جاري الدخول كضيف...")
      await this.delay(500)
      this.handleAuthSuccess({
        uid: "guest_user_123",
        displayName: "ضيف",
        email: null,
        photoURL: "https://via.placeholder.com/40",
      })
    } catch (error) {
      this.showError("فشل في الدخول كضيف")
    }
  }

  handleAuthSuccess(user) {
    this.currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Update UI
    document.getElementById("loginBtn").classList.add("hidden")
    const userMenu = document.getElementById("userMenu")
    userMenu.classList.remove("hidden")

    document.getElementById("userName").textContent = user.displayName
    document.getElementById("userAvatar").src = user.photoURL

    // Close modal
    document.getElementById("loginModal").style.display = "none"

    this.showSuccess(`مرحباً ${user.displayName}!`)
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")

    // Update UI
    document.getElementById("loginBtn").classList.remove("hidden")
    document.getElementById("userMenu").classList.add("hidden")

    this.showSuccess("تم تسجيل الخروج بنجاح")
  }

  checkAuthState() {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
      this.handleAuthSuccess(this.currentUser)
    }
  }

  // Utility methods
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  showSuccess(message) {
    if (window.toastr) {
      window.toastr.success(message)
    } else {
      alert(message)
    }
  }

  showError(message) {
    if (window.toastr) {
      window.toastr.error(message)
    } else {
      alert(message)
    }
  }

  showInfo(message) {
    if (window.toastr) {
      window.toastr.info(message)
    } else {
      alert(message)
    }
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Configure toastr
  if (window.toastr) {
    window.toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    }
  }

  // Initialize GameZone
  window.gameZone = new GameZone()
})

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameZone
}
