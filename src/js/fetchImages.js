
import axios from "axios";


export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api';
  static API_KEY = 'key=32824068-9cbe878c59eec5e2306c3f693';

  constructor() {
    this.page = 1;
    this.q = null;
  }

  fetchPhotosByQuery() {
    const searchParams = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.q,
        page: this.page,
        per_page: 40,
        image_type: photo,
        orientation: 'horizontal',
        safesearch: true,
      },
    };
console.log(axios.get(`${PixabayAPI.BASE_URL}`, searchParams));
    return axios.get(`${PixabayAPI.BASE_URL}/search/photos`, searchParams);
  }

  }


// export const fetchImages = async (inputValue, pageNr) => {
//   return await fetch(
//     `https://pixabay.com/api/?key=29588079-fbc492831fdad231bf7222b96&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNr}`
//   )
//     .then(async response => {
//       if (!response.ok) {
//         if (response.status === 404) {
//           return [];
//         }
//         throw new Error(response.status);
//       }
//       return await response.json();
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };
