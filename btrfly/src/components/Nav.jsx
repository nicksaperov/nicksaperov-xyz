import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'where', label: 'WHERE I AM', to: '/where-i-am' },
  { id: 'who', label: 'WHO I AM', to: '/who-i-am' },
  { id: 'whats-for', label: 'WHATS FOR', to: '/whats-for' },
];

export default function Nav({ activeNav }) {
  return (
    <header className="px-4 py-6 md:px-10 md:py-8 lg:px-16">
      <nav
        className="grid grid-cols-1 gap-4 text-xs font-bold uppercase tracking-tight sm:grid-cols-3 sm:gap-0 sm:text-sm md:text-base"
        aria-label="Main"
      >
        {NAV_ITEMS.map(({ id, label, to }) => {
          const isActive = activeNav === id;

          return (
            <Link
              key={id}
              to={to}
              className={[
                'inline-flex items-center gap-2 transition-opacity hover:opacity-70',
                id === 'where' && 'sm:justify-self-start',
                id === 'who' && 'sm:justify-self-center',
                id === 'whats-for' && 'sm:justify-self-end',
                isActive && 'underline underline-offset-4',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
              {isActive && (
                <span
                  className={[
                    'h-2 w-2 shrink-0 rounded-full',
                    id === 'who' ? 'bg-accent-yellow' : 'bg-brand',
                  ].join(' ')}
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
