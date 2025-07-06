import { fetchDataFromApi, postData } from "../utils/api";

const endpoint = `/api/user`;
export const getUsers = () => {
  const response = fetchDataFromApi(endpoint);
  return response;
};

export const getUserById = (id) => {
  const response = fetchDataFromApi(`${endpoint}/${id}`);
  return response;
};

export const Login = async (email, password) => {
  const response = await postData(`/api/user/signin`, {
    email,
    password,
  });
  if (response) {
    console.log("Login successfull", response);
  } else {
    console.log("login failed");
  }
};

export const loginWithGoogle = async (token) => {
  const response = postData(`${endpoint}/google-auth`, { token });
  return response;
};