import axios from "axios";

const API = axios.create({
  baseURL: "https://password-error-catch.onrender.com/"
});

export default API;