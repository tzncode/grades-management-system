'use client';

import { useState, useEffect } from 'react';

export default function GradeInput({ value, onChange, highlight = false }) {
  const [localValue, setLocalValue] = useState(value || '');
  const [error, setError] = useState(false);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Validar que sea un número entre 0 y 10
    if (newValue !== '') {
      const num = parseFloat(newValue);
      if (isNaN(num) || num < 0 || num > 10) {
        setError(true);
        return;
      }
    }

    setError(false);
    onChange(newValue);
  };

  const handleBlur = () => {
    // Formatear el número al perder el foco
    if (localValue !== '' && !error) {
      const num = parseFloat(localValue);
      if (!isNaN(num)) {
        const formatted = num.toFixed(2);
        setLocalValue(formatted);
        onChange(formatted);
      }
    }
  };

  return (
    <input
      type="number"
      min="0"
      max="10"
      step="0.01"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`w-20 px-2 py-1.5 border rounded text-center font-medium
        transition-all duration-200
        ${error 
          ? 'border-red-500 bg-red-50 text-red-700' 
          : highlight 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-blue-400
        disabled:bg-gray-100 disabled:cursor-not-allowed`}
      placeholder="0.00"
    />
  );
}