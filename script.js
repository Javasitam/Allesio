/* ================= SLIDER / ROTATOR ================= */
(function () {
    const cardsEl = document.getElementById('cards');
    const cards = Array.from(cardsEl.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pauseBtn = document.getElementById('pauseResume');
    const indicators = Array.from(document.querySelectorAll('.dot'));
    let current = 0;
    const total = cards.length;
    const intervalMs = 3500;
    let timer = null;

    function updatePosition() {
        const offset = -current * 100;
        cardsEl.style.transform = `translateX(${offset}%)`;
        indicators.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goto(index) {
        current = (index + total) % total;
        updatePosition();
    }

    const next = () => goto(current + 1);
    const prev = () => goto(current - 1);

    function startTimer() {
        stopTimer();
        timer = setInterval(next, intervalMs);
        pauseBtn.textContent = 'Pause';
        pauseBtn.setAttribute('aria-pressed', 'false');
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    nextBtn.addEventListener('click', () => { next(); startTimer(); });
    prevBtn.addEventListener('click', () => { prev(); startTimer(); });

    indicators.forEach(btn => {
        btn.addEventListener('click', () => {
            goto(Number(btn.dataset.index));
            startTimer();
        });
    });

    pauseBtn.addEventListener('click', () => {
        if (timer) {
            stopTimer();
            pauseBtn.textContent = 'Resume';
            pauseBtn.setAttribute('aria-pressed', 'true');
        } else {
            startTimer();
        }
    });

    const rotator = document.getElementById('rotator');
    rotator.addEventListener('mouseenter', stopTimer);
    rotator.addEventListener('mouseleave', startTimer);

    updatePosition();
    startTimer();

    cards.forEach(imgWrap => {
        const img = imgWrap.querySelector('img');
        img.addEventListener('error', () => {
            img.src = 'https://via.placeholder.com/120?text=No+Image';
        });
    });
})();


/* ================= CATALOG + THEME MODULE ================= */
(function () {

    /* -------- THEME -------- */
    const themeToggle = document.getElementById('themeToggle');
    function applyTheme(theme) {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        themeToggle.textContent = theme === 'dark' ? '☀︎' : '⏾';
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
        localStorage.setItem('site-theme', theme);
    }
    const savedTheme = localStorage.getItem('site-theme') || 'light';
    applyTheme(savedTheme);
    themeToggle.addEventListener('click', () => {
        const cur = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    });


    /* -------- PRODUCT DATA -------- */
    const products = [
        { id: 1, cat: 'technology', title: 'Laptop Pro 14"', price: 12500000, rating: 4.8, img: 'images/laptop.png' },
        { id: 2, cat: 'technology', title: 'Wireless Mouse', price: 150000, rating: 4.5, img: 'images/mouse.png' },
        { id: 3, cat: 'household', title: 'Vacuum Cleaner', price: 950000, rating: 4.3, img: 'images/vacuum.png' },
        { id: 4, cat: 'fashion', title: 'Jaket Bomber', price: 350000, rating: 4.6, img: 'images/jacket.png' },
        { id: 5, cat: 'sports', title: 'Sepatu Lari', price: 650000, rating: 4.7, img: 'images/running.png' },
        { id: 6, cat: 'household', title: 'Rice Cooker', price: 250000, rating: 4.1, img: 'images/ricecooker.png' },
        { id: 7, cat: 'technology', title: 'Smart Watch', price: 850000, rating: 4.4, img: 'images/watch.png' },
    ];


    /* -------- ELEMENTS -------- */
    const categoriesEl = document.getElementById('categories');
    const itemsGrid = document.getElementById('itemsGrid');
    const sortSelect = document.getElementById('sortSelect');
    const searchItems = document.getElementById('searchItems');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');


    /* -------- RENDERING -------- */
    function renderItems(list) {
        itemsGrid.innerHTML = '';
        if (list.length === 0) {
            itemsGrid.innerHTML = '<div class="empty">Tidak ada item</div>';
            return;
        }

        list.forEach(p => {
            const el = document.createElement('div');
            el.className = 'item-card';
            el.setAttribute("data-id", p.id);
            el.innerHTML = `
                <img src="${p.img}" alt="${p.title}" />
                <div class="item-meta">
                    <strong>${p.title}</strong>
                    <div class="item-price">Rp${p.price.toLocaleString('id-ID')}</div>
                    <div class="item-rating">⭐ ${p.rating.toFixed(1)}</div>
                </div>
            `;
            el.addEventListener("click", () => {
                localStorage.setItem("selectedProduct", JSON.stringify(p));
                window.location.href = "product.html";
            });
            itemsGrid.appendChild(el);
        });
    }


    /* -------- FILTERING + SORTING -------- */
    function filterAndSort() {
        const activeCatBtn = categoriesEl.querySelector('.cat-btn.active');
        const cat = activeCatBtn.dataset.cat;
        const q = searchItems.value.trim().toLowerCase();
        const min = Number(priceMin.value) || 0;
        const max = Number(priceMax.value) || Infinity;

        let list = products.filter(p =>
            (cat === 'all' || p.cat === cat) &&
            p.title.toLowerCase().includes(q) &&
            p.price >= min &&
            p.price <= max
        );

        const mode = sortSelect.value;
        if (mode === 'price-asc') list.sort((a, b) => a.price - b.price);
        else if (mode === 'price-desc') list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => b.rating - a.rating);

        renderItems(list);
    }


    /* -------- EVENT LISTENERS -------- */
    [priceMin, priceMax].forEach(el => el.addEventListener('input', filterAndSort));
    if (sortSelect) sortSelect.addEventListener('change', filterAndSort);
    if (searchItems) searchItems.addEventListener('input', filterAndSort);

    if (categoriesEl) {
        categoriesEl.addEventListener('click', ev => {
            const btn = ev.target.closest('.cat-btn');
            if (!btn) return;
            categoriesEl.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSort();
        });
    }

    /* -------- FIRST LOAD -------- */
    filterAndSort();

})();
