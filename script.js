document.addEventListener('DOMContentLoaded', () => {

    // --- 1. BACKGROUND HATI PIXEL ---
    const heartContainer = document.getElementById('heart-container');
    const TOTAL_HEARTS = 25;

    function createStaticPixelHearts() {
        if (!heartContainer) return;
        heartContainer.innerHTML = '';

        for (let i = 0; i < TOTAL_HEARTS; i++) {
            const heartImg = document.createElement('img');
            // Gambar pixel heart via Data URL SVG agar pasti muncul tanpa file eksternal
            heartImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff4370"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
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

    // --- 2. TRANSISI SCENE 1 KE SCENE 2 ---
    const btnToScene2 = document.getElementById('btn-to-scene2');
    const scene1 = document.getElementById('scene-1');
    const scene2 = document.getElementById('scene-2');
    const pixelBox = scene1 ? scene1.querySelector('.pixel-box') : null;
    const scene2Content = document.getElementById('scene-2-content');

    if (btnToScene2 && pixelBox) {
        btnToScene2.addEventListener('click', () => {
            pixelBox.classList.remove('pop-in');
            pixelBox.classList.add('pop-out');

            setTimeout(() => {
                scene1.classList.remove('active');
                scene1.classList.add('hidden');

                scene2.classList.remove('hidden');
                scene2.classList.add('active');

                if (scene2Content) {
                    scene2Content.classList.remove('pop-out');
                    scene2Content.classList.add('pop-in');
                }
            }, 400);
        });
    }

    // --- 3. AMPLOP & KERTAS ---
    const btnOpenEnvelope = document.getElementById('btn-open-envelope');
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const envelopeTextHint = document.getElementById('envelope-text-hint');
    const pointerArrow = document.getElementById('pointer-arrow');

    const papers = Array.from(document.querySelectorAll('.paper-page'));
    const paperNavControls = document.getElementById('paper-nav-controls');
    const pageIndicator = document.getElementById('page-indicator');
    const btnNextPaper = document.getElementById('btn-next-paper');
    const btnPrevPaper = document.getElementById('btn-prev-paper');
    const btnFinishLetter = document.getElementById('btn-finish-letter');

    let isEnvelopeOpened = false;
    let currentPageIndex = 0;
    const totalPages = papers.length;
    let isAnimating = false;

    if (btnOpenEnvelope) {
        btnOpenEnvelope.addEventListener('click', () => {
            envelope.classList.add('open');
            btnOpenEnvelope.style.display = 'none';

            if (envelopeTextHint) envelopeTextHint.style.opacity = '0';
            if (pointerArrow) pointerArrow.style.opacity = '0';

            setTimeout(() => {
                envelope.classList.add('paper-out');
                isEnvelopeOpened = true;
                updateNavUI();
            }, 600);
        });
    }

    function updateNavUI() {
        if (!isEnvelopeOpened) {
            if (paperNavControls) paperNavControls.classList.add('hidden');
            if (btnFinishLetter) btnFinishLetter.classList.remove('show');
            return;
        }

        if (paperNavControls) paperNavControls.classList.remove('hidden');

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

        if (currentPageIndex === totalPages - 1) {
            btnFinishLetter.classList.add('show');
        } else {
            btnFinishLetter.classList.remove('show');
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

    const scene3 = document.getElementById('scene-3');
    if (btnFinishLetter) {
        btnFinishLetter.addEventListener('click', () => {
            if (envelopeWrapper) envelopeWrapper.classList.add('slide-out-left');

            setTimeout(() => {
                scene2.classList.remove('active');
                scene2.classList.add('hidden');

                scene3.classList.remove('hidden');
                scene3.classList.add('active', 'fade-in');
            }, 800);
        });
    }

    reorderPapers();
    updateNavUI();

    // --- 4. SCENE 3: LOGIKA TOMBOL NO & YES ---
    let noClickCount = 0;
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const bgMessagesContainer = document.getElementById('bg-messages-container');
    const questionBox = document.querySelector('.question-box');

    const whisperMessages = [
        "aku akan berubah...",
        "belajar memahami mu...",
        "bertumbuh bersama mu! 💖...",
        "aku tidak akan menyerah!",
        "aku yakin kita bisa! ✨"
    ];

    const placedMessageRects = [];

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            if (noClickCount < 5) {
                noClickCount++;
                btnNo.classList.add('moving');

                const padding = 50;
                const randomX = Math.random() * (window.innerWidth - btnNo.offsetWidth - padding) + padding / 2;
                const randomY = Math.random() * (window.innerHeight - btnNo.offsetHeight - padding) + padding / 2;

                btnNo.style.left = `${randomX}px`;
                btnNo.style.top = `${randomY}px`;

                spawnWhisperMessageOutsideBox(noClickCount - 1);

                if (noClickCount === 5) {
                    btnNo.style.backgroundColor = '#e0e0e0';
                    btnNo.style.borderColor = '#888888';
                    btnNo.style.color = '#888888';
                }
            } else {
                alert("Kamu yakin? 🥺 Tapi aku tetap mau berjuang buat kamu!");
            }
        });
    }

    function spawnWhisperMessageOutsideBox(index) {
        if (!bgMessagesContainer || !questionBox || index >= whisperMessages.length) return;

        const msgText = whisperMessages[index];

        // Murni buat span baru
        const span = document.createElement('span');

        // PENTING: Hanya berikan class bg-whisper-text!
        span.className = 'bg-whisper-text pop-in';
        span.textContent = msgText;

        bgMessagesContainer.appendChild(span);

        // Hitung posisi setelah di-render
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const boxRect = questionBox.getBoundingClientRect();

        const msgW = span.offsetWidth || 140;
        const msgH = span.offsetHeight || 30;
        const margin = 15;

        let bestX = 10;
        let bestY = 10;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 100) {
            attempts++;
            const zone = Math.floor(Math.random() * 4);

            if (zone === 0) { // ATAS
                bestX = Math.random() * (screenW - msgW - 20) + 10;
                const maxY = boxRect.top - msgH - margin;
                bestY = Math.random() * Math.max(10, maxY);
            } else if (zone === 1) { // BAWAH
                bestX = Math.random() * (screenW - msgW - 20) + 10;
                const minY = boxRect.bottom + margin;
                const maxY = screenH - msgH - 20;
                bestY = minY + Math.random() * Math.max(10, maxY - minY);
            } else if (zone === 2) { // KIRI
                const maxX = boxRect.left - msgW - margin;
                bestX = Math.random() * Math.max(10, maxX);
                bestY = Math.random() * (screenH - msgH - 20) + 10;
            } else { // KANAN
                const minX = boxRect.right + margin;
                const maxX = screenW - msgW - 10;
                bestX = minX + Math.random() * Math.max(10, maxX - minX);
                bestY = Math.random() * (screenH - msgH - 20) + 10;
            }

            const overlapsMainBox = !(
                bestX + msgW < boxRect.left - margin ||
                bestX > boxRect.right + margin ||
                bestY + msgH < boxRect.top - margin ||
                bestY > boxRect.bottom + margin
            );

            let overlapsOther = false;
            for (const r of placedMessageRects) {
                if (!(bestX + msgW < r.left || bestX > r.right || bestY + msgH < r.top || bestY > r.bottom)) {
                    overlapsOther = true;
                    break;
                }
            }

            if (!overlapsMainBox && !overlapsOther) {
                validPosition = true;
            }
        }

        span.style.left = `${Math.max(10, Math.min(bestX, screenW - msgW - 10))}px`;
        span.style.top = `${Math.max(10, Math.min(bestY, screenH - msgH - 10))}px`;

        placedMessageRects.push({
            left: bestX - 5,
            right: bestX + msgW + 5,
            top: bestY - 5,
            bottom: bestY + msgH + 5
        });
    }


    if (btnYes) {
        btnYes.addEventListener('click', () => {
            alert("Yeay! I love you! ❤️✨");
        });
    }

    // --- 5. LOGIKA MODAL PREVIEW GAMBAR ---
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const photoCards = document.querySelectorAll('.photo-card');

    photoCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const span = card.querySelector('span');

            if (img && imageModal && modalImg) {
                modalImg.src = img.src;
                modalImg.alt = img.alt || 'Preview Gambar';

                if (modalCaption) {
                    modalCaption.innerText = span ? span.innerText : '';
                }

                imageModal.classList.remove('hidden');
                setTimeout(() => {
                    imageModal.classList.add('active');
                }, 10);
            }
        });
    });

    function closeModal() {
        if (!imageModal) return;
        imageModal.classList.remove('active');
        setTimeout(() => {
            imageModal.classList.add('hidden');
            if (modalImg) modalImg.src = '';
        }, 300);
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });
    }
});
