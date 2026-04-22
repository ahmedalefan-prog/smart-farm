import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { colors } from './theme/theme';
import MainNavigation from './components/MainNavigation';
import AIChatbot from './components/AIChatbot';
import Modal from './components/shared/Modal';
import SettingsSection from './components/SettingsSection';
import HelpSection from './components/HelpSection';
import DailyLogForm from './components/DailyLogForm';
import AddLandForm from './components/forms/AddLandForm';
import AddCattleHerdForm from './components/forms/AddCattleHerdForm';
import AddPoultryFlockForm from './components/forms/AddPoultryFlockForm';
import AddFishPondForm from './components/forms/AddFishPondForm';
import AddFeedIngredientForm from './components/forms/AddFeedIngredientForm';

import Dashboard from './components/Dashboard';
import CropsSection from './components/CropsSection';
import VegetablesSection from './components/VegetablesSection';
import LivestockSection from './components/LivestockSection';
import HousingSection from './components/HousingSection';
import FeedSection from './components/FeedSection';
import IrrigationSection from './components/IrrigationSection';
import SoilReclamation from './components/SoilReclamation';
import CircularFlow from './components/CircularFlow';
import ReportsSection from './components/ReportsSection';
import EncyclopediaSection from './components/EncyclopediaSection';

import './App.css';

const formComponents = {
  dailyLog: { title: 'سجل العمليات اليومي', color: colors.green },
  land:     { title: 'إضافة قطعة أرض', color: colors.wheat },
  cattle:   { title: 'إضافة قطيع أبقار', color: colors.soil },
  poultry:  { title: 'إضافة قطيع دواجن', color: colors.orange },
  fish:     { title: 'إضافة حوض أسماك', color: colors.sky },
  feed:     { title: 'إضافة مادة علفية', color: colors.lime }
};

const AppContent = () => {
  const { farmData } = useFarm();
  const [activeSection, setActiveSection] = useState('crops');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const renderContent = () => {
    if (activeSubSection) {
      switch (activeSubSection) {
        case 'field-crops':  return <CropsSection />;
        case 'vegetables':   return <VegetablesSection />;
        case 'animals':      return <LivestockSection />;
        case 'housing':      return <HousingSection />;
        case 'feed':         return <FeedSection />;
        case 'irrigation':   return <IrrigationSection />;
        case 'soil':         return <SoilReclamation />;
        case 'circular':     return <CircularFlow />;
        case 'reports':      return <ReportsSection />;
        case 'encyclopedia': return <EncyclopediaSection />;
        default:             return <Dashboard />;
      }
    }

    switch (activeSection) {
      case 'crops':      return <Dashboard type="crops" />;
      case 'livestock':  return <Dashboard type="livestock" />;
      case 'resources':  return <Dashboard type="resources" />;
      case 'analytics':  return <Dashboard type="analytics" />;
      case 'knowledge':  return <Dashboard type="knowledge" />;
      default:           return <Dashboard />;
    }
  };

  const hasTodayLog = farmData.dailyLogs.some(log => {
    const today = new Date().toISOString().split('T')[0];
    return log.date && log.date.startsWith(today);
  });

  return (
    <div className="app" dir="rtl">
      <MainNavigation
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSectionChange={(id) => { setActiveSection(id); setActiveSubSection(null); setShowAddMenu(false); }}
        onSubSectionChange={(id) => { setActiveSubSection(id); setShowAddMenu(false); }}
        onSettingsClick={() => setShowSettings(true)}
        onAlertClick={() => setShowHelp(true)}
      />

      <main className="app-main" style={{
        backgroundColor: colors.cream,
        minHeight: '100vh',
        paddingTop: '56px',
        paddingBottom: activeSubSection ? '20px' : '80px'
      }}>
        {!hasTodayLog && (
          <div style={{
            backgroundColor: colors.gold,
            padding: '10px 16px',
            color: colors.dark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '14px' }}>📋 لم تسجّل سجل اليوم بعد</span>
            <button
              onClick={() => setActiveForm('dailyLog')}
              style={{
                padding: '6px 12px',
                backgroundColor: colors.dark,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px'
              }}
            >
              سجّل الآن
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      {/* المستشار الذكي العائم */}
      <AIChatbot />

      {/* زر الإضافة العائم */}
      <div style={{ position: 'fixed', bottom: activeSubSection ? '20px' : '80px', left: '16px', zIndex: 999 }}>
        {showAddMenu && (
          <div style={{
            position: 'absolute',
            bottom: '64px',
            left: 0,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '6px',
            minWidth: '190px'
          }}>
            {Object.entries(formComponents).map(([key, { title, color }]) => (
              <button
                key={key}
                onClick={() => { setActiveForm(key); setShowAddMenu(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${colors.sand}`,
                  textAlign: 'right',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: colors.dark,
                  fontFamily: 'inherit'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: '10px', height: '10px',
                  borderRadius: '3px',
                  backgroundColor: color,
                  marginLeft: '8px'
                }} />
                {title}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          style={{
            width: '54px', height: '54px',
            borderRadius: '27px',
            backgroundColor: colors.green,
            color: 'white',
            border: 'none',
            fontSize: '26px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showAddMenu ? '✕' : '+'}
        </button>
      </div>

      {/* نوافذ منبثقة */}
      {showSettings && (
        <Modal title="⚙️ الإعدادات" onClose={() => setShowSettings(false)}>
          <SettingsSection onClose={() => setShowSettings(false)} />
        </Modal>
      )}

      {showHelp && (
        <Modal title="❓ دليل الاستخدام" onClose={() => setShowHelp(false)}>
          <HelpSection />
        </Modal>
      )}

      {activeForm && (
        <Modal title={formComponents[activeForm].title} onClose={() => setActiveForm(null)}>
          {activeForm === 'dailyLog' && <DailyLogForm onSuccess={() => setActiveForm(null)} />}
          {activeForm === 'land'     && <AddLandForm onSuccess={() => setActiveForm(null)} />}
          {activeForm === 'cattle'   && <AddCattleHerdForm onSuccess={() => setActiveForm(null)} />}
          {activeForm === 'poultry'  && <AddPoultryFlockForm onSuccess={() => setActiveForm(null)} />}
          {activeForm === 'fish'     && <AddFishPondForm onSuccess={() => setActiveForm(null)} />}
          {activeForm === 'feed'     && <AddFeedIngredientForm onSuccess={() => setActiveForm(null)} />}
        </Modal>
      )}
    </div>
  );
};

function App() {
  return (
    <FarmProvider>
      <AppContent />
    </FarmProvider>
  );
}

export default App;
