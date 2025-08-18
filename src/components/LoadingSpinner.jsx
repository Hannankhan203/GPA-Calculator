import React from 'react';

const LoadingSpinner = ({ size = 40, color = '#000000', className = '' }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `${Math.floor(size / 8)}px solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${Math.floor(size / 8)}px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;