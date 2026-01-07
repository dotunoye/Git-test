
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

    // 1. The Page Switcher
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(page => {
                page.classList.remove('active');
            });

            // Deactivate all nav buttons
            document.querySelectorAll('nav button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Highlight selected button
            document.getElementById('nav-' + pageId).classList.add('active');
        }

        // Mechanics: Gear Ratio Logic
        function calcGear() {
            const driven = parseFloat(document.getElementById('teethDriven').value);
            const driver = parseFloat(document.getElementById('teethDriver').value);

            if(driver > 0) {
                const ratio = driven / driver;
                let type = ratio > 1 ? "Torque Increase (Slower)" : "Speed Increase (Faster)";
                
                document.getElementById('gear-result').innerHTML = 
                    `Ratio: <strong style="color:#238636">${ratio.toFixed(2)}:1</strong> <br> <span style="font-size:0.8rem; color:#8b949e">${type}</span>`;
            }
        }