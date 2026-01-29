// Load announcements for home page
async function loadAnnouncements() {
    const container = document.getElementById('announcements-container');
    
    try {
        const data = await apiCall('/api/announcements');
        
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No announcements at the moment.</p>';
            return;
        }

        container.innerHTML = data.slice(0, 3).map(announcement => `
            <div class="card">
                <div class="card-content">
                    <span style="display: inline-block; padding: 0.3rem 1rem; background: ${
                        announcement.type === 'event' ? 'var(--accent-color)' : 'var(--secondary-color)'
                    }; color: white; border-radius: 20px; font-size: 0.85rem; margin-bottom: 1rem;">
                        ${announcement.type === 'event' ? '📅 Event' : '📢 Announcement'}
                    </span>
                    <h3>${announcement.title}</h3>
                    <p>${announcement.content.substring(0, 150)}${announcement.content.length > 150 ? '...' : ''}</p>
                    ${announcement.event_date ? `
                        <p style="margin-top: 1rem; color: var(--accent-color); font-weight: 600;">
                            📆 ${new Date(announcement.event_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    ` : ''}
                </div>
            </div>
        `).join('');
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

        container.innerHTML = data.slice(0, 3).map(program => `
            <div class="card" onclick="window.location.href='/pages/programs.html#program-${program.id}'">
                ${program.image_url ? `
                    <img src="${program.image_url}" alt="${program.title}" class="card-image" 
                         onerror="this.src='https://via.placeholder.com/400x250?text=${encodeURIComponent(program.title)}'">
                ` : `
                    <div class="card-image" style="background: linear-gradient(135deg, var(--secondary-color), var(--primary-color)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                        📚
                    </div>
                `}
                <div class="card-content">
                    <h3>${program.title}</h3>
                    <p>${program.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent-color);">Failed to load programs.</p>';
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
    loadProgramsPreview();
});
