import axios from "axios";

export const resetPassword = async (email, password) => {
  try {
    const response = await axios.put(
      `/api/users/reset/password`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Failed update password", error);
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(
      "/api/users/reset/check-email",
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Checking email failed", error);
  }
};
