document.addEventListener('DOMContentLoaded', () => {
    
    // --- GSAP TIMELINE CHO WELCOME INTRO ---
    // Khởi tạo timeline của GSAP
    const tl = gsap.timeline({
        onComplete: () => {
            // Khi toàn bộ hiệu ứng intro kết thúc
            document.body.classList.add('intro-done');
        }
    });

    // B1: Coin 1 hiện lên từ từ
    tl.to("#coin1", { opacity: 1, duration: 1.5, ease: "power2.out" })
      
      // B2: Coin 2 hiện lên chồng khít (vẽ thêm nét đen), delay 0.5s so với lúc coin 1 đang hiện
      .to("#coin2", { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=0.5")
      
      // NGHỈ 1 CHÚT (Để người dùng nhìn rõ đồng xu hoàn chỉnh)
      .to({}, {duration: 0.5})

      // B4: Mờ dần đồng xu để nhường chỗ cho logo
      .to(".coin-container", { opacity: 0, duration: 1, ease: "power2.inOut" })
      
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

    // --- CUSTOM FAN CAROUSEL (Toán học xòe quạt độc quyền) ---
    function initCardFan() {
        const container = document.getElementById('card-fan');
        if (!container) return;
        
        const cards = Array.from(container.querySelectorAll('.custom-card'));
        const N = cards.length;
        
        let progress = 0; // Vị trí cuộn hiện tại
        let targetProgress = 0; // Vị trí cuộn mục tiêu (để làm mượt)
        
        let isDragging = false;
        let startX = 0;
        let lastX = 0;
        let velocity = 0;
        
        // Thông số cấu hình quạt bài
        const SPACING = 120; // Khoảng cách giãn ra hai bên (px)
        const DROP_Y = 25; // Độ rớt xuống của lá bài (px)
        const ROTATION = 12; // Góc nghiêng của lá bài (độ)
        
        function updateCards() {
            // Nội suy (Ease) để chuyển động mượt mà như bôi mỡ
            progress += (targetProgress - progress) * 0.1;
            
            cards.forEach((card, i) => {
                // Phép Toán Vòng Lặp Vô Tận (Modulo 2 chiều)
                let offset = ((i - progress) % N + N) % N;
                // Nếu khoảng cách lớn hơn nửa vòng, cho nó bọc qua đầu kia
                if (offset > N/2) offset -= N;
                
                let absOffset = Math.abs(offset);
                
                // Áp dụng khoảng cách, độ nghiêng và rớt
                let tx = offset * SPACING;
                let ty = absOffset * DROP_Y;
                let rot = offset * ROTATION;
                let z = 100 - Math.round(absOffset * 10); // Bài xa tâm sẽ chìm xuống dưới
                
                // Lá bài càng xa thì càng mờ dần và biến mất
                let opacity = 1 - Math.max(0, absOffset - 2.5);
                if (opacity < 0) opacity = 0;
                
                card.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
                card.style.zIndex = z;
                card.style.opacity = opacity;
            });
            
            requestAnimationFrame(updateCards);
        }
        
        // --- XỬ LÝ SỰ KIỆN KÉO VUỐT ---
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
            
            velocity = deltaX; // Ghi nhận vận tốc
            // Quy đổi pixel sang tiến trình (1 khoảng cách = 1 lá bài)
            targetProgress -= deltaX / SPACING; 
        }
        
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // Trượt theo quán tính khi buông tay
            targetProgress -= velocity * 0.8 / SPACING; 
            // Bắt dính (Snap) vào lá bài gần nhất
            targetProgress = Math.round(targetProgress);
        }
        
        // Gắn sự kiện Chuột
        container.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('mouseleave', dragEnd);
        
        // Gắn sự kiện Cảm ứng (Điện thoại)
        container.addEventListener('touchstart', dragStart, {passive: true});
        container.addEventListener('touchmove', dragMove, {passive: false});
        container.addEventListener('touchend', dragEnd);
        
        // Bắt đầu vòng lặp Render
        updateCards();
    }
    
    // Kích hoạt thuật toán
    initCardFan();

});
