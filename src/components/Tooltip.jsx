import React, { useState } from 'react';
import { colors } from '../theme/theme';

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {children}
      </div>
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          backgroundColor: colors.dark,
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '10px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${colors.dark}`
          }} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
