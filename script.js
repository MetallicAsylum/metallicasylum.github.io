const container = document.getElementById('grid-container');
const slider = document.getElementById('radius');
const radiusLabel = document.getElementById('radiusVal');

function decRadius() {
    slider.value = Math.max(parseFloat(slider.value) - 0.5, parseFloat(slider.min));
    updateCircle();
}

function incRadius() {
    slider.value = Math.min(parseFloat(slider.value) + 0.5, parseFloat(slider.max));
    updateCircle();
}

function updateCircle() {
    const r = parseFloat(slider.value);
    radiusLabel.textContent = (Math.round(r * 10) / 10).toFixed(1);
    const size = (r * 2) + 1; 
    const center = size/2;

    // Clear container
    container.innerHTML = '';
    container.style.gridAutoFlow = '';
    // Set grid dimensions
    container.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    container.style.gridTemplateRows = `repeat(${size}, 20px)`;
    
    // Calculate total size
    const blockSize = 20;
    const gap = 1;
    const padding = 1;
    const totalSize = (size * blockSize) + ((size - 1) * gap) + (2 * padding);
    
    container.style.width = `${totalSize}px`;
    container.style.height = `${totalSize}px`;
    container.style.display = 'grid';
    container.style.gap = '1px';
    
    // Create blocks
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Create block (which is a grid container)
            const block = document.createElement('div');
            block.className = 'block';
            
            // Set explicit inline styles
            block.style.display = 'grid';
            block.style.gridTemplateColumns = '10px 10px';
            block.style.gridTemplateRows = '10px 10px';
            block.style.width = '20px';
            block.style.height = '20px';
            
            
            // Create 4 quadrants
            const quadrantOffsets = [
                { ox: 0.25, oy: 0.25 },
                { ox: 0.75, oy: 0.25 },
                { ox: 0.25, oy: 0.75 },
                { ox: 0.75, oy: 0.75 }
            ];

            const quadrants = [];
            let countActive = 0;
            quadrantOffsets.forEach(offset => {
                const quad = document.createElement('div');
                quad.className = 'quadrant';
                quad.innerHTML = '&nbsp;';
                quad.style.width = '10px';
                quad.style.height = '10px';
                const c = x == Math.floor(size/2) || y == Math.floor(size/2);
                quad.style.backgroundColor = c ? '#FCC' : '#EEE';
                if (Math.round(r) != r) {
                    const c = x == Math.floor(size/2)-1 || y == Math.floor(size/2)-1;
                    quad.style.backgroundColor = c ? '#FCC' : quad.style.backgroundColor;  
                }
                
                // Calculate distance
                const dx = x + offset.ox - center;
                const dy = y + offset.oy - center;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Circle logic
                if (Math.abs(dist - r) < 0.5) {
                    quad.classList.add('active');
                    quad.style.backgroundColor = '#D77';
                    countActive++;
                    quadrants.push({ element: quad, isActive: true });
                }
                
                block.appendChild(quad);
            });
             // Count active quadrants
            let blockType = '';
            if (countActive === 0) blockType = 'Empty Block';
            else if (countActive === 1) blockType = 'Trapdoor';
            else if (countActive === 2) blockType = 'Slab/Shelf';
            else if (countActive === 3) blockType = 'Stair';
            else if (countActive === 4) blockType = 'Full Block';
            
            // Add tooltip to block
            block.title = `${blockType}`;
            
            // Add data attribute for block type
            block.setAttribute('data-block-type', blockType.toLowerCase().replace(' ', '-'));
        // Color active quadrants if any
            if (countActive > 0) {
                block.style.outline = '1px solid #BBB';
                const colorMap = {
                    1: '#FFD166', // Trapdoor
                    2: '#4ECDC4', // Slab/Shelf
                    3: '#24c331', // Stairs
                    4: '#FF6B6B'  // Full Block
                };
            
                const activeColor = colorMap[countActive];
                quadrants.forEach(({ element, isActive }) => {
                    if (isActive) {
                        element.classList.add('active');
                        element.style.backgroundColor = activeColor;
                    }
                });
            }          
            container.appendChild(block);
        }
    }
}

// Initialize
slider.addEventListener('input', updateCircle);
updateCircle();