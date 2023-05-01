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

searchBtn.disabled = true;

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

  new SimpleLightbox('.gallery a', {
    overlayOpacity: 0.9,
    captionsData: 'alt',
    captionDelay: 250,
  });
};

const checkResponse = ({ hits, totalHits }) => {
  if (hits.length === 0) {
    refs.loadMoreBtn.classList.add('displaynone');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    refs.loadMoreBtn.classList.remove('displaynone');
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    createOfMarkup(hits);
  }
};

const valueForSearch = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  refs.loadMoreBtn.classList.add('displaynone');

  searchBtn.disabled = true;

  refs.searchForm.classList.add('search-form-fixed');

  if (!e.currentTarget.elements[0].value) return;

  newsApiServece.query = e.currentTarget.elements[0].value.trim();

  newsApiServece.resetPage();

  const response = await newsApiServece.fetchImages();

  checkResponse(response);

  refs.searchForm.reset();
};

const textInput = () => {
  if (searchInput.value) {
    searchBtn.disabled = false;
  } else {
    searchBtn.disabled = true;
  }
};

const onLoadMore = async () => {
  newsApiServece.incrementPage();

  const response = await newsApiServece.fetchImages();
  createOfMarkup(response.hits);
};

refs.searchForm.addEventListener('submit', valueForSearch);

searchInput.addEventListener('input', textInput);

refs.loadMoreBtn.addEventListener('click', () => {
  refs.loadMoreBtn.disabled = true;
  onLoadMore();
  setTimeout(() => {
    refs.loadMoreBtn.disabled = false;
  }, 1000);
});
