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

const onSearchFormSubmit = event => {
  event.preventDefault();
  searchBtnEl.disabled = true;
  searchBtnEl.classList.add('disabled');

  pixabayAPI.q = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;


// console.log(pixabayAPI.q); 


  pixabayAPI
    .fetchPhotosByQuery()
    .then(({ data }) => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        event.target.reset();
        gallery.innerHTML = '';

        return;
      }

      // let total_pages =  Math.ceil(+data.totalHits/+pixabayAPI.per_page);
      // console.log(total_pages);
      if (data.hits.length > 1) {
        loadMoreBtnEl.classList.remove('is-hidden');
      }

      gallery.innerHTML = createGalleryCards(data.hits);
      gallerySimpleLightbox.refresh();
      Notiflix.Notify.success(
        `Hooray! We found ${data.totalHits} images.`
      );
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      searchBtnEl.disabled = false;
      searchBtnEl.classList.remove('disabled');
    });
};

const onLoadMoreBtnClick = event => {
  event.target.disabled = true;
  event.target.classList.add('disabled');

  pixabayAPI.page += 1;

  pixabayAPI
    .fetchPhotosByQuery()
    .then(({ data }) => {
      gallery.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
      gallerySimpleLightbox.refresh();

      if (data.totalHits/pixabayAPI.per_page === pixabayAPI.page) {
        loadMoreBtnEl.classList.add('is-hidden');
      }
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      event.target.disabled = false;
      event.target.classList.remove('disabled');
    });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);









// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,

//   behavior: 'smooth',
// });

// btnLoadMore.style.display = 'none';

// let pageNumber = 1;
