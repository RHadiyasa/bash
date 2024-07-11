const toPascalCase = (text) => {
  return text
    .split(/[^a-zA-Z0-9]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

export default toPascalCase;
