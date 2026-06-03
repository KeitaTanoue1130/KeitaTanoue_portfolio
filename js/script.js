// ====================
// 動画ホバー再生
// ====================

document.querySelectorAll('.work-thumb').forEach(el => {

    const video = el.querySelector('video');

    if (!video) return;

    el.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play();
    });

    el.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });

});


// ====================
// Works フィルター
// ====================

const filterButtons = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        workItems.forEach(item => {

            const category = item.dataset.category;

            if (filter === 'all' || filter === category) {
                item.classList.remove('is-hidden');
            } else {
                item.classList.add('is-hidden');
            }

        });

    });

});

const contactForm = document.querySelector('#contact-form');

if (contactForm) {

    contactForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const name = document.querySelector('#name');
        const email = document.querySelector('#email');

        const nameError = document.querySelector('#name-error');
        const emailError = document.querySelector('#email-error');

        nameError.textContent = '';
        emailError.textContent = '';

        name.classList.remove('input-error');
        email.classList.remove('input-error');

        let isValid = true;

        // 名前チェック

        if (name.value.trim() === '') {

            nameError.textContent = '名前を入力してください';

            name.classList.add('input-error');

            isValid = false;
        }

        // メールチェック

        if (email.value.trim() === '') {

            emailError.textContent = 'メールアドレスを入力してください';

            email.classList.add('input-error');

            isValid = false;

        } else {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value)) {

                emailError.textContent =
                    '正しいメールアドレスを入力してください';

                email.classList.add('input-error');

                isValid = false;
            }

        }

        if (isValid) {

            alert('送信できました（デモ）');

        }

    });

}