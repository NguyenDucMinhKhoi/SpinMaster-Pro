// Main Application
let wheelManager;
let uiManager;
let audioManager;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    wheelManager = new WheelManager();
    audioManager = new AudioManager();
    uiManager = new UIManager(wheelManager);

    // Thiết lập thứ tự điều hướng bí mật: 3 lần đầu sẽ ra Na -> Anh -> An
    wheelManager.setRiggedOrder(["Na", "Anh", "An"]);

    audioManager.init();
    uiManager.init();
});

// Spin function
function spinWheel() {
    if (wheelManager.isSpinning) return;

    const result = wheelManager.spin();
    if (!result) return;

    // Play sound effects
    audioManager.playTickingSound();

    // Show winner after spin
    setTimeout(() => {
        wheelManager.isSpinning = false;
        wheelManager.wheel.classList.remove('spinning');
        // Không bật lại animation, giữ nguyên vị trí
        uiManager.showWinnerModal(result.winner);
        audioManager.playApplause();
    }, result.duration);
}

// Close modal
function closeModal() {
    uiManager.closeWinnerModal();
    audioManager.stopApplause();
}

// Remove winner from list
function removeWinnerFromList() {
    const winnerName = document.getElementById('winnerName').innerText;
    uiManager.removeWinner(winnerName);
    audioManager.stopApplause();
}

// Utility functions for UI
function shuffleList() {
    uiManager.shuffleItems();
}

function sortList() {
    uiManager.sortItems();
}

function addNewItem() {
    uiManager.addItem();
}

function updateListFromTextarea() {
    if (uiManager && !uiManager.isUpdatingProgrammatically) {
        uiManager.loadFromTextarea();
    }
}

// Save/Load functionality
function saveToLocalStorage() {
    localStorage.setItem('wheelItems', JSON.stringify(uiManager.items));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('wheelItems');
    if (saved) {
        uiManager.items = JSON.parse(saved);
        uiManager.renderItemList();
        uiManager.updateWheel();
    }
}

// Auto-save on changes
setInterval(() => {
    if (uiManager && uiManager.items.length > 0) {
        saveToLocalStorage();
    }
}, 3000);
