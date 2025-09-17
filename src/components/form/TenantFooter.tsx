import { useMemo } from 'react';
import { useTenant } from '../../context/TenantProvider';

const FOOTER_CONFIG = {
  default: {
    logo: {
      src: '/Mistersubsidie logo.png',
      alt: 'Mistersubsidie',
      className: 'h-[12px] w-auto sm:h-[15px]',
    },
    background: '#132d28',
    textClass: 'text-white',
    contact: {
      label: 'info@mistersubsidie.nl',
      href: 'mailto:info@mistersubsidie.nl',
    },
    legalName: 'Mistersubsidie',
    accentClass: 'text-white/80 hover:text-white',
  },
  mistersubsidie: {
    logo: {
      src: '/Mistersubsidie logo.png',
      alt: 'Mistersubsidie',
      className: 'h-[12px] w-auto sm:h-[15px]',
    },
    background: '#132d28',
    textClass: 'text-white',
    contact: {
      label: 'info@mistersubsidie.nl',
      href: 'mailto:info@mistersubsidie.nl',
    },
    legalName: 'Mistersubsidie',
    accentClass: 'text-white/80 hover:text-white',
  },
  ignite: {
    logo: {
      src: '/Ignite-Group-Primary-Logo-Mint.svg',
      alt: 'Ignite Group',
      className: 'h-6 w-auto sm:h-7',
    },
    background: '#14042e',
    textClass: 'text-white',
    contact: {
      label: 'info@ignite-group.nl',
      href: 'mailto:info@ignite-group.nl',
    },
    legalName: 'Ignite Group',
    accentClass: 'text-teal-200 hover:text-white',
  },
} as const;

export const TenantFooter = () => {
  const { tenantId } = useTenant();

  const config = useMemo(() => FOOTER_CONFIG[tenantId] ?? FOOTER_CONFIG.default, [tenantId]);
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-12 w-full border-t border-white/10"
      style={{ backgroundColor: config.background }}
    >
      <div
        className={`mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 ${config.textClass}`}
      >
        <div className="flex items-center gap-3">
          <img
            src={config.logo.src}
            alt={`${config.logo.alt} logo`}
            className={`${config.logo.className} opacity-90 transition-opacity duration-200 hover:opacity-100`}
          />
     
        </div>
        <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
          <a
            href={config.contact.href}
            className={`text-sm font-medium transition ${config.accentClass}`}
          >
            {config.contact.label}
          </a>
          <p className="text-xs text-white/40">© {year} {config.legalName}. Alle rechten voorbehouden.</p>
          <a
            href="https://fraanjesoftware.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/40 transition hover:text-white/70"
          >
            Ontwikkeld door Fraanje Software
          </a>
        </div>
      </div>
    </footer>
  );
};
