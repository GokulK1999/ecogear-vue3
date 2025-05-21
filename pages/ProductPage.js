// ProductPage.js - Component for displaying and filtering products
// This page showcases all products with advanced filtering and pagination

const ProductPage = {
    template: `
      <div>
        <!-- Main navigation -->
        <navbar></navbar>
        
        <!-- Skip link target for accessibility -->
        <main id="main-content">
          <!-- Page header -->
          <section class="bg-light py-5">
            <div class="container">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <h1>Sustainable Outdoor Products</h1>
                  <p class="lead mb-0">
                    Discover our range of eco-friendly outdoor gear designed for adventure and built to last.
                  </p>
                </div>
                <div class="col-md-6">
                  <!-- Breadcrumb navigation -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb justify-content-md-end mb-0">
                      <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">Products</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Main product section with filters and product grid -->
          <section class="py-5">
            <div class="container">
              <div class="row g-4">
                <!-- Filters sidebar (collapses on mobile) -->
                <div class="col-lg-3">
                  <!-- Mobile filter toggle -->
                  <button class="btn btn-eco-primary d-lg-none w-100 mb-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#filterCollapse"
                          aria-expanded="false"
                          aria-controls="filterCollapse">
                    <i class="fas fa-filter me-2"></i>Filter Products
                  </button>
                  
                  <div class="collapse d-lg-block" id="filterCollapse">
                    <div class="card shadow-sm mb-4">
                      <div class="card-header bg-light">
                        <h5 class="mb-0">Filters</h5>
                      </div>
                      <div class="card-body">
                        <!-- Category filter -->
                        <div class="mb-4">
                          <h6 class="fw-bold mb-2">Category</h6>
                          <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" 
                                  name="categoryFilter" id="categoryAll" 
                                  value="all" v-model="selectedCategory">
                            <label class="form-check-label" for="categoryAll">
                              All Categories
                            </label>
                          </div>
                          <div v-for="category in categories" :key="category.id" 
                               class="form-check mb-2">
                            <input class="form-check-input" type="radio" 
                                  name="categoryFilter" :id="'category' + category.id" 
                                  :value="category.id" v-model="selectedCategory">
                            <label class="form-check-label" :for="'category' + category.id">
                              {{ category.name }}
                            </label>
                          </div>
                        </div>
                        
                        <!-- Price range filter -->
                        <div class="mb-4">
                          <h6 class="fw-bold mb-2">Price Range</h6>
                          <div class="d-flex align-items-center mb-2">
                            <span class="me-2">$0</span>
                            <input type="range" class="form-range flex-grow-1" 
                                  min="0" max="350" step="10"
                                  v-model.number="priceMax">
                            <span class="ms-2">${{ priceMax }}</span>
                          </div>
                          <div class="d-flex justify-content-between small text-muted">
                            <span>Min: $0</span>
                            <span>Max: $350</span>
                          </div>
                        </div>
                        
                        <!-- Rating filter -->
                        <div class="mb-4">
                          <h6 class="fw-bold mb-2">Rating</h6>
                          <div v-for="rating in [4, 3, 2, 1]" :key="rating" 
                               class="form-check mb-2">
                            <input class="form-check-input" type="radio" 
                                  name="ratingFilter" :id="'rating' + rating" 
                                  :value="rating" v-model="selectedRating">
                            <label class="form-check-label" :for="'rating' + rating">
                              <span class="rating-stars">
                                <i v-for="star in 5" :key="star" 
                                   :class="['fas', star <= rating ? 'fa-star' : 'fa-star-o']"
                                   aria-hidden="true"></i>
                              </span>
                              <span v-if="rating < 5">&amp; up</span>
                            </label>
                          </div>
                          <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" 
                                  name="ratingFilter" id="ratingAll" 
                                  :value="0" v-model="selectedRating">
                            <label class="form-check-label" for="ratingAll">
                              Any Rating
                            </label>
                          </div>
                        </div>
                        
                        <!-- Other filters (eco-friendly, etc.) -->
                        <div class="mb-4">
                          <h6 class="fw-bold mb-2">Features</h6>
                          <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" 
                                  id="filterEco" v-model="ecoFriendlyOnly">
                            <label class="form-check-label" for="filterEco">
                              Eco-Friendly
                            </label>
                          </div>
                          <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" 
                                  id="filterSale" v-model="onSaleOnly">
                            <label class="form-check-label" for="filterSale">
                              On Sale
                            </label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                  id="filterInStock" v-model="inStockOnly">
                            <label class="form-check-label" for="filterInStock">
                              In Stock
                            </label>
                          </div>
                        </div>
                        
                        <!-- Reset filters button -->
                        <button class="btn btn-outline-secondary w-100"
                                @click="resetFilters">
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Products main content -->
                <div class="col-lg-9">
                  <!-- Sort and view options -->
                  <div class="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded">
                    <div>
                      <span v-if="filteredProducts.length > 0" class="d-none d-sm-inline">
                        Showing {{ startRange }}-{{ endRange }} of {{ filteredProducts.length }} products
                      </span>
                      <span v-else>No products found matching your criteria</span>
                    </div>
                    
                    <!-- Sort dropdown -->
                    <div class="d-flex align-items-center">
                      <label for="sortBy" class="me-2 d-none d-sm-block">Sort by:</label>
                      <select id="sortBy" class="form-select" v-model="sortBy"
                              aria-label="Sort products by">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                  </div>
                  
                  <!-- Loading indicator -->
                  <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-success" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading products...</p>
                  </div>
                  
                  <!-- Error message -->
                  <div v-else-if="hasError" class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Unable to load products. Please try again later.
                  </div>
                  
                  <!-- Empty state when no products match filters -->
                  <div v-else-if="paginatedProducts.length === 0" class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or browse all products.</p>
                    <button class="btn btn-eco-primary" @click="resetFilters">
                      View All Products
                    </button>
                  </div>
                  
                  <!-- Product grid -->
                  <div v-else class="row">
                    <product-card 
                      v-for="product in paginatedProducts"
                      :key="product.id"
                      :product="product"
                      col-class="col-sm-6 col-lg-4"
                    ></product-card>
                  </div>
                  
                  <!-- Pagination -->
                  <nav v-if="totalPages > 1" aria-label="Product pagination" class="mt-4">
                    <ul class="pagination justify-content-center">
                      <!-- Previous page -->
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)" 
                           aria-label="Previous page">
                          <i class="fas fa-chevron-left" aria-hidden="true"></i>
                          <span class="visually-hidden">Previous</span>
                        </a>
                      </li>
                      
                      <!-- Page numbers -->
                      <li v-for="page in displayedPageNumbers" :key="page" 
                          class="page-item" :class="{ active: currentPage === page }">
                        <a class="page-link" href="#" @click.prevent="goToPage(page)">
                          {{ page }}
                        </a>
                      </li>
                      
                      <!-- Next page -->
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)" 
                           aria-label="Next page">
                          <i class="fas fa-chevron-right" aria-hidden="true"></i>
                          <span class="visually-hidden">Next</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <!-- Footer -->
        <footer-component></footer-component>
      </div>
    `,
    
    data() {
      return {
        isLoading: true,
        hasError: false,
        selectedCategory: 'all',
        priceMax: 350,
        selectedRating: 0,
        ecoFriendlyOnly: false,
        onSaleOnly: false,
        inStockOnly: false,
        sortBy: 'featured',
        currentPage: 1,
        itemsPerPage: 9,
        categories: store.state.categories
      };
    },
    
    components: {
      'navbar': Navbar,
      'footer-component': Footer,
      'product-card': ProductCard
    },
    
    computed: {
      // Filter products based on selected filters
      filteredProducts() {
        if (!store.state.products || store.state.products.length === 0) {
          return [];
        }
        
        return store.state.products.filter(product => {
          // Category filter
          if (this.selectedCategory !== 'all' && product.category !== this.selectedCategory) {
            return false;
          }
          
          // Price filter
          if (product.price > this.priceMax) {
            return false;
          }
          
          // Rating filter
          if (this.selectedRating > 0 && product.rating < this.selectedRating) {
            return false;
          }
          
          // Eco-friendly filter
          if (this.ecoFriendlyOnly && (!product.eco || product.eco.length === 0)) {
            return false;
          }
          
          // Sale filter
          if (this.onSaleOnly && (!product.discountPrice || product.discountPrice >= product.price)) {
            return false;
          }
          
          // In-stock filter
          if (this.inStockOnly && product.stock <= 0) {
            return false;
          }
          
          return true;
        }).sort((a, b) => {
          // Apply sorting
          switch(this.sortBy) {
            case 'price-low':
              return (a.discountPrice || a.price) - (b.discountPrice || b.price);
            case 'price-high':
              return (b.discountPrice || b.price) - (a.discountPrice || a.price);
            case 'rating':
              return b.rating - a.rating;
            case 'newest':
              return new Date(b.dateAdded) - new Date(a.dateAdded);
            default: // 'featured'
              return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          }
        });
      },
      
      // Calculate total pages based on filtered products
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      },
      
      // Get products for current page
      paginatedProducts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
      },
      
      // Calculate pagination display range
      startRange() {
        return Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.filteredProducts.length);
      },
      
      endRange() {
        return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
      },
      
      // Generate array of page numbers to display
      displayedPageNumbers() {
        const displayRange = 5; // Number of page links to show
        let start = Math.max(1, this.currentPage - Math.floor(displayRange / 2));
        let end = Math.min(this.totalPages, start + displayRange - 1);
        
        // Adjust start if we're near the end
        if (end === this.totalPages) {
          start = Math.max(1, end - displayRange + 1);
        }
        
        const pages = [];
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        return pages;
      }
    },
    
    watch: {
      // Reset to first page when filters change
      selectedCategory() {
        this.currentPage = 1;
      },
      priceMax() {
        this.currentPage = 1;
      },
      selectedRating() {
        this.currentPage = 1;
      },
      ecoFriendlyOnly() {
        this.currentPage = 1;
      },
      onSaleOnly() {
        this.currentPage = 1;
      },
      inStockOnly() {
        this.currentPage = 1;
      },
      sortBy() {
        this.currentPage = 1;
      },
      
      // Watch route query parameters for filter updates
      '$route.query': {
        handler(query) {
          // Update filters from URL if present
          if (query.category && this.categories.some(c => c.id === query.category)) {
            this.selectedCategory = query.category;
          }
          
          if (query.sort && ['featured', 'price-low', 'price-high', 'rating', 'newest'].includes(query.sort)) {
            this.sortBy = query.sort;
          }
          
          if (query.page && !isNaN(parseInt(query.page))) {
            const page = parseInt(query.page);
            if (page > 0 && page <= this.totalPages) {
              this.currentPage = page;
            }
          }
        },
        immediate: true
      }
    },
    
    created() {
      // Load products when component is created
      this.loadProducts();
    },
    
    methods: {
      // Load products from store
      async loadProducts() {
        this.isLoading = true;
        this.hasError = false;
        
        try {
          // Load products if not already loaded
          if (store.state.products.length === 0) {
            await store.methods.loadProducts();
          }
          
          this.isLoading = false;
        } catch (error) {
          console.error('Error loading products:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      },
      
      // Go to specific page
      goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          // Update URL with page parameter
          this.$router.push({
            query: { ...this.$route.query, page }
          });
          
          // Scroll to top of products
          document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        }
      },
      
      // Reset all filters to default values
      resetFilters() {
        this.selectedCategory = 'all';
        this.priceMax = 350;
        this.selectedRating = 0;
        this.ecoFriendlyOnly = false;
        this.onSaleOnly = false;
        this.inStockOnly = false;
        this.sortBy = 'featured';
        this.currentPage = 1;
        
        // Update URL to remove filter parameters
        this.$router.push({ path: '/products' });
      }
    }
  };