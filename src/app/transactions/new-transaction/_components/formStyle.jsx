const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "rgb(0, 0, 0, 0.3)",
    color: "white",
    border: "none",
    borderRadius: "0.375rem", // Tailwind class "rounded-lg"
    padding: "0.5rem", // Tailwind class "p-2"
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#151518",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "rgb(37,41,51, 0.3)" : "#151518", // Ubah warna hover menjadi lebih terang
    color: "#FFF", // Teks putih untuk opsi yang di-hover dan tidak di-hover
    padding: "0.5rem", // Tailwind class "p-2"
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "gray", // Ubah warna placeholder agar lebih terlihat
  }),
  input: (provided) => ({
    ...provided,
    color: "white", // Ubah warna teks yang diketik menjadi putih
  }),
};

export default customStyles;
