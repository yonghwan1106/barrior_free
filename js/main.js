// 메인 JavaScript 파일

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // 아이콘 변경 (메뉴 <-> X)
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 스크롤 이벤트
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 이용자 의견 슬라이더 (간단한 구현)
    const testimonials = [
        {
            content: "당산역에서 환승할 때마다 세 번의 엘리베이터 탑승과 긴 이동 거리로 인해 30분 이상이 소요되며, 특히 혼잡시간대에는 더욱 어렵습니다. 이 앱이 있다면 큰 도움이 될 것 같아요.",
            author: "B씨, 지체장애인"
        },
        {
            content: "영등포구청역에서 5호선으로 환승할 때 어디로 가야 할지 몰라 항상 혼란스러웠는데, 이 앱을 통해 최적의 경로를 찾을 수 있다면 정말 좋을 것 같습니다.",
            author: "A씨, 휠체어 이용자"
        },
        {
            content: "이동 전에 필요한 정보를 얻기 위해 여러 앱과 전화 문의를 병행해야 하는 번거로움이 있었습니다. 모든 정보가 한 앱에 통합되면 정말 편리할 것 같아요.",
            author: "D씨, 시각장애인"
        },
        {
            content: "여의도역에서 영등포구청역까지 가려면 직통 노선이 없어 환승이 필요한데, 어느 경로가 장애인에게 최적인지 알 수 없어 매번 시행착오를 겪습니다.",
            author: "C씨, 장애인 권익단체 활동가"
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialContainer = document.querySelector('.testimonial-slider');
    
    // 초기 테스티모니얼 표시
    if (testimonialContainer) {
        updateTestimonial();
        
        // 5초마다 테스티모니얼 변경
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial();
        }, 5000);
    }
    
    // 테스티모니얼 업데이트 함수
    function updateTestimonial() {
        const testimonial = testimonials[currentTestimonial];
        
        // 페이드 아웃 효과
        testimonialContainer.style.opacity = 0;
        
        setTimeout(function() {
            testimonialContainer.innerHTML = `
                <div class="testimonial-item">
                    <div class="testimonial-content">
                        <p>"${testimonial.content}"</p>
                    </div>
                    <div class="testimonial-author">
                        <p><strong>${testimonial.author.split(',')[0]}</strong>, ${testimonial.author.split(',')[1]}</p>
                    </div>
                </div>
            `;
            
            // 페이드 인 효과
            testimonialContainer.style.opacity = 1;
        }, 500);
    }
    
    // 스크롤 애니메이션
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-item');
    
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 모든 애니메이션 요소 관찰
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 부드러운 스크롤 링크
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴 닫기
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // 접근성 개선: 키보드 탐색 강화
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
});
