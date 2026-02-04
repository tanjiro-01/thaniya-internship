document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});

document.addEventListener('DOMContentLoaded', function() {
    const accessToggles = document.querySelectorAll('.access-toggle');
    const consentModal = document.getElementById('consentModal');
    const modalDoctorName = document.getElementById('modalDoctorName');
    const modalDuration = document.getElementById('modalDuration');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    
    let currentToggle = null;
    let currentDoctor = null;

    accessToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const doctorName = this.getAttribute('data-doctor');
            const isChecked = this.checked;
            const accessCard = this.closest('.access-card');
            const accessBadge = accessCard.querySelector('.access-badge');
            const accessDetails = accessCard.querySelector('.access-details');
            
            if (isChecked) {
                currentToggle = this;
                currentDoctor = doctorName;
                showConsentModal(doctorName);
            } else {
                revokeAccess(this, accessCard, accessBadge, accessDetails);
            }
        });
    });

    function showConsentModal(doctorName) {
        modalDoctorName.textContent = doctorName;
        modalDuration.textContent = '24 hours'; 
        consentModal.classList.add('show');
    }

    modalClose.addEventListener('click', closeConsentModal);
    modalCancel.addEventListener('click', closeConsentModal);
    
    modalConfirm.addEventListener('click', function() {
        if (currentToggle && currentDoctor) {
            const accessCard = currentToggle.closest('.access-card');
            const accessBadge = accessCard.querySelector('.access-badge');
            const accessDetails = accessCard.querySelector('.access-details');
            
            grantAccess(currentToggle, accessCard, accessBadge, accessDetails, currentDoctor);
            closeConsentModal();
        }
    });

    consentModal.addEventListener('click', function(e) {
        if (e.target === consentModal) {
            closeConsentModal();
        }
    });

    function closeConsentModal() {
        consentModal.classList.remove('show');
        if (currentToggle) {
            currentToggle.checked = false;
            currentToggle = null;
            currentDoctor = null;
        }
    }

    function grantAccess(toggle, card, badge, details, doctorName) {
        badge.textContent = 'Active';
        badge.classList.remove('inactive');
        badge.classList.add('active');
        
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
        
        details.innerHTML = `
            <p><i class="fas fa-clock"></i> Access granted: ${formatDate(now)}</p>
            <p><i class="fas fa-hourglass-half"></i> Duration: 24 hours</p>
            <p><i class="fas fa-calendar-check"></i> Expires: ${formatDate(expiryDate)}</p>
        `;
        
        addAccessLog(doctorName, 'Normal Access');
        
        showNotification('Access granted successfully', 'success');
    }

    function revokeAccess(toggle, card, badge, details) {
        badge.textContent = 'Inactive';
        badge.classList.remove('active');
        badge.classList.add('inactive');
        
        const lastAccess = new Date();
        details.innerHTML = `
            <p><i class="fas fa-clock"></i> Last access: ${formatDate(lastAccess)}</p>
            <p><i class="fas fa-hourglass-half"></i> Duration: 24 hours</p>
            <p><i class="fas fa-ban"></i> Currently revoked</p>
        `;
        
        showNotification('Access revoked successfully', 'info');
    }

    function formatDate(date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyStatus = document.getElementById('emergencyStatus');
    const emergencyTimer = document.getElementById('emergencyTimer');
    const timerValue = document.getElementById('timerValue');
    const biometricModal = document.getElementById('biometricModal');
    const biometricIcon = document.getElementById('biometricIcon');
    const biometricText = document.getElementById('biometricText');
    const biometricProgress = document.getElementById('biometricProgress');
    const progressFill = document.getElementById('progressFill');
    const biometricModalClose = document.getElementById('biometricModalClose');
    const biometricCancel = document.getElementById('biometricCancel');
    
    let emergencyTimerInterval = null;
    let emergencyActive = false;
    let remainingTime = 30 * 60; 

    emergencyBtn.addEventListener('click', function() {
        if (!emergencyActive) {
            showBiometricModal();
        } else {
            if (confirm('Emergency access is currently active. Do you want to revoke it now?')) {
                deactivateEmergencyAccess();
            }
        }
    });

    function showBiometricModal() {
        biometricModal.classList.add('show');
        biometricIcon.innerHTML = '<i class="fas fa-fingerprint"></i>';
        biometricText.textContent = 'Place your finger on the sensor';
        biometricProgress.style.display = 'none';
        progressFill.style.width = '0%';
        
        biometricIcon.addEventListener('click', startBiometricScan);
    }

    function startBiometricScan() {
        biometricIcon.classList.add('scanning');
        biometricText.textContent = 'Scanning...';
        biometricProgress.style.display = 'block';
        
        let progress = 0;
        const scanInterval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(scanInterval);
                setTimeout(() => {
                    biometricIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    biometricIcon.classList.remove('scanning');
                    biometricText.textContent = 'Authentication successful!';
                    
                    setTimeout(() => {
                        activateEmergencyAccess();
                        closeBiometricModal();
                    }, 1000);
                }, 500);
            }
        }, 200);
    }

    function closeBiometricModal() {
        biometricModal.classList.remove('show');
        biometricIcon.removeEventListener('click', startBiometricScan);
    }

    biometricModalClose.addEventListener('click', closeBiometricModal);
    biometricCancel.addEventListener('click', closeBiometricModal);
    
    biometricModal.addEventListener('click', function(e) {
        if (e.target === biometricModal) {
            closeBiometricModal();
        }
    });

    function activateEmergencyAccess() {
        emergencyActive = true;
        remainingTime = 30 * 60; 
        
        emergencyStatus.innerHTML = `
            <div class="status-indicator active">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Emergency Access: Active</span>
            </div>
        `;
        emergencyTimer.style.display = 'block';
        emergencyBtn.textContent = 'Emergency Access Active';
        emergencyBtn.disabled = true;
        
        updateEmergencyIndicators(true);
        
        addAccessLog('Emergency Department', 'Emergency Access');
        
        startEmergencyTimer();
        
        showNotification('Emergency access activated for 30 minutes', 'emergency');
    }

    function startEmergencyTimer() {
        updateTimerDisplay();
        
        emergencyTimerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            
            if (remainingTime <= 0) {
                deactivateEmergencyAccess();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
                if (remainingTime <= 300) { 
            timerValue.style.color = 'var(--status-emergency)';
        }
    }

    function deactivateEmergencyAccess() {
        emergencyActive = false;
        
        if (emergencyTimerInterval) {
            clearInterval(emergencyTimerInterval);
            emergencyTimerInterval = null;
        }
        
        emergencyStatus.innerHTML = `
            <div class="status-indicator inactive">
                <i class="fas fa-shield-alt"></i>
                <span>Emergency Access: Inactive</span>
            </div>
        `;
        emergencyTimer.style.display = 'none';
        emergencyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Activate Emergency Access';
        emergencyBtn.disabled = false;
        
        updateEmergencyIndicators(false);
        
        showNotification('Emergency access has been automatically revoked', 'info');
    }

    function updateEmergencyIndicators(isActive) {
        const emergencyIndicator = document.getElementById('emergencyIndicator');
        const emergencyIndicatorText = document.getElementById('emergencyIndicatorText');
        
        if (isActive) {
            emergencyIndicator.classList.add('emergency');
            emergencyIndicatorText.textContent = 'Currently active - expires in ' + Math.floor(remainingTime / 60) + ' minutes';
        } else {
            emergencyIndicator.classList.remove('emergency');
            emergencyIndicatorText.textContent = 'Currently inactive';
        }
    }
});

