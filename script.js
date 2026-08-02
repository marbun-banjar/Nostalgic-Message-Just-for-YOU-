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
    const scene3 = document.getElementById('scene-3');
    const pixelBox = scene1 ? scene1.querySelector('.pixel-box') : null;
    const scene2Content = document.getElementById('scene-2-content');
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const envelopeTextHint = document.getElementById('envelope-text-hint');
    const pointerArrow = document.getElementById('pointer-arrow');
    const paperNavControls = document.getElementById('paper-nav-controls');
    const pageIndicator = document.getElementById('page-indicator');
    const btnFinishLetter = document.getElementById('btn-finish-letter');

    // Status apakah amplop sudah dibuka
    let isEnvelopeOpened = false;

    // --- TRANSISI SCENE 1 KE SCENE 2 (Hanya 1 Listener Bersih) ---
    if (btnToScene2 && pixelBox) {
        btnToScene2.addEventListener('click', () => {
            // 1. Scene 1 mengecil & menghilang (pop-out)
            pixelBox.classList.remove('pop-in');
            pixelBox.classList.add('pop-out');

            setTimeout(() => {
                // 2. Sembunyikan Scene 1
                scene1.classList.remove('active');
                scene1.classList.add('hidden');

                // 3. Tampilkan Scene 2
                scene2.classList.remove('hidden');
                scene2.classList.add('active');

                // 4. Munculkan elemen Scene 2 dengan efek pop-in elastis
                if (scene2Content) {
                    scene2Content.classList.remove('pop-out');
                    scene2Content.classList.add('pop-in');
                }
            }, 400); // Waktu selaras dengan durasi animasi pop-out (0.4s)
        });
    }

    // KLIK SEGEL / AMPLOP UNTUK MEMBUKA
    if (btnOpenEnvelope) {
        btnOpenEnvelope.addEventListener('click', () => {
            envelope.classList.add('open');
            btnOpenEnvelope.style.display = 'none';

            if (envelopeTextHint) envelopeTextHint.style.opacity = '0';
            if (pointerArrow) pointerArrow.style.opacity = '0';

            setTimeout(() => {
                envelope.classList.add('paper-out');

                // Set flag amplop sudah dibuka dan tampilkan kontrol
                isEnvelopeOpened = true;
                updateNavUI();
            }, 600);
        });
    }

    // --- 3. NAVIGASI TUMPUKAN KERTAS ---
    const papers = Array.from(document.querySelectorAll('.paper-page'));
    const btnNextPaper = document.getElementById('btn-next-paper');
    const btnPrevPaper = document.getElementById('btn-prev-paper');

    let currentPageIndex = 0;
    const totalPages = papers.length; // 6 Lembar
    let isAnimating = false;

    function updateNavUI() {
        // PERATURAN 1: Kalau amplop BELUM dibuka, SEMUA tombol dikunci rapat
        if (!isEnvelopeOpened) {
            if (paperNavControls) paperNavControls.classList.add('hidden');
            if (btnFinishLetter) {
                btnFinishLetter.classList.remove('show');
            }
            return;
        }

        // Tampilkan kontainer navigasi (< 1/6 >)
        if (paperNavControls) paperNavControls.classList.remove('hidden');

        // Update teks indikator halaman
        if (pageIndicator) {
            pageIndicator.innerText = `${currentPageIndex + 1} / ${totalPages}`;
        }

        // --- KONTROL TOMBOL PANAH (< dan >) ---
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

        // --- KONTROL TOMBOL "NEXT" AKHIR SCENE (Halaman 6/6) ---
        if (currentPageIndex === totalPages - 1) {
            btnFinishLetter.classList.add('show'); // Muncul melayang secara absolute & fade in
        } else {
            btnFinishLetter.classList.remove('show'); // Hilang mulus fade out
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

    // Tombol Next Kertas (>)
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

    // Tombol Prev Kertas (<)
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

    // TOMBOL NEXT AKHIR (SELESAI BACA SURAT DI LEMBAR 6/6)
    if (btnFinishLetter) {
        btnFinishLetter.addEventListener('click', () => {
            envelopeWrapper.classList.add('slide-out-left');

            setTimeout(() => {
                scene2.classList.remove('active');
                scene2.classList.add('hidden');

                scene3.classList.remove('hidden');
                scene3.classList.add('active', 'fade-in');
            }, 800);
        });
    }

    // Inisialisasi awal
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
        "bertumbuh bersama mu! 💖",
        "aku tidak akan menyerah!",
        "aku yakin kita bisa! ✨"
    ];

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            if (noClickCount < 5) {
                noClickCount++;
                btnNo.classList.add('moving');

                const padding = 60;
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

    // Simpan slot posisi yang sudah dipakai
    let usedSlots = [];

    function spawnWhisperMessageOutsideBox(index) {
        if (!bgMessagesContainer || !questionBox) return;

        const msgText = whisperMessages[index];
        const span = document.createElement('span');
        span.className = 'bg-whisper-text pop-in';
        span.textContent = msgText;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const boxRect = questionBox.getBoundingClientRect();

        const slots = [
            { x: Math.max(10, boxRect.left - 170), y: Math.max(20, boxRect.top - 70) },
            { x: Math.min(screenW - 170, boxRect.right - 20), y: Math.max(20, boxRect.top - 110) },
            { x: Math.max(10, boxRect.left - 150), y: Math.min(screenH - 100, boxRect.bottom + 20) },
            { x: Math.min(screenW - 170, boxRect.right - 40), y: Math.min(screenH - 80, boxRect.bottom + 60) },
            { x: (screenW / 2) - 80, y: Math.max(15, boxRect.top - 130) }
        ];

        let availableSlots = slots.map((_, i) => i).filter(i => !usedSlots.includes(i));

        if (availableSlots.length === 0) {
            usedSlots = [];
            availableSlots = slots.map((_, i) => i);
        }

        const randomSlotIndex = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        usedSlots.push(randomSlotIndex);

        const chosenPos = slots[randomSlotIndex];

        span.style.left = `${chosenPos.x}px`;
        span.style.top = `${chosenPos.y}px`;

        bgMessagesContainer.appendChild(span);
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            console.log("Di-ACC!");
        });
    }

    // --- 5. LOGIKA MODAL PREVIEW GAMBAR ---
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const photoCards = document.querySelectorAll('.photo-card');

    // Buka Modal saat .photo-card diklik
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
                // Timeout kecil agar efek CSS transition opacity berjalan
                setTimeout(() => {
                    imageModal.classList.add('active');
                }, 10);
            }
        });
    });

    // Fungsi Tutup Modal
    function closeModal() {
        if (!imageModal) return;
        imageModal.classList.remove('active');
        setTimeout(() => {
            imageModal.classList.add('hidden');
            if (modalImg) modalImg.src = '';
        }, 300); // Sesuaikan dengan durasi transition CSS (0.3s)
    }

    // Klik tombol "X" untuk tutup
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    // Klik area latar belakang hitam (di luar box) untuk tutup
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });
    }
});
