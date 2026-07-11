// ============================================================
// ÍCONES SVG — NextLevel
// Substitui os emojis usados no site por ícones de traço simples,
// coerentes com a identidade dark premium (navy + teal). Usam
// stroke="currentColor", então herdam a cor do texto/caixa onde
// entram — não precisam de ajuste por página.
//
// Uso: <script src="/assets/icons.js"></script> e depois
// window.ICONS.dumbbell, window.ICONS.chat, etc. (ver lista abaixo).
// ============================================================
(function () {
  function icon(paths, extra) {
    return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}>${paths}</svg>`;
  }

  window.ICONS = {
    dumbbell:  icon('<rect x="1.5" y="9" width="4" height="6" rx="1.2" fill="currentColor" stroke="none"/><rect x="18.5" y="9" width="4" height="6" rx="1.2" fill="currentColor" stroke="none"/><path d="M7 12h10" stroke-width="2.6"/>'),
    pulse:     icon('<path d="M2 13h4l2-7 3 14 3-11 2 4h6" stroke-width="2.2"/>'),
    calendar:  icon('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>'),
    brain:     icon('<path d="M12 4a3.5 3.5 0 0 0-3.5 3.5c0 .4 0 .8.2 1.2A3 3 0 0 0 7 11.5a3 3 0 0 0 1.6 2.7A2.6 2.6 0 0 0 11 18h2a2.6 2.6 0 0 0 2.4-3.8A3 3 0 0 0 17 11.5a3 3 0 0 0-1.7-2.8c.1-.4.2-.8.2-1.2A3.5 3.5 0 0 0 12 4z"/><path d="M12 4v14"/>'),
    meal:      icon('<path d="M3.5 12a8.5 8.5 0 0 0 17 0"/><path d="M2 12h20"/><path d="M12 3v3"/>'),
    moon:      icon('<path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a7 7 0 0 0 10.2 10.2z"/>'),
    cycle:     icon('<path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.5 15A8 8 0 0 0 19 11M18.5 9A8 8 0 0 0 5 13"/>'),
    clock:     icon('<circle cx="12" cy="13" r="8"/><path d="M12 9.5v4l2.5 1.5"/><path d="M9.5 2h5M12 2v3"/>'),
    clipboard: icon('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><rect x="9" y="2.5" width="6" height="4" rx="1"/><path d="M8.5 12h7M8.5 16h7"/>'),
    lotus:     icon('<path d="M12 20c-4-2-6-5.5-6-8.5a6 6 0 0 1 12 0c0 3-2 6.5-6 8.5z"/><path d="M12 11.5a3 3 0 0 1 3-3M12 11.5a3 3 0 0 0-3-3"/>'),
    flame:     icon('<path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-1.4.5-2.4 1.4-3.3-.1.9.3 1.7 1 1.7.7 0 .9-.8.4-1.7C8.8 6.9 10 4.7 12 3z"/>'),
    shield:    icon('<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>'),
    body:      icon('<circle cx="12" cy="5.2" r="2.2"/><path d="M12 7.4v8M12 9.7l-4.3 2.4M12 9.7l4.3 2.4M12 15.4l-3.2 5.3M12 15.4l3.2 5.3"/>'),
    eye:       icon('<path d="M2.5 12S6.5 5.5 12 5.5 21.5 12 21.5 12 17.5 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
    flask:     icon('<path d="M9.5 2.5v6L4.8 18.6a2 2 0 0 0 1.8 2.9h10.8a2 2 0 0 0 1.8-2.9L14.5 8.5v-6"/><path d="M9.5 2.5h5M8.3 15h7.4"/>'),
    target:    icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>'),
    home:      icon('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>'),
    compass:   icon('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5.3-5.3 2 2-5.3z"/>'),
    breath:    icon('<path d="M3 8h11.5a3 3 0 1 0-2.5-4.7"/><path d="M3 12.5h15a3 3 0 1 1-2.5 4.7"/><path d="M3 17h8"/>'),
    chat:      icon('<path d="M4 5h16v11.5H8.5L4 20.5V5z"/>'),
    spark:     icon('<path d="M12 2l2 6.5L20.5 11 14 13.5 12 20l-2-6.5L3.5 11 10 8.5z"/>'),
    book:      icon('<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2V5z"/><path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2V5z"/>'),
    ear:       icon('<path d="M8 13.5a5 5 0 0 1 5-9.5 6 6 0 0 1 6 6c0 2-1 3-1 5a3 3 0 0 1-3 3"/><path d="M8 13.5c0 2 1 4 3 4"/>'),
    handshake: icon('<path d="M2.5 11.5l4.5-4.5 3 3 2-2 3 3 4.5-4.5"/><path d="M8.5 9.5l5 5"/><path d="M13 10l-2.5 2.5M15.5 12.5L13 15"/>'),
    ladder:    icon('<path d="M7 2v20M17 2v20M7 7h10M7 12h10M7 17h10"/>'),
    bolt:      icon('<path d="M13 2L4.5 14H10l-1 8 9-12h-5.5z"/>'),
    gift:      icon('<rect x="4" y="9" width="16" height="11" rx="1.2"/><path d="M4 9h16M12 9v11"/><path d="M12 9C10.5 5 6 5 6 7.5S9 9 12 9zM12 9c1.5-4 6-4 6-1.5S15 9 12 9z"/>'),
    lock:      icon('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>'),
    rocket:    icon('<path d="M12 2.5c3 2 4 6 3 10l-3 3-3-3c-1-4 0-8 3-10z"/><circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none"/><path d="M9 15l-2.5 4.5L11 17M15 15l2.5 4.5L13 17"/>'),
    search:    icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>'),
    pan:       icon('<circle cx="10" cy="12" r="6.5"/><path d="M16 9.5l5-2.5"/>'),
    chart:     icon('<path d="M3 20h18"/><path d="M6 20V12M11 20V7M16 20v-9M21 20V4"/>'),
    check:     icon('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>'),
  };
})();
