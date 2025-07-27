// Firebase Configuration and Authentication
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { toastr } from "toastr" // Declare toastr variable

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvy-5ypgeuAPomgI_PqMfuUIC3Ywt0OUM",
  authDomain: "game-9bef3.firebaseapp.com",
  projectId: "game-9bef3",
  storageBucket: "game-9bef3.appspot.com",
  messagingSenderId: "753671705405",
  appId: "1:753671705405:web:45f42b2843bae488a2ab54",
  measurementId: "G-6TY6YEZHV6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

// Configure providers
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("profile")
googleProvider.addScope("email")

const githubProvider = new GithubAuthProvider()
githubProvider.addScope("user:email")

// Firebase Authentication Class
class FirebaseAuth {
  constructor() {
    this.auth = auth
    this.currentUser = null
    this.setupAuthStateListener()
  }

  // Setup authentication state listener
  setupAuthStateListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user
      this.handleAuthStateChange(user)
    })
  }

  // Handle authentication state changes
  handleAuthStateChange(user) {
    if (user) {
      // User is signed in
      const userData = {
        uid: user.uid,
        displayName: user.displayName || "مستخدم",
        email: user.email,
        photoURL: user.photoURL || "https://via.placeholder.com/40",
        emailVerified: user.emailVerified,
        provider: this.getProvider(user.providerData[0]?.providerId),
      }

      // Update UI
      this.updateAuthUI(userData)

      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(userData))

      // Send to backend for user creation/update
      this.syncUserWithBackend(userData)
    } else {
      // User is signed out
      this.updateAuthUI(null)
      localStorage.removeItem("currentUser")
    }
  }

  // Get provider name
  getProvider(providerId) {
    const providers = {
      "google.com": "google",
      "github.com": "github",
      password: "email",
    }
    return providers[providerId] || "unknown"
  }

  // Update authentication UI
  updateAuthUI(user) {
    const loginBtn = document.getElementById("loginBtn")
    const userMenu = document.getElementById("userMenu")
    const userName = document.getElementById("userName")
    const userAvatar = document.getElementById("userAvatar")

    if (user) {
      if (loginBtn) loginBtn.classList.add("hidden")
      if (userMenu) userMenu.classList.remove("hidden")
      if (userName) userName.textContent = user.displayName
      if (userAvatar) userAvatar.src = user.photoURL
    } else {
      if (loginBtn) loginBtn.classList.remove("hidden")
      if (userMenu) userMenu.classList.add("hidden")
    }
  }

  // Sync user with backend
  async syncUserWithBackend(userData) {
    try {
      const response = await fetch("/backend/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        console.warn("Failed to sync user with backend")
      }
    } catch (error) {
      console.error("Error syncing user with backend:", error)
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, googleProvider)
      const user = result.user

      this.showSuccess(`مرحباً ${user.displayName}!`)
      return user
    } catch (error) {
      console.error("Google sign-in error:", error)
      this.handleAuthError(error)
      throw error
    }
  }

  // Sign in with GitHub
  async signInWithGithub() {
    try {
      const result = await signInWithPopup(this.auth, githubProvider)
      const user = result.user

      this.showSuccess(`مرحباً ${user.displayName || "مستخدم GitHub"}!`)
      return user
    } catch (error) {
      console.error("GitHub sign-in error:", error)
      this.handleAuthError(error)
      throw error
    }
  }

  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password)
      const user = result.user

      this.showSuccess(`مرحباً ${user.displayName || "مستخدم"}!`)
      return user
    } catch (error) {
      console.error("Email sign-in error:", error)
      this.handleAuthError(error)
      throw error
    }
  }

  // Create account with email and password
  async createAccountWithEmail(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password)
      const user = result.user

      // Update profile with display name
      await updateProfile(user, {
        displayName: displayName,
      })

      this.showSuccess("تم إنشاء الحساب بنجاح!")
      return user
    } catch (error) {
      console.error("Account creation error:", error)
      this.handleAuthError(error)
      throw error
    }
  }

  // Sign in as guest
  async signInAsGuest() {
    try {
      const result = await signInAnonymously(this.auth)
      const user = result.user

      this.showSuccess("تم الدخول كضيف")
      return user
    } catch (error) {
      console.error("Guest sign-in error:", error)
      this.showError("حدث خطأ في تسجيل الدخول")
      throw error
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth)
      this.showSuccess("تم تسجيل الخروج بنجاح")
    } catch (error) {
      console.error("Sign-out error:", error)
      this.showError("حدث خطأ في تسجيل الخروج")
      throw error
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null
  }

  // Get user token
  async getUserToken() {
    if (this.currentUser) {
      try {
        return await this.currentUser.getIdToken()
      } catch (error) {
        console.error("Error getting user token:", error)
        return null
      }
    }
    return null
  }

  // Handle authentication errors
  handleAuthError(error) {
    let message = "حدث خطأ في المصادقة"

    switch (error.code) {
      case "auth/user-not-found":
        message = "المستخدم غير موجود"
        break
      case "auth/wrong-password":
        message = "كلمة المرور غير صحيحة"
        break
      case "auth/email-already-in-use":
        message = "البريد الإلكتروني مستخدم بالفعل"
        break
      case "auth/weak-password":
        message = "كلمة المرور ضعيفة"
        break
      case "auth/invalid-email":
        message = "البريد الإلكتروني غير صحيح"
        break
      case "auth/popup-closed-by-user":
        message = "تم إغلاق نافذة تسجيل الدخول"
        break
      case "auth/cancelled-popup-request":
        message = "تم إلغاء طلب تسجيل الدخول"
        break
      case "auth/network-request-failed":
        message = "فشل في الاتصال بالشبكة"
        break
      default:
        message = error.message || "حدث خطأ غير متوقع"
        break
    }

    this.showError(message)
  }

  // Show success message
  showSuccess(message) {
    if (typeof toastr !== "undefined") {
      toastr.success(message)
    } else {
      console.log("Success:", message)
    }
  }

  // Show error message
  showError(message) {
    if (typeof toastr !== "undefined") {
      toastr.error(message)
    } else {
      console.error("Error:", message)
    }
  }
}

