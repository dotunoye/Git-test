
    function calcSeries() {
        // Get values (default to 0 if empty)
        let r1 = parseFloat(document.getElementById('s_r1').value) || 0;
        let r2 = parseFloat(document.getElementById('s_r2').value) || 0;
        let r3 = parseFloat(document.getElementById('s_r3').value) || 0;

        // The Math
        let total = r1 + r2 + r3;

        // Display
        document.querySelector('#series_result strong').innerHTML = total.toFixed(2) + " &Omega;";
        document.getElementById('series_result').style.display = 'block';
    }

    function calcParallel() {
        let r1 = parseFloat(document.getElementById('p_r1').value) || 0;
        let r2 = parseFloat(document.getElementById('p_r2').value) || 0;
        let r3 = parseFloat(document.getElementById('p_r3').value) || 0;

        // Avoid division by zero
        if(r1 === 0 && r2 === 0 && r3 === 0) return;

        // The Math: Using 0 for resistors that aren't connected would break the math 
        // (1/0 = Infinity), so we only count non-zero inputs.
        // This is the one tiny bit of "logic" needed to make it work.
        let reciprocalSum = 0;
        if (r1 > 0) reciprocalSum += (1 / r1);
        if (r2 > 0) reciprocalSum += (1 / r2);
        if (r3 > 0) reciprocalSum += (1 / r3);

        let total = 1 / reciprocalSum;

        // Display
        document.querySelector('#parallel_result strong').innerHTML = total.toFixed(2) + " &Omega;";
        document.getElementById('parallel_result').style.display = 'block';
    }

function showPage(pageId) {
    // 1. Hide ALL pages first
    // This assumes all your content divs have the class "page-section"
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // 2. Remove "active" class from ALL buttons
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Show the SPECIFIC page you clicked
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    } else {
        console.error("Could not find page with ID:", pageId);
    }

    // 4. Highlight the clicked button
    // We try to find the button that corresponds to this page
    // (Assuming button ID is 'nav-' + pageId, e.g., 'nav-physics-lab')
    // Note: You might need to adjust your button IDs to match this pattern exactly, 
    // OR just pass 'this' into the function if you want to be simpler.
    
    // Simpler way: Find the button that calls this function? 
    // Actually, let's just target the specific IDs you set up:
    
    let activeBtnId = "";
    if(pageId === 'home') activeBtnId = 'nav-home';
    if(pageId === 'electronics') activeBtnId = 'nav-electronics';
    if(pageId === 'mechanics') activeBtnId = 'nav-mechanics';
    if(pageId === 'robotics') activeBtnId = 'nav-robotics';
    if(pageId === 'physics-lab') activeBtnId = 'nav-physics'; // Matches the ID in Step 1
    if(pageId === 'physics1-lab') activeBtnId = 'nav-physics1';
    
    const activeBtn = document.getElementById(activeBtnId);
    if(activeBtn) activeBtn.classList.add('active');
}

        // Power Calculation (P = V * I)
function calcPower() {
    const V = parseFloat(document.getElementById('p_voltage').value);
    const I = parseFloat(document.getElementById('p_current').value);
    
    if(!isNaN(V) && !isNaN(I)) {
        const P = V * I;
        document.getElementById('power-result').innerHTML = 
            `Power: <strong style="color:#238636">${P.toFixed(2)} W</strong>`;
    }
}

// Capacitor Energy (E = 0.5 * C * V^2)
function calcCapEnergy() {
    const uF = parseFloat(document.getElementById('c_farads').value);
    const V = parseFloat(document.getElementById('c_voltage').value);
    
    if(!isNaN(uF) && !isNaN(V)) {
        // Convert microFarads to Farads
        const C = uF / 1000000;
        const E = 0.5 * C * (V * V);
        document.getElementById('cap-result').innerHTML = 
            `Energy: <strong style="color:#238636">${E.toFixed(4)} J</strong>`;
    }
}

// --- BUOYANCY SIMULATION ENGINE ---

const canvas = document.getElementById('buoyancyCanvas');
const ctx = canvas.getContext('2d');

// Simulation Variables
let objY = 50;       // Initial position
let velocity = 0;    // Initial velocity
let boxSize = 60;    // Size of the block (visual)
const waterLevel = 200; // Y-coordinate where water starts

