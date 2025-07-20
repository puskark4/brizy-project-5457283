// Ultron Developments Menu Enhancements
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }
    
    ready(function() {
        // Mobile menu functionality
        const mobileMenuIcon = document.querySelector('.brz-mm-menu__icon');
        const mobileMenu = document.querySelector('.brz-menu__mmenu');
        const body = document.body;
        
        if (mobileMenuIcon && mobileMenu) {
            // Toggle mobile menu
            mobileMenuIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = mobileMenu.classList.contains('brz-menu--active') || 
                                mobileMenu.classList.contains('brz-menu--opened');
                
                if (isActive) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuIcon.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                }
            });
            
            // Handle submenu toggles on mobile
            const submenuItems = mobileMenu.querySelectorAll('.brz-menu__item:has(.brz-menu__sub-menu)');
            submenuItems.forEach(function(item) {
                const link = item.querySelector('.brz-a');
                const submenu = item.querySelector('.brz-menu__sub-menu');
                
                if (link && submenu) {
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 991) {
                            e.preventDefault();
                            
                            // Toggle submenu visibility
                            const isOpen = submenu.style.display === 'block';
                            
                            // Close all other submenus
                            mobileMenu.querySelectorAll('.brz-menu__sub-menu').forEach(function(sub) {
                                sub.style.display = 'none';
                            });
                            
                            // Toggle current submenu
                            submenu.style.display = isOpen ? 'none' : 'block';
                            
                            // Add/remove active class
                            item.classList.toggle('submenu-open', !isOpen);
                        }
                    });
                }
            });
        }
        
        function openMobileMenu() {
            mobileMenu.classList.add('brz-menu--active', 'brz-menu--opened');
            body.classList.add('brz-menu-opened');
            mobileMenuIcon.setAttribute('aria-expanded', 'true');
            
            // Focus first menu item for accessibility
            const firstMenuItem = mobileMenu.querySelector('.brz-menu__item .brz-a');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 300);
            }
        }
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('brz-menu--active', 'brz-menu--opened');
            body.classList.remove('brz-menu-opened');
            mobileMenuIcon.setAttribute('aria-expanded', 'false');
            
            // Close all submenus
            mobileMenu.querySelectorAll('.brz-menu__sub-menu').forEach(function(sub) {
                sub.style.display = 'none';
            });
            
            mobileMenu.querySelectorAll('.brz-menu__item').forEach(function(item) {
                item.classList.remove('submenu-open');
            });
        }
        
        // Enhance desktop dropdown behavior
        const desktopMenu = document.querySelector('.brz-menu:not(.brz-menu__mmenu)');
        if (desktopMenu) {
            const dropdownItems = desktopMenu.querySelectorAll('.brz-menu__item:has(.brz-menu__sub-menu)');
            
            dropdownItems.forEach(function(item) {
                const submenu = item.querySelector('.brz-menu__sub-menu');
                let hoverTimeout;
                
                item.addEventListener('mouseenter', function() {
                    clearTimeout(hoverTimeout);
                    if (window.innerWidth > 991) {
                        submenu.style.display = 'block';
                        setTimeout(() => submenu.classList.add('visible'), 10);
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 991) {
                        hoverTimeout = setTimeout(() => {
                            submenu.classList.remove('visible');
                            setTimeout(() => submenu.style.display = 'none', 300);
                        }, 100);
                    }
                });
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991) {
                closeMobileMenu();
                
                // Reset mobile submenu displays
                document.querySelectorAll('.brz-menu__mmenu .brz-menu__sub-menu').forEach(function(sub) {
                    sub.style.display = '';
                });
            }
        });
        
        // Improve keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const activeElement = document.activeElement;
                const mobileMenuVisible = mobileMenu && 
                    (mobileMenu.classList.contains('brz-menu--active') || 
                     mobileMenu.classList.contains('brz-menu--opened'));
                
                if (mobileMenuVisible) {
                    const focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Add ARIA attributes for accessibility
        if (mobileMenuIcon) {
            mobileMenuIcon.setAttribute('aria-label', 'Toggle navigation menu');
            mobileMenuIcon.setAttribute('aria-expanded', 'false');
            mobileMenuIcon.setAttribute('role', 'button');
        }
        
        if (mobileMenu) {
            mobileMenu.setAttribute('role', 'navigation');
            mobileMenu.setAttribute('aria-label', 'Mobile navigation');
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        closeMobileMenu();
                        
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                }
            });
        });
        
        // Add loading states
        document.querySelectorAll('.brz-menu__item .brz-a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                    this.classList.add('loading');
                    
                    setTimeout(() => {
                        this.classList.remove('loading');
                    }, 2000);
                }
            });
        });
    });
    
    // Add CSS for loading states
    const loadingStyles = `
        .brz-menu__item .brz-a.loading {
            opacity: 0.7 !important;
            pointer-events: none !important;
        }
        
        .brz-menu__item .brz-a.loading::after {
            content: '...' !important;
            animation: dots 1s infinite !important;
        }
        
        @keyframes dots {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        .brz-menu__sub-menu.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
            pointer-events: auto !important;
        }
        
        .brz-menu__item.submenu-open > .brz-a::after {
            content: '▼' !important;
            float: right !important;
            transform: rotate(180deg) !important;
            transition: transform 0.3s ease !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
})();