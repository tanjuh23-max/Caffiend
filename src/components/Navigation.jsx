import { NavLink } from 'react-router-dom';
import { Home, Camera, BarChart2, Settings } from 'lucide-react';

const LINKS = [
  { to: '/app',      label: 'Home',    Icon: Home },
  { to: '/scanner',  label: 'Scan',    Icon: Camera },
  { to: '/history',  label: 'History', Icon: BarChart2 },
  { to: '/settings', label: 'Profile', Icon: Settings },
];

export default function Navigation() {
  return (
    <nav
      className="fixed bottom-4 left-1/2 z-40"
      style={{
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '400px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="flex items-center justify-around h-[62px] px-3 rounded-[22px]"
        style={{
          background: 'rgba(14,14,16,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className="flex flex-col items-center gap-1 px-4 py-1.5 relative"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute -top-3 left-1/2 w-8 h-0.5 rounded-full"
                    style={{
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                      boxShadow: '0 0 10px rgba(251,191,36,0.7)',
                    }}
                  />
                )}
                <div
                  className="p-1.5 rounded-xl transition-all duration-200"
                  style={{
                    color: isActive ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                    background: isActive ? 'rgba(251,191,36,0.1)' : 'transparent',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(251,191,36,0.5))' : 'none',
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-[10px] font-semibold transition-all duration-200"
                  style={{ color: isActive ? '#fbbf24' : 'rgba(255,255,255,0.25)' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
