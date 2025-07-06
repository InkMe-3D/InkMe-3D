import axios from "axios";
// require('dotenv/config');

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(import.meta.env.VITE_APP_BASE_URL + url);
    return data;
  } catch (error) {
    console.log("API fetch error:", error);
    return error;
  }
};

// export const postData = async (url, formData) => {
//     try {
//         const {res} = await axios.post("http://localhost:4000" + url, formData);
//     return res;
//     } catch (error) {
//         console.log('API edit error:', error);
//         return error;
//     }
// }

export const postData = async (url, formData) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.log("API edit error:", error);
    return error;
  }
};

// export const postData = async (url, formData) => {
//     try {
//         const response = await fetch(import.meta.env.VITE_APP_BASE_URL + url, {
//             method: 'POST',
//             body: formData, // Gửi trực tiếp `FormData`
//         });

//         if (response.ok) {
//             const data = await response.json();
//             return data;
//         } else {
//             const errorData = await response.json();
//             return errorData;
//         }
//     } catch (error) {
//         console.log('API edit error:', error);
//         return error;
//     }
// };

export const editData = async (url, updatedData) => {
  try {
    const { res } = await axios.put(
      `${import.meta.env.VITE_APP_BASE_URL}${url}`,
      updatedData
    );
    return res;
  } catch (error) {
    console.log("API edit error:", error);
    return error;
  }
};

export const deleteData = async (url) => {
  try {
    const { res } = await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}${url}`
    );
    return res;
  } catch (error) {
    console.log("API edit error:", error);
    return error;
  }
};

export const uploadImage = async (url, formData) => {
  try {
    const { res } = await axios.post(
      import.meta.env.VITE_APP_BASE_URL + url,
      formData
    );
    return res;
  } catch (error) {
    console.log("API edit error:", error);
    return error;
  }
};

export const deleteImages = async (url, image) => {
  const { res } = await axios.delete(
    `${import.meta.env.VITE_APP_BASE_URL}${url}`,
    image
  );
  return res;
};
