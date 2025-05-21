// HomePage.js - Main landing page component for EcoGear
// This is the first page users see when visiting the site

const HomePage = {
    template: `
      <div>
        <!-- Main navigation -->
        <navbar></navbar>
        
        <!-- Skip link target for accessibility -->
        <main id="main-content">
          <!-- Hero section with call to action -->
          <section class="hero" style="background-image: url('images/hero-bg.jpg');">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-8 text-center hero-content">
                  <h1 class="display-4 fw-bold mb-4">Sustainable Gear for Outdoor Adventures</h1>
                  <p class="lead mb-4">Discover eco-friendly equipment that's better for the planet without compromising on performance.</p>
                  <router-link to="/products" class="btn btn-eco-primary btn-lg px-4 me-2">
                    Shop Now
                  </router-link>
                  <a href="#featured" class="btn btn-outline-light btn-lg px-4">
                    Featured Products
                  </a>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Eco commitment banner -->
          <section class="bg-light py-4">
            <div class="container">
              <div class="row justify-content-center text-center">
                <div class="col-md-3 col-6 mb-3 mb-md-0">
                  <i class="fas fa-leaf fs-2 text-success mb-2"></i>
                  <p class="mb-0 small">Sustainable Materials</p>
                </div>
                <div class="col-md-3 col-6 mb-3 mb-md-0">
                  <i class="fas fa-recycle fs-2 text-success mb-2"></i>
                  <p class="mb-0 small">Recycled Packaging</p>
                </div>
                <div class="col-md-3 col-6">
                  <i class="fas fa-heart fs-2 text-success mb-2"></i>
                  <p class="mb-0 small">1% For The Planet</p>
                </div>
                <div class="col-md-3 col-6">
                  <i class="fas fa-globe-americas fs-2 text-success mb-2"></i>
                  <p class="mb-0 small">Carbon Neutral Shipping</p>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Category navigation -->
          <section class="py-5">
            <div class="container">
              <h2 class="text-center mb-4">Shop By Category</h2>
              <div class="row g-4">
                <div v-for="category in categories" :key="category.id" class="col-6 col-md-4 col-lg-2">
                  <router-link :to="{ path: '/products', query: { category: category.id }}" 
                               class="text-decoration-none">
                    <div class="category-card shadow-sm h-100">
                      <i :class="['category-icon', 'fas', category.icon]"></i>
                      <h5 class="fs-6">{{ category.name }}</h5>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Featured products -->
          <section id="featured" class="py-5 bg-light">
            <div class="container">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Featured Products</h2>
                <router-link to="/products" class="btn btn-outline-success">
                  View All Products
                </router-link>
              </div>
              
              <!-- Loading state -->
              <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading featured products...</p>
              </div>
              
              <!-- Error state -->
              <div v-else-if="hasError" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Unable to load products. Please try again later.
              </div>
              
              <!-- Products display -->
              <div v-else class="row">
                <product-card 
                  v-for="product in featuredProducts"
                  :key="product.id"
                  :product="product"
                  :col-class="'col-12 col-md-6 col-lg-4 mb-4'"
                ></product-card>
              </div>
            </div>
          </section>
          
          <!-- Sustainability highlight section -->
          <section class="py-5 bg-eco-beige">
            <div class="container">
              <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                  <img src="images/sustainability.jpg" alt="Eco-friendly manufacturing" class="img-fluid rounded shadow">
                </div>
                <div class="col-lg-6">
                  <h2>Our Commitment to Sustainability</h2>
                  <p class="lead">Every product from EcoGear is designed with the planet in mind.</p>
                  <p>We believe that outdoor equipment shouldn't come at the cost of the environment we all enjoy. That's why we're dedicated to:</p>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <i class="fas fa-check text-success me-2"></i>
                      Using recycled and sustainable materials
                    </li>
                    <li class="mb-2">
                      <i class="fas fa-check text-success me-2"></i>
                      Reducing waste in our manufacturing process
                    </li>
                    <li class="mb-2">
                      <i class="fas fa-check text-success me-2"></i>
                      Supporting environmental conservation efforts
                    </li>
                    <li class="mb-2">
                      <i class="fas fa-check text-success me-2"></i>
                      Providing repair services to extend product life
                    </li>
                  </ul>
                  <a href="#" class="btn btn-eco-primary">Learn More</a>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Testimonials section -->
          <section class="py-5">
            <div class="container">
              <h2 class="text-center mb-5">What Our Customers Say</h2>
              <div class="row g-4">
                <div v-for="(testimonial, index) in testimonials" :key="index" class="col-md-4">
                  <div class="testimonial-card h-100">
                    <div class="d-flex align-items-center mb-3">
                      <img :src="testimonial.avatar" :alt="testimonial.name" class="testimonial-avatar me-3">
                      <div>
                        <h5 class="mb-0 fs-6">{{ testimonial.name }}</h5>
                        <div class="rating-stars small">
                          <i v-for="star in 5" :key="star" class="fas fa-star"
                             :class="star <= testimonial.rating ? 'text-warning' : 'text-muted'"></i>
                        </div>
                      </div>
                    </div>
                    <p class="mb-0 fst-italic">{{ testimonial.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Newsletter signup -->
          <section class="py-5 bg-eco-green text-white">
            <div class="container">
              <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                  <h2 class="mb-3">Join Our Community</h2>
                  <p class="mb-4">Subscribe to receive updates on new sustainable products, outdoor tips, and exclusive offers.</p>
                  <form @submit.prevent="subscribeNewsletter" class="row g-2 justify-content-center">
                    <div class="col-md-8">
                      <label for="emailSubscribe" class="visually-hidden">Email address</label>
                      <input type="email" class="form-control" id="emailSubscribe" 
                             placeholder="Your email address" v-model="newsletterEmail" required>
                    </div>
                    <div class="col-md-auto">
                      <button type="submit" class="btn btn-light w-100">Subscribe</button>
                    </div>
                  </form>
                  <p class="small mt-2">We respect your privacy and will never share your information.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <!-- Toast notification for newsletter signup -->
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
          <div id="newsletterToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <i class="fas fa-envelope-open-text me-2 text-success"></i>
              <strong class="me-auto">Newsletter</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Thanks for subscribing! You'll receive our next newsletter soon.
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <footer-component></footer-component>
      </div>
    `,
    
    data() {
      return {
        isLoading: true,
        hasError: false,
        newsletterEmail: '',
        featuredProducts: [],
        categories: store.state.categories,
        testimonials: [
          {
            name: "Sarah T.",
            avatar: "images/testimonial-1.jpg",
            rating: 5,
            comment: "The EcoBreeze tent is incredible! It's lightweight, easy to set up, and I love knowing it's made from recycled materials."
          },
          {
            name: "Michael K.",
            avatar: "images/testimonial-2.jpg",
            rating: 5,
            comment: "I've been using the TrailSeeker backpack for all my hiking trips. Durable, comfortable, and eco-friendly - what more could you ask for?"
          },
          {
            name: "Jessica L.",
            avatar: "images/testimonial-3.jpg",
            rating: 4,
            comment: "The solar lantern has been a game-changer for my camping trips. It's reliable, bright, and I never have to worry about batteries."
          }
        ]
      };
    },
    
    components: {
      'navbar': Navbar,
      'footer-component': Footer,
      'product-card': ProductCard
    },
    
    created() {
      // Load products when component is created
      this.loadFeaturedProducts();
    },
    
    methods: {
      // Load featured products from the store
      async loadFeaturedProducts() {
        this.isLoading = true;
        this.hasError = false;
        
        try {
          // Make sure products are loaded
          if (store.state.products.length === 0) {
            await store.methods.loadProducts();
          }
          
          // Get featured products from all products
          this.featuredProducts = store.state.products
            .filter(product => product.featured)
            .slice(0, 6); // Limit to 6 featured products
            
          this.isLoading = false;
        } catch (error) {
          console.error('Error loading featured products:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      },
      
      // Handle newsletter subscription
      subscribeNewsletter() {
        // In a real app, this would send the email to a backend service
        console.log('Subscribing email:', this.newsletterEmail);
        
        // Show success toast using Bootstrap
        const toastEl = document.getElementById('newsletterToast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
        
        // Reset form
        this.newsletterEmail = '';
      }
    }
  };