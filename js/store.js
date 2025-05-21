// store.js - State management for the EcoGear application
// This provides centralized data storage and functions for manipulating that data

const store = {
    // Reactive state that will trigger component updates when modified
    state: Vue.reactive({
      products: [], // Will be populated from products.json
      cart: [],
      user: JSON.parse(localStorage.getItem('ecoGearUser')) || null,
      isAuthenticated: !!localStorage.getItem('ecoGearUser'),
      purchases: JSON.parse(localStorage.getItem('ecoGearPurchases')) || [],
      filters: {
        category: 'all',
        priceRange: [0, 1000],
        rating: 0,
        sortBy: 'featured'
      },
      categories: [
        { id: 'tents', name: 'Eco Tents', icon: 'fa-campground' },
        { id: 'backpacks', name: 'Sustainable Backpacks', icon: 'fa-backpack' },
        { id: 'apparel', name: 'Organic Apparel', icon: 'fa-shirt' },
        { id: 'hydration', name: 'Water Equipment', icon: 'fa-bottle-water' },
        { id: 'lighting', name: 'Solar Lighting', icon: 'fa-lightbulb' },
        { id: 'cooking', name: 'Eco-Cooking', icon: 'fa-fire-burner' }
      ],
      currentPage: 1,
      itemsPerPage: 9
    }),
  
    // Methods to interact with the state
    methods: {
      // Product methods
      async loadProducts() {
        try {
          const response = await fetch('data/products.json');
          const data = await response.json();
          this.state.products = data;
          console.log('Products loaded:', this.state.products.length);
        } catch (error) {
          console.error('Error loading products:', error);
        }
      },
  
      getFilteredProducts() {
        let result = [...this.state.products];
        
        // Apply category filter
        if (this.state.filters.category !== 'all') {
          result = result.filter(p => p.category === this.state.filters.category);
        }
        
        // Apply price filter
        result = result.filter(p => 
          p.price >= this.state.filters.priceRange[0] && 
          p.price <= this.state.filters.priceRange[1]
        );
        
        // Apply rating filter
        if (this.state.filters.rating > 0) {
          result = result.filter(p => p.rating >= this.state.filters.rating);
        }
        
        // Apply sorting
        switch(this.state.filters.sortBy) {
          case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
          default: // 'featured'
            result.sort((a, b) => b.featured - a.featured);
        }
        
        return result;
      },
  
      getPaginatedProducts() {
        const filtered = this.getFilteredProducts();
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        return filtered.slice(startIndex, startIndex + this.state.itemsPerPage);
      },
  
      getTotalPages() {
        return Math.ceil(this.getFilteredProducts().length / this.state.itemsPerPage);
      },
  
      // Cart methods
      addToCart(product, quantity = 1) {
        const existingItem = this.state.cart.find(item => item.id === product.id);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.state.cart.push({
            ...product,
            quantity
          });
        }
        
        // Save to local storage
        this.saveCartToLocalStorage();
      },
  
      updateCartItemQuantity(productId, quantity) {
        const item = this.state.cart.find(item => item.id === productId);
        if (item) {
          if (quantity > 0) {
            item.quantity = quantity;
          } else {
            // Remove item if quantity is zero or negative
            this.removeFromCart(productId);
            return;
          }
        }
        this.saveCartToLocalStorage();
      },
  
      removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCartToLocalStorage();
      },
  
      clearCart() {
        this.state.cart = [];
        this.saveCartToLocalStorage();
      },
  
      getCartTotal() {
        return this.state.cart.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },
  
      getCartItemCount() {
        return this.state.cart.reduce((count, item) => count + item.quantity, 0);
      },
  
      saveCartToLocalStorage() {
        localStorage.setItem('ecoGearCart', JSON.stringify(this.state.cart));
      },
  
      loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('ecoGearCart');
        if (savedCart) {
          this.state.cart = JSON.parse(savedCart);
        }
      },
  
      // User authentication methods
      register(userData) {
        // In a real application, this would make an API call to create the user
        // For this prototype, we'll store the user in localStorage
        
        // Simulate a new user ID
        userData.id = Date.now().toString();
        
        // Hash the password (in a real app, this would be done on the server)
        // This is just to demonstrate the concept - never actually do this
        userData.password = btoa(userData.password);
        
        localStorage.setItem('ecoGearUser', JSON.stringify(userData));
        this.state.user = userData;
        this.state.isAuthenticated = true;
        
        return true;
      },
  
      login(email, password) {
        // In a real app, this would be validated against the server
        // For this prototype, we'll check against localStorage
        
        // Get stored user
        const storedUser = localStorage.getItem('ecoGearUser');
        
        if (!storedUser) {
          return false;
        }
        
        const user = JSON.parse(storedUser);
        
        // Check credentials (very simplified)
        if (user.email === email && atob(user.password) === password) {
          // Login successful
          this.state.user = user;
          this.state.isAuthenticated = true;
          return true;
        }
        
        return false;
      },
  
      logout() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        // Don't remove user from localStorage to persist registration
        // Just clear the session state
      },
  
      updateUserProfile(updatedData) {
        // Update only the specified fields, keep password unchanged
        this.state.user = { ...this.state.user, ...updatedData };
        
        // Save to localStorage
        localStorage.setItem('ecoGearUser', JSON.stringify(this.state.user));
        
        return true;
      },
  
      // Purchase methods
      createPurchase() {
        if (this.state.cart.length === 0) return false;
        
        const purchase = {
          id: `order-${Date.now()}`,
          date: new Date().toISOString(),
          items: [...this.state.cart],
          total: this.getCartTotal(),
          status: 'processing',
          shipping: {
            method: 'Standard Shipping',
            cost: 5.99,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        };
        
        // Add the purchase to purchase history
        this.state.purchases.unshift(purchase);
        
        // Save to localStorage
        localStorage.setItem('ecoGearPurchases', JSON.stringify(this.state.purchases));
        
        // Clear the cart
        this.clearCart();
        
        return purchase;
      },
  
      // Filter and pagination methods
      setFilter(filterType, value) {
        this.state.filters[filterType] = value;
        // Reset to first page when filters change
        this.state.currentPage = 1;
      },
  
      setPage(pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.getTotalPages()) {
          this.state.currentPage = pageNumber;
        }
      }
    },
  
    // Initialize the store
    init() {
      // Load cart from localStorage
      this.methods.loadCartFromLocalStorage();
      
      // Load products from JSON
      this.methods.loadProducts();
      
      return this;
    }
  }.init(); // Initialize the store immediately