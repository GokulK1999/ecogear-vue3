// router.js - Vue Router Configuration
// This file sets up routes for our application

// Define routes with components
const routes = [
  {
      path: '/',
      component: HomePage,
      name: 'home',
      meta: { title: 'EcoGear - Sustainable Outdoor Equipment' }
  },
  {
      path: '/products',
      component: ProductPage,
      name: 'products',
      meta: { title: 'Products - EcoGear' }
  },
  {
      path: '/cart',
      component: CartPage,
      name: 'cart',
      meta: { title: 'Shopping Cart - EcoGear' }
  },
  {
      path: '/register',
      component: RegisterPage,
      name: 'register',
      meta: { title: 'Create an Account - EcoGear' }
  },
  {
      path: '/login',
      component: LoginPage,
      name: 'login',
      meta: { title: 'Sign In - EcoGear' }
  },
  {
      path: '/account',
      component: AccountPage,
      name: 'account',
      meta: { title: 'My Account - EcoGear' },
      // Simple navigation guard - redirect to login if not authenticated
      beforeEnter: (to, from, next) => {
          const isAuthenticated = !!localStorage.getItem('ecoGearUser');
          if (!isAuthenticated) {
              next('/login');
          } else {
              next();
          }
      }
  },
  {
      path: '/purchases',
      component: PurchasePage,
      name: 'purchases',
      meta: { title: 'My Purchases - EcoGear' },
      // Similar guard for purchase history
      beforeEnter: (to, from, next) => {
          const isAuthenticated = !!localStorage.getItem('ecoGearUser');
          if (!isAuthenticated) {
              next('/login');
          } else {
              next();
          }
      }
  },
  // Catch-all route for 404 errors
  {
      path: '/:pathMatch(.*)*',
      component: {
          template: `
              <div class="container py-5 text-center">
                  <h1>Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <router-link to="/" class="btn btn-eco-primary">Go Home</router-link>
              </div>
          `
      },
      name: 'not-found',
      meta: { title: 'Page Not Found - EcoGear' }
  }
];

// Create the router instance
const router = VueRouter.createRouter({
  // Use hash mode for simplicity in this manual setup
  // In a production environment, you might want to use history mode with proper server configuration
  history: VueRouter.createWebHashHistory(),
  routes
});

// Update page title based on route meta
router.afterEach((to) => {
  document.title = to.meta.title || 'EcoGear';
});