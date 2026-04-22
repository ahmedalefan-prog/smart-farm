import React, { useState } from 'react';
import { colors } from '../theme/theme';

export const MAIN_SECTIONS = [
  {
    id: 'crops',
    name: 'المحاصيل',
    icon: '🌾',
    color: colors.wheat,
    subSections: [
      { id: 'field-crops', name: 'المحاصيل الحقلية' },
      { id: 'vegetables', name: 'الخضروات' }
    ]
  },
  {
    id: 'livestock',
    name: 'الحيوانية',
    icon: '🐄',
    color: colors.soil,
    subSections: [
      { id: 'animals', name: 'القطعان' },
      { id: 'housing', name: 'المنشآت والمساكن' }
    ]
  },
  {
    id: 'resources',
    name: 'الموارد',
    icon: '💧',
    color: colors.teal,
    subSections: [
      { id: 'feed', name: 'الأعلاف' },
      { id: 'irrigation', name: 'الري والهندسة' },
      { id: 'soil', name: 'تأهيل التربة' }
    ]
  },
  {
    id: 'analytics',
    name: 'التحليلات',
    icon: '📊',
    color: colors.purple,
    subSections: [
      { id: 'circular', name: 'الدورة المغلقة' },
      { id: 'reports', name: 'التقارير' }
    ]
  },
  {
    id: 'knowledge',
    name: 'المعرفة',
    icon: '📚',
    color: colors.gold,
    subSections: [
      { id: 'encyclopedia', name: 'الموسوعة' }
    ]
  }
];

const MainNavigation = ({
  activeSection,
  activeSubSection,
  onSectionChange,
  onSubSectionChange,
  onSettingsClick,
  onAlertClick
}) => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const currentSection = MAIN_SECTIONS.find(s => s.id === activeSection);
  const currentSubName = activeSubSection
    ? currentSection?.subSections.find(s => s.id === activeSubSection)?.name
    : null;

  return (
    <>
      {/* شريط علوي */}
      <header style={{
        backgroundColor: colors.dark,
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '56px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeSubSection ? (
            <button
              onClick={() => { onSubSectionChange(null); setShowSubMenu(false); }}
              style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: '22px', cursor: 'pointer', padding: '0 4px'
              }}
            >
              ←
            </button>
          ) : (
            <button
              onClick={() => setShowSubMenu(!showSubMenu)}
              style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: '22px', cursor: 'pointer', padding: '0 4px'
              }}
            >
              {showSubMenu ? '✕' : '☰'}
            </button>
          )}
          <h1 style={{ fontSize: '17px', margin: 0 }}>
            {currentSubName || currentSection?.name || 'المزرعة الذكية'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onAlertClick && (
            <button
              onClick={onAlertClick}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '2px' }}
            >
              🔔
            </button>
          )}
          <button
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '2px' }}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* قائمة منسدلة للأقسام الفرعية */}
      {showSubMenu && !activeSubSection && currentSection && (
        <div style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          zIndex: 99
        }}>
          {currentSection.subSections.map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                onSubSectionChange(sub.id);
                setShowSubMenu(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 20px',
                textAlign: 'right',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '15px',
                cursor: 'pointer',
                borderBottom: `1px solid ${colors.sand}`,
                fontFamily: 'inherit',
                color: colors.dark
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* الشريط السفلي */}
      {!activeSubSection && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.dark,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px 4px',
          zIndex: 100,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
        }}>
          {MAIN_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => { onSectionChange(section.id); setShowSubMenu(false); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                color: activeSection === section.id ? section.color : '#888',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '8px',
                minWidth: '56px',
                backgroundColor: activeSection === section.id ? section.color + '22' : 'transparent',
                fontFamily: 'inherit'
              }}
            >
              <span style={{ fontSize: '22px' }}>{section.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: activeSection === section.id ? 'bold' : 'normal' }}>
                {section.name}
              </span>
            </button>
          ))}
        </nav>
      )}

      {/* طبقة خلفية لإغلاق القائمة */}
      {showSubMenu && (
        <div
          onClick={() => setShowSubMenu(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 98
          }}
        />
      )}
    </>
  );
};

export default MainNavigation;
