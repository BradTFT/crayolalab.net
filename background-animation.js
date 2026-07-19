// AI DISCLOSURE:
// This portion of the website was generated using Google Gemini on July 18th, 2026

const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');

// Configuration variables
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let particles = [];
const properties = {
    particleRadius: 1,
    maxVelocity: 0.2,
    particleColor: 'rgba(56, 189, 248, 0.7)',
    lineColor: 'rgba(56, 189, 248, 0.15)',
    // These will now be set dynamically
    particleCount: 0,
    lineLength: 0, 
};

const cursor = {
    x: null,
    y: null,
    radius: 0 
};

// --- DYNAMIC SCALING LOGIC ---
function updateResponsiveProperties() {
    // 1. Calculate count based on screen area (approx. 1 particle per 3,000 pixels)
    const screenArea = width * height;
    properties.particleCount = Math.floor(screenArea / 3000); 
    
    // Cap the maximum particles to prevent performance hits on ultrawide monitors
    if (properties.particleCount > 800) properties.particleCount = 800;

    // 2. Scale line lengths and cursor radius based on screen width
    if (width < 768) { // Mobile
        properties.lineLength = 120;
        cursor.radius = 120;
    } else if (width < 1024) { // Tablet
        properties.lineLength = 180;
        cursor.radius = 180;
    } else { // Desktop
        properties.lineLength = 250;
        cursor.radius = 250;
    }
}

// Handle window resizing seamlessly
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Recalculate properties and re-initialize the particle array on resize
    updateResponsiveProperties();
    init();
});

// Capture cursor movements
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

// Clear cursor position when mouse leaves the viewport
window.addEventListener('mouseout', () => {
    cursor.x = null;
    cursor.y = null;
});

// Node Object Blueprint
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.velocityX = (Math.random() * 2 - 1) * properties.maxVelocity;
        this.velocityY = (Math.random() * 2 - 1) * properties.maxVelocity;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0 || this.x > width) this.velocityX *= -1;
        if (this.y < 0 || this.y > height) this.velocityY *= -1;

        if (cursor.x !== null && cursor.y !== null) {
            const dx = cursor.x - this.x;
            const dy = cursor.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < cursor.radius) {
                const force = (cursor.radius - distance) / cursor.radius;
                this.x += (dx / distance) * force * 1.5;
                this.y += (dy / distance) * force * 1.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = properties.particleColor;
        ctx.fill();
    }
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < properties.lineLength) {
                const opacity = 1 - (distance / properties.lineLength);
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.2})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function init() {
    // Clear existing particles before populating (crucial for resize events)
    particles = [];
    for (let i = 0; i < properties.particleCount; i++) {
        particles.push(new Particle());
    }
}

function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawLines();
    requestAnimationFrame(loop);
}

// Launch the animation
updateResponsiveProperties();
init();
loop();