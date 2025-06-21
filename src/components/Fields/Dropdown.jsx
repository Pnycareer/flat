// src/components/Dropdown.jsx
const Dropdown = ({ label, name, options = [], value, onChange, required = true }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