function addAccessLog(accessor, accessType) {
    const accessLog = document.querySelector('.access-log');
    if (!accessLog) return;
    
    const now = new Date();
    const timeString = formatTime(now);
    const dateString = formatDate(now);
    
    const isEmergency = accessType === 'Emergency Access';
    const logIconClass = isEmergency ? 'emergency-log' : 'normal';
    const logBadgeClass = isEmergency ? 'emergency-log' : 'normal';
    const iconClass = isEmergency ? 'fa-ambulance' : 'fa-user-md';
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <div class="log-icon ${logIconClass}">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="log-content">
            <h4>${accessor}</h4>
            <p>${dateString} at ${timeString}</p>
            <span class="log-badge ${logBadgeClass}">${accessType}</span>
        </div>
    `;
    
    accessLog.insertBefore(logEntry, accessLog.firstChild);
    
    while (accessLog.children.length > 10) {
        accessLog.removeChild(accessLog.lastChild);
    }
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-success {
                border-left: 4px solid var(--status-active);
            }
            .notification-info {
                border-left: 4px solid var(--primary-blue);
            }
            .notification-emergency {
                border-left: 4px solid var(--status-emergency);
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
            document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'info': 'fa-info-circle',
        'emergency': 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-info-circle';
}

function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Secure Patient Medical Record Portal initialized');
    console.log('All data is encrypted and access-controlled');


    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = String(new Date().getFullYear());
    }


    const backToTopBtn = document.getElementById('backToTop');
    const updateBackToTopVisibility = () => {
        if (!backToTopBtn) return;
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    updateBackToTopVisibility();
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

