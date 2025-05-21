// store.js - Simple State Management
// This implements a reactive store for our application

// Create a reactive store using Vue's reactivity system
const createStore = () => {
    // Initial state
    const state = Vue.reactive({
        // User-related state
        user: JSON.parse(localStorage.getItem('ecoGearUser')) || null,
        isAuthenticated: !!localStorage.getItem('ecoGearUser'),
        
        // Cart state
        cart: JSON.parse(localStorage.getItem('ecoGearCart')) || [],
        
        // Product state (will be loaded from JSON)
        products: [],
        filteredProducts: [],
        categories: [],
        
        // UI states
        isLoading: false,
        currentPage: 1,
        itemsPerPage: 9,
        searchQuery: '',
        selectedCategory: '',
        sortBy: 'default',
        
        // Filter options
        priceRange: {min: 0, max: 1000},
        selectedFilters: {
            sustainable: false,
            sale: false,
            inStock: false
        }
    });
    
    // Methods to manipulate state
    const methods = {
        // User methods
        login(email, password) {
            // In a real app, this would validate against a server
            // For demo, we'll check if the user exists in localStorage
            const users = JSON.parse(localStorage.getItem('ecoGearUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Remove password for security before storing in state
                const { password, ...safeUser } = user;
                state.user = safeUser;
                state.isAuthenticated = true;
                localStorage.setItem('ecoGearUser', JSON.stringify(safeUser));
                return true;
            }
            return false;
        },
        
        logout() {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('ecoGearUser');
        },
        
        register(userData) {
            // In a real app, this would send data to a server
            // For demo, we'll store in localStorage
            const users = JSON.parse(localStorage.getItem('ecoGearUsers')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                return { success: false, message: 'Email already in use' };
            }
            
            // Add user to the array
            users.push({
                id: Date.now().toString(),
                ...userData,
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('ecoGearUsers', JSON.stringify(users));
            return { success: true };
        },
        
        updateUserProfile(updates) {
            if (!state.user) return false;
            
            // Update user in state
            state.user = { ...state.user, ...updates };
            
            // Update in localStorage (both user and users array)
            localStorage.setItem('ecoGearUser', JSON.stringify(state.user));
            
            const users = JSON.parse(localStorage.getItem('ecoGearUsers')) || [];
            const updatedUsers = users.map(user => 
                user.id === state.user.id ? { ...user, ...updates } : user
            );
            
            localStorage.setItem('ecoGearUsers', JSON.stringify(updatedUsers));
            return true;
        },
        
        // Cart methods
        addToCart(product, quantity = 1) {
            // Check if product is already in cart
            const existingItem = state.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                // Update quantity
                existingItem.quantity += quantity;
            } else {
                // Add new item
                state.cart.push({
                    ...product,
                    quantity
                });
            }
            
            // Save to localStorage
            localStorage.setItem('ecoGearCart', JSON.stringify(state.cart));
        },
        
        updateCartItem(productId, quantity) {
            const item = state.cart.find(item => item.id === productId);
            
            if (item) {
                if (quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    this.removeFromCart(productId);
                } else {
                    // Update quantity
                    item.quantity = quantity;
                    localStorage.setItem('ecoGearCart', JSON.stringify(state.cart));
                }
            }
        },
        
        removeFromCart(productId) {
            state.cart = state.cart.filter(item => item.id !== productId);
            localStorage.setItem('ecoGearCart', JSON.stringify(state.cart));
        },
        
        clearCart() {
            state.cart = [];
            localStorage.setItem('ecoGearCart', JSON.stringify(state.cart));
        },
        
        getCartTotal() {
            return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        
        // Product methods
        async loadProducts() {
            state.isLoading = true;
            
            try {
                // In a real app, this would be an API call
                // For demo, we're loading from a local JSON file
                const response = await fetch('./data/products.json');
                const data = await response.json();
                
                state.products = data;
                state.filteredProducts = [...data];
                
                // Extract unique categories
                state.categories = [...new Set(data.map(product => product.category))];
                
                // Find min and max prices for price filter
                const prices = data.map(product => product.price);
                state.priceRange.min = Math.min(...prices);
                state.priceRange.max = Math.max(...prices);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                state.isLoading = false;
            }
        },
        
        filterProducts() {
            let filtered = [...state.products];
            
            // Apply category filter
            if (state.selectedCategory) {
                filtered = filtered.filter(product => product.category === state.selectedCategory);
            }
            
            // Apply search query
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                filtered = filtered.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    product.description.toLowerCase().includes(query)
                );
            }
            
            // Apply price range
            filtered = filtered.filter(product => 
                product.price >= state.priceRange.min && 
                product.price <= state.priceRange.max
            );
            
            // Apply other filters
            if (state.selectedFilters.sustainable) {
                filtered = filtered.filter(product => product.sustainable);
            }
            
            if (state.selectedFilters.sale) {
                filtered = filtered.filter(product => product.onSale);
            }
            
            if (state.selectedFilters.inStock) {
                filtered = filtered.filter(product => product.inStock);
            }
            
            // Apply sorting
            switch (state.sortBy) {
                case 'price-low-high':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high-low':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name-a-z':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-z-a':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'newest':
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                // Default sorting is by featured/popularity
                default:
                    filtered.sort((a, b) => b.rating - a.rating);
            }
            
            state.filteredProducts = filtered;
        },
        
        getPagedProducts() {
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            return state.filteredProducts.slice(startIndex, endIndex);
        },
        
        getTotalPages() {
            return Math.ceil(state.filteredProducts.length / state.itemsPerPage);
        },
        
        // Purchase history methods
        getPurchaseHistory() {
            if (!state.user) return [];
            
            // In a real app, this would come from a server
            // For demo, we'll use localStorage
            const allPurchases = JSON.parse(localStorage.getItem('ecoGearPurchases')) || [];
            return allPurchases.filter(purchase => purchase.userId === state.user.id);
        },
        
        addPurchase(purchase) {
            if (!state.user) return false;
            
            const purchases = JSON.parse(localStorage.getItem('ecoGearPurchases')) || [];
            
            const newPurchase = {
                id: Date.now().toString(),
                userId: state.user.id,
                items: [...state.cart],
                total: this.getCartTotal(),
                date: new Date().toISOString(),
                status: 'processing',
                ...purchase
            };
            
            purchases.push(newPurchase);
            localStorage.setItem('ecoGearPurchases', JSON.stringify(purchases));
            
            // Clear cart after purchase
            this.clearCart();
            
            return newPurchase;
        }
    };

    // Return the state and methods
    return {
        state,
        ...methods
    };
};

// Create a global store instance
const store = createStore();