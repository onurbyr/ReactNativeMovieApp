import axios from 'axios';
import {API_KEY,API_URL,API_IMAGE_URL} from "@env"

const api = axios.create({
    baseURL: API_URL,
    params:{
        api_key:API_KEY
    }
});

const apiKey = {API_KEY}

const apiImgUrl = {API_IMAGE_URL}

//export default api;
export {
    api,
    apiKey,
    apiImgUrl
  }