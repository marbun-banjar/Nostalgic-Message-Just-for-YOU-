document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BACKGROUND HATI PIXEL ---
    const heartContainer = document.getElementById('heart-container');
    const TOTAL_HEARTS = 25;

    function createStaticPixelHearts() {
        if (!heartContainer) return;
        heartContainer.innerHTML = '';

        for (let i = 0; i < TOTAL_HEARTS; i++) {
            const heartImg = document.createElement('img');
            heartImg.src = 'pixel-heart.png';
            heartImg.classList.add('heart-static-img');
            
            heartImg.style.left = Math.random() * 92 + 'vw';
            heartImg.style.top = Math.random() * 92 + 'vh';
            
            const size = Math.random() * 20 + 20; 
            heartImg.style.width = size + 'px';
            heartImg.style.height = 'auto';
            heartImg.style.opacity = (Math.random() * 0.15 + 0.1).toFixed(2);
            
            const rotation = Math.floor(Math.random() * 40) - 20;
            heartImg.style.transform = `rotate(${rotation}deg)`;
            
            heartContainer.appendChild(heartImg);
        }
    }

    createStaticPixelHearts();

    // --- 2. LOGIKA TRANSISI SCENE ---
    const btnToScene2 = document.getElementById('btn-to-scene2');
    const btnOpenEnvelope = document.getElementById('btn-open-envelope');
    const scene1 = document.getElementById('scene-1');
    const scene2 = document.getElementById('scene-2');
    const envelope = document.getElementById('envelope');
    const envelopeTextHint = document.getElementById('envelope-text-hint');
    const pointerArrow = document.getElementById('pointer-arrow');
    const paperNavControls = document.getElementById('paper-nav-controls');
    const pageIndicator = document.getElementById('page-indicator');

    if (btnToScene2) {
        btnToScene2.addEventListener('click', () => {
            scene1.classList.add('fade-out');

            setTimeout(() => {
                scene1.classList.remove('active', 'fade-out');
                scene1.classList.add('hidden');

                scene2.classList.remove('hidden');
                scene2.classList.add('active', 'fade-in');
            }, 400);
        });
    }

    if (btnOpenEnvelope) {
        btnOpenEnvelope.addEventListener('click', () => {
            envelope.classList.add('open');
            btnOpenEnvelope.style.display = 'none';
            
            if (envelopeTextHint) envelopeTextHint.style.opacity = '0';
            if (pointerArrow) pointerArrow.style.opacity = '0';

            setTimeout(() => {
                envelope.classList.add('paper-out');
                if (paperNavControls) paperNavControls.classList.remove('hidden');
            }, 600);
        });
    }

    // --- 3. NAVIGASI TUMPUKAN KERTAS (STACK PAPER) ---
    const papers = Array.from(document.querySelectorAll('.paper-page'));
    const btnNextPaper = document.getElementById('btn-next-paper');
    const btnPrevPaper = document.getElementById('btn-prev-paper');

    let currentPageIndex = 0;
    const totalPages = papers.length;
    let isAnimating = false;

    function updateNavUI() {
        if (pageIndicator) {
            pageIndicator.innerText = `${currentPageIndex + 1} / ${totalPages}`;
        }

        if (currentPageIndex === 0) {
            btnPrevPaper.classList.add('disabled');
            btnPrevPaper.disabled = true;
        } else {
            btnPrevPaper.classList.remove('disabled');
            btnPrevPaper.disabled = false;
        }

        if (currentPageIndex === totalPages - 1) {
            btnNextPaper.classList.add('disabled');
            btnNextPaper.disabled = true;
        } else {
            btnNextPaper.classList.remove('disabled');
            btnNextPaper.disabled = false;
        }
    }

    function reorderPapers() {
        papers.forEach((paper, index) => {
            paper.classList.remove('paper-active', 'paper-behind-1', 'paper-behind-2');

            if (index === currentPageIndex) {
                paper.classList.add('paper-active');
            } else if (index === currentPageIndex + 1) {
                paper.classList.add('paper-behind-1');
            } else {
                paper.classList.add('paper-behind-2');
            }
        });
    }

    // Tombol Next (Melempar Kertas Ke Belakang)
    if (btnNextPaper) {
        btnNextPaper.addEventListener('click', () => {
            if (isAnimating || currentPageIndex >= totalPages - 1) return;
            
            isAnimating = true;
            const currentPaper = papers[currentPageIndex];
            
            currentPaper.classList.add('anim-throw-back');

            setTimeout(() => {
                currentPageIndex++;
                reorderPapers();
                currentPaper.classList.remove('anim-throw-back');
                updateNavUI();
                isAnimating = false;
            }, 500);
        });
    }

    // Tombol Prev (Attract Kertas Ke Depan)
    if (btnPrevPaper) {
        btnPrevPaper.addEventListener('click', () => {
            if (isAnimating || currentPageIndex <= 0) return;

            isAnimating = true;
            const targetPaper = papers[currentPageIndex - 1];

            targetPaper.classList.add('anim-pull-front');

            setTimeout(() => {
                currentPageIndex--;
                reorderPapers();
                targetPaper.classList.remove('anim-pull-front');
                updateNavUI();
                isAnimating = false;
            }, 480);
        });
    }

    // Inisialisasi awal
    reorderPapers();
    updateNavUI();
});
