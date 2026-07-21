import { useEffect, useRef, useState } from 'react';
import { Bell, BookOpen, ChartNoAxesCombined, ChevronLeft, ChevronRight, CircleHelp, Cog, Headphones, Home, Menu, Search, ShieldAlert, UserRound } from 'lucide-react';
import type { PageKey } from '../App';
import { loadWorkspacePreferences } from '../lib/preferences';

const navItems: Array<{ key: PageKey; label: string; icon: React.ReactNode }> = [
  { key: 'dashboard', label: 'Área de Trabalho', icon: <Home size={21} /> },
  { key: 'base', label: 'Base de Conhecimento', icon: <BookOpen size={21} /> },
  { key: 'alertas', label: 'Central de Alertas', icon: <ShieldAlert size={21} /> },
  { key: 'atendimento', label: 'Central de Atendimento', icon: <Headphones size={21} /> },
  { key: 'analise', label: 'Roadmap', icon: <ChartNoAxesCombined size={21} /> },
  { key: 'config', label: 'Parametrização', icon: <Cog size={21} /> }
];

export function Layout({ activePage, onNavigate, children, rightPanel }: { activePage: PageKey; onNavigate: (page: PageKey) => void; children: React.ReactNode; rightPanel?: React.ReactNode }) {
  const [prefs, setPrefs] = useState(() => loadWorkspacePreferences());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => window.localStorage.getItem('radar-sus-sidebar-collapsed') === 'true');
  const [panelSize, setPanelSize] = useState(() => window.localStorage.getItem('radar-sus-right-panel-size') || 'medium');
  const [panelWidth, setPanelWidth] = useState(() => Number(window.localStorage.getItem('radar-sus-right-panel-width') || 0));
  const isResizing = useRef(false);

  useEffect(() => {
    const refresh = () => setPrefs(loadWorkspacePreferences());
    const refreshPanel = () => {
      setPanelSize(window.localStorage.getItem('radar-sus-right-panel-size') || 'medium');
      setPanelWidth(Number(window.localStorage.getItem('radar-sus-right-panel-width') || 0));
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing.current) return;
      const width = Math.min(680, Math.max(340, window.innerWidth - event.clientX));
      setPanelWidth(width);
      window.localStorage.setItem('radar-sus-right-panel-width', String(width));
      window.localStorage.setItem('radar-sus-right-panel-size', 'custom');
      window.dispatchEvent(new CustomEvent('radar-sus-panel-size-changed'));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.classList.remove('is-resizing-right-panel');
    };

    window.addEventListener('storage', refresh);
    window.addEventListener('radar-sus-panel-size-changed', refreshPanel);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('radar-sus-panel-size-changed', refreshPanel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <Menu size={22} />
          <span>Radar <strong>SUS</strong></span>
          <div className="radar-mark" />
        </div>
        <nav>
          {navItems.map((item) => (
            <button key={item.key} className={activePage === item.key ? 'active' : ''} onClick={() => onNavigate(item.key)}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="collapse-btn icon-only"
          title={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          onClick={() => {
            const next = !isSidebarCollapsed;
            setIsSidebarCollapsed(next);
            window.localStorage.setItem('radar-sus-sidebar-collapsed', String(next));
          }}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <div className="search-box"><Search size={18} /><input placeholder="Buscar por documentos, alertas, atendimentos, alertas, conhecimentos ou tarefas..." /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button className="environment"><span /> Ambiente: <strong>Produção</strong></button>
            <button className="icon-btn"><Bell size={19} /><em>12</em></button>
            <button className="icon-btn"><CircleHelp size={19} /></button>
            <div className="user-area"><div className="avatar">{prefs.userPhotoUrl ? <img src={prefs.userPhotoUrl} alt={prefs.userName} /> : <UserRound size={18} />}</div><div><strong>{prefs.userName}</strong><small>{prefs.userEmail || 'Administrador'}</small></div></div>
          </div>
        </header>
        <div className={`content-grid ${rightPanel ? `panel-${panelSize}` : 'panel-hidden'}`} style={rightPanel && panelWidth ? ({ '--right-panel-width': `${panelWidth}px` } as React.CSSProperties) : undefined}>
          <section className="page-content">{children}</section>
          {rightPanel && (
            <aside className="right-panel">
              <button
                className="right-panel-resizer"
                title="Arraste para ajustar a largura do painel"
                onMouseDown={() => {
                  isResizing.current = true;
                  document.body.classList.add('is-resizing-right-panel');
                }}
              />
              {rightPanel}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
