/* 
============================================
  AGRON - Redesigned UI JavaScript
============================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Hero Slider Logic ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => {
            slide.classList.remove('active');
            // reset animation for re-triggering
            const contentElements = slide.querySelectorAll('.headline, .subheadline, .hero-buttons');
            contentElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; /* trigger reflow */
                el.style.animation = null;
            });
        });

        slides[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Auto slide
    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 6000);
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    startInterval();

    // --- Simple Cart Interaction ---
    const cartIcon = document.querySelector('.cart-icon');
    const cartCountEl = document.querySelector('.cart-count');
    let cartCount = 0;

    // Add dummy functionality to some links to test cart
    const actionBtns = document.querySelectorAll('.btn-yellow');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.innerText.includes('Products')) {
                e.preventDefault();
                cartCount++;
                cartCountEl.innerText = cartCount;
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // --- Back to Top Logic ---
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Scroll-Animated Floating Vegetable ---
    const floatingVeg = document.getElementById('floatingVeg');
    if (floatingVeg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            // Move vegetable from right to left based on scroll
            const moveX = -(scrolled * 0.6);
            floatingVeg.style.transform = `translateX(${moveX}px)`;
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const scrollElements = document.querySelectorAll('.animate-from-left, .animate-from-right, .animate-from-bottom');

    if (scrollElements.length > 0) {
        const elementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the element is visible
        });

        scrollElements.forEach(el => {
            elementObserver.observe(el);
        });
    }

    // --- Offcanvas Toggle (Event Delegation) ---
    // Using event delegation on document so it works even after loading.js injects navbar.html
    document.addEventListener('click', (e) => {
        // Open offcanvas
        const menuBtn = e.target.closest('.mobile-menu-btn');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const offcanvas = document.getElementById('offcanvas-sidebar');
            const overlay = document.getElementById('offcanvas-overlay');
            if (offcanvas && overlay) {
                offcanvas.classList.add('active');
                overlay.classList.add('active');
            }
        }

        // Close offcanvas via X button or overlay
        const closeBtn = e.target.closest('.offcanvas-close');
        const overlayClick = e.target.closest('.offcanvas-overlay');

        if (closeBtn || overlayClick) {
            const offcanvas = document.getElementById('offcanvas-sidebar');
            const overlay = document.getElementById('offcanvas-overlay');
            if (offcanvas && overlay) {
                offcanvas.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });

    // --- Projects Pagination Logic ---
    const projectPages = document.querySelectorAll('.projects-page');
    const pageNums = document.querySelectorAll('.page-num');
    const pagePrev = document.querySelector('.page-prev');
    const pageNext = document.querySelector('.page-next');
    let currentProjPage = 1;
    const totalProjPages = projectPages.length;

    if (projectPages.length > 0) {
        const updatePagination = (page) => {
            // Update active content
            projectPages.forEach((p, idx) => {
                if (idx + 1 === page) {
                    p.style.display = 'grid';
                    setTimeout(() => p.style.opacity = '1', 50);
                } else {
                    p.style.display = 'none';
                    p.style.opacity = '0';
                }
            });

            // Update active buttons
            pageNums.forEach(btn => {
                if (parseInt(btn.getAttribute('data-page')) === page) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Toggle Arrows
            if (pagePrev) pagePrev.style.display = page === 1 ? 'none' : 'flex';
            if (pageNext) pageNext.style.display = page === totalProjPages ? 'none' : 'flex';
        };

        // Click on page numbers
        pageNums.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentProjPage = parseInt(btn.getAttribute('data-page'));
                updatePagination(currentProjPage);
            });
        });

        // Click on prev/next arrows
        if (pagePrev) {
            pagePrev.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentProjPage > 1) {
                    currentProjPage--;
                    updatePagination(currentProjPage);
                }
            });
        }

        if (pageNext) {
            pageNext.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentProjPage < totalProjPages) {
                    currentProjPage++;
                    updatePagination(currentProjPage);
                }
            });
        }
    }

    // --- Advanced Shop Pagination & Filter Logic ---
    const allProductCards = Array.from(document.querySelectorAll('.product-card'));
    const itemsPerPage = 9;
    let currentFilteredCards = [...allProductCards];
    let currentPage = 1;

    const sliderTrack = document.querySelector('.slider-track');
    const minHandle = document.querySelector('.min-handle');
    const maxHandle = document.querySelector('.max-handle');
    const minLabel = document.getElementById('price-min-label');
    const maxLabel = document.getElementById('price-max-label');
    const sliderParent = document.querySelector('.price-slider');
    const shopPageBtns = document.querySelectorAll('.shop-pagination .page-num');
    const shopNextBtn = document.querySelector('.shop-pagination .page-next');
    const showingResultsText = document.getElementById('showing-results');

    const minVal = 0;
    const maxVal = 500;
    let minPercent = 6;
    let maxPercent = 56;

    let isDraggingMin = false;
    let isDraggingMax = false;

    if (sliderTrack && minHandle && maxHandle) {

        const applyFiltersAndPagination = () => {
            const currentMinPrice = Math.round((minPercent / 100) * maxVal);
            const currentMaxPrice = Math.round((maxPercent / 100) * maxVal);

            // 1. Filter by price
            currentFilteredCards = allProductCards.filter(card => {
                const priceElement = card.querySelector('.pc-price .current');
                if (priceElement) {
                    const priceText = priceElement.innerText.replace('$', '').trim();
                    const price = parseFloat(priceText);
                    return !isNaN(price) && price >= currentMinPrice && price <= currentMaxPrice;
                }
                return false;
            });

            // 2. Pagination Math
            const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;

            // 3. Hide all cards
            allProductCards.forEach(card => card.style.display = 'none');

            // 4. Show matching cards for current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const cardsToShow = currentFilteredCards.slice(startIndex, endIndex);
            cardsToShow.forEach(card => card.style.display = 'block');

            // 5. Update UI Text
            if (showingResultsText) {
                const startText = currentFilteredCards.length === 0 ? 0 : startIndex + 1;
                const endText = Math.min(endIndex, currentFilteredCards.length);
                showingResultsText.innerText = `Showing ${startText}–${endText} of ${currentFilteredCards.length} results`;
            }

            // 6. Update Pagination Buttons
            shopPageBtns.forEach(btn => {
                const targetPage = parseInt(btn.getAttribute('data-target'));
                if (targetPage <= totalPages) {
                    btn.style.display = 'flex';
                    if (targetPage === currentPage) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                } else {
                    btn.style.display = 'none';
                }
            });

            if (shopNextBtn) {
                shopNextBtn.style.display = currentPage < totalPages ? 'flex' : 'none';
            }
        };

        const updateSlider = () => {
            if (minPercent > maxPercent - 5) minPercent = maxPercent - 5;
            if (maxPercent < minPercent + 5) maxPercent = minPercent + 5;
            if (minPercent < 0) minPercent = 0;
            if (maxPercent > 100) maxPercent = 100;

            minHandle.style.left = `${minPercent}%`;
            maxHandle.style.left = `${maxPercent}%`;
            sliderTrack.style.left = `${minPercent}%`;
            sliderTrack.style.right = `${100 - maxPercent}%`;

            const currentMinPrice = Math.round((minPercent / 100) * maxVal);
            const currentMaxPrice = Math.round((maxPercent / 100) * maxVal);

            if (minLabel) {
                minLabel.innerText = `$${currentMinPrice}`;
                minLabel.style.left = `${minPercent}%`;
            }
            if (maxLabel) {
                maxLabel.innerText = `$${currentMaxPrice}`;
                maxLabel.style.left = `${maxPercent}%`;
            }

            applyFiltersAndPagination();
        };

        // Init
        updateSlider();

        // Slider events
        minHandle.addEventListener('mousedown', () => isDraggingMin = true);
        maxHandle.addEventListener('mousedown', () => isDraggingMax = true);

        document.addEventListener('mouseup', () => {
            isDraggingMin = false;
            isDraggingMax = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingMin && !isDraggingMax) return;
            const rect = sliderParent.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;

            if (isDraggingMin) {
                minPercent = percent;
            } else if (isDraggingMax) {
                maxPercent = percent;
            }
            updateSlider();
        });

        // Pagination events
        shopPageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(btn.getAttribute('data-target'));
                applyFiltersAndPagination();
                // scroll to top smoothly
                document.querySelector('.shop-section').scrollIntoView({ behavior: 'smooth' });
            });
        });

        if (shopNextBtn) {
            shopNextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage) || 1;
                if (currentPage < totalPages) {
                    currentPage++;
                    applyFiltersAndPagination();
                    document.querySelector('.shop-section').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // --- Quick View Modal Logic ---
    const quickViewModal = document.getElementById('quickViewModal');
    const qvOverlay = document.querySelector('.qv-overlay');
    const qvClose = document.querySelector('.qv-close');
    const qvPrev = document.querySelector('.qv-prev');
    const qvNext = document.querySelector('.qv-next');

    const qvImage = document.getElementById('qv-image');
    const qvTitle = document.getElementById('qv-title');
    const qvPrice = document.getElementById('qv-price');
    const qvQtyInput = document.getElementById('qv-qty-input');
    const qvMinus = document.querySelector('.qty-btn.minus');
    const qvPlus = document.querySelector('.qty-btn.plus');

    let currentQVIndex = 0;

    const openQuickView = (index) => {
        if (!currentFilteredCards || currentFilteredCards.length === 0) return;

        // Wrap around index
        if (index < 0) index = currentFilteredCards.length - 1;
        if (index >= currentFilteredCards.length) index = 0;

        currentQVIndex = index;
        const card = currentFilteredCards[currentQVIndex];

        // Extract data
        const img = card.querySelector('.pc-img img').src;
        const title = card.querySelector('.pc-title a').innerText;
        const priceHTML = card.querySelector('.pc-price').innerHTML;

        // Populate
        if (qvImage) qvImage.src = img;
        if (qvTitle) qvTitle.innerText = title;
        if (qvPrice) qvPrice.innerHTML = priceHTML;
        if (qvQtyInput) qvQtyInput.value = 1;

        // Show modal
        if (quickViewModal) {
            quickViewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeQuickView = () => {
        if (quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (quickViewModal) {
        if (qvClose) qvClose.addEventListener('click', closeQuickView);
        if (qvOverlay) qvOverlay.addEventListener('click', closeQuickView);

        if (qvPrev) qvPrev.addEventListener('click', () => openQuickView(currentQVIndex - 1));
        if (qvNext) qvNext.addEventListener('click', () => openQuickView(currentQVIndex + 1));

        if (qvMinus) {
            qvMinus.addEventListener('click', () => {
                let val = parseInt(qvQtyInput.value);
                if (val > 1) qvQtyInput.value = val - 1;
            });
        }
        if (qvPlus) {
            qvPlus.addEventListener('click', () => {
                let val = parseInt(qvQtyInput.value);
                qvQtyInput.value = val + 1;
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
                closeQuickView();
            }
        });

        // Attach click to eye buttons using event delegation
        const shopGrid = document.getElementById('main-shop-grid');
        if (shopGrid) {
            shopGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.pc-action-btn');
                if (btn && btn.querySelector('.fa-eye')) {
                    e.preventDefault();
                    const card = btn.closest('.product-card');
                    if (card) {
                        const index = currentFilteredCards.indexOf(card);
                        if (index !== -1) {
                            openQuickView(index);
                        }
                    }
                }
            });
        }
    }

    // --- Wishlist Modal Logic ---
    const wishlistModal = document.getElementById('wishlistModal');
    const wlOverlay = document.querySelector('.wl-overlay');
    const wlClose = document.querySelector('.wl-close');
    const wlContinue = document.querySelector('.wl-continue');
    const wlItemsContainer = document.getElementById('wl-items-container');
    const wlCountText = document.getElementById('wl-count-text');

    let wishlistItems = JSON.parse(localStorage.getItem('agron_wishlist')) || [];

    const saveWishlist = () => {
        localStorage.setItem('agron_wishlist', JSON.stringify(wishlistItems));
    };

    const updateWishlistUI = () => {
        if (!wlItemsContainer || !wlCountText) return;

        wlCountText.innerText = `Wishlist(${wishlistItems.length})`;
        wlItemsContainer.innerHTML = '';

        if (wishlistItems.length === 0) {
            wlItemsContainer.innerHTML = '<p style="text-align:center; color:#999; padding: 20px 0;">Your wishlist is empty.</p>';
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        wishlistItems.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'wl-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="wl-item-img">
                <div class="wl-item-details">
                    <h4 class="wl-item-title">${item.title}</h4>
                    <div class="wl-item-price">${item.priceHTML}</div>
                    <div class="wl-item-date">${currentDate}</div>
                    <div style="margin-top: 15px;">
                        <button class="wl-add-cart">Add to cart <i class="fa-solid fa-arrow-trend-up"></i></button>
                    </div>
                </div>
                <button class="wl-remove" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
            `;
            wlItemsContainer.appendChild(div);
        });

        // Add remove listeners
        document.querySelectorAll('.wl-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                wishlistItems.splice(idx, 1);
                saveWishlist();
                updateWishlistUI();
            });
        });
    };

    const openWishlist = () => {
        if (wishlistModal) {
            updateWishlistUI();
            wishlistModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeWishlist = () => {
        if (wishlistModal) {
            wishlistModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (wishlistModal) {
        if (wlClose) wlClose.addEventListener('click', closeWishlist);
        if (wlOverlay) wlOverlay.addEventListener('click', closeWishlist);
        if (wlContinue) wlContinue.addEventListener('click', closeWishlist);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && wishlistModal.classList.contains('active')) {
                closeWishlist();
            }
        });

        // Attach click to heart buttons using event delegation
        const shopGrid = document.getElementById('main-shop-grid');
        if (shopGrid) {
            shopGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.pc-action-btn');
                if (btn && btn.querySelector('.fa-heart')) {
                    e.preventDefault();
                    const card = btn.closest('.product-card');
                    if (card) {
                        const img = card.querySelector('.pc-img img').src;
                        const title = card.querySelector('.pc-title a').innerText;

                        let priceHTML = '';
                        const oldPrice = card.querySelector('.pc-price .old');
                        const currentPrice = card.querySelector('.pc-price .current');

                        // To match screenshot: Old price first, then current price
                        if (oldPrice) {
                            priceHTML += `<span class="old">${oldPrice.innerText}</span> `;
                        }
                        if (currentPrice) {
                            priceHTML += `<span class="current">${currentPrice.innerText}</span>`;
                        }

                        // Check if already in wishlist
                        const exists = wishlistItems.some(item => item.title === title);
                        if (!exists) {
                            wishlistItems.push({ img, title, priceHTML });
                            saveWishlist();
                        }
                        openWishlist();
                    }
                }
            });
        }
    }

    // --- Cart Sidebar Logic ---
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountText = document.getElementById('cart-count-text');
    const cartSubtotalPrice = document.getElementById('cart-subtotal-price');

    let cartItems = JSON.parse(localStorage.getItem('agron_cart')) || [];

    const saveCart = () => {
        localStorage.setItem('agron_cart', JSON.stringify(cartItems));
    };

    const renderCartPage = () => {
        const cartPageContainer = document.getElementById('cart-page-container');
        const cartPageSubtotal = document.getElementById('cart-page-subtotal-val');
        const cartPageTotal = document.getElementById('cart-page-total-val');
        if (!cartPageContainer) return;

        cartPageContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartPageContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999; padding: 50px 0; font-size: 18px;">Your cart is currently empty.</td></tr>';
            if (cartPageSubtotal) cartPageSubtotal.innerText = '$0.00';
            if (cartPageTotal) cartPageTotal.innerText = '$0.00';
            return;
        }

        let subtotal = 0;
        cartItems.forEach((item, index) => {
            const itemTotal = item.qty * item.price;
            subtotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="cart-product-col">
                    <button class="cart-remove-page-btn" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img-table">
                    <span class="cart-item-title-table"><a href="single_product.html">${item.title}</a></span>
                </td>
                <td class="cart-price-col">$${item.price.toFixed(2)}</td>
                <td class="cart-qty-col">
                    <div class="cart-page-qty">
                        <button class="cart-page-qty-minus" data-index="${index}">-</button>
                        <input type="text" value="${item.qty}" readonly>
                        <button class="cart-page-qty-plus" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="cart-subtotal-col">$${itemTotal.toFixed(2)}</td>
            `;
            cartPageContainer.appendChild(tr);
        });

        if (cartPageSubtotal) cartPageSubtotal.innerText = `$${subtotal.toFixed(2)}`;
        if (cartPageTotal) cartPageTotal.innerText = `$${subtotal.toFixed(2)}`;

        // Remove btn
        document.querySelectorAll('.cart-remove-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                saveCart();
                renderCartPage();
                updateCartUI(); // Update sidebar too
            });
        });

        // Plus/Minus btn
        document.querySelectorAll('.cart-page-qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (cartItems[idx].qty > 1) {
                    cartItems[idx].qty -= 1;
                    saveCart();
                    renderCartPage();
                    updateCartUI();
                }
            });
        });

        document.querySelectorAll('.cart-page-qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems[idx].qty += 1;
                saveCart();
                renderCartPage();
                updateCartUI();
            });
        });
    };

    renderCartPage();

    const renderCheckoutPage = () => {
        const checkoutItemsContainer = document.getElementById('checkout-items-container');
        const checkoutSubtotal = document.getElementById('checkout-subtotal-val');
        const checkoutTotal = document.getElementById('checkout-total-val');
        if (!checkoutItemsContainer) return;

        checkoutItemsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            checkoutItemsContainer.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#999; padding: 20px 0;">Your cart is empty.</td></tr>';
            if (checkoutSubtotal) checkoutSubtotal.innerText = '$0.00';
            if (checkoutTotal) checkoutTotal.innerText = '$0.00';
            return;
        }

        let subtotal = 0;
        cartItems.forEach(item => {
            const itemTotal = item.qty * item.price;
            subtotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.title} <strong class="item-qty">× ${item.qty}</strong></td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
            checkoutItemsContainer.appendChild(tr);
        });

        if (checkoutSubtotal) checkoutSubtotal.innerText = `$${subtotal.toFixed(2)}`;
        if (checkoutTotal) checkoutTotal.innerText = `$${subtotal.toFixed(2)}`;
    };

    renderCheckoutPage();

    // Coupon Form Toggle
    const showCouponBtn = document.getElementById('show-coupon-form');
    const couponForm = document.getElementById('checkout-coupon-form');
    if (showCouponBtn && couponForm) {
        showCouponBtn.addEventListener('click', (e) => {
            e.preventDefault();
            couponForm.classList.toggle('active');
        });
    }

    // Dynamic Country and State Populator
    const countrySelect = document.getElementById('country-select');
    const stateSelect = document.getElementById('state-select');

    if (countrySelect && stateSelect) {
        // Initialize Select2 first if jQuery is available
        const hasJQuery = typeof jQuery !== 'undefined';
        if (hasJQuery) {
            $('#country-select').select2();
            $('#state-select').select2();
        }

        // Fetch countries and states from API
        fetch('https://countriesnow.space/api/v0.1/countries/states')
            .then(response => response.json())
            .then(result => {
                if (!result.error) {
                    const countriesData = result.data;

                    // Populate countries
                    countriesData.forEach(country => {
                        const option = document.createElement('option');
                        option.value = country.name;
                        option.textContent = country.name;
                        countrySelect.appendChild(option);
                    });

                    // Trigger Select2 update if available
                    if (hasJQuery) {
                        $('#country-select').trigger('change');
                    }

                    // Handle country change (using jQuery if available for Select2 compatibility, otherwise vanilla)
                    const onChangeHandler = (e) => {
                        const selectedCountryName = e.target.value;
                        const countryInfo = countriesData.find(c => c.name === selectedCountryName);

                        // Clear states
                        stateSelect.innerHTML = '<option value="" disabled selected>Select State...</option>';

                        if (countryInfo && countryInfo.states && countryInfo.states.length > 0) {
                            countryInfo.states.forEach(state => {
                                const option = document.createElement('option');
                                option.value = state.name;
                                option.textContent = state.name;
                                stateSelect.appendChild(option);
                            });
                        } else {
                            const option = document.createElement('option');
                            option.value = "N/A";
                            option.textContent = "No States Available";
                            stateSelect.appendChild(option);
                        }

                        // Trigger Select2 update if available
                        if (hasJQuery) {
                            $('#state-select').trigger('change');
                        }
                    };

                    if (hasJQuery) {
                        $('#country-select').on('change', onChangeHandler);
                    } else {
                        countrySelect.addEventListener('change', onChangeHandler);
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching countries:", error);
                const option = document.createElement('option');
                option.value = "Other";
                option.textContent = "Other";
                countrySelect.appendChild(option.cloneNode(true));
                stateSelect.appendChild(option.cloneNode(true));
                if (hasJQuery) {
                    $('#country-select').trigger('change');
                    $('#state-select').trigger('change');
                }
            });
    }

    const updateCartUI = () => {
        if (!cartItemsContainer || !cartCountText) return;

        cartCountText.innerText = `Cart (${cartItems.length})`;
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; padding: 20px 0;">Your cart is empty.</p>';
            if (cartSubtotalPrice) cartSubtotalPrice.innerText = '$0.00';
            return;
        }

        let subtotal = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.qty * item.price;
            subtotal += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.qty} × $${item.price.toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
            `;
            cartItemsContainer.appendChild(div);
        });

        if (cartSubtotalPrice) cartSubtotalPrice.innerText = `$${subtotal.toFixed(2)}`;

        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                saveCart();
                updateCartUI();
                renderCartPage();
            });
        });
    };

    const openCart = () => {
        if (cartSidebar) {
            updateCartUI();
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeCart = () => {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (cartSidebar) {
        if (cartClose) cartClose.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
                closeCart();
            }
        });

        // Helper to add item to cart
        const addToCart = (img, title, priceText, qty = 1) => {
            const priceVal = parseFloat(priceText.replace('$', '').trim());
            if (isNaN(priceVal)) return;

            const existing = cartItems.find(item => item.title === title);
            if (existing) {
                existing.qty += qty;
            } else {
                cartItems.push({ img, title, price: priceVal, qty });
            }

            saveCart();
            renderCartPage();

            // Auto close Quick View if open
            if (quickViewModal && quickViewModal.classList.contains('active')) closeQuickView();

            openCart();
        };
        window.addToCart = addToCart;

        // 1. Attach to main grid basket buttons
        const shopGrid = document.getElementById('main-shop-grid');
        if (shopGrid) {
            shopGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.pc-action-btn');
                if (btn && btn.querySelector('.fa-basket-shopping')) {
                    e.preventDefault();
                    const card = btn.closest('.product-card');
                    if (card) {
                        const img = card.querySelector('.pc-img img').src;
                        const title = card.querySelector('.pc-title a').innerText;
                        const currentPriceEl = card.querySelector('.pc-price .current');
                        const priceText = currentPriceEl ? currentPriceEl.innerText : '$0';
                        addToCart(img, title, priceText, 1);
                    }
                }
            });
        }

        // 2. Attach to Quick View add to cart button
        const qvAddToCart = document.querySelector('.quick-view-modal .btn-green');
        if (qvAddToCart) {
            qvAddToCart.addEventListener('click', () => {
                const img = qvImage.src;
                const title = qvTitle.innerText;
                const card = currentFilteredCards[currentQVIndex];
                if (card) {
                    const currentPriceEl = card.querySelector('.pc-price .current');
                    const priceText = currentPriceEl ? currentPriceEl.innerText : '$0';
                    const qty = parseInt(qvQtyInput.value) || 1;
                    addToCart(img, title, priceText, qty);
                }
            });
        }

        // 3. Attach to Wishlist add to cart buttons
        if (wlItemsContainer) {
            wlItemsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.wl-add-cart');
                if (btn) {
                    const itemDiv = btn.closest('.wl-item');
                    const img = itemDiv.querySelector('.wl-item-img').src;
                    const title = itemDiv.querySelector('.wl-item-title').innerText;
                    const currentPriceEl = itemDiv.querySelector('.wl-item-price .current');
                    const priceText = currentPriceEl ? currentPriceEl.innerText : '$0';
                    addToCart(img, title, priceText, 1);
                }
            });
        }
    }

    // --- Single Product Page Logic ---
    // Tabs
    const spTabBtns = document.querySelectorAll('.sp-tab-btn');
    const spTabPanes = document.querySelectorAll('.sp-tab-pane');

    if (spTabBtns.length > 0) {
        spTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                spTabBtns.forEach(b => b.classList.remove('active'));
                spTabPanes.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Add active class to corresponding pane
                const targetId = `tab-${btn.dataset.target}`;
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // Quantity Selector
    const spMinusBtn = document.querySelector('.sp-minus');
    const spPlusBtn = document.querySelector('.sp-plus');
    const spQtyInput = document.getElementById('sp-qty-input');

    if (spMinusBtn && spPlusBtn && spQtyInput) {
        spMinusBtn.addEventListener('click', () => {
            let currentValue = parseInt(spQtyInput.value);
            if (currentValue > 1) {
                spQtyInput.value = currentValue - 1;
            }
        });

        spPlusBtn.addEventListener('click', () => {
            let currentValue = parseInt(spQtyInput.value);
            spQtyInput.value = currentValue + 1;
        });
    }

    // Add to Cart integration for Single Product
    const spAddToCartBtn = document.querySelector('.sp-add-to-cart');
    if (spAddToCartBtn) {
        spAddToCartBtn.addEventListener('click', () => {
            if (typeof window.addToCart === 'function') {
                const img = document.getElementById('main-product-img').src;
                const title = document.querySelector('.sp-title').innerText;
                const currentPriceEl = document.querySelector('.sp-price .current');
                const priceText = currentPriceEl ? currentPriceEl.innerText : '$0';
                const qty = parseInt(spQtyInput.value) || 1;

                addToCart(img, title, priceText, qty);
            }
        });
    }

    // Add to Wishlist integration for Single Product
    const spAddToWishlistBtn = document.querySelector('.sp-add-to-wishlist');
    if (spAddToWishlistBtn) {
        spAddToWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof openWishlist === 'function' && typeof wishlistItems !== 'undefined') {
                const img = document.getElementById('main-product-img').src;
                const title = document.querySelector('.sp-title').innerText;

                let priceHTML = '';
                const oldPrice = document.querySelector('.sp-price .old');
                const currentPrice = document.querySelector('.sp-price .current');

                if (oldPrice) {
                    priceHTML += `<span class="old">${oldPrice.innerText}</span> `;
                }
                if (currentPrice) {
                    priceHTML += `<span class="current">${currentPrice.innerText}</span>`;
                }

                const exists = wishlistItems.some(item => item.title === title);
                if (!exists) {
                    wishlistItems.push({ img, title, priceHTML });
                    saveWishlist();
                }
                openWishlist();
            }
        });
    }

    // Product Image Thumbnails interaction
    const spThumbnails = document.querySelectorAll('.sp-thumb');
    const mainProductImg = document.getElementById('main-product-img');

    if (spThumbnails.length > 0 && mainProductImg) {
        spThumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active from all
                spThumbnails.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                thumb.classList.add('active');
                // Change main image src
                const thumbImgSrc = thumb.querySelector('img').src;
                mainProductImg.src = thumbImgSrc;
            });
        });
    }

    // Weight Buttons interaction
    const weightBtns = document.querySelectorAll('.weight-btn');
    if (weightBtns.length > 0) {
        weightBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                weightBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // --- Wishlist Page Logic ---
    const wlPageContainer = document.getElementById('wishlist-page-container');
    if (wlPageContainer) {
        const renderWishlistPage = () => {
            wlPageContainer.innerHTML = '';
            if (wishlistItems.length === 0) {
                wlPageContainer.innerHTML = '<div style="text-align:center; padding: 30px; font-weight:600; color:#5a8e48;">Your wishlist is currently empty.</div>';
                return;
            }
            wishlistItems.forEach((item, idx) => {
                const div = document.createElement('div');
                div.className = 'wl-page-item';
                div.innerHTML = `
                    <button class="wl-remove-page-btn" data-index="${idx}"><i class="fa-solid fa-xmark"></i></button>
                    <div class="wl-page-img"><a href="single_product.html"><img src="${item.img}" alt="${item.title}"></a></div>
                    <div class="wl-page-info">
                        <h3 class="wl-page-title"><a href="single_product.html">${item.title}</a></h3>
                        <div class="wl-page-price">${item.priceHTML || '$0.00'}</div>
                    </div>
                    <div class="wl-page-action">
                        <button class="btn-green wl-add-cart-page-btn" data-index="${idx}">Add to cart <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:12px; margin-left:5px;"></i></button>
                    </div>
                `;
                wlPageContainer.appendChild(div);
            });

            // Remove logic
            document.querySelectorAll('.wl-remove-page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-index'));
                    wishlistItems.splice(idx, 1);
                    saveWishlist();
                    if (typeof updateWishlistUI === 'function') updateWishlistUI();
                    renderWishlistPage();
                });
            });

            // Add to cart logic
            document.querySelectorAll('.wl-add-cart-page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-index'));
                    const item = wishlistItems[idx];

                    const temp = document.createElement('div');
                    temp.innerHTML = item.priceHTML;
                    const currentPriceEl = temp.querySelector('.current');
                    const priceText = currentPriceEl ? currentPriceEl.innerText : (temp.innerText || '$0');

                    if (typeof window.addToCart === 'function') {
                        window.addToCart(item.img, item.title, priceText, 1);
                    }
                });
            });
        };
        renderWishlistPage();
    }
    // --- Authentication Logic (Login Routing) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const roleSelect = document.getElementById('role');
            const emailInput = document.getElementById('email');
            
            if (roleSelect && emailInput) {
                const role = roleSelect.value;
                const email = emailInput.value;
                
                // Save to localStorage
                localStorage.setItem('auth_role', role);
                localStorage.setItem('auth_email', email);
                
                // Check if account was created with this email
                const regEmail = localStorage.getItem('reg_email');
                if (regEmail && regEmail === email) {
                    const regName = localStorage.getItem('reg_first_name');
                    if (regName) {
                        localStorage.setItem('auth_first_name', regName);
                    }
                } else {
                    // Not registered or different email
                    localStorage.removeItem('auth_first_name');
                }
                
                // Redirect based on role
                if (role === 'admin') {
                    window.location.href = 'admin_dashboard.html';
                } else {
                    window.location.href = 'user_dashboard.html';
                }
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstNameInput = document.getElementById('first_name');
            const emailInput = document.getElementById('email');
            const roleSelect = document.getElementById('role');
            
            if (firstNameInput && emailInput && roleSelect) {
                // Save registered data
                localStorage.setItem('reg_first_name', firstNameInput.value);
                localStorage.setItem('reg_email', emailInput.value);
                localStorage.setItem('reg_role', roleSelect.value);
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }

});
