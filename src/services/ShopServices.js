import { fetchDataFromApi } from "../utils/api";

const endpoint = `/api/products`;
const categoryEndpoint = `/api/category`;
export const getProducts = () => {
  const response = fetchDataFromApi(endpoint);
  return response;
};

export const getProductById = (id) => {
  const response = fetchDataFromApi(`${endpoint}/${id}`);
  return response;
};

export const getProductByCategory = (category) => {
  const response = fetchDataFromApi(`${categoryEndpoint}/${category}`);
  return response;
};

export const getCategorys = ()=>{
    const response = fetchDataFromApi(`${categoryEndpoint}`);
    return response;
}