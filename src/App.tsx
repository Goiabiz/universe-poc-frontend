import { useState } from 'react';
import { Layout } from './components/Layout';
import { RightPanel, type PanelDetail } from './components/RightPanel';
import { DetailModal } from './components/DetailModal';
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

export type PageProps = {
  onSelectDetail?: (detail: PanelDetail) => void;
  onOpenDetail?: (detail: PanelDetail) => void;
};

export function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [selectedDetail, setSelectedDetail] = useState<PanelDetail | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<PanelDetail | null>(null);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

  const handleNavigate = (page: PageKey) => {
    setActivePage(page);
    setSelectedDetail(null);
    setExpandedDetail(null);
  };

  const pages: Record<PageKey, React.ReactNode> = {
    dashboard: <Dashboard onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    alertas: <Alertas onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    analise: <AnaliseAcoes onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    base: <BaseConhecimento onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    atendimento: <CentralAtendimento onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    impactos: <ImpactosProduto onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />,
    config: <Configuracoes onSelectDetail={setSelectedDetail} onOpenDetail={setExpandedDetail} />
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={handleNavigate}
      rightPanel={<RightPanel variant={rightPanelByPage[activePage]} detail={selectedDetail} onExpand={setExpandedDetail} />}
    >
      {pages[activePage]}
      <DetailModal detail={expandedDetail} onClose={() => setExpandedDetail(null)} />
    </Layout>
  );
}
