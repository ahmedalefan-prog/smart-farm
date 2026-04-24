import React from 'react';
import { colors } from '../theme/theme';

export const MAIN_SECTIONS = [
  {
    id: 'crops',
    name: 'المحاصيل',
    icon: '🌾',
    color: colors.wheat,
    subSections: [
      { id: 'field-crops', name: 'المحاصيل الحقلية' },
      { id: 'vegetables',  name: 'الخضروات' }
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
      { id: 'feed',       name: 'الأعلاف' },
      { id: 'irrigation', name: 'الري والهندسة' },
      { id: 'soil',       name: 'تأهيل التربة' }
    ]
  },
  {
    id: 'analytics',
    name: 'التحليلات',
    icon: '📊',
    color: colors.purple,
    subSections: [
      { id: 'circular', name: 'الدورة المغلقة' },
      { id: 'reports',  name: 'التقارير' },
      { id: 'finance',  name: '💰 المالية' }
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
  const currentSection = MAIN_SECTIONS.find(s => s.id === activeSection);
  const currentSubName = activeSubSection
    ? currentSection?.subSections.find(s => s.id === activeSubSection)?.name
    : null;

  return (
    <>
      {/* ── الهيدر ── */}
      <header style={{
        backgroundColor: colors.dark,
        color: 'white',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        minHeight: '56px'
      }}>
        <h1 style={{ fontSize: '17px', margin: 0, fontWeight: 'bold' }}>
          {currentSubName || currentSection?.name || 'المزرعة الذكية'}
        </h1>

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

      {/* ── شريط الأقسام الفرعية الأفقي ── */}
      {currentSection && (
        <div style={{
          position: 'fixed',
          top: 'calc(56px + env(safe-area-inset-top, 0px))',
          left: 0, right: 0,
          backgroundColor: 'white',
          borderBottom: `1px solid ${colors.sand}`,
          zIndex: 99,
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          padding: '8px 14px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {/* تبويب "نظرة عامة" لكل قسم */}
          <button
            onClick={() => onSubSectionChange(null)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              backgroundColor: !activeSubSection ? currentSection.color : colors.cream,
              color:           !activeSubSection ? 'white'                : colors.soil,
              fontWeight:      !activeSubSection ? 'bold'                 : 'normal'
            }}
          >
            {currentSection.icon} {currentSection.name}
          </button>

          {/* تبويبات الأقسام الفرعية */}
          {currentSection.subSections.map(sub => (
            <button
              key={sub.id}
              onClick={() => onSubSectionChange(sub.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                backgroundColor: activeSubSection === sub.id ? currentSection.color : colors.cream,
                color:           activeSubSection === sub.id ? 'white'               : colors.soil,
                fontWeight:      activeSubSection === sub.id ? 'bold'                : 'normal'
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── الشريط السفلي — دائماً مرئي ── */}
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        backgroundColor: colors.dark,
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '6px',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
      }}>
        {MAIN_SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              color:           activeSection === section.id ? section.color : '#888',
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
    </>
  );
};

export default MainNavigation;
