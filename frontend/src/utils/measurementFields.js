// Field labels for each measurement category. Keep field keys in sync with
// CATEGORY_FIELDS in backend/controllers/measurementController.js
export const MEASUREMENT_FIELDS = {
  Blouse: [
    { key: "shoulder", label: "Shoulder" },
    { key: "bust", label: "Bust" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "sleeve", label: "Sleeve" },
    { key: "neck", label: "Neck" },
    { key: "length", label: "Length" },
    { key: "armRound", label: "Arm Round" },
    { key: "frontNeck", label: "Front Neck" },
    { key: "backNeck", label: "Back Neck" },
  ],
  Chudithar: [
    { key: "shoulder", label: "Shoulder" },
    { key: "bust", label: "Bust" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "sleeve", label: "Sleeve" },
    { key: "topLength", label: "Top Length" },
    { key: "pantLength", label: "Pant Length" },
  ],
  Pant: [
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "thigh", label: "Thigh" },
    { key: "knee", label: "Knee" },
    { key: "bottom", label: "Bottom" },
    { key: "length", label: "Length" },
  ],
};

export const MEASUREMENT_CATEGORIES = Object.keys(MEASUREMENT_FIELDS);
