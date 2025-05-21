// js/components/HomePage.js
const HomePage = {
    template: `
      <div class="container mt-4">
        <!-- Hero Section using Bootstrap Grid -->
        <div class="row align-items-center mb-5">
          <div class="col-md-6">
            <h1>Sustainable Gear for Your Adventures</h1>
            <p class="lead">Eco-friendly outdoor equipment that doesn't compromise on performance or planet.</p>
            <router-link to="/products" class="btn btn-success btn-lg">Shop Now</router-link>
          </div>
          <div class="col-md-6">
            <img src="images/hero-image.jpg" class="img-fluid rounded" alt="Sustainable Outdoor Gear">
          </div>
        </div>
        
        <!-- Categories Section using Grid -->
        <h2 class="text-center mb-4">Shop by Category</h2>
        <div class="row">
          <div class="col-6 col-md-3 mb-4" v-for="category in categories" :key="category.name">
            <div class="card h-100 text-center">
              <img :src="category.image" class="card-img-top" :alt="category.name">
              <div class="card-body">
                <h5 class="card-title">{{ category.name }}</h5>
                <router-link :to="{ path: '/products', query: { category: category.id }}" class="btn btn-outline-success">View Products</router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Featured Products Section -->
        <h2 class="text-center mb-4 mt-5">Featured Products</h2>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="product in featuredProducts" :key="product.id">
            <div class="card h-100">
              <img :src="product.image" class="card-img-top" :alt="product.name">
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description.substring(0, 100) }}...</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span v-if="product.onSale" class="h5">
                    <del class="text-muted">${{ product.price.toFixed(2) }}</del>
                    ${{ product.salePrice.toFixed(2) }}
                  </span>
                  <span v-else class="h5">${{ product.price.toFixed(2) }}</span>
                  <router-link :to="'/products/' + product.id" class="btn btn-success">View Details</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        categories: [
          { id: 'apparel', name: 'Apparel', image: 'images/category-apparel.jpg' },
          { id: 'footwear', name: 'Footwear', image: 'images/category-footwear.jpg' },
          { id: 'camping', name: 'Camping', image: 'images/category-camping.jpg' },
          { id: 'accessories', name: 'Accessories', image: 'images/category-accessories.jpg' }
        ],
        featuredProducts: []
      }
    },
    mounted() {
      // Fetch products from JSON file
      fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
          // Get first 3 products as featured
          this.featuredProducts = data.products.slice(0, 3);
        })
        .catch(error => console.error('Error loading products:', error));
    }
  };