// Physics Constants (Scaled for visuals)
const g = 0.5;       // Gravity scalar for canvas
const damping = 0.95; // Simulates water resistance/drag

// Inputs
const rhoObjInput = document.getElementById('rho-obj');
const rhoFluidInput = document.getElementById('rho-fluid');

// UI Update Loop
function updatePhysics() {
    // 1. Get Values
    let rhoObj = parseInt(rhoObjInput.value);
    let rhoFluid = parseInt(rhoFluidInput.value);
    
    // Update labels
    document.getElementById('val-rho-obj').innerText = rhoObj;
    document.getElementById('val-rho-fluid').innerText = rhoFluid;

    // 2. Physics Calculation
    // Mass is proportional to density (Assuming Volume = 1 for simplicity)
    let mass = rhoObj / 500; 
    let weight = mass * g;

    // Buoyancy Logic
    let submergedDepth = 0;
    let bottomOfBox = objY + boxSize;

    if (bottomOfBox > waterLevel) {
        // Calculate how much of the box is underwater (0 to boxSize)
        submergedDepth = Math.min(bottomOfBox - waterLevel, boxSize);
    }

    // Upthrust = DensityFluid * VolumeSubmerged * g
    // (We scale VolumeSubmerged to be 0.0 -> 1.0 fraction of the box)
    let volumeFraction = submergedDepth / boxSize;
    
    // Buoyancy Force scalar
    let buoyancy = (rhoFluid / 500) * volumeFraction * g; 

    // Net Force = W - Fb (Down is positive in Canvas Y-axis)
    let netForce = weight - buoyancy;
    
    // Acceleration = F/m
    let acceleration = netForce / mass;

    // Euler Integration (Velocity & Position)
    velocity += acceleration;
    velocity *= damping; // Apply drag
    objY += velocity;

    // Floor Collision (Tank Bottom)
    if (objY + boxSize > canvas.height) {
        objY = canvas.height - boxSize;
        velocity *= -0.5; // Bounce slightly
    }

    // 3. Update Stats Text
    document.getElementById('stat-weight').innerText = (weight * 100).toFixed(0);
    document.getElementById('stat-buoyancy').innerText = (buoyancy * 100).toFixed(0);
    
    let state = "Floating";
    if(rhoObj > rhoFluid) state = "Sinking";
    if(Math.abs(rhoObj - rhoFluid) < 20) state = "Neutral";
    document.getElementById('stat-state').innerText = state;

    drawFrame(submergedDepth, weight, buoyancy);
    requestAnimationFrame(updatePhysics);
}

// Drawing Loop
function drawFrame(submergedDepth, weight, buoyancy) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Water
    ctx.fillStyle = "rgba(56, 139, 253, 0.4)"; // Transparent Blue
    ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);
    
    // Water Surface Line
    ctx.beginPath();
    ctx.moveTo(0, waterLevel);
    ctx.lineTo(canvas.width, waterLevel);
    ctx.strokeStyle = "#58a6ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Draw The Box
    ctx.fillStyle = "#8b949e"; // Metallic Grey
    ctx.fillRect(canvas.width / 2 - boxSize / 2, objY, boxSize, boxSize);
    
    // Draw Submerged Part (Darker to show it's wet/underwater)
    if (submergedDepth > 0) {
        ctx.fillStyle = "rgba(33, 38, 45, 0.6)";
        ctx.fillRect(canvas.width / 2 - boxSize / 2, objY + (boxSize - submergedDepth), boxSize, submergedDepth);
    }

    // 3. Draw Force Vectors (The Physics Lesson)
    let centerX = canvas.width / 2;
    let centerY = objY + boxSize / 2;

    // Gravity Vector (Red, Down)
    drawArrow(centerX, centerY, weight * 20, "red"); 

    // Buoyancy Vector (Blue, Up)
    if (buoyancy > 0) {
        // Start arrow slightly offset so they don't overlap perfectly
        drawArrow(centerX + 10, centerY, -buoyancy * 20, "#58a6ff"); 
    }
}

// Helper: Draw Arrow
function drawArrow(x, y, length, color) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + length);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(x, y + length);
    ctx.lineTo(x - 5, y + length - (Math.sign(length) * 5));
    ctx.lineTo(x + 5, y + length - (Math.sign(length) * 5));
    ctx.fillStyle = color;
    ctx.fill();
}

// Start the engine
updatePhysics();