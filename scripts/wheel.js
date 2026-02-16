// Wheel Management Module
class WheelManager {
    constructor() {
        this.names = [];
        this.currentRotation = 0;
        this.isSpinning = false;
        this.spinCount = 0;
        this.riggedOrder = []; // Thứ tự điều hướng bí mật
        this.wheel = document.getElementById("wheel");
        this.colors = [
            "#3369e8", "#009925", "#EEB211", "#d50f25",
            "#3369e8", "#009925", "#EEB211", "#d50f25",
            "#3369e8", "#009925", "#EEB211", "#d50f25",
        ];
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

        // Font size cố định — chỉ co lại khi quá nhiều tên và cung quá hẹp
        const midRadius = (innerTextStart + outerTextEnd) / 2;
        const segmentAngleRad = (segmentAngle / 2) * Math.PI / 180;
        const arcWidth = midRadius * 2 * Math.sin(segmentAngleRad);
        const idealSize = wheelRadius * 0.17;
        const fontSize = Math.max(20, Math.min(idealSize, arcWidth * 0.75));

        this.names.forEach((name, index) => {
            const color = this.colors[index % this.colors.length];
            gradientStr.push(`${color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`);

            const span = document.createElement("span");
            span.className = "wheel-label";
            span.innerText = name;
            const rotateAngle = (index * segmentAngle) + (segmentAngle / 2);

            // Đặt chữ tại trung điểm giữa hub và rìa cánh cung
            const textCenter = (innerTextStart + outerTextEnd) / 2;
            span.style.fontSize = `${fontSize}px`;
            span.style.maxWidth = `${textLength * 0.95}px`;
            span.style.transform = `rotate(${rotateAngle}deg) translate(${textCenter}px, -50%) translateX(-50%)`;
            this.wheel.appendChild(span);
        });

        this.wheel.style.background = `conic-gradient(from 90deg, ${gradientStr.join(", ")})`;
        // KHÔNG reset transform - giữ nguyên vị trí hiện tại
    }

    setNames(names) {
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

        // KỊCH BẢN BÍ MẬT: Ưu tiên riggedOrder nếu có
        // Trường hợp đặc biệt: 4 người có "An" → An ra đầu tiên
        let activeRiggedOrder = this.riggedOrder;
        if (this.names.length === 4 && this.names.includes("An")) {
            activeRiggedOrder = ["An"];
        }

        if (this.spinCount < activeRiggedOrder.length && this.names.includes(activeRiggedOrder[this.spinCount])) {
            selectedName = activeRiggedOrder[this.spinCount];
            // Tìm TẤT CẢ các vị trí có tên này
            const allIndices = this.names.map((name, idx) => name === selectedName ? idx : -1)
                                         .filter(idx => idx !== -1);
            // Random chọn 1 trong các vị trí
            targetIndex = allIndices[Math.floor(Math.random() * allIndices.length)];
        } else {
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
        
        // Đảm bảo quay thuận chiều và ít nhất 6 vòng
        if (additionalRotation < 0) {
            additionalRotation += 360;
        }
        this.currentRotation += 2160 + additionalRotation;
        
        this.wheel.style.transform = `rotate(${this.currentRotation}deg)`;

        this.spinCount++;

        const winnerColor = this.colors[targetIndex % this.colors.length];
        return {
            winner: selectedName,
            color: winnerColor,
            duration: 5000
        };
    }

    reset() {
        this.currentRotation = 0;
        this.isSpinning = false;
        this.spinCount = 0;
        this.wheel.style.transform = `rotate(0deg)`;
    }

    getColors() {
        return this.colors;
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
