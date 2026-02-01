// Load announcements for home page
async function loadAnnouncements() {
    const container = document.getElementById('announcements-container');

    try {
        const data = await apiCall('/api/announcements');

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No announcements at the moment.</p>';
            return;
        }

        container.innerHTML = data.slice(0, 3).map((announcement, index) => `
            <div class="card reveal stagger-${index + 1}">
                <div class="card-content">
                    <span style="display: inline-block; padding: 0.3rem 1rem; background: ${announcement.type === 'event' ? 'var(--accent-color)' : 'var(--gradient-trust)'}; color: white; border-radius: 20px; font-size: 0.85rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ${announcement.type === 'event' ? '📅 Event' : '📢 Announcement'}
                    </span>
                    <h3>${announcement.title}</h3>
                    <p>${announcement.content.substring(0, 150)}${announcement.content.length > 150 ? '...' : ''}</p>
                    ${announcement.event_date ? `
                        <p style="margin-top: 1rem; color: var(--accent-color); font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="ri-calendar-line"></i> ${new Date(announcement.event_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                        </p>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Re-observe newly added cards
        setTimeout(() => {
            const cards = container.querySelectorAll('.card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        }, 100);
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-color);">Failed to load announcements.</p>';
    }
}

// Load programs preview for home page
async function loadProgramsPreview() {
    const container = document.getElementById('programs-container');

    try {
        const data = await apiCall('/api/programs');

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No programs available at the moment.</p>';
            return;
        }

        container.innerHTML = data.slice(0, 3).map((program, index) => `
            <div class="card reveal stagger-${index + 1}" onclick="window.location.href='/pages/programs.html#program-${program.id}'">
                ${program.image_url ? `
                    <img src="${program.image_url}" alt="${program.title}" class="card-image" 
                         onerror="this.src='https://via.placeholder.com/400x250?text=${encodeURIComponent(program.title)}'">
                ` : `
                    <div class="card-image" style="background: var(--gradient-trust); display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">
                        <i class="${getProgramIcon(program.title)} float-animation"></i>
                    </div>
                `}
                <div class="card-content">
                    <h3>${program.title}</h3>
                    <p>${program.description}</p>
                </div>
            </div>
        `).join('');

        // Re-observe newly added cards
        setTimeout(() => {
            const cards = container.querySelectorAll('.card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        }, 100);
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-color);">Failed to load programs.</p>';
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
    loadProgramsPreview();
});

// Helper to get relevant icon based on title
function getProgramIcon(title) {
    const t = title.toLowerCase();
    if (t.includes('education') || t.includes('school') || t.includes('learn') || t.includes('study')) return 'ri-book-open-line';
    if (t.includes('health') || t.includes('medical') || t.includes('care') || t.includes('hospital')) return 'ri-heart-pulse-line';
    if (t.includes('food') || t.includes('hunger') || t.includes('feed') || t.includes('nutrition')) return 'ri-restaurant-line';
    if (t.includes('environment') || t.includes('nature') || t.includes('tree') || t.includes('planet')) return 'ri-plant-line';
    if (t.includes('water') || t.includes('clean')) return 'ri-drop-line';
    if (t.includes('women') || t.includes('girl')) return 'ri-women-line';
    if (t.includes('house') || t.includes('home') || t.includes('shelter')) return 'ri-home-heart-line';
    return 'ri-hand-heart-line'; // Default fallback
}

// Bulb Feature
document.addEventListener('DOMContentLoaded', () => {
    const lightsUpBtn = document.getElementById('lights-up-btn');
    const bulb = document.getElementById('glowing-bulb');

    if (lightsUpBtn && bulb) {
        lightsUpBtn.addEventListener('click', () => {
            bulb.classList.toggle('glowing');

            const isGlowing = bulb.classList.contains('glowing');
            if (isGlowing) {
                // Change style to indicate "on" state
                lightsUpBtn.innerHTML = '<i class="ri-lightbulb-line" style="margin-right: 8px;"></i> Lights Off';
                lightsUpBtn.style.background = '#facc15'; // Yellow-400
                lightsUpBtn.style.color = '#1e293b'; // Slate-800
                lightsUpBtn.style.boxShadow = '0 0 15px rgba(250, 204, 21, 0.4)';
            } else {
                // Revert to original style
                lightsUpBtn.innerHTML = '<i class="ri-lightbulb-flash-line" style="margin-right: 8px;"></i> Lights Up';
                lightsUpBtn.style.background = 'white';
                lightsUpBtn.style.color = 'var(--accent-color)';
                lightsUpBtn.style.boxShadow = 'none';
            }
        });
    }
});
