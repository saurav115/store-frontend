// src/components/DateRangePicker.js
import React from 'react';

const DateRangePicker = ({ label, value, onChange }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <label>{label}</label>
            <input
                type="date"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
            />
        </div>
    );
};

export default DateRangePicker;
