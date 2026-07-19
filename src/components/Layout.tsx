import { useEffect, useState } from 'react';
import { Bell, BookOpen, Boxes, ChartNoAxesCombined, ChevronLeft, CircleHelp, ClipboardList, Cog, Headphones, Home, Menu, Search, ShieldAlert, UserRound } from 'lucide-react';
import type { PageKey } from '../App';
import { loadWorkspacePreferences } from '../lib/preferences';

const navItems: Array<{ key: PageKey; label: string; icon: React.ReactNode }> = [
  { key: 'dashboard', label: 'Área de Trabalho', icon: <Home size={21} /> },
  { key: 'alertas', label: 'Central de Alertas', icon: <ShieldAlert size={21} /> },
  { key: 'analise', label: 'Roadmap', icon: <ChartNoAxesCombined size={21} /> },
  { key: 'base', label: 'Base de Conhecimento', icon: <BookOpen size={21} /> },
  { key: 'atendimento', label: 'Central de Atendimento', icon: <Headphones size={21} /> },
  { key: 'config', label: 'Configurações', icon: <Cog size={21} /> },
  { key: 'impactos', label: 'Mapa de Impactos', icon: <Boxes size={21} /> }
];

export function Layout({ activePage, onNavigate, children, rightPanel }: { activePage: PageKey; onNavigate: (page: PageKey) => void; children: React.ReactNode; rightPanel?: React.ReactNode }) {
  const [prefs, setPrefs] = useState(() => loadWorkspacePreferences());

  useEffect(() => {
    const refresh = () => setPrefs(loadWorkspacePreferences());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  return (
    <div className="app-shell">
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
        <button className="collapse-btn"><ChevronLeft size={18} /> Recolher menu</button>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <div className="search-box"><Search size={18} /><input placeholder="Buscar por documentos, alertas, impactos, personas ou ações..." /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button className="environment"><span /> Ambiente: <strong>Produção</strong></button>
            <button className="icon-btn"><Bell size={19} /><em>12</em></button>
            <button className="icon-btn"><CircleHelp size={19} /></button>
            <div className="user-area"><div className="avatar">{prefs.userPhotoUrl ? <img src={prefs.userPhotoUrl} alt={prefs.userName} /> : <UserRound size={18} />}</div><div><strong>{prefs.userName}</strong><small>{prefs.userEmail || 'Administrador'}</small></div></div>
          </div>
        </header>
        <div className="content-grid">
          <section className="page-content">{children}</section>
          <aside className="right-panel">{rightPanel}</aside>
        </div>
      </main>
    </div>
  );
}
