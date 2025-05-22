// ProductPage.js - Minimal test version
console.log('ProductPage.js is loading...');

const ProductPage = {
  data() {
    console.log('ProductPage data function called');
    return {
      testMessage: 'ProductPage is working!',
      priceMax: 350,
      store: store
    };
  },
  
  template: `
    <div>
      <main id="main-content">
        <section class="bg-light py-5">
          <div class="container">
            <h1>{{ testMessage }}</h1>
            <p>Price Max: {{ priceMax }}</p>
            <p>Store products count: {{ store.state.products.length }}</p>
          </div>
        </section>
      </main>
      <footer-component></footer-component>
    </div>
  `,
  
  components: {
    'footer-component': Footer
  },
  
  created() {
    console.log('ProductPage created, priceMax is:', this.priceMax);
  }
};

console.log('ProductPage component defined:', ProductPage);