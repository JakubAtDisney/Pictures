let currentGroup = [];
let currentIndex = 0;

window.onscroll = function() {
    const btn = document.getElementById("back-to-top");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterPosts(month) {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');

    const items = document.querySelectorAll('.filter-item');
    items.forEach(item => {
        if (month === 'all') {
            item.classList.remove('hidden-post');
        } else {
            const itemMonths = item.getAttribute('data-month');
            if (itemMonths && itemMonths.includes(month)) {
                item.classList.remove('hidden-post');
            } else {
                item.classList.add('hidden-post');
            }
        }
    });
}

setTimeout(() => {
    document.getElementById('bookmark-toast').style.bottom = '20px';
}, 3000); 

function closeToast() {
    document.getElementById('bookmark-toast').style.bottom = '-100px';
}

function openShareModal() {
    document.getElementById('share-modal').style.display = 'flex';
}

function closeShareModal(event) {
    if (!event || event.target.id === 'share-modal') {
        document.getElementById('share-modal').style.display = 'none';
    }
}

function copyLink() {
    const linkText = document.getElementById('share-link').innerText.trim();
    navigator.clipboard.writeText(linkText).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerText;
        btn.innerText = "✅ Copied!";
        setTimeout(() => { btn.innerText = originalText; }, 2000);
    });
}

function nativeShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Jakub\'s Internship Gallery',
            text: 'Check out Jakub\'s photos from Kohls and Disney!',
            url: 'https://jakubatdisney.github.io/Pictures/'
        }).catch(console.error);
    } else {
        alert("Sharing isn't supported on this browser. Try copying the link!");
    }
}

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    let contextContainer = element.closest('.memory-grid, .gallery-grid');
    
    if (contextContainer) {
        currentGroup = Array.from(contextContainer.querySelectorAll('.gallery-item img, .gallery-item video'));
    } else {
        currentGroup = [element];
    }
    
    currentIndex = currentGroup.indexOf(element);
    updateNavButtons();
    showMedia(element);
    lightbox.style.display = 'flex';
    document.body.classList.add('no-scroll');
}

function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (currentGroup.length > 1) {
        prevBtn.style.visibility = 'visible';
        nextBtn.style.visibility = 'visible';
    } else {
        prevBtn.style.visibility = 'hidden';
        nextBtn.style.visibility = 'hidden';
    }
}

function showMedia(element) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const captionEl = document.querySelector('.lightbox-caption');
    
    const desc = element.getAttribute('data-desc');
    if (desc) {
        captionEl.textContent = desc;
        captionEl.style.display = 'block';
    } else {
        captionEl.style.display = 'none';
    }

    const src = element.tagName === 'VIDEO' ? element.getAttribute('src') : element.src;
    const isVideo = element.tagName === 'VIDEO' || src.endsWith('.mp4');

    if (isVideo) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.play();
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause(); 
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
    }
}

function changeImage(direction) {
    if (currentGroup.length <= 1) return;
    currentIndex += direction;
    if (currentIndex >= currentGroup.length) currentIndex = 0;
    else if (currentIndex < 0) currentIndex = currentGroup.length - 1;
    showMedia(currentGroup[currentIndex]);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    lightbox.style.display = 'none';
    lightboxVideo.pause(); 
    document.body.classList.remove('no-scroll');
}

function handleLightboxClick(event) {
    if (event.target.id === 'lightbox') closeLightbox();
}

document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') {
        if (event.key === 'ArrowLeft') changeImage(-1);
        if (event.key === 'ArrowRight') changeImage(1);
        if (event.key === 'Escape') closeLightbox();
    }
});

let touchStartX = 0;
let touchEndX = 0;
const lightbox = document.getElementById('lightbox');

lightbox.addEventListener('touchstart', e => {
    if (e.touches.length > 1 || (window.visualViewport && window.visualViewport.scale > 1)) return;
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

lightbox.addEventListener('touchend', e => {
    if (window.visualViewport && window.visualViewport.scale > 1) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    if (currentGroup.length <= 1) return;
    if (touchEndX < touchStartX - 50) changeImage(1); 
    if (touchEndX > touchStartX + 50) changeImage(-1); 
}