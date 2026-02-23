// Wheel Management Module
class WheelManager {
    constructor() {
        this.names = [];
        this.currentRotation = 0;
        this.isSpinning = false;
        this.riggedOrder = []; // Thứ tự điều hướng bí mật
        this.riggedUsed = new Set(); // Theo dõi tên đã được rigged
        this.lastNamesSnapshot = ''; // Snapshot dé phát hiện thay đổi
        this.wheel = document.getElementById("wheel");
        this.pointer = document.querySelector(".pointer");
        this.colors = [
            "#3369e8", "#009925", "#EEB211", "#d50f25",
            "#3369e8", "#009925", "#EEB211", "#d50f25",
            "#3369e8", "#009925", "#EEB211", "#d50f25",
        ];
        this._startPointerColorUpdater();
    }

    updateWheel() {
        if (this.names.length < 1) {
            this.wheel.innerHTML = '';
            this.wheel.style.background = '#d0d0d0';
            this.wheel.style.transform = 'rotate(0deg)';
            this.currentRotation = 0;
            return;
        }

        this.wheel.innerHTML = "";
        const segmentAngle = 360 / this.names.length;
        let gradientStr = [];
        
        // Màu xen kẽ theo thứ tự, không shuffle
        // Tính kích thước để căn giữa chữ trong mỗi cánh cung
        const wheelRadius = this.wheel.offsetWidth / 2;
        const centerHubRadius = Math.max(25, wheelRadius * 0.14);
        const innerTextStart = centerHubRadius + 5;
        const outerTextEnd = wheelRadius * 0.95;
        const textLength = outerTextEnd - innerTextStart;

        // === FONT SIZE TỶ LỆ VỚI CÁNH CUNG ===
        const numNames = this.names.length;

        // Tính chiều rộng cung tại ~55% bán kính
        const textMidRadius = innerTextStart + textLength * 0.55;
        const segmentAngleRad = (segmentAngle / 2) * Math.PI / 180;
        const arcWidth = textMidRadius * 2 * Math.sin(segmentAngleRad);

        // Font size ~ 55% chiều cao cung — khớp tỷ lệ vòng nhỏ hơn
        const arcFontSize = arcWidth * 0.55;

        // Giới hạn phụ: tên dài thì co font để vừa chiều dài segment
        const maxNameLength = Math.max(...this.names.map(n => n.length));
        const lengthConstraint = (textLength * 0.88) / Math.max(maxNameLength * 0.52, 1);

        // Sàn tối thiểu & trần tối đa — tỷ lệ cao hơn cho vòng nhỏ
        const minSize = Math.max(11, wheelRadius * 0.055);
        const maxSize = wheelRadius * 0.26;
        const fontSize = Math.max(minSize, Math.min(arcFontSize, lengthConstraint, maxSize));

        // Font-weight
        const fontWeight = 300;

        this.names.forEach((name, index) => {
            const color = this.colors[index % this.colors.length];
            gradientStr.push(`${color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`);

            const span = document.createElement("span");
            span.className = "wheel-label";
            span.innerText = name;

            // Blue (#3369e8) và Red (#d50f25) → chữ trắng, Green (#009925) và Yellow (#EEB211) → chữ đen
            if (color === "#3369e8" || color === "#d50f25") {
                span.style.color = "#fff";
            } else {
                span.style.color = "#000";
            }

            const rotateAngle = (index * segmentAngle) + (segmentAngle / 2);

            // Chữ bắt đầu gần rìa, hướng vào tâm
            const edgePadding = 5;
            const textStartFromCenter = outerTextEnd - edgePadding;
            span.style.fontSize = `${fontSize}px`;
            span.style.fontWeight = fontWeight;
            span.style.maxWidth = `${textLength * 0.95}px`;
            span.style.textAlign = 'right';
            span.style.transform = `rotate(${rotateAngle}deg) translate(${textStartFromCenter}px, -50%) translateX(-100%)`;
            this.wheel.appendChild(span);
        });

        this.wheel.style.background = `conic-gradient(from 90deg, ${gradientStr.join(", ")})`;
        // KHÔNG reset transform - giữ nguyên vị trí hiện tại
    }

    setNames(names) {
        const sortedNew = [...names].sort().join('|');
        const sortedOld = [...this.names].sort().join('|');
        
        // Reset riggedUsed khi danh sách tên thay đổi
        if (sortedNew !== sortedOld) {
            this.riggedUsed = new Set();
        }
        
        this.names = names;
        this.updateWheel();
    }

    setRiggedOrder(order) {
        this.riggedOrder = order;
    }

