/**
 * View Icons - Visualizador de Iconos SVG (Tailwind / Heroicons)
 * Permite explorar, buscar y copiar claves, d-paths y elementos SVG completos.
 */

const ICON_MAP = {
  'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  'briefcase': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'map': 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  'map-marker': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  'users-cog': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z',
  'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'cliente': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z M19 11h-4m2-2v4',
  'client': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z M19 11h-4m2-2v4',
  'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'wallet': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z',
  'chart': 'M3 3h18v18H3V3zm3 12h3V9H6v6zm6 0h3v-9h-3v9zm6 0h3v-4h-3v4z',
  'document': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'file': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'file-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'calendar-event': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z M12 14h.01',
  'dashboard': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'globe': 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253',
  'city': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'identification': 'M15 9a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM9 21h6M3 16.25c0-1.242 1.058-2.25 2.364-2.25h13.272C19.942 14 21 15.008 21 16.25V18a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.75z',
  'id-card': 'M15 9a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM9 21h6M3 16.25c0-1.242 1.058-2.25 2.364-2.25h13.272C19.942 14 21 15.008 21 16.25V18a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.75z',
  'user-check': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  'scale': 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9zm3 1v9M18 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9zm3 1v9M12 3v18m0-18L9 6m3-3l3 3',
  'currency-dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1',
  'document-duplicate': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  'chat-bubble': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  'tag': 'M9.504 3.004a1.5 1.5 0 011.06.44l8.594 8.594a1.5 1.5 0 010 2.122l-5.656 5.656a1.5 1.5 0 01-2.122 0L2.784 11.22a1.5 1.5 0 01-.44-1.06V4.5a1.5 1.5 0 011.5-1.5h5.66m.246 3.75a1 1 0 10-2 0 1 1 0 002 0',
  'bank': 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  'store': 'M3 3h18v2H3V3zm1 4l1 12h14l1-12H4zm8 3v6M8 10v6m8-6v6',
  'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 03 3z',
  'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'user-group': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  'clipboard': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6-4h6',
  'building-bank': 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  'bell': 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  'exclamation-triangle': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  'history': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'layers': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  'mail': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'calculator': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'hashtag': 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'number': 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  'shopping-bag': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  'badge-check': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'user-id': 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  'receipt-tax': 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  'receipt': 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  'presentation-chart-bar': 'M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12H4V4z',
  'code': 'M10 20l-5-5 5-5m4-4l5 5-5 5',
  'terminal': 'M8 9l3 3-3 3m5 0h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
  'command': 'M6 6l12 12M6 18L18 6M5 5h4v4H5V5zm10 10h4v4h-4v-4z',
  'braces': 'M8 3H6a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 012 2v5a2 2 0 002 2h2M16 3h2a2 2 0 012 2v5a2 2 0 002 2 2 2 0 01-2 2v5a2 2 0 01-2 2h-2',
  'brackets': 'M8 4H5v16h3m8-16h3v16h-3',
  'bug': 'M9 9V5a3 3 0 016 0v4m-9 3h12m-9 4h6m-9-4l-3-2m15 2l3-2m-4-4l2-3m-10 3L6 7m3 12v2m6-2v2',
  'git-branch': 'M6 3v12a3 3 0 003 3h6m-9-9h6a3 3 0 003-3V3m0 0a3 3 0 100 6 3 3 0 000-6zM6 3a3 3 0 100 6 3 3 0 000-6z',
  'git-merge': 'M6 3v12a3 3 0 003 3h6m0-12v9m0-9a3 3 0 100-6 3 3 0 000 6zm0 0a3 3 0 100 6 3 3 0 000-6z',
  'database': 'M4 6c0-1.657 3.582-3 8-3s8 1.343 8 3-3.582 3-8 3-8-1.343-8-3zm0 0v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6m-16 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6',
  'server': 'M5 3h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 10h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zm3-5h.01M8 16h.01',
  'api': 'M7 8h10M7 12h6m-6 4h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
  'key': 'M15 7a5 5 0 11-9.9 1H3v4h3v3h3v-3h2.1A5 5 0 0015 7zm0 0h.01',
  'lock': 'M16 10V7a4 4 0 00-8 0v3m-2 0h12v10H6V10z',
  'unlock': 'M8 10V7a4 4 0 018-1m-8 4h12v10H8V10z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'shield-check': 'M9 12l2 2 4-4m5-2v5c0 6-8 10-8 10S4 19 4 13V8l8-3 8 3z',
  'code-bracket': 'M8 9l-3 3 3 3m8-6l3 3-3 3m-5 3l2-12',
  'function': 'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7',
  'command-line': 'M4 5l6 6-6 6m8 0h8',
  'archive': 'M3 7h18M5 7v12h14V7M4 3h16v4H4V3zm5 8h6',
  'download': 'M12 3v12m0 0l-4-4m4 4l4-4M5 21h14',
  'upload': 'M12 15V3m0 0l-4 4m4-4l4 4M5 21h14',
  'cloud': 'M7 18a4 4 0 110-8 5 5 0 019.9-1A4.5 4.5 0 1118 18H7z',
  'cloud-upload': 'M7 16a4 4 0 110-8 5 5 0 019.9-1A4.5 4.5 0 1118 16h-1m-5-7v9m0 0l-3-3m3 3l3-3',
  'cloud-download': 'M7 16a4 4 0 110-8 5 5 0 019.9-1A4.5 4.5 0 1118 16h-1m-5-5v9m0 0l-3-3m3 3l3-3',
  'save': 'M5 3h12l3 3v15H4V4a1 1 0 011-1zm3 0v6h8V3M8 21v-6h8v6',
  'trash': 'M6 7h12m-9 0V4h6v3m-8 0l1 14h8l1-14M10 11v6m4-6v6',
  'edit': 'M15.232 5.232l3.536 3.536M4 20h4l10.768-10.768a2.5 2.5 0 00-3.536-3.536L4 16.464V20z',
  'copy': 'M8 8h10a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2V10a2 2 0 012-2zM16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h1',
  'search': 'M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z',
  'filter': 'M3 5h18M6 12h12m-8 7h4',
  'sort': 'M8 6h13M8 12h10M8 18h7M3 6h.01M3 12h.01M3 18h.01',
  'paperclip': 'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48',
  'link': 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71m2.5 5.29a5 5 0 01-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  'external-link': 'M14 3h7v7m0-7L10 14M5 5h5M5 5v14h14v-5',
  'eye': 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  'eye-off': 'M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A9.77 9.77 0 0112 4c6.5 0 10 8 10 8a17.2 17.2 0 01-3.17 4.33M6.61 6.61C3.87 8.17 2 12 2 12s3.5 8 10 8c1.61 0 3.04-.36 4.29-.94',
  'chart-bar': 'M4 19V5m0 14h16M8 17v-5m4 5V8m4 9v-8',
  'chart-pie': 'M11 3a9 9 0 109 9h-9V3zm2 0v7h7a9 9 0 00-7-7z',
  'chart-line': 'M3 17l6-6 4 4 8-9',
  'trending-down': 'M21 17v-8m0 8h-8m8 0l-8-8-4 4-6-6',
  'activity': 'M3 12h4l3-8 4 16 3-8h4',
  'analytics': 'M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-7',
  'percent': 'M19 5L5 19M6.5 6.5h.01M17.5 17.5h.01',
  'presentation': 'M4 4h16v12H4V4zm4 16l4-4 4 4M3 4h18',
  'table': 'M4 5h16v14H4V5zm0 5h16M10 5v14M16 5v14',
  'dashboard-grid': 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
  'pulse': 'M3 12h4l2-5 4 10 2-5h6',
  'refresh': 'M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 102.05 9',
  'sync': 'M20 11a8.1 8.1 0 00-14.9-4M4 13a8.1 8.1 0 0014.9 4M5 3v4h4m10 14v-4h-4',
  'check': 'M5 13l4 4L19 7',
  'x': 'M6 6l12 12M6 18L18 6',
  'plus': 'M12 5v14m-7-7h14',
  'minus': 'M5 12h14',
  'arrow-left': 'M19 12H5m7 7l-7-7 7-7',
  'arrow-right': 'M5 12h14m-7-7l7 7-7 7',
  'arrow-up': 'M12 19V5m0 0l-7 7m7-7l7 7',
  'arrow-down': 'M12 5v14m0 0l7-7m-7 7l-7-7',
  'chevron-down': 'M19 9l-7 7-7-7',
  'chevron-up': 'M5 15l7-7 7 7',
  'chevron-left': 'M15 19l-7-7 7-7',
  'chevron-right': 'M9 5l7 7-7 7',
  'play': 'M8 5v14l11-7L8 5z',
  'pause': 'M8 5v14m8-14v14',
  'stop': 'M6 6h12v12H6V6z',
  'power': 'M12 2v10m6.36-6.36a9 9 0 11-12.72 0',
  'logout': 'M10 17l5-5-5-5m5 5H3m12-9h4a2 2 0 012 2v12a2 2 0 01-2 2h-4',
  'login': 'M14 8l4 4-4 4m4-4H3m11-9h4a2 2 0 012 2v14a2 2 0 01-2 2h-4',
  'cash': 'M17 9V5H7v4m10 0v10H7V9h10zm-5 3h.01M9 12a3 3 0 006 0',
  'coins': 'M12 6c4.418 0 8-1.343 8-3s-3.582-3-8-3-8 1.343-8 3 3.582 3 8 3zm8-3v6c0 1.657-3.582 3-8 3S4 10.657 4 9V3m16 6v6c0 1.657-3.582 3-8 3s-8-1.343-8-3V9',
  'banknotes': 'M4 6h16v12H4V6zm3 3h.01M17 15h.01M12 15a3 3 0 100-6 3 3 0 000 6z',
  'piggy-bank': 'M5 11a7 7 0 0114 0v5H5v-5zm-2 2h2m14 0h2m-9-8V3m-4 2l-2-2m10 2l2-2M9 16v3m6-3v3',
  'cash-register': 'M4 7h16v12H4V7zm3-4h10v4H7V3zm2 8h6m-6 3h6m-3-3v3',
  'safe': 'M5 4h14v16H5V4zm3 4h8v8H8V8zm3 3h2v2h-2v-2z',
  'hand-money': 'M3 10h5l3 3h3a2 2 0 000-4h-2m0 0l-2-2H7m5 2h3l3 3h3v7H3v-7',
  'exchange': 'M7 7h12l-3-3m3 3l-3 3M17 17H5l3 3m-3-3l3-3',
  'invoice': 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6m-6 4h6m-6 4h4',
  'loan': 'M4 5h16v14H4V5zm4 4h8m-8 4h5',
  'office': 'M3 21h18M5 21V5l7-3 7 3v16M9 9h1m-1 4h1m4-4h1m-1 4h1',
  'warehouse': 'M3 21V8l9-5 9 5v13M3 10h18M7 14h2m-2 4h2m4-4h2m-2 4h2',
  'factory': 'M3 21V8l6 3V7l6 4V7l6 4v10M3 21h18M7 17h2m4 0h2m4 0h2',
  'network': 'M12 12a3 3 0 100-6 3 3 0 000 6zm-7 9a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6zM10 10L7 15m7-5l3 5',
  'workflow': 'M5 4h5v5H5V4zm9 11h5v5h-5v-5zm-9-5h5v5H5v-5zm5-3h4v8',
  'sitemap': 'M12 3v5m0 0H6v4m6-4h6v4M6 12v4m0 0H3v4m3-4h6v4m6-4v4m0-4h3v4',
  'project': 'M4 5h16v14H4V5zm4 4h8M8 13h5',
  'task': 'M5 4h14v16H5V4zm3 4h6m-6 4h6m-6 4h4',
  'checklist': 'M5 5h14M5 12h14M5 19h14M2 5h.01M2 12h.01M2 19h.01',
  'team': 'M16 11a4 4 0 10-8 0m-5 8a9 9 0 0118 0M5 11a3 3 0 100-6m14 6a3 3 0 100-6',
  'fingerprint': 'M12 11a1 1 0 100-2 1 1 0 000 2zm-5 5a7 7 0 0110-9m-12 6a10 10 0 0114-10M4 19a12 12 0 0116-14',
  'security': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'user-lock': 'M16 11a4 4 0 10-8 0m-5 8a9 9 0 0118 0M17 14v-2a2 2 0 014 0v2m-5 0h6v5h-6v-5',
  'access': 'M5 4h14v16H5V4zm4 8h6m-3-3v6',
  'password': 'M5 11h14v8H5v-8zm3 0V8a4 4 0 018 0v3',
  'verified': 'M12 3l2 2 3-.5.5 3 2 2-2 2-.5 3-3-.5-2 2-2-2-3 .5-.5-3-2-2-2 2-2-.5-3 .5-2-2-2 2-2-2-2 .5-3 3 .5',
  'wifi': 'M5 12.55a11 11 0 0114.08 0M8.53 16.11a6 6 0 017.94 0M12 20h.01M2 8.82a16 16 0 0120 0',
  'server-network': 'M4 4h16v6H4V4zm0 10h16v6H4v-6zm4-4v4m8-4v4M8 7h.01M8 17h.01',
  'rss': 'M5 19a2 2 0 100-4 2 2 0 000 4zM5 10a9 9 0 019 9M5 5a14 14 0 0114 14',
  'phone': 'M3 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2C9.716 18 3 11.284 3 3z',
  'video': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM3 6h12v12H3V6z',
  'megaphone': 'M3 11l18-5v10L3 11zm0 0v5a2 2 0 002 2h2l-2-7m12-3v10',
  'send': 'M3 11l18-9-9 18-2-7-7-2zm7 2l11-11',
  'inbox': 'M3 13h5l2 3h4l2-3h5M5 13l1-8h12l1 8M5 13l-2 6h18l-2-6',
  'at-symbol': 'M16 8a5 5 0 10-1 8m1-8v5a2 2 0 104 0V8a8 8 0 10-1.5 4.7',
  'menu': 'M4 6h16M4 12h16M4 18h16',
  'grid': 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z',
  'list': 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  'more-horizontal': 'M6 12h.01M12 12h.01M18 12h.01',
  'more-vertical': 'M12 6h.01M12 12h.01M12 18h.01',
  'maximize': 'M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5',
  'minimize': 'M5 12h14',
  'fullscreen': 'M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5',
  'zoom-in': 'M12 8v8m-4-4h8m5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  'zoom-out': 'M8 12h8m5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  'info': 'M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'help': 'M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4m.08 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.89a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z',
  'bookmark': 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z',
  'flag': 'M5 3v18m0-16h11l-3 4 3 4H5',
  'heart': 'M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364 4.318 12.682a4.5 4.5 0 010-6.364z',
  'box': 'M3 7l9-4 9 4v10l-9 4-9-4V7zm0 0l9 4 9-4M12 11v10',
  'package': 'M4 7l8-4 8 4v10l-8 4-8-4V7zm0 0l8 4 8-4M12 11v10',
  'truck': 'M3 6h11v11H3V6zm11 5h4l3 3v3h-7v-6zm-8 8a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z',
  'cart': 'M3 3h2l2 12h10l3-8H6m1 12a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z',
  'barcode': 'M4 5v14m3-14v14m3-14v14m4-14v14m3-14v14m3-14v14',
  'qr-code': 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h2v2h-2v-2zm4 0h2v6h-6v-2h4v-4z',
  'clipboard-list': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 12h6m-6 4h4',
  'location': 'M12 21s8-5 8-11a8 8 0 10-16 0c0 6 8 11 8 11zm0-8a3 3 0 100-6 3 3 0 000 6z',
  'wrench': 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-3 3-2-2 3-3z',
  'tool': 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-3 3-2-2 3-3z',
  'hammer': 'M14 4l6 6m-8-4l-6 6m0 0l-3-3 5-5 3 3m-5 5l8 8',
  'sliders': 'M4 6h16M4 12h16M4 18h16M8 4v4m8-4v4m-5 6v4m6-4v4',
  'adjustments': 'M4 6h16M4 12h16M4 18h16M8 3v6m8-6v6m-5 6v6',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'lightning': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'cpu': 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z',
  'memory': 'M5 5h14v14H5V5zm3 3h8v8H8V8zm-5 4h2m12 0h2M12 3v2m0 14v2',
  'monitor': 'M4 4h16v12H4V4zm5 16h6m-3-4v4',
  'desktop': 'M3 4h18v13H3V4zm5 17h8m-4-4v4',
  'laptop': 'M4 5h16v11H4V5zm-2 14h20',
  'mobile': 'M7 3h10v18H7V3zm5 15h.01',
  'tablet': 'M5 3h14v18H5V3zm7 15h.01',
  'printer': 'M6 9V3h12v6M6 17H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2m-12 0h12v4H6v-4z',
  'camera': 'M4 7h4l2-2h4l2 2h4v12H4V7zm8 9a3 3 0 100-6 3 3 0 000 6z',
  'keyboard': 'M3 6h18v12H3V6zm3 4h.01m3 0h.01m3 0h.01m3 0h.01m3 0h.01M6 14h12',
  'rocket': 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 013.5-5.5C15.5 2 21 3 21 3s1 5.5-3.5 9.5A22 22 0 0112 15zM9 12l-4 4m10-7h.01',
  'docker': 'M3 10h18v7H3v-7zm3-4h3v4H6V6zm4 0h3v4h-3V6zm4 0h3v4h-3V6zm-8 11a4 4 0 008 0',
  'container': 'M4 7h16v12H4V7zm4-4h8v4H8V3zm0 8h2m2 0h2m2 0h2',
  'cloud-server': 'M5 16h14a4 4 0 100-8 5 5 0 00-9.9 1A4 4 0 005 16zm4-3h6m-6-3h6',
  'deploy': 'M12 3v12m0 0l-4-4m4 4l4-4M5 21h14',
  'git-pull': 'M6 3v12a3 3 0 003 3h6m0-12v9m0-9a3 3 0 100-6 3 3 0 000 6zM6 3a3 3 0 100 6 3 3 0 000-6z',
  'branch': 'M6 3v12a3 3 0 003 3h6m0-12v9M6 3a3 3 0 100 6 3 3 0 000-6zm9 0a3 3 0 100 6 3 3 0 000-6z',
  'commit': 'M12 8a4 4 0 100 8 4 4 0 000-8zm-4 4H3m18 0h-5',
  'pipeline': 'M4 4h6v6H4V4zm10 10h6v6h-6v-6zM10 7h4a4 4 0 014 4v3',
  'calendar-plus': 'M8 3v4m8-4v4M5 10h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm7-7v6m-3-3h6',
  'calendar-check': 'M8 3v4m8-4v4M5 10h14M9 16l2 2 4-4M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'calendar-x': 'M8 3v4m8-4v4M5 10h14M9 15l6 6m0-6l-6 6M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'timer': 'M12 8v4l3 3m-3-12V2m-5 1l1 2m9-2l-1 2M5 7l2 1m10-1l-2 1M3 12a9 9 0 1018 0 9 9 0 00-18 0z',
  'hourglass': 'M6 3h12M6 21h12M8 3c0 4 4 5 4 9s-4 5-4 9m8-18c0 4-4 5-4 9s4 5 4 9',
  'terminal-square': 'M4 4h16v16H4V4zm4 5l3 3-3 3m5 0h3',
  'json': 'M7 4H5a2 2 0 00-2 2v3a3 3 0 013 3 3 3 0 00-3 3v3a2 2 0 002 2h2m10-16h2a2 2 0 012 2v3a3 3 0 00-3 3 3 3 0 013 3v3a2 2 0 01-2 2h-2',
  'database-search': 'M4 6c0-1.657 3.582-3 8-3s8 1.343 8 3-3.582 3-8 3-8-1.343-8-3zm0 0v6c0 1.657 3.582 3 8 3m8-9v6m-8 3c-2.5 0-4.7-.5-6.1-1.3M19 16l3 3m-1-4a4 4 0 11-8 0 4 4 0 018 0z',
  'sql': 'M4 5c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zm0 0v7c0 1.1 3.6 2 8 2m8-9v7M4 12v7c0 1.1 3.6 2 8 2',
  'regex': 'M4 7h5m-2.5-2.5v5M13 5l7 14m-7-7h7',
  'json-file': 'M7 3h7l4 4v14H7V3zm7 0v5h4M10 12h4m-4 4h4',
  'terminal-history': 'M4 4h16v16H4V4zm4 4l3 3-3 3m5 0h3M8 17h8',
  'compare': 'M8 4H5a2 2 0 00-2 2v12a2 2 0 002 2h3m8-16h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M8 8h8m-8 4h8m-8 4h5',
  'diff': 'M7 3v18m10-18v18M3 8h8m-8 8h8m2-8h6m-6 8h6',
  'code-review': 'M5 5h14v14H5V5zm3 4l2 2-2 2m4 0h3',
  'test': 'M8 3h8m-6 0v7l-4 7a2 2 0 002 3h8a2 2 0 002-3l-4-7V3',
  'flask': 'M9 3v7l-4 8a2 2 0 002 3h10a2 2 0 002-3l-4-8V3m-6 0h8m-7 10h6',
  'package-manager': 'M4 7l8-4 8 4v10l-8 4-8-4V7zm0 0l8 4 8-4M12 11v10',

  // Vehículos y Transporte
  'car': 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 6h-3.6a2 2 0 00-1.8 1.1L5.8 11.5A2 2 0 004 12.6V16a1 1 0 001 1h1m12 0h1a1 1 0 001-1v-3.4a2 2 0 00-.6-1.4l-2.4-2.6A2 2 0 0015 6h-2z',
  'auto': 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 6h-3.6a2 2 0 00-1.8 1.1L5.8 11.5A2 2 0 004 12.6V16a1 1 0 001 1h1m12 0h1a1 1 0 001-1v-3.4a2 2 0 00-.6-1.4l-2.4-2.6A2 2 0 0015 6h-2z',
  'truck-delivery': 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1H7m6 1h2.586a1 1 0 00.707-.293l3.414-3.414a1 1 0 00.293-.707V11a1 1 0 00-1-1h-5v6zm-10 1a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z',
  'bus': 'M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 12v2m10-2v2M6 8h12M7 13h.01M17 13h.01',
  'van': 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1H7m6 1h2.586a1 1 0 00.707-.293l3.414-3.414a1 1 0 00.293-.707V11a1 1 0 00-1-1h-5v6zm-10 1a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z',

  // Deportes y Actividades
  'ball': 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10',
  'basketball': 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10',
  'trophy': 'M8 21h8m-4-4v4M5 3h14v5a7 7 0 01-14 0V3zM5 3H3v4a3 3 0 003 3h1m12-7h2v4a3 3 0 01-3 3h-1',
  'target': 'M12 15a3 3 0 100-6 3 3 0 000 6zm0-9a9 9 0 100 18 9 9 0 000-18z',
  'sports': 'M12 2a10 10 0 100 20 10 10 0 000-20zM6 12l6-6 6 6-6 6z',

  // Tatuajes, Arte y Diseño
  'tattoo': 'M5 3v4M3 5h4M6 17v4m-2-2h4m11-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.143-5.714L5 13l5.714-2.143L13 4z',
  'sparkles': 'M5 3v4M3 5h4M6 17v4m-2-2h4m11-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.143-5.714L5 13l5.714-2.143L13 4z',
  'palette': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h14a2 2 0 012 2v12a4 4 0 01-4 4H7zm5-16a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm-8 4a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z',
  'brush': 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',

  // Inventario y Almacén
  'inventory': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  'cube': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  'stack': 'M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4',

  // Solicitudes y Documentos
  'request': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  'solicitud': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  'document-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',

  // Pagos y Financiero
  'payment': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  'pago': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  'dollar': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1',
  'wallet-card': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9',

  // Administrativos y Gestión
  'admin': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'management': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'briefcase-user': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',

  // Compras Web y E-commerce
  'shopping-cart': 'M3 3h2l2 12h10l3-8H6m1 12a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z',
  'gift': 'M12 8v13m0-13V3.5A1.5 1.5 0 0113.5 2C14.5 2 15 2.5 15 3.5C15 5.5 12 8 12 8zm0 0V3.5A1.5 1.5 0 0010.5 2C9.5 2 9 2.5 9 3.5C9 5.5 12 8 12 8zm-8 4h16v3H4v-3zm2 3v6h12v-6H6z',
  'discount': 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',

  // Software y Email
  'software': 'M10 20l-5-5 5-5m4-4l5 5-5 5',
  'email': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'envelope': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'paper-airplane': 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
};

