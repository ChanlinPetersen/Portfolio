document.addEventListener('DOMContentLoaded', function() {
    // Enhanced smooth scrolling for all navigation links
    document.querySelectorAll('.navbar-nav a.nav-link').forEach(navLink => {
        navLink.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.style.boxShadow = window.scrollY > 50 
            ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    });

    // Quick View functionality
    const quickViewModal = new bootstrap.Modal('#quickViewModal');
    const carouselInner = document.getElementById('carousel-inner');
    
    // Game media configuration - Updated structure
    const gameMedia = {
        game1: [
            { 
                type: 'image', 
                src: 'images/image1.jpg', 
                alt: 'Game 1 Screenshot',
                aspectRatio: '16/9'
            },
            { 
                type: 'video', 
                src: 'videos/test1.mp4', 
                title: 'Game 1 Trailer',
                aspectRatio: '16/9',
                sources: [
                    { src: 'videos/test1.mp4', type: 'video/mp4' }
                ]
            }
        ],
        game2: [
            { 
                type: 'image', 
                src: 'images/image1.jpg', 
                alt: 'Game 1 Screenshot',
                aspectRatio: '16/9'
            },
            { 
                type: 'video', 
                src: 'videos/test1.mp4', 
                title: 'Game 1 Trailer',
                aspectRatio: '16/9',
                sources: [
                    { src: 'videos/test1.mp4', type: 'video/mp4' }
                ]
            }
        ],
        game3: [
            { 
                type: 'image', 
                src: 'images/image1.jpg', 
                alt: 'Game 1 Screenshot',
                aspectRatio: '16/9'
            },
            { 
                type: 'video', 
                src: 'videos/test1.mp4', 
                title: 'Game 1 Trailer',
                aspectRatio: '16/9',
                sources: [
                    { src: 'videos/test1.mp4', type: 'video/mp4' }
                ]
            }
        ]
    };

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = this.dataset.game;
            const media = gameMedia[gameId];
            
            // Update modal title
            document.getElementById('quickViewTitle').textContent = 
                this.closest('.card').querySelector('.card-title').textContent + ' Preview';
            
            // Clear previous content
            carouselInner.innerHTML = '';
            
            // Add new items with proper aspect ratio handling
            media.forEach((item, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                carouselItem.style.height = '100%';
                
                if (item.type === 'image') {
                    carouselItem.innerHTML = `
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <img src="${item.src}" 
                                 class="d-block img-fluid mh-100 mw-100" 
                                 alt="${item.alt}"
                                 style="object-fit: contain;">
                        </div>
                    `;
                } else if (item.type === 'video') {
                    const isYouTube = item.src.includes('youtube.com') || item.src.includes('youtu.be');
                    carouselItem.innerHTML = `
                        <div class="h-100 w-100 d-flex justify-content-center align-items-center">
                            ${isYouTube ? 
                                `<div class="ratio ratio-16x9 w-100 h-100">
                                    <iframe src="${item.src}?autoplay=1&mute=1" 
                                            title="${item.title}" 
                                            allowfullscreen
                                            allow="autoplay"
                                            class="border-0">
                                    </iframe>
                                </div>` :
                                `<video controls autoplay muted playsinline 
                                      class="h-100 w-100"
                                      style="object-fit: contain;">
                                    ${item.sources?.map(source => 
                                        `<source src="${source.src}" type="${source.type}">`
                                    ).join('')}
                                </video>`}
                        </div>
                    `;
                }
                
                carouselInner.appendChild(carouselItem);
            });
            
            quickViewModal.show();
            
            // Handle video autoplay after modal shows
            setTimeout(() => {
                const activeVideo = carouselInner.querySelector('.active video');
                if (activeVideo) {
                    activeVideo.play().catch(e => console.log('Autoplay prevented:', e));
                }
            }, 500);
        });
    });

    // Handle carousel slide events to pause/play videos
    document.getElementById('quickViewCarousel')?.addEventListener('slid.bs.carousel', function() {
        const activeItem = this.querySelector('.active');
        const videos = this.querySelectorAll('video');
        
        // Pause all videos first
        videos.forEach(video => video.pause());
        
        // Play active video if exists
        const activeVideo = activeItem.querySelector('video');
        if (activeVideo) {
            activeVideo.play().catch(e => console.log('Autoplay prevented:', e));
        }
    });
});

