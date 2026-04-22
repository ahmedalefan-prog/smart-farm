import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import { getUnreadCount } from '../utils/alertsGenerator';

const AlertBell = () => {
  const { farmData, markAlertAsRead, dismissAlert } = useFarm();
  const [showDropdown, setShowDropdown] = useState(false);

  const alerts = farmData.alerts || [];
  const unreadCount = getUnreadCount(alerts);

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return colors.red;
      case 'warning': return colors.orange;
      case 'info': return colors.sky;
      default: return colors.soil;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'feed': return '🌾';
      case 'crops': return '🌱';
      case 'weather': return '☀️';
      case 'livestock': return '🐄';
      default: return '📋';
    }
  };

  const handleAlertClick = (alert) => {
    markAlertAsRead(alert.id);
  };

  const handleDismiss = (e, alertId) => {
    e.stopPropagation();
    dismissAlert(alertId);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          position: 'relative',
          padding: '5px 10px'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: colors.red,
            color: 'white',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
            onClick={() => setShowDropdown(false)}
          />
          <div style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 999
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${colors.sand}`,
              fontWeight: 'bold',
              color: colors.dark
            }}>
              التنبيهات ({alerts.length})
            </div>

            {alerts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: colors.soil }}>
                لا توجد تنبيهات حالياً
              </div>
            ) : (
              alerts.slice(0, 10).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${colors.sand}`,
                    backgroundColor: alert.read ? 'white' : colors.cream,
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {getCategoryIcon(alert.category)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: getAlertColor(alert.type)
                        }}></span>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: colors.dark }}>
                          {alert.title}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: colors.soil, margin: '4px 0' }}>
                        {alert.message}
                      </p>
                      <small style={{ color: colors.soil, fontSize: '11px' }}>
                        {new Date(alert.date).toLocaleDateString('ar-IQ')}
                      </small>
                    </div>
                    <button
                      onClick={(e) => handleDismiss(e, alert.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer',
                        color: colors.soil,
                        padding: '4px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AlertBell;
