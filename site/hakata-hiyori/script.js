const products = {
    standard: {
        name: 'だし香る明太子 三種ギフト',
        text: 'だし、昆布、柚子の三種を詰め合わせた定番セット。初めての贈り物にも選びやすい内容です。',
        price: '税込 4,980円',
        image: './assets/hero-gift.png',
        tags: ['送料無料', 'のし対応', '冷凍配送']
    },
    family: {
        name: '家族で楽しむ たっぷりセット',
        text: 'ごはんのお供やお茶漬けに使いやすい、量を重視したファミリー向けセットです。',
        price: '税込 6,480円',
        image: './assets/table-scene.png',
        tags: ['大容量', '自宅用にも', '冷凍配送']
    },
    premium: {
        name: '季節のご挨拶 上質ギフト',
        text: '包装や贈答感を重視した、目上の方にも贈りやすいプレミアム想定のセットです。',
        price: '税込 7,980円',
        image: './assets/gift-package.png',
        tags: ['高級箱入り', '名入れ想定', '日時指定']
    }
};

const reviews = [
    {
        type: 'gift',
        title: '県外の親戚に喜ばれました',
        text: '福岡らしさが分かりやすく、のし対応もあるので季節の挨拶に選びやすいです。'
    },
    {
        type: 'home',
        title: '朝ごはんが楽しみになります',
        text: '辛すぎず、だしの風味があるので家族で食べやすい味という想定にしました。'
    },
    {
        type: 'gift',
        title: '配送情報が分かりやすい',
        text: '冷凍配送や賞味期限が先に分かるため、食品ギフトの不安を減らせます。'
    }
];

const price = 4980;
const productPanel = document.querySelector('#product-panel');
const productTabs = document.querySelectorAll('.product-tab');
const reviewGrid = document.querySelector('#review-grid');
const reviewButtons = document.querySelectorAll('.review-btn');
const quantityInput = document.querySelector('#quantity');
const totalPrice = document.querySelector('#total-price');
const cartModal = document.querySelector('#cart-modal');
const cartMessage = document.querySelector('#cart-message');

function renderProduct(key) {
    const product = products[key];
    productPanel.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-copy">
            <h3>${product.name}</h3>
            <p>${product.text}</p>
            <p class="product-price">${product.price}</p>
            <div class="product-meta">
                ${product.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
        </div>
    `;
}

function renderReviews(filter = 'all') {
    const filtered = filter === 'all' ? reviews : reviews.filter(review => review.type === filter);
    reviewGrid.innerHTML = filtered.map(review => `
        <article class="review-card">
            <strong>${review.title}</strong>
            <p>${review.text}</p>
        </article>
    `).join('');
}

function updateTotal() {
    const quantity = Math.min(9, Math.max(1, Number(quantityInput.value) || 1));
    quantityInput.value = quantity;
    totalPrice.textContent = `${(price * quantity).toLocaleString()}円`;
}

renderProduct('standard');
renderReviews();
updateTotal();

productTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        productTabs.forEach(button => button.classList.remove('is-active'));
        tab.classList.add('is-active');
        renderProduct(tab.dataset.product);
    });
});

reviewButtons.forEach(button => {
    button.addEventListener('click', () => {
        reviewButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        renderReviews(button.dataset.review);
    });
});

document.querySelector('[data-minus]').addEventListener('click', () => {
    quantityInput.value = Number(quantityInput.value) - 1;
    updateTotal();
});

document.querySelector('[data-plus]').addEventListener('click', () => {
    quantityInput.value = Number(quantityInput.value) + 1;
    updateTotal();
});

quantityInput.addEventListener('input', updateTotal);

document.querySelectorAll('[data-scroll-buy]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelector('[data-add-cart]').addEventListener('click', () => {
    cartMessage.textContent = `だし香る明太子 三種ギフトを${quantityInput.value}点追加しました。`;
    cartModal.classList.add('is-open');
    cartModal.setAttribute('aria-hidden', 'false');
});

document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
        cartModal.classList.remove('is-open');
        cartModal.setAttribute('aria-hidden', 'true');
    });
});

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.classList.toggle('is-open');
    });
});
