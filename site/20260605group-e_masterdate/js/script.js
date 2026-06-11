// FAQ
const plusBtns = document.querySelectorAll('.plus');

plusBtns.forEach((btn) => {
btn.addEventListener('click', function () {

    const answer = this
    .closest('.faq-item')
    .querySelector('.faq-answer');

    answer.classList.toggle('open');
    
});
});

// プラスをバツにする部分
const pluses = document.querySelectorAll(".plus");

pluses.forEach(plus => {
    plus.addEventListener("click", () => {
    plus.classList.toggle("active");
});
});

// ハンバーガー
const hamBtn = document.querySelector('.ham-btn');
    const hamMenu = document.getElementById('ham-menu');

    hamBtn.addEventListener('click', function () {
        hamMenu.classList.toggle('open');
    });

    const headerMenuItems = document.querySelectorAll(".ham-content a");

    headerMenuItems.forEach((headerMenuItem) => {
        headerMenuItem.addEventListener("click", () => {
            hamMenu.classList.remove("open");
        });
    });


