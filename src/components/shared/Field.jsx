import React from 'react';
import { colors } from '../../theme/theme';

const Field = ({
  label,
  hint,
  value,
  onChange,
  type = 'text',
  options = [],
  unit,
  min,
  max,
  required = false,
  placeholder
}) => {
  const inputId = `field-${label?.replace(/\s+/g, '-') || 'input'}`;

  const renderInput = () => {
    if (type === 'select' && options.length > 0) {
      return (
        <select
          id={inputId}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.sand}`,
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: 'white'
          }}
          required={required}
        >
          <option value="">-- اختر --</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id={inputId}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          required={required}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.sand}`,
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: 'white'
          }}
        />
        {unit && (
          <span style={{ color: colors.soil, fontWeight: 'bold', minWidth: '40px' }}>
            {unit}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold',
          color: colors.dark
        }}
      >
        {label}
        {required && <span style={{ color: colors.red, marginRight: '4px' }}>*</span>}
      </label>
      {renderInput()}
      {hint && (
        <small style={{ display: 'block', marginTop: '4px', color: colors.soil }}>
          {hint}
        </small>
      )}
    </div>
  );
};

export default Field;