function renderViewIconsView(container) {
  const iconKeys = Object.keys(ICON_MAP);
  const totalCount = iconKeys.length;

  container.innerHTML = `
    <div class="view-icons-container">
      
      <!-- Panel Header Hero -->
      <div class="panel-box view-icons-header">
        <div class="view-icons-header-main">
          <div class="welcome-badge">
            <i class="ph ph-squares-four"></i> Galería de Iconos SVG
          </div>
          <h1 class="welcome-title" style="font-size: 1.6rem; margin: 0.25rem 0;">
            View Icons <span class="gradient-text">Heroicons / Tailwind</span>
          </h1>
          <p class="welcome-description" style="margin-bottom: 0;">
            Explora y copia rápidamente las claves, vectores SVG y atributos <code>d</code> de la biblioteca local.
          </p>
        </div>

        <div class="view-icons-controls">
          <div class="view-icons-search-wrapper">
            <i class="ph ph-magnifying-glass search-icon"></i>
            <input type="text" id="icon-search-input" class="view-icons-search-input" placeholder="Buscar por nombre de icono..." autocomplete="off">
            <button type="button" id="btn-clear-search" class="btn-clear-search" title="Limpiar búsqueda" style="display: none;">
              <i class="ph ph-x"></i>
            </button>
          </div>
          <div class="icons-count-badge">
            <i class="ph ph-sparkle"></i>
            <span id="icons-counter">${totalCount} de ${totalCount} iconos</span>
          </div>
        </div>
      </div>

      <!-- Grid de Iconos -->
      <div id="icons-grid-container" class="icons-grid-container">
        <!-- Renderizado dinámicamente -->
      </div>

    </div>
  `;

  const searchInput = document.getElementById("icon-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  const gridContainer = document.getElementById("icons-grid-container");
  const counterSpan = document.getElementById("icons-counter");

  function renderGrid(filterText = "") {
    const query = filterText.trim().toLowerCase();
    const filteredKeys = iconKeys.filter(key => key.toLowerCase().includes(query));

    counterSpan.textContent = `${filteredKeys.length} de ${totalCount} iconos`;
    clearBtn.style.display = query ? "flex" : "none";

    if (filteredKeys.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-icons-state">
          <i class="ph ph-magnifying-glass-plus"></i>
          <h3>No se encontraron iconos</h3>
          <p>No hay ningún icono que coincida con "<strong>${escapeHTML(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filteredKeys.map(key => {
      const pathD = ICON_MAP[key];
      const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="${pathD}" /></svg>`;

      return `
        <div class="icon-card" data-icon-key="${escapeHTML(key)}">
          <div class="icon-preview-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-svg-element">
              <path stroke-linecap="round" stroke-linejoin="round" d="${pathD}" />
            </svg>
          </div>
          <div class="icon-card-body">
            <span class="icon-key-title" title="${escapeHTML(key)}">${escapeHTML(key)}</span>
          </div>
          <div class="icon-card-actions">
            <button type="button" class="btn-icon-action btn-copy-key" title="Copiar nombre de clave ('${escapeHTML(key)}')">
              <i class="ph ph-key"></i> Clave
            </button>
            <button type="button" class="btn-icon-action btn-copy-svg" title="Copiar código SVG completo">
              <i class="ph ph-code"></i> SVG
            </button>
            <button type="button" class="btn-icon-action btn-copy-path" title="Copiar atributo 'd'">
              <i class="ph ph-brackets-angle"></i> Path
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Event listeners para los botones de copia dentro de cada tarjeta
    gridContainer.querySelectorAll(".icon-card").forEach(card => {
      const key = card.getAttribute("data-icon-key");
      const pathD = ICON_MAP[key];
      const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="${pathD}" /></svg>`;

      const btnKey = card.querySelector(".btn-copy-key");
      const btnSvg = card.querySelector(".btn-copy-svg");
      const btnPath = card.querySelector(".btn-copy-path");

      if (btnKey) {
        btnKey.addEventListener("click", (e) => {
          e.stopPropagation();
          copyToClipboard(key, `Clave '${key}' copiada`);
        });
      }

      if (btnSvg) {
        btnSvg.addEventListener("click", (e) => {
          e.stopPropagation();
          copyToClipboard(svgCode, `SVG de '${key}' copiado`);
        });
      }

      if (btnPath) {
        btnPath.addEventListener("click", (e) => {
          e.stopPropagation();
          copyToClipboard(pathD, `Path 'd' de '${key}' copiado`);
        });
      }

      // Al hacer clic en toda la tarjeta, copiar la clave por defecto
      card.addEventListener("click", () => {
        copyToClipboard(key, `Clave '${key}' copiada`);
      });
    });
  }

  function copyToClipboard(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (typeof ArgottAlert !== "undefined" && ArgottAlert.toast) {
          ArgottAlert.toast(message, "success");
        }
      }).catch(err => {
        fallbackCopyTextToClipboard(text, message);
      });
    } else {
      fallbackCopyTextToClipboard(text, message);
    }
  }

  function fallbackCopyTextToClipboard(text, message) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      if (typeof ArgottAlert !== "undefined" && ArgottAlert.toast) {
        ArgottAlert.toast(message, "success");
      }
    } catch (err) {
      console.error("Error al copiar text: ", err);
    }
    document.body.removeChild(textArea);
  }

  // Escuchar entrada en la barra de búsqueda
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderGrid(e.target.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      renderGrid("");
      searchInput.focus();
    });
  }

  // Render inicial
  renderGrid();
}
