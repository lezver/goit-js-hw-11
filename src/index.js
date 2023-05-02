import { NewsApiServece } from './fetch-images.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('[data-dallery]'),
  sentinel: document.querySelector('.sentinel'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsApiServece = new NewsApiServece();
const searchBtn = refs.searchForm.children[1];
const searchInput = refs.searchForm.children[0];
const gallery = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.9,
  captionsData: 'alt',
  captionDelay: 250,
});

let sumOfPages = 0;
let totalCount = 0;

searchBtn.disabled = true;

const onLoadMore = async () => {
  newsApiServece.incrementPage();

  const response = await newsApiServece.fetchImages();
  createOfMarkup(response.hits);

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  onListener();
};

const offListener = () => {
  window.removeEventListener('scroll', scrollListener);
};

const onListener = () => {
  window.addEventListener('scroll', scrollListener);
};

const scrollListener = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    sumOfPages !== totalCount
  ) {
    onLoadMore();
    offListener();
  }
};

const createOfMarkup = arr => {
  const markup = arr.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `
				<div class="photo-card">
					<a href="${largeImageURL}">
						<img src="${webformatURL}" alt="${tags}" data-source="${largeImageURL}" loading="lazy" />
					</a>
					<div class="info">
						<p class="info-item">
							<b>Likes</b>
							${likes}
						</p>
						<p class="info-item">
							<b>Views</b>
							${views}
						</p>
						<p class="info-item">
							<b>Comments</b>
							${comments}
						</p>
						<p class="info-item">
							<b>Downloads</b>
							${downloads}
						</p>
					</div>
				</div>
		`,
    ''
  );

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  gallery.refresh();
};

const checkResponse = ({ hits, totalHits }) => {
  totalCount = totalHits;
  sumOfPages += hits.length;

  if (hits.length === 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    refs.searchForm.classList.add('search-form-fixed');

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    createOfMarkup(hits);
  }
};

const textInput = () => {
  if (searchInput.value) {
    searchBtn.disabled = false;
  } else {
    searchBtn.disabled = true;
  }
};

const valueForSearch = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  searchBtn.disabled = true;

  if (!e.currentTarget.elements[0].value.trim()) return;

  onListener();

  newsApiServece.query = e.currentTarget.elements[0].value.trim();

  newsApiServece.resetPage();

  const response = await newsApiServece.fetchImages();

  checkResponse(response);

  refs.searchForm.reset();
};

refs.searchForm.addEventListener('submit', valueForSearch);

searchInput.addEventListener('input', textInput);
