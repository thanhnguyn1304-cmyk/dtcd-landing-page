document.addEventListener('DOMContentLoaded', () => {
    
    // --- GSAP TIMELINE CHO WELCOME INTRO ---
    // Khởi tạo timeline của GSAP
    const introTl = gsap.timeline({
        onComplete: () => {
            // Khi toàn bộ hiệu ứng intro kết thúc
            document.body.classList.add('intro-done');
        }
    });

    // Hiện Coin 1 (Tung lên)
    introTl.to("#coin1", { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" })
           .to("#coin1", { opacity: 0, y: -30, scale: 1.2, duration: 0.3 }, "+=0.2")
    // Hiện Coin 2 (Lật mặt nhanh)
           .to("#coin2", { opacity: 1, y: 0, rotationY: 360, duration: 0.4, ease: "power2.out" }, "-=0.2")
           .to("#coin2", { opacity: 0, y: -30, scale: 1.2, duration: 0.3 }, "+=0.2")
    // Hiện Coin 3 (Phóng to ra)
           .to("#coin3", { opacity: 1, y: 0, scale: 1.1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2")
           .to("#coin3", { opacity: 0, scale: 2, duration: 0.4 }, "+=0.3") // Phóng to và mờ đi tạo cảm giác lao tới
           
      // Mờ dần đồng xu thật nhanh để nhường chỗ cho logo
      .to(".coin-container", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.2")
      
      // B5: Hiện Logo hoành tráng
      .add(() => {
          document.body.classList.add('logo-reveal');
      })
      
      // B6: Giữ Logo một mình chiếm trọn màn hình trong 2.5 giây trước khi cho chữ hiện lên
      .to({}, {duration: 2.5});


    // --- HIỆU ỨNG CUỘN TRANG (SCROLL) THU NHỎ LOGO ---
    window.addEventListener('scroll', () => {
        // Nếu người dùng cuộn quá 50px từ trên cùng
        if (window.scrollY > 50) {
            document.body.classList.add('is-scrolled');
        } else {
            // Cuộn ngược lên trên cùng
            document.body.classList.remove('is-scrolled');
        }
    });

    // --- CUSTOM FAN CAROUSEL (Hỗ trợ chạy song song 3 vòng xoay độc lập) ---
    function initCarousel(container) {
        if (!container) return;
        
        const cards = Array.from(container.querySelectorAll('.custom-card'));
        const N = cards.length;
        if (N === 0) return;
        
        let progress = 0; 
        let targetProgress = 0; 
        
        let isDragging = false;
        let startX = 0;
        let lastX = 0;
        let velocity = 0;
        
        // Thông số cấu hình quạt bài
        const SPACING = 120; 
        const DROP_Y = 25; 
        const ROTATION = 12; 
        
        function updateCards() {
            progress += (targetProgress - progress) * 0.1;
            
            cards.forEach((card, i) => {
                let offset = ((i - progress) % N + N) % N;
                if (offset > N/2) offset -= N;
                
                let absOffset = Math.abs(offset);
                
                let tx = offset * SPACING;
                let ty = absOffset * DROP_Y;
                let rot = offset * ROTATION;
                let z = 100 - Math.round(absOffset * 10); 
                
                let opacity = 1 - Math.max(0, absOffset - 4.0);
                if (opacity < 0) opacity = 0;
                
                card.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
                card.style.zIndex = z;
                card.style.opacity = opacity;
            });
            
            requestAnimationFrame(updateCards);
        }
        
        function dragStart(e) {
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
            } else {
                startX = e.clientX;
            }
            isDragging = true;
            lastX = startX;
            velocity = 0;
        }
        
        function dragMove(e) {
            if (!isDragging) return;
            let currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            let deltaX = currentX - lastX;
            lastX = currentX;
            
            velocity = deltaX; 
            targetProgress -= deltaX / SPACING; 
        }
        
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            targetProgress -= velocity * 0.8 / SPACING; 
            targetProgress = Math.round(targetProgress);
        }
        
        container.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('mouseleave', dragEnd);
        
        container.addEventListener('touchstart', dragStart, {passive: true});
        container.addEventListener('touchmove', dragMove, {passive: false});
        container.addEventListener('touchend', dragEnd);
        
        updateCards();
    }
    
    // --- HIỆU ỨNG GSAP ĐẬP HỘP ---
    function initBoxAnimation() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn("GSAP hoặc ScrollTrigger chưa được tải.");
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        let boxTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#box-presentation-area",
                start: "top 60%", // Kích hoạt khi cuộn đến 60% màn hình
                once: true // Chỉ hiệu ứng 1 lần
            }
        });

        boxTl.to("#the-game-box", {
            y: -20,
            rotation: 2,
            yoyo: true,
            repeat: 3,
            duration: 0.15,
            ease: "power1.inOut"
        })
        .to("#the-game-box", {
            scale: 0.8,
            opacity: 0.1,
            y: 80,
            duration: 0.6,
            ease: "power2.in"
        })
        .to(".carousels-wrapper", {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.1
        }, "-=0.2")
        .to(".carousel-column", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15, // Nổ ra từng vòng xoay
            ease: "back.out(1.2)"
        }, "-=0.2")
        .fromTo(".carousel-title", {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1
        }, "-=0.4");
    }

    // Tìm và gắn thuật toán cho tất cả các vòng xoay trên trang
    document.querySelectorAll('.custom-carousel-container').forEach(initCarousel);
    
    // Bắt đầu hiệu ứng hộp
    initBoxAnimation();

});
