// RegisterPage.js - User registration component for EcoGear
// This page allows new users to create an account

const RegisterPage = {
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
                  <h1>Create an Account</h1>
                </div>
                <div class="col-md-6">
                  <!-- Breadcrumb navigation -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb justify-content-md-end mb-0">
                      <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">Register</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Registration form section -->
          <section class="py-5">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                  <!-- Already registered message -->
                  <div v-if="isAuthenticated" class="alert alert-success text-center mb-4" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <span>You're already registered and logged in.</span>
                    <div class="mt-3">
                      <router-link to="/account" class="btn btn-eco-primary me-2">My Account</router-link>
                      <router-link to="/products" class="btn btn-outline-secondary">Continue Shopping</router-link>
                    </div>
                  </div>
                  
                  <!-- Registration success message -->
                  <div v-else-if="registrationSuccess" class="alert alert-success text-center mb-4" role="alert">
                    <i class="fas fa-check-circle fa-3x mb-3"></i>
                    <h4>Registration Successful!</h4>
                    <p>Your account has been created successfully. You are now logged in.</p>
                    <div class="mt-3">
                      <router-link to="/account" class="btn btn-eco-primary me-2">My Account</router-link>
                      <router-link to="/products" class="btn btn-outline-secondary">Continue Shopping</router-link>
                    </div>
                  </div>
                  
                  <!-- Registration form -->
                  <div v-else class="card shadow-sm">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">Personal Information</h5>
                    </div>
                    <div class="card-body">
                      <!-- Form errors alert -->
                      <div v-if="formErrors.length > 0" class="alert alert-danger" role="alert">
                        <ul class="mb-0 ps-3">
                          <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
                        </ul>
                      </div>
                      
                      <form @submit.prevent="submitRegistration" novalidate>
                        <!-- Name fields -->
                        <div class="row">
                          <div class="col-md-6 mb-3">
                            <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="firstName" v-model.trim="user.firstName"
                                   :class="{'is-invalid': validationErrors.firstName}"
                                   required autocomplete="given-name">
                            <div v-if="validationErrors.firstName" class="invalid-feedback">
                              {{ validationErrors.firstName }}
                            </div>
                          </div>
                          <div class="col-md-6 mb-3">
                            <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="lastName" v-model.trim="user.lastName"
                                   :class="{'is-invalid': validationErrors.lastName}" 
                                   required autocomplete="family-name">
                            <div v-if="validationErrors.lastName" class="invalid-feedback">
                              {{ validationErrors.lastName }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- Email field -->
                        <div class="mb-3">
                          <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                          <input type="email" class="form-control" id="email" v-model.trim="user.email"
                                 :class="{'is-invalid': validationErrors.email}"
                                 required autocomplete="email">
                          <div v-if="validationErrors.email" class="invalid-feedback">
                            {{ validationErrors.email }}
                          </div>
                          <div class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        
                        <!-- Phone field -->
                        <div class="mb-3">
                          <label for="phone" class="form-label">Phone Number</label>
                          <input type="tel" class="form-control" id="phone" v-model.trim="user.phone"
                                 :class="{'is-invalid': validationErrors.phone}"
                                 autocomplete="tel">
                          <div v-if="validationErrors.phone" class="invalid-feedback">
                            {{ validationErrors.phone }}
                          </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Address fields -->
                        <h5 class="mb-3">Shipping Address</h5>
                        
                        <div class="mb-3">
                          <label for="address" class="form-label">Street Address <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="address" v-model.trim="user.address"
                                 :class="{'is-invalid': validationErrors.address}"
                                 required autocomplete="street-address">
                          <div v-if="validationErrors.address" class="invalid-feedback">
                            {{ validationErrors.address }}
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label for="addressLine2" class="form-label">Apartment, Suite, etc. (optional)</label>
                          <input type="text" class="form-control" id="addressLine2" v-model.trim="user.addressLine2"
                                 autocomplete="address-line2">
                        </div>
                        
                        <div class="row">
                          <div class="col-md-6 mb-3">
                            <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="city" v-model.trim="user.city"
                                   :class="{'is-invalid': validationErrors.city}"
                                   required autocomplete="address-level2">
                            <div v-if="validationErrors.city" class="invalid-feedback">
                              {{ validationErrors.city }}
                            </div>
                          </div>
                          
                          <div class="col-md-4 mb-3">
                            <label for="state" class="form-label">State/Province <span class="text-danger">*</span></label>
                            <select class="form-select" id="state" v-model="user.state"
                                    :class="{'is-invalid': validationErrors.state}"
                                    required autocomplete="address-level1">
                              <option value="">Select...</option>
                              <option v-for="(state, code) in states" :key="code" :value="code">{{ state }}</option>
                            </select>
                            <div v-if="validationErrors.state" class="invalid-feedback">
                              {{ validationErrors.state }}
                            </div>
                          </div>
                          
                          <div class="col-md-2 mb-3">
                            <label for="zipCode" class="form-label">Zip <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="zipCode" v-model.trim="user.zipCode"
                                   :class="{'is-invalid': validationErrors.zipCode}"
                                   required autocomplete="postal-code">
                            <div v-if="validationErrors.zipCode" class="invalid-feedback">
                              {{ validationErrors.zipCode }}
                            </div>
                          </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Account credentials -->
                        <h5 class="mb-3">Account Credentials</h5>
                        
                        <div class="mb-3">
                          <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
                          <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                   id="password" v-model="user.password"
                                   :class="{'is-invalid': validationErrors.password}"
                                   required autocomplete="new-password"
                                   @input="checkPasswordStrength">
                            <button class="btn btn-outline-secondary" type="button" 
                                    @click="showPassword = !showPassword"
                                    :aria-label="showPassword ? 'Hide password' : 'Show password'">
                              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="validationErrors.password" class="invalid-feedback">
                              {{ validationErrors.password }}
                            </div>
                          </div>
                          
                          <!-- Password strength meter -->
                          <div class="mt-2">
                            <div class="d-flex justify-content-between mb-1">
                              <small>Password Strength</small>
                              <small>{{ passwordStrengthText }}</small>
                            </div>
                            <div class="progress" style="height: 6px;">
                              <div class="progress-bar password-strength-meter" 
                                   :class="passwordStrengthClass"
                                   :style="{ width: passwordStrength + '%' }"
                                   role="progressbar" 
                                   :aria-valuenow="passwordStrength" 
                                   aria-valuemin="0" 
                                   aria-valuemax="100"></div>
                            </div>
                            <ul class="list-unstyled mt-2 small">
                              <li :class="passwordCriteria.length ? 'text-success' : 'text-muted'">
                                <i :class="['fas', 'fa-' + (passwordCriteria.length ? 'check' : 'times'), 'me-1']"></i>
                                At least 8 characters
                              </li>
                              <li :class="passwordCriteria.uppercase ? 'text-success' : 'text-muted'">
                                <i :class="['fas', 'fa-' + (passwordCriteria.uppercase ? 'check' : 'times'), 'me-1']"></i>
                                At least one uppercase letter
                              </li>
                              <li :class="passwordCriteria.lowercase ? 'text-success' : 'text-muted'">
                                <i :class="['fas', 'fa-' + (passwordCriteria.lowercase ? 'check' : 'times'), 'me-1']"></i>
                                At least one lowercase letter
                              </li>
                              <li :class="passwordCriteria.number ? 'text-success' : 'text-muted'">
                                <i :class="['fas', 'fa-' + (passwordCriteria.number ? 'check' : 'times'), 'me-1']"></i>
                                At least one number
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label for="passwordConfirm" class="form-label">Confirm Password <span class="text-danger">*</span></label>
                          <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                 id="passwordConfirm" v-model="user.passwordConfirm"
                                 :class="{'is-invalid': validationErrors.passwordConfirm}"
                                 required autocomplete="new-password">
                          <div v-if="validationErrors.passwordConfirm" class="invalid-feedback">
                            {{ validationErrors.passwordConfirm }}
                          </div>
                        </div>
                        
                        <!-- Marketing preferences -->
                        <div class="mb-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="marketingEmails" 
                                   v-model="user.marketingEmails">
                            <label class="form-check-label" for="marketingEmails">
                              Send me updates on new products, special offers, and sustainability initiatives
                            </label>
                          </div>
                        </div>
                        
                        <!-- Terms agreement -->
                        <div class="mb-4">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="termsAgreement" 
                                   v-model="user.termsAgreement"
                                   :class="{'is-invalid': validationErrors.termsAgreement}">
                            <label class="form-check-label" for="termsAgreement">
                              I agree to the <a href="#" @click.prevent="showTerms">Terms of Service</a> and 
                              <a href="#" @click.prevent="showPrivacyPolicy">Privacy Policy</a>
                              <span class="text-danger">*</span>
                            </label>
                            <div v-if="validationErrors.termsAgreement" class="invalid-feedback">
                              {{ validationErrors.termsAgreement }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- Submit button -->
                        <div class="d-grid">
                          <button type="submit" class="btn btn-eco-primary" :disabled="isSubmitting">
                            <span v-if="isSubmitting">
                              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Creating Account...
                            </span>
                            <span v-else>Create Account</span>
                          </button>
                        </div>
                      </form>
                      
                      <!-- Login link -->
                      <div class="mt-3 text-center">
                        <p>Already have an account? 
                          <router-link to="/login">Sign in here</router-link>
                        </p>
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
        
        <!-- Terms Modal -->
        <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="termsModalLabel">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div v-if="modalContent === 'terms'">
                  <h5>Terms of Service</h5>
                  <p>This document outlines the terms of use for EcoGear's services. By using our website, you agree to these terms.</p>
                  
                  <h6>1. Account Responsibilities</h6>
                  <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                  
                  <h6>2. Product Information</h6>
                  <p>We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
                  
                  <h6>3. Shipping & Returns</h6>
                  <p>Please refer to our Shipping & Returns policy for information about shipping methods, delivery times, and return procedures.</p>
                  
                  <h6>4. User Conduct</h6>
                  <p>You agree not to use the site for any illegal or unauthorized purpose. You must not transmit worms, viruses, or any code of a destructive nature.</p>
                  
                  <h6>5. Modifications to Terms</h6>
                  <p>We reserve the right to modify these terms at any time. Your continued use of the site after such changes constitutes your acceptance of the new terms.</p>
                </div>
                
                <div v-if="modalContent === 'privacy'">
                  <h5>Privacy Policy</h5>
                  <p>At EcoGear, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
                  
                  <h6>1. Information Collection</h6>
                  <p>We collect information you provide when creating an account, placing an order, or signing up for our newsletter. This may include your name, email, phone number, and address.</p>
                  
                  <h6>2. Use of Information</h6>
                  <p>We use your information to process orders, personalize your experience, improve our website, and send periodic emails when you opt in to our marketing communications.</p>
                  
                  <h6>3. Information Protection</h6>
                  <p>We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</p>
                  
                  <h6>4. Cookies</h6>
                  <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and interactions.</p>
                  
                  <h6>5. Your Rights</h6>
                  <p>You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time.</p>
                </div>
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
        isSubmitting: false,
        registrationSuccess: false,
        formErrors: [],
        validationErrors: {},
        showPassword: false,
        passwordStrength: 0,
        passwordCriteria: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false
        },
        modalTitle: '',
        modalContent: '',
        user: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          password: '',
          passwordConfirm: '',
          marketingEmails: true,
          termsAgreement: false
        },
        states: {
          'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
          'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
          'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
          'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
          'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
          'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
          'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
          'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
          'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
          'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
          // Add territories and provinces for international customers
          'AS': 'American Samoa', 'DC': 'District of Columbia', 'FM': 'Federated States of Micronesia',
          'GU': 'Guam', 'MH': 'Marshall Islands', 'MP': 'Northern Mariana Islands', 'PW': 'Palau',
          'PR': 'Puerto Rico', 'VI': 'Virgin Islands',
          // Canadian provinces
          'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
          'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia', 'NT': 'Northwest Territories',
          'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
          'SK': 'Saskatchewan', 'YT': 'Yukon'
        },
        termsModal: null
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
      },
      
      // Password strength text based on score
      passwordStrengthText() {
        if (this.passwordStrength <= 0) return 'None';
        if (this.passwordStrength < 25) return 'Weak';
        if (this.passwordStrength < 50) return 'Fair';
        if (this.passwordStrength < 75) return 'Good';
        return 'Strong';
      },
      
      // Password strength class for color coding
      passwordStrengthClass() {
        if (this.passwordStrength <= 0) return '';
        if (this.passwordStrength < 25) return 'bg-danger';
        if (this.passwordStrength < 50) return 'bg-warning';
        if (this.passwordStrength < 75) return 'bg-info';
        return 'bg-success';
      }
    },
    
    mounted() {
      // Initialize the terms modal
      this.termsModal = new bootstrap.Modal(document.getElementById('termsModal'));
    },
    
    methods: {
      // Validate the registration form
      validateForm() {
        this.formErrors = [];
        this.validationErrors = {};
        let isValid = true;
        
        // First name validation
        if (!this.user.firstName.trim()) {
          this.validationErrors.firstName = 'First name is required';
          isValid = false;
        }
        
        // Last name validation
        if (!this.user.lastName.trim()) {
          this.validationErrors.lastName = 'Last name is required';
          isValid = false;
        }
        
        // Email validation
        if (!this.user.email.trim()) {
          this.validationErrors.email = 'Email address is required';
          isValid = false;
        } else if (!this.isValidEmail(this.user.email)) {
          this.validationErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Phone validation (optional but validate format if provided)
        if (this.user.phone.trim() && !this.isValidPhone(this.user.phone)) {
          this.validationErrors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
        
        // Address validation
        if (!this.user.address.trim()) {
          this.validationErrors.address = 'Street address is required';
          isValid = false;
        }
        
        // City validation
        if (!this.user.city.trim()) {
          this.validationErrors.city = 'City is required';
          isValid = false;
        }
        
        // State validation
        if (!this.user.state) {
          this.validationErrors.state = 'Please select a state or province';
          isValid = false;
        }
        
        // Zip code validation
        if (!this.user.zipCode.trim()) {
          this.validationErrors.zipCode = 'Zip code is required';
          isValid = false;
        } else if (!this.isValidZipCode(this.user.zipCode)) {
          this.validationErrors.zipCode = 'Please enter a valid zip code';
          isValid = false;
        }
        
        // Password validation
        if (!this.user.password) {
          this.validationErrors.password = 'Password is required';
          isValid = false;
        } else if (this.passwordStrength < 50) {
          this.validationErrors.password = 'Please choose a stronger password';
          isValid = false;
        }
        
        // Password confirmation validation
        if (!this.user.passwordConfirm) {
          this.validationErrors.passwordConfirm = 'Please confirm your password';
          isValid = false;
        } else if (this.user.password !== this.user.passwordConfirm) {
          this.validationErrors.passwordConfirm = 'Passwords do not match';
          isValid = false;
        }
        
        // Terms agreement validation
        if (!this.user.termsAgreement) {
          this.validationErrors.termsAgreement = 'You must agree to the Terms of Service and Privacy Policy';
          isValid = false;
        }
        
        // Aggregate all validation errors for the alert
        for (const key in this.validationErrors) {
          this.formErrors.push(this.validationErrors[key]);
        }
        
        return isValid;
      },
      
      // Check password strength as user types
      checkPasswordStrength() {
        const password = this.user.password;
        
        // Reset criteria
        this.passwordCriteria = {
          length: password.length >= 8,
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
          number: /[0-9]/.test(password)
        };
        
        // Calculate strength percentage
        const criteriaCount = Object.values(this.passwordCriteria).filter(Boolean).length;
        this.passwordStrength = (criteriaCount / 4) * 100;
      },
      
      // Submit registration form
      async submitRegistration() {
        // Validate form first
        if (!this.validateForm()) {
          // Scroll to the first error
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        this.isSubmitting = true;
        
        try {
          // In a real application, you would send this data to your backend API
          // For this prototype, we'll use the store's register method
          
          // Create a user object with the form data
          const userData = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phone: this.user.phone,
            address: {
              street: this.user.address,
              line2: this.user.addressLine2,
              city: this.user.city,
              state: this.user.state,
              zipCode: this.user.zipCode
            },
            marketingEmails: this.user.marketingEmails,
            createdAt: new Date().toISOString()
          };
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Register the user
          const success = store.methods.register(userData, this.user.password);
          
          if (success) {
            this.registrationSuccess = true;
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            this.formErrors.push('Registration failed. Please try again.');
          }
        } catch (error) {
          console.error('Registration error:', error);
          this.formErrors.push('An error occurred during registration. Please try again.');
        } finally {
          this.isSubmitting = false;
        }
      },
      
      // Show terms modal
      showTerms() {
        this.modalTitle = 'Terms of Service';
        this.modalContent = 'terms';
        this.termsModal.show();
      },
      
      // Show privacy policy modal
      showPrivacyPolicy() {
        this.modalTitle = 'Privacy Policy';
        this.modalContent = 'privacy';
        this.termsModal.show();
      },
      
      // Validation helpers
      isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      
      isValidPhone(phone) {
        // Basic phone validation - allows various formats
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
      },
      
      isValidZipCode(zipCode) {
        // Validates US and Canadian postal codes
        const usZip = /^\d{5}(-\d{4})?$/;
        const caZip = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        return usZip.test(zipCode) || caZip.test(zipCode);
      }
    }
  };