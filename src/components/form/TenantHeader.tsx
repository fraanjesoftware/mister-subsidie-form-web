import { useMemo } from 'react';
import { useTenant } from '../../context/TenantProvider';

const LOGO_BY_TENANT = {
  default: {
    src: '/Mistersubsidie logo.png',
    alt: 'Mistersubsidie',
    className: 'h-[12px] w-auto sm:h-[15px]'
  },
  mistersubsidie: {
    src: '/Mistersubsidie logo.png',
    alt: 'Mistersubsidie',
    className: 'h-[12px] w-auto sm:h-[15px]'
  },
  test: {
    src: '/Mistersubsidie logo.png',
    alt: 'Mistersubsidie',
    className: 'h-[12px] w-auto sm:h-[15px]'
  },
  ignite: {
    src: '/Ignite-Group-Primary-Logo-Mint.svg',
    alt: 'Ignite Group',
    className: 'h-7 w-auto sm:h-8 max-w-[180px]'
  },
} as const;


const HEADER_STYLES = {
  default: {
    background: '#122E28',
    textClass: 'text-white',
    buttonClass:
      'border-black/30 bg-white/10 text-white hover:bg-white hover:text-[var(--color-primary)]',
  },
  mistersubsidie: {
    background: '#122E28',
    textClass: 'text-white',
    buttonClass:
      'border-white/30 bg-white/10 text-white hover:bg-white hover:text-[var(--color-primary)]',
  },
  test: {
    background: '#122E28',
    textClass: 'text-white',
    buttonClass:
      'border-white/30 bg-white/10 text-white hover:bg-white hover:text-[var(--color-primary)]',
  },
  ignite: {
    background: '#1E063E',
    textClass: 'text-white',
    buttonClass:
      'border-white/30 bg-white/10 text-white hover:bg-white hover:text-[var(--color-primary)]',
  },
} as const;

export const TenantHeader = () => {
  const { tenantId } = useTenant();

  const { logo, style } = useMemo(() => {
    const resolvedLogo = LOGO_BY_TENANT[tenantId] ?? LOGO_BY_TENANT.default;
    const resolvedStyle = HEADER_STYLES[tenantId] ?? HEADER_STYLES.default;
    return { logo: resolvedLogo, style: resolvedStyle };
  }, [tenantId]);

  return (
    <header
      className="w-full"
      style={{ backgroundColor: style.background }}
    >
      <div
        className={`mx-auto flex h-11 w-full max-w-4xl items-center justify-between gap-4 px-4 sm:px-6 ${style.textClass}`}
      >
        <img
          src={logo.src}
          alt={`${logo.alt} logo`}
          className={`${logo.className} opacity-90 transition-opacity duration-200 hover:opacity-100`}
        />
        {/* <a
          href={action.href}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm transition ${style.buttonClass}`}
        >
          {action.label}
        </a> */}
      </div>
    </header>
  );
};
