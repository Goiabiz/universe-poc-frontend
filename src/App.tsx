import { useState } from 'react';
import { Layout } from './components/Layout';
import { RightPanel } from './components/RightPanel';
import { Dashboard } from './pages/Dashboard';
import { Alertas } from './pages/Alertas';
import { AnaliseAcoes } from './pages/AnaliseAcoes';
import { BaseConhecimento } from './pages/BaseConhecimento';
import { CentralAtendimento } from './pages/CentralAtendimento';
import { ImpactosProduto } from './pages/ImpactosProduto';
import { Configuracoes } from './pages/Configuracoes';

export type PageKey = 'dashboard' | 'alertas' | 'analise' | 'base' | 'atendimento' | 'impactos' | 'config';

const rightPanelByPage: Record<PageKey, React.ComponentProps<typeof RightPanel>['variant']> = {
  dashboard: 'dashboard',
  alertas: 'alerta',
  analise: 'acao',
  base: 'documento',
  atendimento: 'atendimento',
  impactos: 'impacto',
  config: 'config'
};

export function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  const pages: Record<PageKey, React.ReactNode> = {
    dashboard: <Dashboard />,
    alertas: <Alertas />,
    analise: <AnaliseAcoes />,
    base: <BaseConhecimento />,
    atendimento: <CentralAtendimento />,
    impactos: <ImpactosProduto />,
    config: <Configuracoes />
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage} rightPanel={<RightPanel variant={rightPanelByPage[activePage]} />}>
      {pages[activePage]}
    </Layout>
  );
}
