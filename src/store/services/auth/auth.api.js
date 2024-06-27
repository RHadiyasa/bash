export const fetchTrashes = async setTrashes => {
  const response = await axios.get("/api/users/trash", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.success;
};
