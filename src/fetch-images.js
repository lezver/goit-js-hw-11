import axios from 'axios';

export { NewsApiServece };

class NewsApiServece {
  constructor() {
    this.KEY = 'key=35889864-226fb2b19f733dcfa0ea78ac8';
    this.URL = 'https://pixabay.com/api/?';
    this.BASE_QUERY =
      '&per_page=40&image_type=photo&orientation=horizontal&safesearch=true';
    this.page = 1;
    this.searchQuery = null;
  }
  async fetchImages() {
    try {
      const response = await axios.get(
        `${this.URL}${this.KEY}&q=${this.searchQuery}&page=${this.page}${this.BASE_QUERY}`
      );

      return await response.data;
    } catch (error) {
      throw new Error(response.status);
    }
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newSerchQuery) {
    this.searchQuery = newSerchQuery;
  }
}
