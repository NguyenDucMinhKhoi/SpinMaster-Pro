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
            "#3369e8", "#d50f25", "#eeb211", "#009925", 
            "#ff887c", "#dc2127", "#f3b562", "#8ebca7"
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

        this.names.forEach((name, index) => {
            const color = this.colors[index % this.colors.length];
            gradientStr.push(`${color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`);

            const span = document.createElement("span");
            span.className = "wheel-label";
            span.innerText = name;
            const rotateAngle = (index * segmentAngle) + (segmentAngle / 2);
            span.style.transform = `rotate(${rotateAngle}deg) translateX(120px)`;
            this.wheel.appendChild(span);
        });

        this.wheel.style.background = `conic-gradient(${gradientStr.join(", ")})`;
        this.wheel.style.transform = `rotate(0deg)`;
        this.currentRotation = 0;
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
        if (this.spinCount < this.riggedOrder.length && this.names.includes(this.riggedOrder[this.spinCount])) {
            selectedName = this.riggedOrder[this.spinCount];
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

        return {
            winner: selectedName,
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
}

// Export for use in main app
window.WheelManager = WheelManager;
