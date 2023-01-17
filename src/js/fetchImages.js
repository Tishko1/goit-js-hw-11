import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api';
  static API_KEY = '32824068-9cbe878c59eec5e2306c3f693';

  constructor() {
    this.page = 1;
    this.q = null;
  }

  async fetchPhotosByQuery() {
    const searchParams = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.q,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };
    const response = await axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
    return response.data;
  }
}
