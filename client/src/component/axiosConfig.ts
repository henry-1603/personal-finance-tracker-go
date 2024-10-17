import axios from "axios";

// Using the environment variable for base URL
const baseURL =  "http://localhost:8080";
axios.defaults.baseURL = baseURL;

export default axios;
