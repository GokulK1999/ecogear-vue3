// AccountPage.js - User account management component for EcoGear
// This page allows users to view and update their personal information

const AccountPage = {
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
                  <h1>My Account</h1>
                </div>
                <div class="col-md-6">
                  <!-- Breadcrumb navigation -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb justify-content-md-end mb-0">
                      <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">My Account</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <section class="py-5">
            <div class="container">
              <!-- Not logged in message -->
              <div v-if="!isAuthenticated" class="text-center py-5">
                <i class="fas fa-user-lock fa-4x text-muted mb-4"></i>
                <h2>Please sign in to access your account</h2>
                <p class="mb-4">You need to be logged in to view your account information.</p>
                <router-link to="/login" class="btn btn-eco-primary me-2">
                  Sign In
                </router-link>
                <router-link to="/register" class="btn btn-outline-secondary">
                  Create an Account
                </router-link>
              </div>
              
              <!-- Account page when user is logged in -->
              <div v-else class="row">
                <!-- Account navigation sidebar -->
                <div class="col-lg-3 mb-4 mb-lg-0">
                  <div class="list-group shadow-sm">
                    <button @click="activeSection = 'profile'" 
                            :class="['list-group-item list-group-item-action', 
                                     activeSection === 'profile' ? 'active' : '']">
                      <i class="fas fa-user me-2"></i>Profile
                    </button>
                    <button @click="activeSection = 'addresses'" 
                            :class="['list-group-item list-group-item-action', 
                                     activeSection === 'addresses' ? 'active' : '']">
                      <i class="fas fa-map-marker-alt me-2"></i>Addresses
                    </button>
                    <button @click="activeSection = 'orders'" 
                            :class="['list-group-item list-group-item-action', 
                                     activeSection === 'orders' ? 'active' : '']">
                      <i class="fas fa-shopping-bag me-2"></i>Order History
                    </button>
                    <button @click="activeSection = 'password'" 
                            :class="['list-group-item list-group-item-action', 
                                     activeSection === 'password' ? 'active' : '']">
                      <i class="fas fa-lock me-2"></i>Change Password
                    </button>
                    <button @click="activeSection = 'preferences'" 
                            :class="['list-group-item list-group-item-action', 
                                     activeSection === 'preferences' ? 'active' : '']">
                      <i class="fas fa-bell me-2"></i>Preferences
                    </button>
                    <button @click="confirmLogout" class="list-group-item list-group-item-action text-danger">
                      <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </div>
                </div>
                
                <!-- Account content area -->
                <div class="col-lg-9">
                  <!-- Profile information section -->
                  <div v-if="activeSection === 'profile'" class="card shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">Personal Information</h5>
                      <button class="btn btn-sm btn-outline-secondary" 
                              @click="editMode.profile = !editMode.profile">
                        <i :class="['fas', editMode.profile ? 'fa-times' : 'fa-edit']"></i>
                        {{ editMode.profile ? 'Cancel' : 'Edit' }}
                      </button>
                    </div>
                    <div class="card-body">
                      <!-- Update success message -->
                      <div v-if="updateSuccess" class="alert alert-success" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        Your profile has been updated successfully.
                      </div>
                      
                      <!-- View mode -->
                      <div v-if="!editMode.profile">
                        <div class="row mb-3">
                          <div class="col-md-4 fw-bold">Name</div>
                          <div class="col-md-8">{{ user.firstName }} {{ user.lastName }}</div>
                        </div>
                        <div class="row mb-3">
                          <div class="col-md-4 fw-bold">Email</div>
                          <div class="col-md-8">{{ user.email }}</div>
                        </div>
                        <div class="row mb-3">
                          <div class="col-md-4 fw-bold">Phone</div>
                          <div class="col-md-8">{{ user.phone || 'Not provided' }}</div>
                        </div>
                        <div class="row mb-3">
                          <div class="col-md-4 fw-bold">Member Since</div>
                          <div class="col-md-8">{{ formatDate(user.createdAt) }}</div>
                        </div>
                      </div>
                      
                      <!-- Edit mode -->
                      <form v-else @submit.prevent="updateProfile">
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label for="firstName" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="firstName" 
                                   v-model="editableProfile.firstName" required>
                          </div>
                          <div class="col-md-6">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="lastName" 
                                   v-model="editableProfile.lastName" required>
                          </div>
                          <div class="col-md-6">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="email" 
                                   v-model="editableProfile.email" required>
                          </div>
                          <div class="col-md-6">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" class="form-control" id="phone" 
                                   v-model="editableProfile.phone">
                          </div>
                          <div class="col-12 d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-outline-secondary" 
                                    @click="editMode.profile = false">
                              Cancel
                            </button>
                            <button type="submit" class="btn btn-eco-primary" :disabled="isUpdating">
                              <span v-if="isUpdating">
                                <span class="spinner-border spinner-border-sm me-2" 
                                      role="status" aria-hidden="true"></span>
                                Updating...
                              </span>
                              <span v-else>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <!-- Addresses section -->
                  <div v-if="activeSection === 'addresses'" class="card shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">Addresses</h5>
                      <button class="btn btn-sm btn-outline-secondary" 
                              @click="editMode.address = !editMode.address">
                        <i :class="['fas', editMode.address ? 'fa-times' : 'fa-edit']"></i>
                        {{ editMode.address ? 'Cancel' : 'Edit' }}
                      </button>
                    </div>
                    <div class="card-body">
                      <!-- View mode -->
                      <div v-if="!editMode.address">
                        <h6 class="mb-3">Shipping Address</h6>
                        <address>
                          {{ user.firstName }} {{ user.lastName }}<br>
                          {{ user.address?.street || 'No address provided' }}
                          <span v-if="user.address?.line2"><br>{{ user.address.line2 }}</span><br>
                          <span v-if="user.address?.city">
                            {{ user.address.city }}, {{ user.address.state }} {{ user.address.zipCode }}<br>
                          </span>
                        </address>
                      </div>
                      
                      <!-- Edit mode -->
                      <form v-else @submit.prevent="updateAddress">
                        <h6 class="mb-3">Shipping Address</h6>
                        <div class="row g-3">
                          <div class="col-12">
                            <label for="street" class="form-label">Street Address</label>
                            <input type="text" class="form-control" id="street" 
                                   v-model="editableAddress.street" required>
                          </div>
                          <div class="col-12">
                            <label for="line2" class="form-label">Apartment, Suite, etc. (optional)</label>
                            <input type="text" class="form-control" id="line2" 
                                   v-model="editableAddress.line2">
                          </div>
                          <div class="col-md-6">
                            <label for="city" class="form-label">City</label>
                            <input type="text" class="form-control" id="city" 
                                   v-model="editableAddress.city" required>
                          </div>
                          <div class="col-md-4">
                            <label for="state" class="form-label">State/Province</label>
                            <select class="form-select" id="state" v-model="editableAddress.state" required>
                              <option value="">Select...</option>
                              <option v-for="(state, code) in states" :key="code" :value="code">
                                {{ state }}
                              </option>
                            </select>
                          </div>
                          <div class="col-md-2">
                            <label for="zipCode" class="form-label">Zip Code</label>
                            <input type="text" class="form-control" id="zipCode" 
                                   v-model="editableAddress.zipCode" required>
                          </div>
                          <div class="col-12 d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-outline-secondary" 
                                    @click="editMode.address = false">
                              Cancel
                            </button>
                            <button type="submit" class="btn btn-eco-primary" :disabled="isUpdating">
                              <span v-if="isUpdating">
                                <span class="spinner-border spinner-border-sm me-2" 
                                      role="status" aria-hidden="true"></span>
                                Updating...
                              </span>
                              <span v-else>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <!-- Order history section -->
                  <div v-if="activeSection === 'orders'" class="card shadow-sm">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">Order History</h5>
                    </div>
                    <div class="card-body">
                      <!-- No orders message -->
                      <div v-if="purchases.length === 0" class="text-center py-4">
                        <i class="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
                        <h5>No orders yet</h5>
                        <p class="mb-3">You haven't placed any orders yet.</p>
                        <router-link to="/products" class="btn btn-eco-primary">
                          Start Shopping
                        </router-link>
                      </div>
                      
                      <!-- Order list -->
                      <div v-else>
                        <div class="table-responsive">
                          <table class="table table-hover order-table">
                            <thead>
                              <tr>
                                <th>Order #</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="order in purchases" :key="order.id">
                                <td>{{ order.id }}</td>
                                <td>{{ formatDate(order.date) }}</td>
                                <td>{{ order.items.length }}</td>
                                <td>{{ formatPrice(order.total) }}</td>
                                <td>
                                  <span class="badge"
                                        :class="getOrderStatusClass(order.status)">
                                    {{ capitalizeFirst(order.status) }}
                                  </span>
                                </td>
                                <td>
                                  <button class="btn btn-sm btn-outline-secondary"
                                          @click="viewOrderDetails(order)">
                                    Details
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Change password section -->
                  <div v-if="activeSection === 'password'" class="card shadow-sm">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">Change Password</h5>
                    </div>
                    <div class="card-body">
                      <!-- Password change success message -->
                      <div v-if="passwordChangeSuccess" class="alert alert-success" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        Your password has been updated successfully.
                      </div>
                      
                      <!-- Password change form -->
                      <form @submit.prevent="updatePassword">
                        <div class="mb-3">
                          <label for="currentPassword" class="form-label">Current Password</label>
                          <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                   id="currentPassword" v-model="passwordForm.current"
                                   :class="{'is-invalid': passwordErrors.current}"
                                   required>
                            <button class="btn btn-outline-secondary" type="button" 
                                    @click="showPassword = !showPassword">
                              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="passwordErrors.current" class="invalid-feedback">
                              {{ passwordErrors.current }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label for="newPassword" class="form-label">New Password</label>
                          <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                   id="newPassword" v-model="passwordForm.new"
                                   :class="{'is-invalid': passwordErrors.new}"
                                   @input="checkPasswordStrength"
                                   required>
                            <button class="btn btn-outline-secondary" type="button" 
                                    @click="showPassword = !showPassword">
                              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="passwordErrors.new" class="invalid-feedback">
                              {{ passwordErrors.new }}
                            </div>
                          </div>
                          
                          <!-- Password strength meter -->
                          <div class="mt-2">
                            <div class="d-flex justify-content-between mb-1">
                              <small>Password Strength</small>
                              <small>{{ passwordStrengthText }}</small>
                            </div>
                            <div class="progress" style="height: 5px;">
                              <div class="progress-bar" 
                                   :class="passwordStrengthClass"
                                   :style="{ width: passwordStrength + '%' }"
                                   role="progressbar" 
                                   :aria-valuenow="passwordStrength" 
                                   aria-valuemin="0" 
                                   aria-valuemax="100"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label for="confirmPassword" class="form-label">Confirm New Password</label>
                          <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" 
                                   id="confirmPassword" v-model="passwordForm.confirm"
                                   :class="{'is-invalid': passwordErrors.confirm}"
                                   required>
                            <button class="btn btn-outline-secondary" type="button" 
                                    @click="showPassword = !showPassword">
                              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="passwordErrors.confirm" class="invalid-feedback">
                              {{ passwordErrors.confirm }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                          <button type="submit" class="btn btn-eco-primary" :disabled="isUpdating">
                            <span v-if="isUpdating">
                              <span class="spinner-border spinner-border-sm me-2" 
                                    role="status" aria-hidden="true"></span>
                              Updating...
                            </span>
                            <span v-else>Update Password</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <!-- Preferences section -->
                  <div v-if="activeSection === 'preferences'" class="card shadow-sm">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">Notification Preferences</h5>
                    </div>
                    <div class="card-body">
                      <!-- Update success message -->
                      <div v-if="updateSuccess" class="alert alert-success" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        Your preferences have been updated successfully.
                      </div>
                      
                      <form @submit.prevent="updatePreferences">
                        <div class="mb-3">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="emailNotifications" 
                                   v-model="preferences.emailNotifications">
                            <label class="form-check-label" for="emailNotifications">
                              Email notifications for order updates
                            </label>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="marketingEmails" 
                                   v-model="preferences.marketingEmails">
                            <label class="form-check-label" for="marketingEmails">
                              Promotional emails about new products and offers
                            </label>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="newsletterSubscription" 
                                   v-model="preferences.newsletterSubscription">
                            <label class="form-check-label" for="newsletterSubscription">
                              Quarterly newsletter with sustainability tips
                            </label>
                          </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                          <button type="submit" class="btn btn-eco-primary" :disabled="isUpdating">
                            <span v-if="isUpdating">
                              <span class="spinner-border spinner-border-sm me-2" 
                                    role="status" aria-hidden="true"></span>
                              Updating...
                            </span>
                            <span v-else>Save Preferences</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <!-- Footer -->
        <footer-component></footer-component>
        
        <!-- Order Details Modal -->
        <div class="modal fade" id="orderDetailsModal" tabindex="-1" 
             aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="orderDetailsModalLabel">
                  Order Details: {{ selectedOrderId }}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" v-if="selectedOrder">
                <div class="d-flex justify-content-between mb-3">
                  <div>
                    <p class="mb-1"><strong>Order Date:</strong> {{ formatDate(selectedOrder.date) }}</p>
                    <p class="mb-1">
                      <strong>Status:</strong> 
                      <span class="badge" :class="getOrderStatusClass(selectedOrder.status)">
                        {{ capitalizeFirst(selectedOrder.status) }}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="mb-1"><strong>Shipping Method:</strong> {{ selectedOrder.shipping.method }}</p>
                    <p class="mb-1">
                      <strong>Estimated Delivery:</strong> 
                      {{ formatDate(selectedOrder.shipping.estimatedDelivery) }}
                    </p>
                  </div>
                </div>
                
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th class="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedOrder.items" :key="item.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <img :src="item.image" :alt="item.name" class="cart-image rounded me-2"
                                 @error="handleImageError">
                            <div>
                              <h6 class="mb-0">{{ item.name }}</h6>
                              <small class="text-muted">{{ getCategoryName(item.category) }}</small>
                            </div>
                          </div>
                        </td>
                        <td>{{ formatItemPrice(item) }}</td>
                        <td>{{ item.quantity }}</td>
                        <td class="text-end">{{ formatItemTotal(item) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                        <td class="text-end">{{ formatOrderSubtotal }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-end"><strong>Shipping:</strong></td>
                        <td class="text-end">{{ formatShippingCost }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-end"><strong>Tax:</strong></td>
                        <td class="text-end">{{ formatTaxAmount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                        <td class="text-end"><strong>{{ formatOrderTotal }}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-eco-primary" @click="reorderItems(selectedOrder)">
                  <i class="fas fa-redo me-2"></i>Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    
    data() {
      return {
        activeSection: 'profile',
        editMode: {
          profile: false,
          address: false
        },
        user: null,
        purchases: [],
        updateSuccess: false,
        isUpdating: false,
        showPassword: false,
        
        // Profile editing
        editableProfile: {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        },
        
        // Address editing
        editableAddress: {
          street: '',
          line2: '',
          city: '',
          state: '',
          zipCode: ''
        },
        
        // Password change
        passwordChangeSuccess: false,
        passwordForm: {
          current: '',
          new: '',
          confirm: ''
        },
        passwordErrors: {
          current: '',
          new: '',
          confirm: ''
        },
        passwordStrength: 0,
        passwordCriteria: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false
        },
        
        // Preferences
        preferences: {
          emailNotifications: true,
          marketingEmails: true,
          newsletterSubscription: false
        },
        
        // Order details
        selectedOrder: null,
        orderDetailsModal: null,
        
        // State/province list
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
        }
      };
    },
    
    components: {
      'navbar': Navbar,
      'footer-component': Footer
    },
    
    computed: {
      // Check if user is authenticated
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
      },
      
      // Get selected order ID for the modal title
      selectedOrderId() {
        return this.selectedOrder ? this.selectedOrder.id : '';
      },
      
      // Format the order subtotal in the modal
      formatOrderSubtotal() {
        if (!this.selectedOrder) return '$0.00';
        return this.formatPrice(this.calculateSubtotal(this.selectedOrder.items));
      },
      
      // Format the shipping cost in the modal
      formatShippingCost() {
        if (!this.selectedOrder || !this.selectedOrder.shipping) return '$0.00';
        return this.formatPrice(this.selectedOrder.shipping.cost);
      },
      
      // Format the tax amount in the modal
      formatTaxAmount() {
        if (!this.selectedOrder) return '$0.00';
        const subtotal = this.calculateSubtotal(this.selectedOrder.items);
        const shipping = this.selectedOrder.shipping ? this.selectedOrder.shipping.cost : 0;
        const tax = this.selectedOrder.total - subtotal - shipping;
        return this.formatPrice(tax);
      },
      
      // Format the order total in the modal
      formatOrderTotal() {
        if (!this.selectedOrder) return '$0.00';
        return this.formatPrice(this.selectedOrder.total);
      }
    },
    
    mounted() {
      // Initialize the order details modal
      this.orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
      
      // Load user data and purchase history
      this.loadUserData();
      this.loadPurchases();
    },
    
    methods: {
      // Format price to display as currency
      formatPrice(price) {
        if (price === undefined || price === null) return '$0.00';
        return `$${Number(price).toFixed(2)}`;
      },
      
      // Format item price for the order details modal
      formatItemPrice(item) {
        if (!item) return '$0.00';
        const price = item.discountPrice !== null && item.discountPrice !== undefined 
          ? item.discountPrice : item.price;
        return this.formatPrice(price);
      },
      
      // Format item total for the order details modal
      formatItemTotal(item) {
        if (!item) return '$0.00';
        const price = item.discountPrice !== null && item.discountPrice !== undefined 
          ? item.discountPrice : item.price;
        return this.formatPrice(price * item.quantity);
      },
      
      // Load user data from store
      loadUserData() {
        if (this.isAuthenticated) {
          this.user = JSON.parse(JSON.stringify(store.state.user));
          
          // Initialize editable profile with current user data
          this.editableProfile = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phone: this.user.phone || ''
          };
          
          // Initialize editable address with current address data
          this.editableAddress = {
            street: this.user.address?.street || '',
            line2: this.user.address?.line2 || '',
            city: this.user.address?.city || '',
            state: this.user.address?.state || '',
            zipCode: this.user.address?.zipCode || ''
          };
          
          // Initialize preferences
          this.preferences = {
            emailNotifications: this.user.emailNotifications !== false, // default to true
            marketingEmails: this.user.marketingEmails !== false, // default to true
            newsletterSubscription: this.user.newsletterSubscription === true // default to false
          };
        }
      },
      
      // Load purchase history
      loadPurchases() {
        if (this.isAuthenticated) {
          this.purchases = JSON.parse(JSON.stringify(store.state.purchases));
        }
      },
      
      // Update user profile
      async updateProfile() {
        this.isUpdating = true;
        this.updateSuccess = false;
        
        try {
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update user data in store
          const success = store.methods.updateUserProfile({
            firstName: this.editableProfile.firstName,
            lastName: this.editableProfile.lastName,
            email: this.editableProfile.email,
            phone: this.editableProfile.phone
          });
          
          if (success) {
            this.updateSuccess = true;
            this.editMode.profile = false;
            
            // Reload user data
            this.loadUserData();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.updateSuccess = false;
            }, 3000);
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('An error occurred while updating your profile. Please try again.');
        } finally {
          this.isUpdating = false;
        }
      },
      
      // Update user address
      async updateAddress() {
        this.isUpdating = true;
        this.updateSuccess = false;
        
        try {
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update address in store
          const success = store.methods.updateUserProfile({
            address: {
              street: this.editableAddress.street,
              line2: this.editableAddress.line2,
              city: this.editableAddress.city,
              state: this.editableAddress.state,
              zipCode: this.editableAddress.zipCode
            }
          });
          
          if (success) {
            this.updateSuccess = true;
            this.editMode.address = false;
            
            // Reload user data
            this.loadUserData();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.updateSuccess = false;
            }, 3000);
          }
        } catch (error) {
          console.error('Error updating address:', error);
          alert('An error occurred while updating your address. Please try again.');
        } finally {
          this.isUpdating = false;
        }
      },
      
      // Check password strength as user types
      checkPasswordStrength() {
        const password = this.passwordForm.new;
        
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
      
      // Update user password
      async updatePassword() {
        // Reset errors
        this.passwordErrors = {
          current: '',
          new: '',
          confirm: ''
        };
        this.passwordChangeSuccess = false;
        
        // Validate current password (in a real app, this would be verified on the server)
        if (!this.passwordForm.current) {
          this.passwordErrors.current = 'Please enter your current password';
          return;
        }
        
        // Validate new password
        if (!this.passwordForm.new) {
          this.passwordErrors.new = 'Please enter a new password';
          return;
        } else if (this.passwordStrength < 50) {
          this.passwordErrors.new = 'Please choose a stronger password';
          return;
        }
        
        // Validate password confirmation
        if (!this.passwordForm.confirm) {
          this.passwordErrors.confirm = 'Please confirm your new password';
          return;
        } else if (this.passwordForm.new !== this.passwordForm.confirm) {
          this.passwordErrors.confirm = 'Passwords do not match';
          return;
        }
        
        this.isUpdating = true;
        
        try {
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real application, this would make an API call to update the password
          // For this prototype, we'll just simulate a successful update
          this.passwordChangeSuccess = true;
          
          // Reset form
          this.passwordForm = {
            current: '',
            new: '',
            confirm: ''
          };
          this.passwordStrength = 0;
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.passwordChangeSuccess = false;
          }, 3000);
        } catch (error) {
          console.error('Error updating password:', error);
          alert('An error occurred while updating your password. Please try again.');
        } finally {
          this.isUpdating = false;
        }
      },
      
      // Update user preferences
      async updatePreferences() {
        this.isUpdating = true;
        this.updateSuccess = false;
        
        try {
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update preferences in store
          const success = store.methods.updateUserProfile({
            emailNotifications: this.preferences.emailNotifications,
            marketingEmails: this.preferences.marketingEmails,
            newsletterSubscription: this.preferences.newsletterSubscription
          });
          
          if (success) {
            this.updateSuccess = true;
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.updateSuccess = false;
            }, 3000);
          }
        } catch (error) {
          console.error('Error updating preferences:', error);
          alert('An error occurred while updating your preferences. Please try again.');
        } finally {
          this.isUpdating = false;
        }
      },
      
      // View order details
      viewOrderDetails(order) {
        this.selectedOrder = JSON.parse(JSON.stringify(order));
        this.orderDetailsModal.show();
      },
      
      // Reorder items from a previous order
      reorderItems(order) {
        if (!order) return;
        
        // Add all items from the order to the cart
        order.items.forEach(item => {
          store.methods.addToCart(item, item.quantity);
        });
        
        // Close modal
        this.orderDetailsModal.hide();
        
        // Navigate to cart
        this.$router.push('/cart');
      },
      
      // Confirm logout
      confirmLogout() {
        if (confirm('Are you sure you want to sign out?')) {
          store.methods.logout();
          this.$router.push('/');
        }
      },
      
      // Format date for display
      formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      },
      
      // Handle missing product images
      handleImageError(e) {
        e.target.src = 'images/placeholder.jpg';
      },
      
      // Get category name from id
      getCategoryName(categoryId) {
        const category = store.state.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
      },
      
      // Get CSS class for order status
      getOrderStatusClass(status) {
        if (!status) return 'bg-secondary';
        
        switch (status.toLowerCase()) {
          case 'processing':
            return 'bg-warning text-dark';
          case 'shipped':
            return 'bg-info text-dark';
          case 'delivered':
            return 'bg-success';
          case 'cancelled':
            return 'bg-danger';
          default:
            return 'bg-secondary';
        }
      },
      
      // Capitalize first letter
      capitalizeFirst(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      
      // Calculate subtotal for order items
      calculateSubtotal(items) {
        if (!items || !Array.isArray(items)) return 0;
        
        return items.reduce((total, item) => {
          const itemPrice = item.discountPrice !== null && item.discountPrice !== undefined 
            ? item.discountPrice : item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      }
    }
  };