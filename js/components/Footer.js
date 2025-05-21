// Footer.js - Footer component for EcoGear
// This component appears at the bottom of every page

const Footer = {
    template: `
      <footer class="footer mt-auto py-5">
        <div class="container">
          <div class="row g-4">
            <!-- Company information -->
            <div class="col-12 col-md-4">
              <h5 class="text-white mb-3">EcoGear</h5>
              <p class="text-white-50">
                We're committed to providing sustainable outdoor equipment 
                without compromising on quality or performance.
              </p>
              <div class="d-flex gap-3 mt-3">
                <a href="#" class="text-white" aria-label="Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="text-white" aria-label="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="text-white" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="text-white" aria-label="YouTube">
                  <i class="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <!-- Quick links -->
            <div class="col-6 col-md-2">
              <h5 class="text-white mb-3">Shop</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <router-link to="/products" class="text-white-50 text-decoration-none">
                    All Products
                  </router-link>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">New Arrivals</a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">Best Sellers</a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">Sale Items</a>
                </li>
              </ul>
            </div>
            
            <!-- Support links -->
            <div class="col-6 col-md-2">
              <h5 class="text-white mb-3">Support</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">Contact Us</a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">FAQs</a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">Shipping & Returns</a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-white-50 text-decoration-none">Size Guide</a>
                </li>
              </ul>
            </div>
            
            <!-- Newsletter signup -->
            <div class="col-12 col-md-4">
              <h5 class="text-white mb-3">Stay Connected</h5>
              <p class="text-white-50">Subscribe to our newsletter for updates on new sustainable products.</p>
              <form class="d-flex">
                <div class="input-group">
                  <label for="newsletterEmail" class="visually-hidden">Email address</label>
                  <input type="email" class="form-control" id="newsletterEmail" 
                         placeholder="Your email address" aria-label="Email address" 
                         aria-describedby="subscribeButton">
                  <button class="btn btn-eco-primary" type="submit" id="subscribeButton">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Eco certifications -->
          <div class="row mt-5">
            <div class="col-12">
              <div class="d-flex flex-wrap justify-content-center gap-4 mb-4">
                <div class="text-center">
                  <i class="fas fa-award text-white-50 fs-1"></i>
                  <p class="text-white-50 small mt-1">Certified B Corp</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-leaf text-white-50 fs-1"></i>
                  <p class="text-white-50 small mt-1">1% For The Planet</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-recycle text-white-50 fs-1"></i>
                  <p class="text-white-50 small mt-1">Recycled Materials</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-globe-americas text-white-50 fs-1"></i>
                  <p class="text-white-50 small mt-1">Carbon Neutral</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Copyright and policies -->
          <div class="row mt-4 pt-4 border-top border-secondary">
            <div class="col-md-6 text-center text-md-start">
              <p class="text-white-50 small">
                &copy; {{ currentYear }} EcoGear. All rights reserved.
              </p>
            </div>
            <div class="col-md-6">
              <ul class="list-inline text-center text-md-end mb-0">
                <li class="list-inline-item">
                  <a href="#" class="text-white-50 text-decoration-none small">Privacy Policy</a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="text-white-50 text-decoration-none small">Terms of Service</a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="text-white-50 text-decoration-none small">Accessibility</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    `,
    
    data() {
      return {
        currentYear: new Date().getFullYear()
      };
    }
  };