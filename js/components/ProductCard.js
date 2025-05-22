// ProductCard.js - Reusable component for displaying product information
// This component is used on both the home page and product listing page

const ProductCard = {
    props: {
      // Product object containing all product details
      product: {
        type: Object,
        required: true
      },
      // Optional grid column sizing for responsive layout
      colClass: {
        type: String,
        default: 'col-12 col-md-6 col-lg-4'
      }
    },
    
    template: `
      <div :class="colClass" class="mb-4">
        <div class="product-card card h-100">
          <!-- Product image with eco badge if applicable -->
          <div class="position-relative">
            <img :src="product.image" :alt="product.name" class="card-img-top"
                 @error="handleImageError">
            <span v-if="product.eco && product.eco.length > 0" 
                  class="eco-badge">Eco-Friendly</span>
            <span v-if="isOnSale" 
                  class="position-absolute top-0 start-0 badge bg-danger m-2">SALE</span>
          </div>
          
          <!-- Card body with product details -->
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            
            <!-- Product rating -->
            <div class="mb-2">
              <span class="rating-stars">
                <i v-for="star in 5" :key="star" 
                   :class="['fas', star <= Math.round(product.rating) ? 'fa-star' : 'fa-star-o']"
                   aria-hidden="true"></i>
              </span>
              <span class="ms-2 text-muted small">
                {{ formatRating }} ({{ product.reviewCount }} reviews)
              </span>
            </div>
            
            <!-- Product price with discount if applicable -->
            <div class="mb-2">
              <span v-if="isOnSale" class="text-decoration-line-through text-muted me-2">
                {{ formatPrice(product.price) }}
              </span>
              <span class="fw-bold" :class="{'text-danger': isOnSale}">
                {{ formatCurrentPrice }}
              </span>
            </div>
            
            <!-- Short description truncated for card view -->
            <p class="card-text flex-grow-1">{{ truncatedDescription }}</p>
            
            <!-- Eco features list (limited to 2 for card view) -->
            <div v-if="product.eco && product.eco.length > 0" class="mb-2">
              <div v-for="(feature, index) in limitedEcoFeatures" :key="index" 
                   class="d-flex align-items-center mb-1">
                <i class="fas fa-leaf text-success me-2 small"></i>
                <small class="eco-feature">{{ feature }}</small>
              </div>
              <small v-if="product.eco.length > 2" class="text-muted">
                +{{ product.eco.length - 2 }} more eco features
              </small>
            </div>
            
            <!-- Stock indicator -->
            <div class="mb-3">
              <span v-if="product.stock > 0" class="badge"
                    :class="stockStatusClass">
                {{ stockStatusText }}
              </span>
              <span v-else class="badge bg-secondary">Out of Stock</span>
            </div>
            
            <!-- Action buttons -->
            <div class="mt-auto">
              <div class="d-grid gap-2">
                <button v-if="product.stock > 0"
                        class="btn btn-eco-primary" 
                        @click="addToCart">
                  <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                </button>
                <button v-else
                        class="btn btn-secondary" 
                        disabled>
                  Out of Stock
                </button>
                <button class="btn btn-outline-secondary"
                        @click="viewDetails">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    
    computed: {
      // Check if product has a discount price
      isOnSale() {
        return this.product.discountPrice !== null && 
               this.product.discountPrice < this.product.price;
      },
      
      // Truncate description to max 100 characters for card view
      truncatedDescription() {
        if (this.product.description.length > 100) {
          return this.product.description.substring(0, 100) + '...';
        }
        return this.product.description;
      },
      
      // Limit eco features to 2 for card view
      limitedEcoFeatures() {
        return this.product.eco.slice(0, 2);
      },
      
      // Format rating to avoid template expression issues
      formatRating() {
        return this.product.rating.toFixed(1);
      },
      
      // Determine stock status text and class based on quantity
      stockStatusText() {
        if (this.product.stock > 10) {
          return 'In Stock';
        } else if (this.product.stock > 0) {
          return `Only ${this.product.stock} left`;
        } else {
          return 'Out of Stock';
        }
      },
      
      stockStatusClass() {
        if (this.product.stock > 10) {
          return 'bg-success';
        } else if (this.product.stock > 0) {
          return 'bg-warning text-dark';
        } else {
          return 'bg-secondary';
        }
      },
      
      // Format current price (with or without discount)
      formatCurrentPrice() {
        const price = this.product.discountPrice || this.product.price;
        return this.formatPrice(price);
      }
    },
    
    methods: {
      // Format price to display as currency
      formatPrice(price) {
        if (price === undefined || price === null) return '$0.00';
        return `$${Number(price).toFixed(2)}`;
      },
      
      // Handle missing product images
      handleImageError(e) {
        e.target.src = 'images/placeholder.jpg';
      },
      
      // Add product to cart with quantity of 1
      addToCart() {
        store.methods.addToCart(this.product, 1);
        // Show a brief notification (you could implement a toast here)
        alert(`${this.product.name} has been added to your cart.`);
      },
      
      // Navigate to product detail page (future implementation)
      viewDetails() {
        // This would link to a product detail page in a full implementation
        console.log('View details for', this.product.id);
        alert('Product details feature coming soon!');
      }
    }
  };