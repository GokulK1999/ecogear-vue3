// js/components/ProductsPage.js
const ProductsPage = {
    template: `
      <div class="container mt-4">
        <h1 class="mb-4">Sustainable Outdoor Products</h1>
        
        <!-- Filters -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Filters</h5>
              </div>
              <div class="card-body">
                <!-- Category Filter -->
                <h6>Category</h6>
                <div class="form-check" v-for="category in categories" :key="category">
                  <input class="form-check-input" type="checkbox" :id="category" 
                         :value="category" v-model="selectedCategories">
                  <label class="form-check-label" :for="category">{{ category }}</label>
                </div>
                
                <!-- Price Range Filter -->
                <h6 class="mt-3">Price Range</h6>
                <div>
                  <input type="range" class="form-range" min="0" max="500" v-model.number="priceRange">
                  <div class="d-flex justify-content-between">
                    <span>$0</span>
                    <span>${{ priceRange }}</span>
                  </div>
                </div>
                
                <!-- Sort Options -->
                <h6 class="mt-3">Sort By</h6>
                <select class="form-select" v-model="sortBy">
                  <option value="nameAsc">Name (A-Z)</option>
                  <option value="nameDesc">Name (Z-A)</option>
                  <option value="priceLow">Price (Low to High)</option>
                  <option value="priceHigh">Price (High to Low)</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Products Grid -->
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-4 mb-4" v-for="product in paginatedProducts" :key="product.id">
                <div class="card h-100">
                  <img :src="product.image" class="card-img-top" :alt="product.name">
                  <div class="card-body">
                    <h5 class="card-title">{{ product.name }}</h5>
                    <div class="mb-2">
                      <span class="text-warning" v-for="i in 5" :key="i">
                        <i :class="i <= product.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                      </span>
                      <small class="ms-1">({{ product.reviewCount }})</small>
                    </div>
                    <p class="card-text">{{ product.description.substring(0, 80) }}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span v-if="product.onSale" class="h5">
                        <del class="text-muted">${{ product.price.toFixed(2) }}</del>
                        ${{ product.salePrice.toFixed(2) }}
                      </span>
                      <span v-else class="h5">${{ product.price.toFixed(2) }}</span>
                      <button @click="addToCart(product)" class="btn btn-success">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <nav aria-label="Product pagination" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" 
                    :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        products: [],
        categories: ['Apparel', 'Footwear', 'Camping', 'Accessories'],
        selectedCategories: [],
        priceRange: 300,
        sortBy: 'nameAsc',
        currentPage: 1,
        itemsPerPage: 9
      }
    },
    computed: {
      filteredProducts() {
        let result = [...this.products];
        
        // Filter by category
        if (this.selectedCategories.length > 0) {
          result = result.filter(product => 
            this.selectedCategories.includes(product.category)
          );
        }
        
        // Filter by price
        result = result.filter(product => {
          const effectivePrice = product.onSale ? product.salePrice : product.price;
          return effectivePrice <= this.priceRange;
        });
        
        // Sort products
        result.sort((a, b) => {
          if (this.sortBy === 'nameAsc') {
            return a.name.localeCompare(b.name);
          } else if (this.sortBy === 'nameDesc') {
            return b.name.localeCompare(a.name);
          } else if (this.sortBy === 'priceLow') {
            const priceA = a.onSale ? a.salePrice : a.price;
            const priceB = b.onSale ? b.salePrice : b.price;
            return priceA - priceB;
          } else if (this.sortBy === 'priceHigh') {
            const priceA = a.onSale ? a.salePrice : a.price;
            const priceB = b.onSale ? b.salePrice : b.price;
            return priceB - priceA;
          } else if (this.sortBy === 'rating') {
            return b.rating - a.rating;
          }
          return 0;
        });
        
        return result;
      },
      paginatedProducts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      }
    },
    methods: {
      addToCart(product) {
        // Use the global app's addToCart method
        this.$root.addToCart(product);
        alert(`${product.name} added to cart!`);
      }
    },
    mounted() {
      // Fetch products from JSON file
      fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
          this.products = data.products;
          
          // Check if a category was passed in the URL query
          const urlParams = new URLSearchParams(window.location.search);
          const categoryParam = urlParams.get('category');
          if (categoryParam) {
            // Convert to proper case to match our category names
            const properCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
            this.selectedCategories = [properCategory];
          }
        })
        .catch(error => console.error('Error loading products:', error));
    }
  };