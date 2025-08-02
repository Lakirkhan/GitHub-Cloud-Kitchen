const FormField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  fullWidth = false,
  maxLength,
  as = "input",
  error,
}) => {
  const inputClasses = `ch-input ${fullWidth ? "ch-full-width" : ""} ${
    error ? "ch-input-error" : ""
  }`;

  return (
    <div className="ch-form-field">
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name || id}
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <input
          id={id}
          name={name || id}
          type={type}
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      {error && <div className="ch-error-message">{error}</div>}
    </div>
  );
};

export default FormField;
