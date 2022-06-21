import './style.css'

/* HIDE CONTENT */
const hideContentBtn = document.getElementById('hideContentBtn'),
    hideContent = document.getElementById('hideContent')

if (hideContentBtn) {
    hideContentBtn.addEventListener('click', () => {
        hideContent.style.display = 'none'
    })
}