// Initialize Firebase Auth
const firebaseAuth = new FirebaseAuth()

// Export for use in other files
window.firebaseAuth = firebaseAuth

// Setup authentication event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Google login
  const googleLoginBtn = document.getElementById("googleLogin")
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      try {
        await firebaseAuth.signInWithGoogle()
        // Close modal
        const modal = document.getElementById("loginModal")
        if (modal) modal.style.display = "none"
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }

  // GitHub login
  const githubLoginBtn = document.getElementById("githubLogin")
  if (githubLoginBtn) {
    githubLoginBtn.addEventListener("click", async () => {
      try {
        await firebaseAuth.signInWithGithub()
        // Close modal
        const modal = document.getElementById("loginModal")
        if (modal) modal.style.display = "none"
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }

  // Email login
  const emailLoginBtn = document.getElementById("emailLogin")
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", () => {
      // Show email/password form
      showEmailLoginForm()
    })
  }

  // Guest login
  const guestLoginBtn = document.getElementById("guestLogin")
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", async () => {
      try {
        await firebaseAuth.signInAsGuest()
        // Close modal
        const modal = document.getElementById("loginModal")
        if (modal) modal.style.display = "none"
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      try {
        await firebaseAuth.signOut()
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }
})

// Show email login form
function showEmailLoginForm() {
  const modal = document.getElementById("loginModal")
  const modalContent = modal.querySelector(".modal-content")

  modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>تسجيل الدخول بالإيميل</h2>
        <form id="emailLoginForm">
            <div class="form-group">
                <input type="email" id="loginEmail" placeholder="البريد الإلكتروني" required>
            </div>
            <div class="form-group">
                <input type="password" id="loginPassword" placeholder="كلمة المرور" required>
            </div>
            <button type="submit" class="btn btn-primary">تسجيل الدخول</button>
            <button type="button" class="btn btn-outline" id="showRegisterForm">إنشاء حساب جديد</button>
            <button type="button" class="btn btn-outline" id="backToOptions">العودة</button>
        </form>
    `

  // Setup form event listeners
  setupEmailFormListeners()
}

// Show registration form
function showRegistrationForm() {
  const modal = document.getElementById("loginModal")
  const modalContent = modal.querySelector(".modal-content")

  modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>إنشاء حساب جديد</h2>
        <form id="registerForm">
            <div class="form-group">
                <input type="text" id="registerName" placeholder="الاسم الكامل" required>
            </div>
            <div class="form-group">
                <input type="email" id="registerEmail" placeholder="البريد الإلكتروني" required>
            </div>
            <div class="form-group">
                <input type="password" id="registerPassword" placeholder="كلمة المرور" required>
            </div>
            <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="تأكيد كلمة المرور" required>
            </div>
            <button type="submit" class="btn btn-primary">إنشاء الحساب</button>
            <button type="button" class="btn btn-outline" id="showLoginForm">لديك حساب؟ سجل دخول</button>
            <button type="button" class="btn btn-outline" id="backToOptions">العودة</button>
        </form>
    `

  // Setup form event listeners
  setupEmailFormListeners()
}

// Setup email form event listeners
function setupEmailFormListeners() {
  // Close button
  const closeBtn = document.querySelector(".close")
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("loginModal").style.display = "none"
    })
  }

  // Email login form
  const emailLoginForm = document.getElementById("emailLoginForm")
  if (emailLoginForm) {
    emailLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value

      try {
        await firebaseAuth.signInWithEmail(email, password)
        document.getElementById("loginModal").style.display = "none"
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }

  // Registration form
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const name = document.getElementById("registerName").value
      const email = document.getElementById("registerEmail").value
      const password = document.getElementById("registerPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value

      if (password !== confirmPassword) {
        firebaseAuth.showError("كلمات المرور غير متطابقة")
        return
      }

      try {
        await firebaseAuth.createAccountWithEmail(email, password, name)
        document.getElementById("loginModal").style.display = "none"
      } catch (error) {
        // Error is already handled in the method
      }
    })
  }

  // Show register form button
  const showRegisterBtn = document.getElementById("showRegisterForm")
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", showRegistrationForm)
  }

  // Show login form button
  const showLoginBtn = document.getElementById("showLoginForm")
  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", showEmailLoginForm)
  }

  // Back to options buttons
  const backBtns = document.querySelectorAll("#backToOptions")
  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      location.reload() // Simple way to reset the modal
    })
  })
}

export { firebaseAuth, auth, app }
