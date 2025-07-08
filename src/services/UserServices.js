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

export const updateUser = async (id, userData) => {
  try {
    const response = await postData(`${endpoint}/update/${id}`, userData);
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await postData(`${endpoint}/change-password/${userId}`, {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
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