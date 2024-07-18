import axios from "axios";

export const fetchHeader = async (router, setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");

    const { username, _id } = res.data.data;
    setData(username);
    setUserId(_id);
  } catch (error) {
    router.push("/");
    return;
    // console.log("Belum login");
    // toast.error(error.response?.data?.message || "Failed to fetch header data");
  }
};
