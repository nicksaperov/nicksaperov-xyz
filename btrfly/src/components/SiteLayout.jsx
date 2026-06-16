import Nav from './Nav';

export default function SiteLayout({ activeNav, children }) {
  return (
    <div className="min-h-dvh bg-surface text-ink font-sans">
      <Nav activeNav={activeNav} />
      {children}
    </div>
  );
}
