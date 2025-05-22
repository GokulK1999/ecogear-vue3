// Navbar.js - Navigation component for EcoGear
// This component appears at the top of every page

const Navbar = {
  template: `
    <header>
      <!-- Accessibility skip link -->
      <a href="#main-content" class="skip-link">Skip to content</a>
      
      <nav class="navbar navbar-expand-lg navbar-eco sticky-top">
        <div class="container">
          <!-- Brand logo and name -->
          <router-link class="navbar-brand" to="/">
            <i class="fas fa-leaf me-2"></i>EcoGear
          </router-link>
          
          <!-- Mobile toggle button -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#navbarContent" aria-controls="navbarContent" 
                  aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <!-- Collapsible navigation content -->
          <div class="collapse navbar-collapse" id="navbarContent">
            <!-- Main navigation links -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/' }" 
                             to="/" aria-current="page">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :class="{ active: $route.path === '/products' }" 
                             to="/products">Products</router-link>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="categoriesDropdown" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  Categories
                </a>
                <ul class="dropdown-menu" aria-labelledby="categoriesDropdown">
                  <li v-for="category in store.state.categories" :key="category.id">
                    <router-link class="dropdown-item" 
                                 :to="{ path: '/products', query: { category: category.id }}">
                      <i :class="'fas ' + category.icon + ' me-2'"></i>
                      {{ category.name }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
            
            <!-- Right-aligned navigation items -->
            <div class="d-flex align-items-center">
              <!-- Search form -->
              <form class="d-flex me-2">
                <div class="input-group">
                  <input class="form-control" type="search" placeholder="Search products..." 
                         aria-label="Search">
                  <button class="btn btn-outline-success" type="submit" aria-label="Submit search">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </form>
              
              <!-- Shopping cart button with badge - temporarily disabled -->
              <button class="btn btn-outline-success position-relative me-2" 
                      aria-label="Shopping cart" @click="showCartMessage">
                <i class="fas fa-shopping-cart"></i>
                <span v-if="cartItemCount > 0" 
                      class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ cartItemCount }}
                </span>
              </button>
              
              <!-- Account dropdown -->
              <div class="dropdown">
                <button class="btn btn-outline-success dropdown-toggle" type="button" 
                        id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user me-1"></i>
                  <span class="d-none d-md-inline">{{ isAuthenticated ? 'My Account' : 'Sign In' }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                  <template v-if="isAuthenticated">
                    <li>
                      <router-link class="dropdown-item" to="/account">
                        <i class="fas fa-user-circle me-2"></i>My Profile
                      </router-link>
                    </li>
                    <li>
                      <router-link class="dropdown-item" to="/purchases">
                        <i class="fas fa-shopping-bag me-2"></i>My Purchases
                      </router-link>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="logout">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                      </a>
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      <router-link class="dropdown-item" to="/login">
                        <i class="fas fa-sign-in-alt me-2"></i>Sign In
                      </router-link>
                    </li>
                    <li>
                      <router-link class="dropdown-item" to="/register">
                        <i class="fas fa-user-plus me-2"></i>Create Account
                      </router-link>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  
  data() {
    return {
      store: store
    };
  },
  
  computed: {
    isAuthenticated() {
      return store.state.isAuthenticated;
    },
    
    cartItemCount() {
      return store.methods.getCartItemCount();
    }
  },
  
  methods: {
    logout() {
      store.methods.logout();
      // Redirect to home page after logout
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    
    showCartMessage() {
      alert('Cart page coming soon! Cart functionality will be available once we complete the cart component.');
    }
  }
};