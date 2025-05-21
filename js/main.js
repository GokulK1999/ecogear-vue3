// main.js - Main entry point for the EcoGear Vue application
// This file initializes Vue and mounts it to the DOM

// Main application layout with router view and persistent components
const App = {
    template: `
      <div class="d-flex flex-column min-vh-100">
        <!-- Navigation bar -->
        <Navbar></Navbar>
        
        <!-- Main content -->
        <main id="main-content" class="flex-grow-1">
          <router-view></router-view>
        </main>
        
        <!-- Footer -->
        <Footer></Footer>
      </div>
    `,
    
    components: {
      Navbar,
      Footer
    }
  };
  
  // Create and mount the Vue application
  const app = Vue.createApp(App);
  
  // Register global components
  app.component('ProductCard', ProductCard);
  
  // Make store available in all components
  app.config.globalProperties.$store = store;
  
  // Use Vue Router
  app.use(router);
  
  // Custom directive for focus on input fields
  app.directive('focus', {
    mounted(el) {
      el.focus();
    }
  });
  
  // Custom filter for currency formatting
  app.config.globalProperties.$filters = {
    currency(value) {
      return value ? '$' + parseFloat(value).toFixed(2) : '$0.00';
    },
    
    date(value, format = 'medium') {
      if (!value) return '';
      const date = new Date(value);
      if (format === 'short') {
        return date.toLocaleDateString();
      } else if (format === 'medium') {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleString();
      }
    }
  };
  
  // Mount the app
  app.mount('#app');
  
  // Log that the application has been initialized
  console.log('EcoGear application initialized!');