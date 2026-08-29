import { useEffect, useState } from "react";
import { MEASUREMENT_FIELDS } from "../../utils/measurementFields";

// Renders the measurement fields for one category as a single-column list —
// label on the left, input on the right — matching the Figma field layout.
// `savedValues` (if any) pre-fills the form — that's how editing works.
const MeasurementForm = ({ category, savedValues, onSave, isSaving }) => {
  const fields = MEASUREMENT_FIELDS[category];
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues(savedValues || {});
  }, [category, savedValues]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="divide-y divide-gray-100 dark:divide-gray-800 mb-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2.5">
            <label className="text-sm text-textmain dark:text-card">{label}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={values[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder="0.0"
              className="w-24 h-9 px-2.5 rounded-btn bg-background dark:bg-[#121717] text-sm text-right text-textmain dark:text-card placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full h-12 rounded-btn bg-success text-white text-sm font-semibold disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default MeasurementForm;
