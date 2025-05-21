// PurchasePage.js - Order history and management component for EcoGear
// This page allows users to view and manage their purchase history

const PurchasePage = {
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
                  <h1>My Purchases</h1>
                </div>
                <div class="col-md-6">
                  <!-- Breadcrumb navigation -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb justify-content-md-end mb-0">
                      <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">My Purchases</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Purchases content -->
          <section class="py-5">
            <div class="container">
              <!-- Not logged in message -->
              <div v-if="!isAuthenticated" class="text-center py-5">
                <i class="fas fa-user-lock fa-4x text-muted mb-4"></i>
                <h2>Please sign in to view your purchases</h2>
                <p class="mb-4">You need to be logged in to access your purchase history.</p>
                <router-link to="/login" class="btn btn-eco-primary me-2">
                  Sign In
                </router-link>
                <router-link to="/register" class="btn btn-outline-secondary">
                  Create an Account
                </router-link>
              </div>
              
              <!-- Purchase history when logged in -->
              <div v-else>
                <!-- Filters and search -->
                <div class="card shadow-sm mb-4">
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label for="orderSearch" class="form-label">Search Orders</label>
                        <div class="input-group">
                          <input type="text" class="form-control" id="orderSearch" 
                                 v-model="searchQuery" placeholder="Search by order ID or product">
                          <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div class="col-md-3">
                        <label for="statusFilter" class="form-label">Order Status</label>
                        <select class="form-select" id="statusFilter" v-model="statusFilter">
                          <option value="all">All Statuses</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div class="col-md-3">
                        <label for="dateFilter" class="form-label">Time Period</label>
                        <select class="form-select" id="dateFilter" v-model="dateFilter">
                          <option value="all">All Time</option>
                          <option value="30">Last 30 Days</option>
                          <option value="90">Last 90 Days</option>
                          <option value="365">Last Year</option>
                        </select>
                      </div>
                      
                      <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-eco-primary w-100" @click="applyFilters">
                          <i class="fas fa-filter me-2"></i>Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- No purchases message -->
                <div v-if="filteredPurchases.length === 0" class="text-center py-5">
                  <i class="fas fa-shopping-bag fa-4x text-muted mb-4"></i>
                  <h2 v-if="hasActiveFilters">No matching purchases found</h2>
                  <h2 v-else>No purchases yet</h2>
                  <p class="mb-4" v-if="hasActiveFilters">
                    Try adjusting your filters or search criteria.
                  </p>
                  <p class="mb-4" v-else>
                    You haven't made any purchases yet. Explore our products to get started!
                  </p>
                  <div>
                    <button v-if="hasActiveFilters" class="btn btn-outline-secondary me-2" @click="resetFilters">
                      Clear Filters
                    </button>
                    <router-link to="/products" class="btn btn-eco-primary">
                      Browse Products
                    </router-link>
                  </div>
                </div>
                
                <!-- Purchase list -->
                <div v-else>
                  <div class="mb-3 d-flex justify-content-between align-items-center">
                    <p class="mb-0">
                      Showing {{ filteredPurchases.length }} 
                      {{ filteredPurchases.length === 1 ? 'order' : 'orders' }}
                    </p>
                    <button class="btn btn-sm btn-outline-secondary" @click="resetFilters" 
                            v-if="hasActiveFilters">
                      <i class="fas fa-times me-1"></i>Clear Filters
                    </button>
                  </div>
                  
                  <!-- Order cards -->
                  <div class="row g-4">
                    <div v-for="order in filteredPurchases" :key="order.id" class="col-12">
                      <div class="card shadow-sm">
                        <div class="card-header bg-light">
                          <div class="row align-items-center">
                            <div class="col-md-3">
                              <h5 class="mb-0">Order #{{ order.id }}</h5>
                            </div>
                            <div class="col-md-3">
                              <span class="text-muted small">Placed on {{ formatDate(order.date) }}</span>
                            </div>
                            <div class="col-md-3">
                              <span class="badge" :class="getOrderStatusClass(order.status)">
                                {{ capitalizeFirst(order.status) }}
                              </span>
                            </div>
                            <div class="col-md-3 text-md-end">
                              <span class="fw-bold">{{ formatPrice(order.total) }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="card-body">
                          <!-- Order items -->
                          <div class="table-responsive mb-3">
                            <table class="table table-sm">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th class="text-end">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="item in order.items" :key="item.id">
                                  <td>
                                    <div class="d-flex align-items-center">
                                      <img :src="item.image" :alt="item.name" 
                                           class="cart-image rounded me-2"
                                           @error="handleImageError">
                                      <div>
                                        <router-link :to="'/products?id=' + item.id" class="fw-medium text-decoration-none">
                                          {{ item.name }}
                                        </router-link>
                                        <div class="small text-muted">{{ getCategoryName(item.category) }}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{{ formatPrice(item.discountPrice || item.price) }}</td>
                                  <td class="text-center">
                                    <div class="d-flex align-items-center">
                                      <input type="number" class="form-control form-control-sm quantity-input" 
                                             v-model.number="item.quantity" min="1" max="99"
                                             :disabled="!isOrderEditable(order)" 
                                             style="width: 60px;">
                                      
                                      <button v-if="isOrderEditable(order)" 
                                              class="btn btn-sm btn-outline-danger ms-2"
                                              @click="removeOrderItem(order, item)"
                                              title="Remove item">
                                        <i class="fas fa-trash-alt"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td class="text-end">
                                    {{ formatPrice((item.discountPrice || item.price) * item.quantity) }}
                                  </td>
                                </tr>
                              </tbody>
                              
                              <!-- Order summary -->
                              <tfoot class="table-light">
                                <tr>
                                  <td colspan="3" class="text-end">Subtotal:</td>
                                  <td class="text-end">{{ formatPrice(calculateSubtotal(order.items)) }}</td>
                                </tr>
                                <tr>
                                  <td colspan="3" class="text-end">Shipping:</td>
                                  <td class="text-end">{{ formatPrice(order.shipping.cost) }}</td>
                                </tr>
                                <tr>
                                  <td colspan="3" class="text-end">Tax:</td>
                                  <td class="text-end">
                                    {{ formatPrice(calculateTax(order)) }}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                  <td class="text-end"><strong>{{ formatPrice(order.total) }}</strong></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                          
                          <!-- Shipping information -->
                          <div class="row g-3">
                            <div class="col-md-6">
                              <div class="card h-100">
                                <div class="card-body">
                                  <h6 class="card-title">Shipping Information</h6>
                                  <p class="small mb-1">
                                    <strong>Method:</strong> {{ order.shipping.method }}
                                  </p>
                                  <p class="small mb-1">
                                    <strong>Estimated Delivery:</strong> 
                                    {{ formatDate(order.shipping.estimatedDelivery) }}
                                  </p>
                                  <p class="small mb-0" v-if="order.tracking">
                                    <strong>Tracking:</strong> 
                                    <a :href="'https://tracking.example.com/' + order.tracking" target="_blank">
                                      {{ order.tracking }}
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Order actions -->
                            <div class="col-md-6">
                              <div class="card h-100">
                                <div class="card-body">
                                  <h6 class="card-title">Order Actions</h6>
                                  <div class="d-flex flex-wrap gap-2">
                                    <!-- Update order button -->
                                    <button v-if="isOrderEditable(order)" 
                                            class="btn btn-sm btn-eco-primary"
                                            @click="updateOrder(order)"
                                            :disabled="isOrderUnchanged(order)">
                                      <i class="fas fa-save me-1"></i>Save Changes
                                    </button>
                                    
                                    <!-- Cancel order button -->
                                    <button v-if="order.status === 'processing'" 
                                            class="btn btn-sm btn-outline-danger"
                                            @click="cancelOrder(order)">
                                      <i class="fas fa-times me-1"></i>Cancel Order
                                    </button>
                                    
                                    <!-- Reorder button -->
                                    <button class="btn btn-sm btn-outline-secondary"
                                            @click="reorderItems(order)">
                                      <i class="fas fa-redo me-1"></i>Reorder
                                    </button>
                                    
                                    <!-- Add items button -->
                                    <button class="btn btn-sm btn-outline-success"
                                            @click="showAddItemModal(order)">
                                      <i class="fas fa-plus me-1"></i>Add Items
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
        
        <!-- Add Items Modal -->
        <div class="modal fade" id="addItemsModal" tabindex="-1" 
             aria-labelledby="addItemsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addItemsModalLabel">
                  Add Items to Order {{ currentOrderId }}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Search products -->
                <div class="mb-3">
                  <label for="productSearch" class="form-label">Search Products</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="productSearch" 
                           v-model="productSearchQuery" placeholder="Search by product name or category">
                    <button class="btn btn-outline-secondary" type="button" @click="searchProducts">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Product results -->
                <div v-if="searchResults.length > 0" class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in searchResults" :key="product.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <img :src="product.image" :alt="product.name" 
                                 class="cart-image rounded me-2"
                                 @error="handleImageError">
                            <div>
                              <div class="fw-medium">{{ product.name }}</div>
                              <div class="small text-muted">{{ getCategoryName(product.category) }}</div>
                            </div>
                          </div>
                        </td>
                        <td>{{ formatPrice(product.discountPrice || product.price) }}</td>
                        <td>
                          <input type="number" class="form-control form-control-sm" 
                                 v-model.number="product.quantity" min="1" max="99"
                                 style="width: 60px;">
                        </td>
                        <td>
                          <button class="btn btn-sm btn-eco-primary"
                                  @click="addProductToOrder(product)">
                            <i class="fas fa-plus me-1"></i>Add
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- No results message -->
                <div v-else-if="productSearchQuery && !isSearching" class="text-center py-3">
                  <i class="fas fa-search fa-2x text-muted mb-2"></i>
                  <p>No products found. Try a different search term.</p>
                </div>
                
                <!-- Loading state -->
                <div v-if="isSearching" class="text-center py-3">
                  <div class="spinner-border text-eco-green" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Searching products...</p>
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
        // Filters
        searchQuery: '',
        statusFilter: 'all',
        dateFilter: 'all',
        isSearching: false,
        
        // Purchases data
        purchases: [],
        originalPurchases: [], // Keep an unmodified copy for comparison
        
        // Add items modal
        addItemsModal: null,
        currentOrderId: '',
        selectedOrder: null,
        productSearchQuery: '',
        searchResults: [],
        
        // Edit tracking
        modifiedOrders: {}
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
      
      // Filter and search purchases
      filteredPurchases() {
        if (!this.purchases || this.purchases.length === 0) {
          return [];
        }
        
        let result = [...this.purchases];
        
        // Apply status filter
        if (this.statusFilter !== 'all') {
          result = result.filter(order => 
            order.status.toLowerCase() === this.statusFilter.toLowerCase()
          );
        }
        
        // Apply date filter
        if (this.dateFilter !== 'all') {
          const daysAgo = parseInt(this.dateFilter);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
          
          result = result.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= cutoffDate;
          });
        }
        
        // Apply search filter
        if (this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(order => {
            // Search in order ID
            if (order.id.toLowerCase().includes(query)) {
              return true;
            }
            
            // Search in product names
            return order.items.some(item => 
              item.name.toLowerCase().includes(query)
            );
          });
        }
        
        return result;
      },
      
      // Check if there are active filters
      hasActiveFilters() {
        return this.searchQuery.trim() !== '' || 
               this.statusFilter !== 'all' || 
               this.dateFilter !== 'all';
      }
    },
    
    mounted() {
      // Initialize modal
      this.addItemsModal = new bootstrap.Modal(document.getElementById('addItemsModal'));
      
      // Load purchase data
      this.loadPurchases();
    },
    
    methods: {
      // Format price to display as currency
      formatPrice(price) {
        if (price === undefined || price === null) return '$0.00';
        return `$${Number(price).toFixed(2)}`;
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
      
      // Load purchase history
      loadPurchases() {
        if (this.isAuthenticated) {
          // Get a deep copy of purchases to avoid reference issues
          this.purchases = JSON.parse(JSON.stringify(store.state.purchases));
          this.originalPurchases = JSON.parse(JSON.stringify(store.state.purchases));
          
          // Initialize modified orders tracking
          this.modifiedOrders = {};
        }
      },
      
      // Get CSS class for order status badge
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
      
      // Capitalize first letter of a string
      capitalizeFirst(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      
      // Get category name from ID
      getCategoryName(categoryId) {
        const category = store.state.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
      },
      
      // Calculate subtotal for order items
      calculateSubtotal(items) {
        if (!items || !Array.isArray(items)) return 0;
        
        return items.reduce((total, item) => {
          const itemPrice = item.discountPrice !== null && item.discountPrice !== undefined 
            ? item.discountPrice : item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      },
      
      // Calculate tax amount
      calculateTax(order) {
        if (!order) return 0;
        
        const subtotal = this.calculateSubtotal(order.items);
        const shipping = order.shipping ? order.shipping.cost : 0;
        return order.total - subtotal - shipping;
      },
      
      // Handle missing images
      handleImageError(e) {
        e.target.src = 'images/placeholder.jpg';
      },
      
      // Apply filters
      applyFilters() {
        // This method is a placeholder in case you want to add 
        // additional logic when filters are applied
        console.log('Filters applied:', {
          search: this.searchQuery,
          status: this.statusFilter,
          date: this.dateFilter
        });
      },
      
      // Reset all filters
      resetFilters() {
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.dateFilter = 'all';
      },
      
      // Clear search
      clearSearch() {
        this.searchQuery = '';
      },
      
      // Check if order is editable (only processing orders can be edited)
      isOrderEditable(order) {
        return order && order.status.toLowerCase() === 'processing';
      },
      
      // Check if order has been changed
      isOrderUnchanged(order) {
        // Find the original order
        const originalOrder = this.originalPurchases.find(o => o.id === order.id);
        if (!originalOrder) return true;
        
        // Check if items are the same
        if (order.items.length !== originalOrder.items.length) return false;
        
        // Check if quantities are the same
        for (const item of order.items) {
          const originalItem = originalOrder.items.find(i => i.id === item.id);
          if (!originalItem || originalItem.quantity !== item.quantity) return false;
        }
        
        return true;
      },
      
      // Remove item from order
      removeOrderItem(order, itemToRemove) {
        // Confirm removal
        if (!confirm(`Remove ${itemToRemove.name} from this order?`)) return;
        
        // Find the item index
        const index = order.items.findIndex(item => item.id === itemToRemove.id);
        if (index === -1) return;
        
        // Remove the item
        order.items.splice(index, 1);
        
        // Recalculate total
        this.recalculateOrderTotal(order);
        
        // Mark order as modified
        this.modifiedOrders[order.id] = true;
      },
      
      // Update order with new information
      async updateOrder(order) {
        // Confirm update
        if (!confirm('Save changes to this order?')) return;
        
        try {
          // In a real application, this would make an API call
          // For this prototype, we'll simulate a successful update
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Recalculate order total
          this.recalculateOrderTotal(order);
          
          // Update the order in the store
          const updatedPurchases = store.state.purchases.map(p => 
            p.id === order.id ? order : p
          );
          localStorage.setItem('ecoGearPurchases', JSON.stringify(updatedPurchases));
          
          // Update local data
          this.loadPurchases();
          
          // Show success message
          alert('Order updated successfully!');
        } catch (error) {
          console.error('Error updating order:', error);
          alert('An error occurred while updating your order. Please try again.');
        }
      },
      
      // Recalculate order total when items are changed
      recalculateOrderTotal(order) {
        const subtotal = this.calculateSubtotal(order.items);
        const shipping = order.shipping.cost;
        const tax = subtotal * 0.08; // Assuming 8% tax rate
        
        order.total = subtotal + shipping + tax;
      },
      
      // Cancel an order
      async cancelOrder(order) {
        // Confirm cancellation
        if (!confirm('Are you sure you want to cancel this order?')) return;
        
        try {
          // In a real application, this would make an API call
          // For this prototype, we'll simulate a successful cancellation
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update order status
          order.status = 'cancelled';
          
          // Update the order in the store
          const updatedPurchases = store.state.purchases.map(p => 
            p.id === order.id ? order : p
          );
          localStorage.setItem('ecoGearPurchases', JSON.stringify(updatedPurchases));
          
          // Update local data
          this.loadPurchases();
          
          // Show success message
          alert('Order cancelled successfully!');
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert('An error occurred while cancelling your order. Please try again.');
        }
      },
      
      // Reorder items from a previous order
      reorderItems(order) {
        // Add all items from the order to the cart
        order.items.forEach(item => {
          store.methods.addToCart(item, item.quantity);
        });
        
        // Navigate to cart
        this.$router.push('/cart');
      },
      
      // Show modal to add items to order
      showAddItemModal(order) {
        this.selectedOrder = order;
        this.currentOrderId = order.id;
        this.productSearchQuery = '';
        this.searchResults = [];
        
        // Show the modal
        this.addItemsModal.show();
      },
      
      // Search for products to add
      async searchProducts() {
        if (!this.productSearchQuery.trim()) return;
        
        this.isSearching = true;
        
        try {
          // In a real application, this would make an API call
          // For this prototype, we'll search through available products
          
          // Simulate server delay
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const query = this.productSearchQuery.toLowerCase();
          const results = store.state.products.filter(product => {
            // Check if the product is already in the order
            const isInOrder = this.selectedOrder.items.some(item => item.id === product.id);
            if (isInOrder) return false;
            
            // Check if product name or category matches
            return product.name.toLowerCase().includes(query) || 
                   this.getCategoryName(product.category).toLowerCase().includes(query);
          });
          
          // Add quantity property to each result for the input
          this.searchResults = results.map(product => ({
            ...product,
            quantity: 1
          }));
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          this.isSearching = false;
        }
      },
      
      // Add product to the current order
      addProductToOrder(product) {
        if (!this.selectedOrder) return;
        
        // Create a copy of the product
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
          category: product.category,
          quantity: product.quantity
        };
        
        // Add to order items
        this.selectedOrder.items.push(newItem);
        
        // Recalculate total
        this.recalculateOrderTotal(this.selectedOrder);
        
        // Mark order as modified
        this.modifiedOrders[this.selectedOrder.id] = true;
        
        // Remove from search results
        this.searchResults = this.searchResults.filter(p => p.id !== product.id);
        
        // Show confirmation
        alert(`${product.name} added to your order.`);
      }
    }
  };