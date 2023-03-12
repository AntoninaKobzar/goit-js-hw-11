    import Notiflix from 'notiflix';
    import SimpleLightbox from 'simplelightbox';
    import 'simplelightbox/dist/simple-lightbox.min.css';
    import throttle from 'lodash.throttle';
    import { fetchImages } from './js/ApiService';

    const searchForm = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');

    let query = '';
    let page = 1;
    let simpleLightBox;
    let totalHits = 0;
    const perPage = 40;

    searchForm.addEventListener('submit', onSearchForm);

    function renderGallery(images) {
    if (!gallery) {
        return;
    }

    const markup = images
        .map(image => {
        const {
            id,
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        } = image;
        return `
            <a class="gallery__link" href="${largeImageURL}">
            <div class="gallery-item" id="${id}">
                <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
                </div>
            </div>
            </a>
        `;
        })
        .join('');

    gallery.insertAdjacentHTML('beforeend', markup);
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
    }

async function onSearchForm(e) {
    e.preventDefault();
    page = 1;
    query = e.currentTarget.elements.searchQuery.value.trim();
    gallery.innerHTML = '';
    totalHits = response.hits.length;

    if (query === '') {
        Notiflix.Notify.failure(
            'The search string cannot be empty. Please specify your search query.',
        );
        return;
    }

    const response = await fetchImages(query, page, perPage);
    // let totalHits = response.hits.length;
    try {
        if (response.totalHits === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
            );
        } else {
            renderGallery(response.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        }
    }
    catch (error) {
        console.log(error);
    }
}

    async function onloadMore() {
    page += 1;
    simpleLightBox.destroy();

        const response = await fetchImages(query, page, perPage);
        renderGallery(response.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();

        const totalPages = Math.ceil(response.totalHits / perPage);

        if (page > totalPages) {
            Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results.",
            );
        }
        }


    function checkIfEndOfPage() {
    return (
        window.innerHeight + window.pageYOffset >=
        document.documentElement.scrollHeight
    );
    }


    function showLoadMorePage() {
    if (checkIfEndOfPage()) {
        onloadMore();
    }
    }

    window.addEventListener('scroll', throttle(showLoadMorePage,500));

    SmoothScroll({
    animationTime: 800,
    stepSize: 75,
    accelerationDelta: 30,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 50,
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    });