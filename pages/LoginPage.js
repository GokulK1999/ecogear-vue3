// LoginPage.js - User login component for EcoGear
// This page allows users to sign in to their existing accounts

const LoginPage = {
    template: `
      <div>
        <!-- Main navigation -->
        <navbar></navbar>
        
        <!-- Skip link target for accessibility -->
        <main id="main-content">
          <!-- Page header -->
          <section class="bg-light py-4">
            <div class="container">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <h1>Sign In</h1>
                </div>
                <div class="col-md-6">
                  <!-- Breadcrumb navigation -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb justify-content-md-end mb-0">
                      <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">Sign In</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Login form section -->
          <section class="py-5">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-8 col-lg-5">
                  <!-- Already logged in message -->
                  <div v-if="isAuthenticated" class="alert alert-success text-center mb-4" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <span>You're already signed in.</span>
                    <div class="mt-3">
                      <router-link to="/account" class="btn btn-eco-primary me-2">My Account</router-link>
                      <router-link to="/products" class="btn btn-outline-secondary">Continue Shopping</router-link>
                    </div>
                  </div>
                  
                  <!-- Login form -->
                  <div v-else class="card shadow-sm">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">Sign In to Your Account</h5>
                    </div>
                    <div class="card-body">
                      <!-- Login error alert -->
                      <div v-if="loginError" class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        {{ loginError }}
                      </div>
                      
                      <form @submit.prevent="submitLogin" novalidate>
                        <!-- Email field -->
                        <div class="mb-3">
                          <label for="email" class="form-label">Email Address</label>
                          <input type="email" class="form-control" id="email" v-model.trim="email"
                                 :class="{'is-invalid': emailError}"
                                 required autocomplete="email">
                          <div v-if="emailError" class="invalid-feedback">
                            {{ emailError }}
                          </div>
                        </div>
                        
                        <!-- Password field -->
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                   id="password" v-model="password"
                                   :class="{'is-invalid': passwordError}"
                                   required autocomplete="current-password">
                            <button class="btn btn-outline-secondary" type="button" 
                                    @click="showPassword = !showPassword"
                                    :aria-label="showPassword ? 'Hide password' : 'Show password'">
                              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="passwordError" class="invalid-feedback">
                              {{ passwordError }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- Remember me and forgot password -->
                        <div class="d-flex justify-content-between mb-3">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe">
                            <label class="form-check-label" for="rememberMe">
                              Remember me
                            </label>
                          </div>
                          <a href="#" @click.prevent="showForgotPasswordModal">Forgot Password?</a>
                        </div>
                        
                        <!-- Submit button -->
                        <div class="d-grid">
                          <button type="submit" class="btn btn-eco-primary" :disabled="isLoggingIn">
                            <span v-if="isLoggingIn">
                              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Signing In...
                            </span>
                            <span v-else>Sign In</span>
                          </button>
                        </div>
                      </form>
                      
                      <!-- Registration link -->
                      <div class="mt-4 text-center">
                        <p>Don't have an account? 
                          <router-link to="/register">Create one here</router-link>
                        </p>
                      </div>
                      
                      <!-- Divider -->
                      <div class="my-4 d-flex align-items-center">
                        <div class="flex-grow-1 border-bottom"></div>
                        <div class="mx-3 text-secondary small">or sign in with</div>
                        <div class="flex-grow-1 border-bottom"></div>
                      </div>
                      
                      <!-- Social login buttons -->
                      <div class="row g-2 mb-3">
                        <div class="col-sm-6">
                          <button type="button" class="btn btn-outline-secondary w-100" @click="socialLogin('google')">
                            <i class="fab fa-google me-2"></i>Google
                          </button>
                        </div>
                        <div class="col-sm-6">
                          <button type="button" class="btn btn-outline-secondary w-100" @click="socialLogin('facebook')">
                            <i class="fab fa-facebook-f me-2"></i>Facebook
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Guest checkout prompt -->
                  <div class="card shadow-sm mt-4">
                    <div class="card-body">
                      <div class="d-flex align-items-center">
                        <div>
                          <h5 class="mb-1">Continue as Guest</h5>
                          <p class="mb-0 text-muted small">No account required to complete your purchase</p>
                        </div>
                        <router-link to="/cart" class="btn btn-outline-success ms-auto">
                          Guest Checkout
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <!-- Footer -->
        <footer-component></footer-component>
        
        <!-- Forgot Password Modal -->
        <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" 
             aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="forgotPasswordModalLabel">Forgot Your Password</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Enter your email address and we'll send you instructions to reset your password.</p>
                
                <!-- Password reset form -->
                <form @submit.prevent="sendPasswordReset">
                  <div class="mb-3">
                    <label for="resetEmail" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="resetEmail" 
                           v-model.trim="resetEmail" required>
                  </div>
                  
                  <!-- Reset success/error messages -->
                  <div v-if="resetMessage" 
                       :class="['alert', resetSuccess ? 'alert-success' : 'alert-danger']" 
                       role="alert">
                    {{ resetMessage }}
                  </div>
                  
                  <div class="d-grid">
                    <button type="submit" class="btn btn-eco-primary" :disabled="isResetting">
                      <span v-if="isResetting">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </span>
                      <span v-else>Send Reset Instructions</span>
                    </button>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    
    data() {
      return {
        email: '',
        password: '',
        rememberMe: false,
        showPassword: false,
        isLoggingIn: false,
        loginError: '',
        emailError: '',
        passwordError: '',
        
        // Forgot password modal
        resetEmail: '',
        resetMessage: '',
        resetSuccess: false,
        isResetting: false,
        forgotPasswordModal: null
      };
    },
    
    components: {
      'navbar': Navbar,
      'footer-component': Footer
    },
    
    computed: {
      // Check if user is already authenticated
      isAuthenticated() {
        return store.state.isAuthenticated;
      }
    },
    
    mounted() {
      // Initialize the forgot password modal
      this.forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
      
      // Pre-fill email if coming from registration page
      if (this.$route.query.email) {
        this.email = this.$route.query.email;
      }
      
      // Check for redirect after login
      this.redirectTo = this.$route.query.redirect || '/account';
    },
    
    methods: {
      // Validate login form
      validateLogin() {
        let isValid = true;
        this.emailError = '';
        this.passwordError = '';
        this.loginError = '';
        
        // Email validation
        if (!this.email.trim()) {
          this.emailError = 'Email address is required';
          isValid = false;
        } else if (!this.isValidEmail(this.email)) {
          this.emailError = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Password validation
        if (!this.password) {
          this.passwordError = 'Password is required';
          isValid = false;
        }
        
        return isValid;
      },
      
      // Submit login form
      async submitLogin() {
        // Validate form first
        if (!this.validateLogin()) {
          return;
        }
        
        this.isLoggingIn = true;
        this.loginError = '';
        
        try {
          // In a real application, you would send credentials to your backend API
          // For this prototype, we'll use the store's login method
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Attempt login
          const success = store.methods.login(this.email, this.password);
          
          if (success) {
            // Redirect after successful login
            const redirect = this.$route.query.redirect || '/account';
            this.$router.push(redirect);
          } else {
            this.loginError = 'Invalid email or password. Please try again.';
          }
        } catch (error) {
          console.error('Login error:', error);
          this.loginError = 'An error occurred during sign in. Please try again.';
        } finally {
          this.isLoggingIn = false;
        }
      },
      
      // Show forgot password modal
      showForgotPasswordModal() {
        // Pre-fill the reset email with the login email if available
        if (this.email) {
          this.resetEmail = this.email;
        }
        
        // Reset state
        this.resetMessage = '';
        this.resetSuccess = false;
        
        // Show the modal
        this.forgotPasswordModal.show();
      },
      
      // Send password reset email
      async sendPasswordReset() {
        if (!this.resetEmail.trim() || !this.isValidEmail(this.resetEmail)) {
          this.resetMessage = 'Please enter a valid email address';
          this.resetSuccess = false;
          return;
        }
        
        this.isResetting = true;
        
        try {
          // In a real application, this would send a reset email
          // For this prototype, we'll just simulate it
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate success
          this.resetSuccess = true;
          this.resetMessage = 'Password reset instructions have been sent to your email address.';
          
          // In a real app, you'd check if the email exists in your database
          // and only show the success message if it does, for security reasons
        } catch (error) {
          console.error('Password reset error:', error);
          this.resetSuccess = false;
          this.resetMessage = 'An error occurred. Please try again.';
        } finally {
          this.isResetting = false;
        }
      },
      
      // Handle social login
      socialLogin(provider) {
        // In a real application, this would redirect to OAuth provider
        alert(`${provider} login would be implemented in a full application.`);
      },
      
      // Email validation helper
      isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
    }
  };