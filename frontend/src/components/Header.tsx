import { NavLink } from 'react-router-dom';

export default function Header() {
  const navItems = [
    { to: '/', label: 'Welcome' },
    { to: '/intake', label: 'Intake' },
    { to: '/symptoms', label: 'Symptoms' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/results', label: 'Results' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-[0_8px_32px_rgba(25,28,29,0.06)] bg-slate-50/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-extrabold text-blue-700 font-headline tracking-tight">
          MedaPath
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-700 font-bold border-b-2 border-blue-600 pb-1 transition-colors'
                  : 'text-slate-500 font-medium hover:text-blue-800 transition-colors'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">help</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
