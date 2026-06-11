const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--background) / 0.5)",
    color: "hsl(var(--foreground))",
    border: "1px solid hsl(var(--border) / 0.7)",
    borderRadius: "0.5rem",
    boxShadow: "none",
    minHeight: "44px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "hsl(var(--popover) / 0.95)",
    border: "1px solid hsl(var(--border) / 0.7)",
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "hsl(var(--accent) / 0.7)"
      : "transparent",
    color: "hsl(var(--foreground))",
    padding: "0.65rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "hsl(var(--muted-foreground))",
  }),
  input: (provided) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
};

export default customStyles;
