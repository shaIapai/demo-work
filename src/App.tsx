import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AllRecordsView } from './components/data/AllRecordsView';
import { ImportView } from './components/data/ImportView';
import { SourcesView } from './components/data/SourcesView';
import { DiscrepanciesView } from './components/control/DiscrepanciesView';
import { ErrorsView } from './components/control/ErrorsView';
import { MatchingView } from './components/matching/MatchingView';
import { TelegramView } from './components/telegram/TelegramView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { OrderCardView } from './components/objects/OrderCardView';
import { ClientsView, CargoesView, InspectionsView } from './components/objects/AuxiliaryViews';
import { ManualResolutionModal } from './components/control/ManualResolutionModal';

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedOrderNumber,
    setSelectedOrderNumber,
    inspectingDiscrepancy,
    closeDiscrepancyModal,
  } = useData();

  // If a specific order is opened, show the OrderCardView
  if (selectedOrderNumber) {
    return (
      <main className="flex-1 bg-slate-100 min-h-[calc(100vh-4rem)] overflow-y-auto">
        <OrderCardView
          orderNumber={selectedOrderNumber}
          onBack={() => setSelectedOrderNumber(null)}
        />
        {inspectingDiscrepancy && (
          <ManualResolutionModal
            discrepancy={inspectingDiscrepancy}
            onClose={closeDiscrepancyModal}
          />
        )}
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-100 min-h-[calc(100vh-4rem)] overflow-y-auto">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'all-records' && <AllRecordsView />}
      {activeTab === 'import' && <ImportView />}
      {activeTab === 'sources' && <SourcesView />}
      {activeTab === 'discrepancies' && <DiscrepanciesView />}
      {activeTab === 'errors' && <ErrorsView />}
      {activeTab === 'duplicates' && <ErrorsView />}
      {activeTab === 'tasks' && <DiscrepanciesView />}
      {activeTab === 'orders' && <AllRecordsView />}
      {activeTab === 'clients' && <ClientsView />}
      {activeTab === 'cargoes' && <CargoesView />}
      {activeTab === 'inspections' && <InspectionsView />}
      {activeTab === 'matching' && <MatchingView />}
      {activeTab === 'telegram' && <TelegramView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'history' && <HistoryView />}
      {activeTab === 'settings' && <SettingsView />}

      {/* Manual Resolution Modal */}
      {inspectingDiscrepancy && (
        <ManualResolutionModal
          discrepancy={inspectingDiscrepancy}
          onClose={closeDiscrepancyModal}
        />
      )}
    </main>
  );
};

export default function App() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </DataProvider>
  );
}
