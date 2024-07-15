import axios from "axios";

export async function fetchTrashesById(id, token) {
  try {
    const response = await axios.get(`/api/users/trash/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      const trashes = response.data.trashes;
      const findTrash = await trashes.find((trash) => trash._id === id);

      return findTrash;
    } else {
      console.error("Gagal memuat sampah");
    }
  } catch (error) {
    throw new error();
  }
}

export async function fetchCategories(token) {
  try {
    const response = await axios.get(`/api/users/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data.success) {
      const categories = response.data.trashes;
      return response.data.categories;
    } else {
      throw new Error("Gagal memuat sampah");
    }
  } catch (error) {
    throw error;
  }
}
