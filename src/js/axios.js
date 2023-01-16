import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';

axios
  .get(`${BASE_URL}/?key=32824068-9cbe878c59eec5e2306c3f693`)
  .then(({ data }) => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });