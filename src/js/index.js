import { fetchImages } from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from '../js/fetchImages';

const searchFormEl = document.querySelector('.search-form');
const searchBtnEl = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const pixabayAPI = new PixabayAPI();

const createGalleryCards = images => {
  const galleryCardsArr = images
    .map(image => {
      return `
    <div class="photo-card">

    <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" 
    title="${image.tags}" loading="lazy"/></a>

     <div class="info">
        <p class="info-item">
            <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
        </p>
         <p class="info-item">
             <b>Views</b> <span class="info-item-api">${image.views}</span>  
         </p>
         <p class="info-item">
             <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
         </p>
         <p class="info-item">
             <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
         </p>
     </div>
 </div>
        `;
    })
    .join('');

  return galleryCardsArr;
};

const onSearchFormSubmit = async event => {
  event.preventDefault();
  searchBtnEl.disabled = true;
  searchBtnEl.classList.add('disabled');

  pixabayAPI.q = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;

  try {
    const data = await pixabayAPI.fetchPhotosByQuery();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      gallery.innerHTML = '';

      return;
    }

    let total_pages = Math.ceil(+data.totalHits / +pixabayAPI.per_page);
    // console.log(total_pages);
    if (total_pages > 1) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    gallery.innerHTML = createGalleryCards(data.hits);
    gallerySimpleLightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch {
    err => {
      console.log(err);
    };
  }

  searchBtnEl.disabled = false;
  searchBtnEl.classList.remove('disabled');
};

const onLoadMoreBtnClick = async event => {
  event.target.disabled = true;
  event.target.classList.add('disabled');

  pixabayAPI.page += 1;

  try {
    const data = await pixabayAPI.fetchPhotosByQuery();

    gallery.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
    gallerySimpleLightbox.refresh();

    let total_pages = Math.ceil(+data.totalHits / +pixabayAPI.per_page);
    if (total_pages === pixabayAPI.page) {
      loadMoreBtnEl.classList.add('is-hidden');
    }
  } catch {
    err => {
      console.log(err);
    };
  }

  event.target.disabled = false;
  event.target.classList.remove('disabled');
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
