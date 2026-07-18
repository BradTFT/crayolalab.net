// AI DISCLOSURE:
// This portion of the website was generated using Google Gemini 3 Fast  on July 18th, 2026


const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');

// Configuration variables
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const properties = {
    particleCount: 775,          // Number of nodes on screen
    particleRadius: 1,         // Size of each node
    maxVelocity: 0.2,            // Speed of autonomous movement
    lineLength: 250,             // Max distance to draw lines between nodes
    particleColor: 'rgba(56, 189, 248, 0.7)', // Tech blue nodes
    lineColor: 'rgba(56, 189, 248, 0.15)',    // Faint connection lines
};

// Track cursor coordinates and attraction radius
const cursor = {
    x: null,
    y: null,
    radius: 250 // Distance within which nodes are pulled to the cursor
};

// Handle window resizing seamlessly
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
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
        // Autonomous movement vector over time
        this.velocityX = (Math.random() * 2 - 1) * properties.maxVelocity;
        this.velocityY = (Math.random() * 2 - 1) * properties.maxVelocity;
    }

    update() {
        // 1. Autonomous Movement
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > width) this.velocityX *= -1;
        if (this.y < 0 || this.y > height) this.velocityY *= -1;

        // 2. Cursor Attraction Logic
        if (cursor.x !== null && cursor.y !== null) {
            const dx = cursor.x - this.x;
            const dy = cursor.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Pull particle closer if inside the cursor radius
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

// Draw the connecting web lines based on node proximity
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < properties.lineLength) {
                // Fade lines out dynamically the further apart the nodes get
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

// Initialize the particle array
function init() {
    for (let i = 0; i < properties.particleCount; i++) {
        particles.push(new Particle());
    }
}

// High-performance animation loop
function loop() {
    ctx.clearRect(0, 0, width, height);

    // Update and redraw all nodes
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawLines();
    requestAnimationFrame(loop);
}

// Launch the animation
init();
loop();