    spin(targetName = null) {
        if (this.names.length < 1 || this.isSpinning) return null;
        this.isSpinning = true;
        
        // Tắt animation idle
        this.wheel.classList.add('spinning');
        this.wheel.style.animation = 'none';
        
        // Force reflow để đảm bảo transition hoạt động
        void this.wheel.offsetHeight;

        const segmentAngle = 360 / this.names.length;
        let targetIndex;
        let selectedName;

        // KỊCH BẢN BÍ MẬT: Tìm tên rigged tiếp theo còn trong danh sách
        // Trường hợp đặc biệt: 4 người có "An" → An ra đầu tiên
        let activeOrder = this.riggedOrder;
        if (this.names.length === 4 && this.names.includes("An")) {
            activeOrder = ["An"];
        }

        let riggedFound = false;
        for (const riggedName of activeOrder) {
            if (!this.riggedUsed.has(riggedName) && this.names.includes(riggedName)) {
                selectedName = riggedName;
                this.riggedUsed.add(riggedName);
                // Tìm TẤT CẢ các vị trí có tên này
                const allIndices = this.names.map((name, idx) => name === selectedName ? idx : -1)
                                             .filter(idx => idx !== -1);
                targetIndex = allIndices[Math.floor(Math.random() * allIndices.length)];
                riggedFound = true;
                break;
            }
        }
        if (!riggedFound) {
            targetIndex = Math.floor(Math.random() * this.names.length);
            selectedName = this.names[targetIndex];
        }

        // TÍNH GÓC QUAY
        // Vòng quay render từ 0° (3h) theo chiều kim đồng hồ
        // Mũi tên ở 3h tương đương 0° trong hệ gradient
        // Tính góc giữa của segment cần trúng
        const segmentStart = targetIndex * segmentAngle;
        const segmentCenter = segmentStart + (segmentAngle / 2);
        const randomOffset = (Math.random() * 0.6 - 0.3) * segmentAngle;
        
        // Góc cần quay = góc hiện tại cần đưa segment về vị trí 0° (3h)
        // targetRotation = 0° - (vị trí segment + offset) = -(vị trí segment + offset)
        let targetRotation = -(segmentCenter + randomOffset);
        
        // Chuẩn hóa về 0-360
        while (targetRotation < 0) targetRotation += 360;
        while (targetRotation >= 360) targetRotation -= 360;
        
        // Tính góc cần quay thêm từ vị trí hiện tại
        const currentPosition = this.currentRotation % 360;
        let additionalRotation = targetRotation - currentPosition;
        
        // Đảm bảo quay thuận chiều và ít nhất 8 vòng (nhiều hơn = hồi hộp hơn)
        if (additionalRotation < 0) {
            additionalRotation += 360;
        }
        const totalRotation = 2880 + additionalRotation; // 8 vòng
        const startRotation = this.currentRotation;
        const endRotation = startRotation + totalRotation;
        this.currentRotation = endRotation;

        // === ANIMATION HỒI HỘP: nhanh → chậm dần dần mượt mà ===
        const totalDuration = 8000; // 8 giây tổng
        const startTime = performance.now();

        // Easing mượt liên tục — không giật khi chuyển giai đoạn
        // Dùng ease-out bậc 4: nhanh ở đầu, chậm dần RẤT mượt về cuối
        // t=30% → đã đi 76% quãng đường (nhanh)
        // t=60% → đã đi 97% (chậm dần)
        // t=80% → đã đi 99.8% (rất chậm, từ từ nhích)
        // t=100% → 100% (dừng mượt, velocity = 0)
        const suspenseEasing = (t) => {
            return 1 - Math.pow(1 - t, 4);
        };

        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / totalDuration, 1);
            const progress = suspenseEasing(t);
            const currentAngle = startRotation + totalRotation * progress;
            this.wheel.style.transform = `rotate(${currentAngle}deg)`;

            // Cập nhật màu mũi tên realtime khi quay
            this.updatePointerColor();

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);

        const winnerColor = this.colors[targetIndex % this.colors.length];
        return {
            winner: selectedName,
            color: winnerColor,
            duration: totalDuration + 300 // chờ thêm chút sau khi dừng
        };
    }

    reset() {
        this.currentRotation = 0;
        this.isSpinning = false;
        this.riggedUsed = new Set();
        this.wheel.style.transition = 'none';
        this.wheel.style.transform = `rotate(0deg)`;
    }

    getColors() {
        return this.colors;
    }

    // Tính màu segment đang ở vị trí mũi tên (3h = 0°)
    getPointerColor() {
        if (this.names.length < 1) return "#009925";
        const segmentAngle = 360 / this.names.length;
        // Lấy góc hiện tại từ transform
        const style = window.getComputedStyle(this.wheel);
        const transform = style.transform;
        let angle = 0;
        if (transform && transform !== 'none') {
            const values = transform.split('(')[1]?.split(')')[0]?.split(',');
            if (values && values.length >= 2) {
                const a = parseFloat(values[0]);
                const b = parseFloat(values[1]);
                angle = Math.atan2(b, a) * (180 / Math.PI);
            }
        }
        // Chuẩn hóa về 0-360
        angle = ((angle % 360) + 360) % 360;
        // Mũi tên ở 3h = 0° trong hệ gradient (from 90deg)
        // Segment index tại vị trí mũi tên
        const pointerAngle = (360 - angle) % 360;
        const index = Math.floor(pointerAngle / segmentAngle) % this.names.length;
        return this.colors[index % this.colors.length];
    }

    // Cập nhật màu mũi tên
    updatePointerColor() {
        if (this.pointer) {
            this.pointer.style.borderTopColor = this.getPointerColor();
        }
    }

    // Updater chạy liên tục khi idle (có animation CSS)
    _startPointerColorUpdater() {
        const update = () => {
            if (!this.isSpinning) {
                this.updatePointerColor();
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    shuffleColors() {
        // Fisher-Yates shuffle
        const shuffled = [...this.colors];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export for use in main app
window.WheelManager = WheelManager;
