// 지하철 경로 시뮬레이터 JavaScript 파일

document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let selectedProfile = '';
    let fromStation = '';
    let toStation = '';
    let timePreference = 'normal';
    let routePreference = 'optimal';
    
    // 요소 참조
    const profileOptions = document.querySelectorAll('.profile-option');
    const fromStationSelect = document.getElementById('from-station');
    const toStationSelect = document.getElementById('to-station');
    const timePreferenceSelect = document.getElementById('time-preference');
    const routePreferenceSelect = document.getElementById('route-preference');
    const findRouteBtn = document.getElementById('find-route');
    const demoResult = document.querySelector('.demo-result');
    const resultLoading = document.querySelector('.result-loading');
    const resultContent = document.querySelector('.result-content');
    const stationFilter = document.getElementById('station-filter');
    const elevatorItems = document.querySelectorAll('.elevator-item');
    const refreshStatusBtn = document.getElementById('refresh-status');
    const simulateElevatorFailureBtn = document.getElementById('simulate-elevator-failure');
    const simulateCongestionBtn = document.getElementById('simulate-congestion');
    const simulateHelpBtn = document.getElementById('simulate-help');
    const simulationResult = document.querySelector('.simulation-result');
    const routeModifyBtn = document.querySelector('.route-modify');
    const routeStartBtn = document.querySelector('.route-start');
    const feedbackForm = document.querySelector('.feedback-form');
    const ratingStars = document.querySelectorAll('.rating-stars .star');
    
    // 프로필 선택 이벤트
    if (profileOptions) {
        profileOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 이전 선택 제거
                profileOptions.forEach(opt => opt.classList.remove('selected'));
                
                // 새로운 선택 적용
                this.classList.add('selected');
                selectedProfile = this.getAttribute('data-profile');
                
                // 프로필에 따른 UI 조정
                updateUIForProfile(selectedProfile);
            });
        });
    }
    
    // 역 교환 버튼 이벤트
    const stationArrow = document.querySelector('.station-arrow');
    if (stationArrow) {
        stationArrow.addEventListener('click', function() {
            const fromValue = fromStationSelect.value;
            const toValue = toStationSelect.value;
            
            // 값 교환
            fromStationSelect.value = toValue;
            toStationSelect.value = fromValue;
            
            // 변수 업데이트
            fromStation = toValue;
            toStation = fromValue;
        });
    }
    
    // 선택 변경 이벤트
    if (fromStationSelect) {
        fromStationSelect.addEventListener('change', function() {
            fromStation = this.value;
        });
    }
    
    if (toStationSelect) {
        toStationSelect.addEventListener('change', function() {
            toStation = this.value;
        });
    }
    
    if (timePreferenceSelect) {
        timePreferenceSelect.addEventListener('change', function() {
            timePreference = this.value;
        });
    }
    
    if (routePreferenceSelect) {
        routePreferenceSelect.addEventListener('change', function() {
            routePreference = this.value;
        });
    }
    
    // 경로 찾기 버튼 이벤트
    if (findRouteBtn) {
        findRouteBtn.addEventListener('click', function() {
            // 입력 검증
            if (!selectedProfile) {
                alert('사용자 프로필을 선택해주세요.');
                return;
            }
            
            if (!fromStation) {
                alert('출발역을 선택해주세요.');
                return;
            }
            
            if (!toStation) {
                alert('도착역을 선택해주세요.');
                return;
            }
            
            if (fromStation === toStation) {
                alert('출발역과 도착역이 같습니다. 다른 역을 선택해주세요.');
                return;
            }
            
            // 경로 검색 시작
            demoResult.style.display = 'block';
            resultLoading.style.display = 'block';
            resultContent.style.display = 'none';
            
            // 경로 검색 결과를 표시하기 위한 타이머 (실제로는 API 호출 필요)
            setTimeout(function() {
                resultLoading.style.display = 'none';
                resultContent.style.display = 'block';
                
                // 경로 결과 업데이트
                updateRouteResult(fromStation, toStation, selectedProfile, timePreference, routePreference);
                
                // 페이지 스크롤
                resultContent.scrollIntoView({ behavior: 'smooth' });
            }, 2000);
        });
    }
    
    // 엘리베이터 상태 필터 이벤트
    if (stationFilter) {
        stationFilter.addEventListener('change', function() {
            const selectedStation = this.value;
            
            // 모든 역 표시 또는 선택된 역만 표시
            if (selectedStation === 'all') {
                elevatorItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                elevatorItems.forEach(item => {
                    if (item.getAttribute('data-station') === selectedStation) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // 상태 새로고침 버튼 이벤트
    if (refreshStatusBtn) {
        refreshStatusBtn.addEventListener('click', function() {
            // 새로고침 애니메이션
            this.classList.add('rotating');
            
            // 상태 업데이트 타이머 (실제로는 API 호출 필요)
            setTimeout(() => {
                // 현재 시간 업데이트
                const now = new Date();
                const timeString = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                document.querySelector('.status-update-time p').textContent = `마지막 업데이트: ${timeString}`;
                
                // 랜덤하게 일부 엘리베이터 상태 변경 (데모용)
                updateRandomElevatorStatus();
                
                // 새로고침 애니메이션 제거
                this.classList.remove('rotating');
            }, 1000);
        });
    }
    
    // 시뮬레이션 버튼 이벤트
    if (simulateElevatorFailureBtn) {
        simulateElevatorFailureBtn.addEventListener('click', function() {
            // 엘리베이터 고장 시뮬레이션
            simulateElevatorFailure();
        });
    }
    
    if (simulateCongestionBtn) {
        simulateCongestionBtn.addEventListener('click', function() {
            // 혼잡 상황 시뮬레이션
            simulateCongestion();
        });
    }
    
    if (simulateHelpBtn) {
        simulateHelpBtn.addEventListener('click', function() {
            // 긴급 도움 요청 시뮬레이션
            simulateEmergencyHelp();
        });
    }
    
    // 경로 수정/시작 버튼 이벤트
    if (routeModifyBtn) {
        routeModifyBtn.addEventListener('click', function() {
            // 결과 숨기고 다시 입력 폼으로 스크롤
            demoResult.style.display = 'none';
            document.querySelector('.demo-station-selector').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (routeStartBtn) {
        routeStartBtn.addEventListener('click', function() {
            alert('실제 앱에서는 내비게이션이 시작됩니다. 이 데모에서는 지원하지 않습니다.');
        });
    }
    
    // 별점 이벤트
    if (ratingStars) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                updateStarRating(rating);
            });
            
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                previewStarRating(rating);
            });
            
            star.addEventListener('mouseout', function() {
                resetStarRating();
            });
        });
    }
    
    // 피드백 폼 제출 이벤트
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            alert('소중한 의견 감사합니다. 더 나은 서비스 개발에 반영하겠습니다.');
            this.reset();
            resetStarRating();
        });
    }
    
    // 프로필에 따른 UI 업데이트 함수
    function updateUIForProfile(profile) {
        // 다양한 프로필에 따른 UI 조정
        switch (profile) {
            case 'wheelchair':
                routePreferenceSelect.value = 'less-elevator';
                break;
            case 'visually-impaired':
                // 시각장애인 프로필에 맞는 설정
                routePreferenceSelect.value = 'less-walking';
                break;
            case 'elderly':
                // 노인/보행약자 프로필에 맞는 설정
                routePreferenceSelect.value = 'less-walking';
                break;
            case 'hearing-impaired':
                // 청각장애인 프로필에 맞는 설정
                routePreferenceSelect.value = 'optimal';
                break;
        }
    }
    
    // 경로 결과 업데이트 함수
    function updateRouteResult(fromStation, toStation, profile, time, preference) {
        // 실제로는 API 응답 데이터를 기반으로 동적 업데이트 필요
        // 지금은 데모를 위한 하드코딩
        
        // 출발역-도착역 정보
        let fromStationName, toStationName;
        let fromStationLines, toStationLines;
        
        // 출발역 정보 설정
        switch (fromStation) {
            case 'yeongdeungpo-office':
                fromStationName = '영등포구청역';
                fromStationLines = '<span class="line-2">2호선</span><span class="line-5">5호선</span>';
                break;
            case 'dangsan':
                fromStationName = '당산역';
                fromStationLines = '<span class="line-2">2호선</span><span class="line-9">9호선</span>';
                break;
            case 'yeouido':
                fromStationName = '여의도역';
                fromStationLines = '<span class="line-9">9호선</span>';
                break;
            // 나머지 역들...
            default:
                fromStationName = '영등포구청역';
                fromStationLines = '<span class="line-2">2호선</span><span class="line-5">5호선</span>';
        }
        
        // 도착역 정보 설정
        switch (toStation) {
            case 'yeongdeungpo-office':
                toStationName = '영등포구청역';
                toStationLines = '<span class="line-2">2호선</span><span class="line-5">5호선</span>';
                break;
            case 'dangsan':
                toStationName = '당산역';
                toStationLines = '<span class="line-2">2호선</span><span class="line-9">9호선</span>';
                break;
            case 'yeouido':
                toStationName = '여의도역';
                toStationLines = '<span class="line-9">9호선</span>';
                break;
            // 나머지 역들...
            default:
                toStationName = '당산역';
                toStationLines = '<span class="line-2">2호선</span><span class="line-9">9호선</span>';
        }
        
        // UI 업데이트
        document.querySelector('.result-from .station-name').textContent = fromStationName;
        document.querySelector('.result-from .station-lines').innerHTML = fromStationLines;
        document.querySelector('.result-to .station-name').textContent = toStationName;
        document.querySelector('.result-to .station-lines').innerHTML = toStationLines;
        
        // 사용자 프로필에 따른 맞춤형 정보 표시
        let travelTime, walkingDistance, elevatorUse, transfers;
        
        switch (profile) {
            case 'wheelchair':
                travelTime = '20분';
                walkingDistance = '350m';
                elevatorUse = '3회';
                transfers = '1회';
                break;
            case 'visually-impaired':
                travelTime = '18분';
                walkingDistance = '300m';
                elevatorUse = '2회';
                transfers = '1회';
                break;
            case 'elderly':
                travelTime = '17분';
                walkingDistance = '280m';
                elevatorUse = '2회';
                transfers = '1회';
                break;
            case 'hearing-impaired':
                travelTime = '15분';
                walkingDistance = '320m';
                elevatorUse = '2회';
                transfers = '1회';
                break;
            default:
                travelTime = '15분';
                walkingDistance = '320m';
                elevatorUse = '2회';
                transfers = '1회';
        }
        
        // 시간대에 따른 조정
        if (time === 'rush-morning' || time === 'rush-evening') {
            // 출퇴근 시간에는 더 오래 걸림
            travelTime = (parseInt(travelTime) + 5) + '분';
        }
        
        // 경로 선호도에 따른 조정
        if (preference === 'less-walking') {
            walkingDistance = (parseInt(walkingDistance) - 100) + 'm';
            elevatorUse = (parseInt(elevatorUse) + 1) + '회';
        } else if (preference === 'less-elevator') {
            elevatorUse = (parseInt(elevatorUse) - 1) + '회';
            walkingDistance = (parseInt(walkingDistance) + 100) + 'm';
        } else if (preference === 'less-transfer') {
            transfers = '0회';
            travelTime = (parseInt(travelTime) + 3) + '분';
        }
        
        // 결과 정보 업데이트
        document.querySelectorAll('.info-item').forEach(item => {
            const label = item.querySelector('.info-label').textContent;
            if (label.includes('소요시간')) {
                item.querySelector('.info-value').textContent = travelTime;
            } else if (label.includes('이동거리')) {
                item.querySelector('.info-value').textContent = walkingDistance;
            } else if (label.includes('엘리베이터')) {
                item.querySelector('.info-value').textContent = elevatorUse;
            } else if (label.includes('환승')) {
                item.querySelector('.info-value').textContent = transfers;
            }
        });
    }
    
    // 랜덤 엘리베이터 상태 업데이트 함수 (데모용)
    function updateRandomElevatorStatus() {
        const elevatorUnits = document.querySelectorAll('.elevator-unit');
        
        // 랜덤하게 2개 선택
        const randomUnits = Array.from(elevatorUnits).sort(() => 0.5 - Math.random()).slice(0, 2);
        
        randomUnits.forEach(unit => {
            // 현재 상태 확인
            const isAvailable = unit.classList.contains('available');
            const isMaintenance = unit.classList.contains('maintenance');
            const isUnavailable = unit.classList.contains('unavailable');
            
            // 상태 변경 (순환: 정상 -> 점검 중 -> 고장 -> 정상)
            unit.classList.remove('available', 'maintenance', 'unavailable');
            
            let newStatus, statusHTML;
            if (isAvailable) {
                unit.classList.add('maintenance');
                statusHTML = '<i class="fas fa-tools"></i> 점검 중 (17:30 완료 예정)';
            } else if (isMaintenance) {
                unit.classList.add('unavailable');
                statusHTML = '<i class="fas fa-times-circle"></i> 고장 (수리 중, 18시 복구 예정)';
            } else {
                unit.classList.add('available');
                statusHTML = '<i class="fas fa-check-circle"></i> 정상 운행 중';
            }
            
            unit.querySelector('.unit-status').innerHTML = statusHTML;
        });
    }
    
    // 엘리베이터 고장 시뮬레이션 함수
    function simulateElevatorFailure() {
        // 특정 엘리베이터 고장 시뮬레이션
        const targetElevator = document.querySelector('[data-station="yeongdeungpo-office"] .elevator-unit:nth-child(1)');
        
        if (targetElevator) {
            // 상태 변경
            targetElevator.classList.remove('available', 'maintenance');
            targetElevator.classList.add('unavailable');
            targetElevator.querySelector('.unit-status').innerHTML = '<i class="fas fa-times-circle"></i> 고장 (수리 중, 현재 이용 불가)';
            
            // 시뮬레이션 결과 표시
            simulationResult.style.display = 'block';
            simulationResult.innerHTML = `
                <div class="simulation-alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>엘리베이터 고장 감지됨!</h3>
                    <p>영등포구청역 5호선 승강장 엘리베이터(E-01)가 고장났습니다.</p>
                    <div class="alert-actions">
                        <button class="btn-outline alert-action">우회 경로 보기</button>
                        <button class="btn-outline alert-action">역무원 연결</button>
                    </div>
                </div>
            `;
            
            // 알림 버튼 이벤트 연결
            document.querySelectorAll('.alert-action').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('실제 앱에서는 해당 기능이 실행됩니다. 이 데모에서는 지원하지 않습니다.');
                });
            });
            
            // 시뮬레이션 결과로 스크롤
            simulationResult.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // 혼잡 상황 시뮬레이션 함수
    function simulateCongestion() {
        // 혼잡 상황 시뮬레이션 결과 표시
        simulationResult.style.display = 'block';
        simulationResult.innerHTML = `
            <div class="simulation-alert congestion">
                <i class="fas fa-users"></i>
                <h3>혼잡 상황 알림</h3>
                <p>현재 당산역 2호선 승강장이 매우 혼잡합니다 (혼잡도: 90%).</p>
                <div class="congestion-info">
                    <div class="congestion-chart">
                        <div class="chart-bar" style="width: 90%;"></div>
                    </div>
                    <p>예상 대기 시간: 약 5-7분</p>
                </div>
                <div class="alert-message">
                    <p>추천: 15분 후 이동하거나 9호선을 이용하여 우회하세요.</p>
                </div>
                <div class="alert-actions">
                    <button class="btn-outline alert-action">대체 경로 보기</button>
                    <button class="btn-outline alert-action">알림 설정</button>
                </div>
            </div>
        `;
        
        // 알림 버튼 이벤트 연결
        document.querySelectorAll('.alert-action').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('실제 앱에서는 해당 기능이 실행됩니다. 이 데모에서는 지원하지 않습니다.');
            });
        });
        
        // 시뮬레이션 결과로 스크롤
        simulationResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 긴급 도움 요청 시뮬레이션 함수
    function simulateEmergencyHelp() {
        // 긴급 도움 요청 시뮬레이션 결과 표시
        simulationResult.style.display = 'block';
        simulationResult.innerHTML = `
            <div class="simulation-alert emergency">
                <i class="fas fa-ambulance"></i>
                <h3>긴급 도움 요청 시뮬레이션</h3>
                <p>현재 위치: 영등포구청역 5호선 승강장</p>
                <div class="emergency-status">
                    <div class="status-icon">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <div class="status-text">
                        <p>역무원 호출 중...</p>
                        <p>예상 도착 시간: 3분 이내</p>
                    </div>
                </div>
                <div class="emergency-options">
                    <button class="btn-outline emergency-option">
                        <i class="fas fa-phone"></i> 역무원 직통 전화
                    </button>
                    <button class="btn-outline emergency-option">
                        <i class="fas fa-user-friends"></i> 주변 도우미 요청
                    </button>
                    <button class="btn-outline emergency-option">
                        <i class="fas fa-volume-up"></i> 비상 알림 방송
                    </button>
                </div>
                <button class="cta-secondary cancel-emergency">긴급 요청 취소</button>
            </div>
        `;
        
        // 알림 버튼 이벤트 연결
        document.querySelectorAll('.emergency-option, .cancel-emergency').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('실제 앱에서는 해당 기능이 실행됩니다. 이 데모에서는 지원하지 않습니다.');
            });
        });
        
        // 시뮬레이션 결과로 스크롤
        simulationResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 별점 관련 함수들
    function updateStarRating(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            
            if (starRating <= rating) {
                star.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                star.innerHTML = '<i class="far fa-star"></i>';
            }
        });
    }
    
    function previewStarRating(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            
            if (starRating <= rating) {
                star.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                star.innerHTML = '<i class="far fa-star"></i>';
            }
        });
    }
    
    function resetStarRating() {
        ratingStars.forEach(star => {
            star.innerHTML = '<i class="far fa-star"></i>';
        });
    }
});
