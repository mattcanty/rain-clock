import React from 'react';

/*
 * Simplified phone screens for the "Add to Home Screen" guide. They're drawings rather than
 * screenshots on purpose: they stay sharp at any size, weigh next to nothing, and don't go stale
 * every time Apple or Google restyle their browser chrome. Each one rings the thing to tap.
 */

const INK = '#161616';
const MUTED = '#8d8d8d';
const QUIET = '#e0e0e0';
const ACCENT = '#0f62fe';
const IOS_BLUE = '#007aff';
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const Phone: React.FunctionComponent<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => {
    // several phones share the page, so each needs its own clip path id
    const clipId = `screen-${React.useId().replace(/:/g, '')}`;
    return (
        <svg viewBox="0 0 180 320" role="img" aria-label={label} style={{ fontFamily: FONT }}>
            <defs>
                <clipPath id={clipId}>
                    <rect x="6" y="6" width="168" height="308" rx="20" />
                </clipPath>
            </defs>
            <rect x="2" y="2" width="176" height="316" rx="24" fill="#ffffff" stroke="#c1c7cd" strokeWidth="3" />
            <g clipPath={`url(#${clipId})`}>{children}</g>
        </svg>
    );
};

// the thing to tap: a soft accent disc with a ring around it
const Tap: React.FunctionComponent<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => (
    <circle cx={x} cy={y} r={r} fill="rgba(15, 98, 254, 0.14)" stroke={ACCENT} strokeWidth="2.5" />
);

const TapRow: React.FunctionComponent<{ x: number; y: number; width: number; height: number }> = props => (
    <rect {...props} rx="8" fill="rgba(15, 98, 254, 0.1)" stroke={ACCENT} strokeWidth="2.5" />
);

// a tiny version of the site itself, so every screen reads as "this page"
const MiniClock: React.FunctionComponent<{ y?: number; dim?: boolean }> = ({ y = 140, dim }) => (
    <g opacity={dim ? 0.35 : 1}>
        <text x="16" y="44" fontSize="11" fontWeight="600" fill={INK}>
            Rain Clock
        </text>
        <circle cx="90" cy={y} r="52" fill="none" stroke="#c1c7cd" strokeWidth="1.5" />
        <path d={`M90 ${y} L90 ${y - 52} A52 52 0 0 1 135 ${y - 26} Z`} fill="#b0c4de" />
        <line x1="90" y1={y} x2="90" y2={y - 34} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1={y} x2="114" y2={y + 10} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="90" cy={y} r="4" fill="#ffffff" stroke={ACCENT} strokeWidth="1.5" />
        <rect x="56" y={y + 70} width="68" height="14" rx="4" fill="#f4f4f4" />
    </g>
);

const AppIcon: React.FunctionComponent<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
    const scale = size / 64;
    return (
        <g transform={`translate(${x} ${y}) scale(${scale})`}>
            <rect width="64" height="64" rx="14" fill={ACCENT} />
            <path d="M44 33.2 C 33.6 42.8, 36 50.8, 44 54 C 52 50.8, 54.4 42.8, 44 33.2 Z" fill="#ffffff" />
            <line x1="32" y1="32" x2="23.5" y2="13.9" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            <line x1="32" y1="32" x2="39.5" y2="21.4" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="32" r="4.5" fill="#ffffff" />
        </g>
    );
};

const ShareIcon: React.FunctionComponent<{ x: number; y: number; color?: string }> = ({ x, y, color = IOS_BLUE }) => (
    <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${x - 3} ${y - 3} h-4 v13 h14 v-13 h-4`} />
        <path d={`M${x} ${y + 3} v-12 M${x - 4} ${y - 5} l4 -4 l4 4`} />
    </g>
);

/* ---------------------------------- iPhone / iPad (Safari) --------------------------------- */

export const IosShare = () => (
    <Phone label="Safari with the Share button highlighted in the toolbar">
        <MiniClock />
        <rect x="6" y="250" width="168" height="64" fill="#f4f4f4" />
        <rect x="16" y="258" width="148" height="20" rx="8" fill="#ffffff" />
        <text x="90" y="272" fontSize="9" fill={INK} textAnchor="middle">
            rainclock.live
        </text>
        <g fill="none" stroke={IOS_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 290 l-5 5 l5 5" />
            <path d="M52 290 l5 5 l-5 5" opacity="0.4" />
            <path d="M118 290 c4 -2 9 -2 12 0 v12 c-3 -2 -8 -2 -12 0 z" />
            <rect x="148" y="289" width="11" height="11" rx="2" />
        </g>
        <ShareIcon x={90} y={295} />
        <Tap x={90} y={295} />
    </Phone>
);

const sheetRows = ['Copy', 'Add to Reading List', 'Add Bookmark', 'Add to Favourites', 'Add to Home Screen'];

export const IosAddToHomeScreen = () => (
    <Phone label="The Share sheet, scrolled down to Add to Home Screen">
        <MiniClock dim />
        <rect x="6" y="6" width="168" height="308" fill="rgba(0, 0, 0, 0.25)" />
        <rect x="6" y="96" width="168" height="230" rx="16" fill="#f2f2f7" />
        <AppIcon x={16} y={108} size={24} />
        <text x="48" y="119" fontSize="10" fontWeight="600" fill={INK}>
            Rain Clock
        </text>
        <text x="48" y="130" fontSize="8" fill={MUTED}>
            rainclock.live
        </text>
        <rect x="14" y="146" width="152" height={sheetRows.length * 26} rx="10" fill="#ffffff" />
        {sheetRows.map((row, index) => {
            const y = 146 + index * 26;
            const target = row === 'Add to Home Screen';
            return (
                <g key={row}>
                    {index > 0 && <line x1="22" y1={y} x2="158" y2={y} stroke={QUIET} strokeWidth="1" />}
                    <text x="24" y={y + 17} fontSize="9.5" fill={INK} fontWeight={target ? 600 : 400}>
                        {row}
                    </text>
                    {target ? (
                        <g fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round">
                            <rect x="144" y={y + 7} width="12" height="12" rx="3" />
                            <path d={`M150 ${y + 10} v6 M147 ${y + 13} h6`} />
                        </g>
                    ) : (
                        <rect x="145" y={y + 8} width="10" height="10" rx="2" fill={QUIET} />
                    )}
                </g>
            );
        })}
        <TapRow x={14} y={146 + 4 * 26} width={152} height={26} />
    </Phone>
);

export const IosConfirm = () => (
    <Phone label="The Add to Home Screen screen with the Add button highlighted">
        <rect x="6" y="6" width="168" height="308" fill="#f2f2f7" />
        <text x="14" y="38" fontSize="9" fill={IOS_BLUE}>
            Cancel
        </text>
        <text x="92" y="38" fontSize="8" fontWeight="600" fill={INK} textAnchor="middle">
            Add to Home Screen
        </text>
        <text x="164" y="38" fontSize="10" fontWeight="600" fill={IOS_BLUE} textAnchor="end">
            Add
        </text>
        <Tap x={155} y={34} r={14} />
        <rect x="14" y="60" width="152" height="64" rx="10" fill="#ffffff" />
        <AppIcon x={24} y={70} size={44} />
        <text x="78" y="88" fontSize="11" fill={INK}>
            Rain Clock
        </text>
        <line x1="78" y1="94" x2="156" y2="94" stroke={QUIET} />
        <text x="78" y="108" fontSize="8" fill={MUTED}>
            rainclock.live
        </text>
        <rect x="14" y="136" width="152" height="30" rx="10" fill="#ffffff" />
        <text x="24" y="155" fontSize="9.5" fill={INK}>
            Open as Web App
        </text>
        <rect x="134" y="144" width="24" height="14" rx="7" fill="#34c759" />
        <circle cx="151" cy="151" r="5.5" fill="#ffffff" />
    </Phone>
);

/* -------------------------------------- Android (Chrome) ------------------------------------- */

const ChromeBar = () => (
    <g>
        <rect x="6" y="6" width="168" height="54" fill="#f4f4f4" />
        <rect x="14" y="24" width="118" height="24" rx="12" fill="#ffffff" />
        <text x="26" y="40" fontSize="9" fill={INK}>
            rainclock.live
        </text>
        <rect x="140" y="29" width="13" height="13" rx="3" fill="none" stroke={INK} strokeWidth="1.5" />
        <g fill={INK}>
            <circle cx="164" cy="30" r="1.8" />
            <circle cx="164" cy="36" r="1.8" />
            <circle cx="164" cy="42" r="1.8" />
        </g>
    </g>
);

export const AndroidMenu = () => (
    <Phone label="Chrome with the three-dot menu button highlighted">
        <g transform="translate(0 30)">
            <MiniClock />
        </g>
        <ChromeBar />
        <Tap x={164} y={36} r={13} />
    </Phone>
);

const menuRows = ['New tab', 'History', 'Downloads', 'Bookmarks', 'Share…', 'Add to Home screen', 'Settings'];

export const AndroidAddToHomeScreen = () => (
    <Phone label="Chrome's menu, with Add to Home screen highlighted">
        <g transform="translate(0 30)">
            <MiniClock dim />
        </g>
        <ChromeBar />
        <rect x="58" y="22" width="112" height={menuRows.length * 26 + 12} rx="8" fill="#ffffff" />
        <rect
            x="58"
            y="22"
            width="112"
            height={menuRows.length * 26 + 12}
            rx="8"
            fill="none"
            stroke={QUIET}
            strokeWidth="1"
        />
        {menuRows.map((row, index) => (
            <text
                key={row}
                x="70"
                y={28 + index * 26 + 17}
                fontSize="9.5"
                fill={INK}
                fontWeight={row === 'Add to Home screen' ? 600 : 400}>
                {row}
            </text>
        ))}
        <TapRow x={62} y={28 + 5 * 26} width={104} height={26} />
    </Phone>
);

export const AndroidConfirm = () => (
    <Phone label="The Install app dialog with the Install button highlighted">
        <g transform="translate(0 30)">
            <MiniClock dim />
        </g>
        <ChromeBar />
        <rect x="6" y="6" width="168" height="308" fill="rgba(0, 0, 0, 0.3)" />
        <rect x="18" y="104" width="144" height="122" rx="16" fill="#ffffff" />
        <text x="32" y="128" fontSize="11" fontWeight="600" fill={INK}>
            Install app
        </text>
        <AppIcon x={32} y={142} size={28} />
        <text x="68" y="154" fontSize="10" fill={INK}>
            Rain Clock
        </text>
        <text x="68" y="166" fontSize="8" fill={MUTED}>
            rainclock.live
        </text>
        <text x="86" y="207" fontSize="10" fill={ACCENT} textAnchor="middle">
            Cancel
        </text>
        <rect x="112" y="194" width="42" height="20" rx="10" fill={ACCENT} />
        <text x="133" y="207" fontSize="9.5" fontWeight="600" fill="#ffffff" textAnchor="middle">
            Install
        </text>
        <Tap x={133} y={204} r={18} />
    </Phone>
);

/* ------------------------------------------ Both ------------------------------------------- */

export const HomeScreen = () => (
    <Phone label="The home screen, with the Rain Clock icon on it">
        <rect x="6" y="6" width="168" height="308" fill="#dde6f3" />
        {Array.from({ length: 4 * 4 }, (_, index) => {
            const x = 22 + (index % 4) * 36;
            const y = 40 + Math.floor(index / 4) * 50;
            return index === 9 ? (
                <g key={index}>
                    <AppIcon x={x} y={y} size={28} />
                    <text x={x + 14} y={y + 40} fontSize="6.5" fill={INK} textAnchor="middle">
                        Rain Clock
                    </text>
                    <Tap x={x + 14} y={y + 14} r={20} />
                </g>
            ) : (
                <rect key={index} x={x} y={y} width="28" height="28" rx="7" fill="#ffffff" opacity="0.8" />
            );
        })}
        <rect x="16" y="270" width="148" height="36" rx="14" fill="rgba(255, 255, 255, 0.5)" />
    </Phone>
);
