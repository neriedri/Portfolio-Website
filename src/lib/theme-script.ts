/**
 * Runs before first paint (injected into the document) to set the theme class
 * and text direction from localStorage / system preference. This prevents a
 * flash of the wrong theme or direction (PRD §5.6, US-13/US-14).
 *
 * NOTE: the default locale "he" is hardcoded here to match DEFAULT_LOCALE in
 * src/i18n/config.ts — keep the two in sync.
 */
export const themeInitScript = `(function(){try{
var t=localStorage.getItem('theme');
var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
if(t==='dark'||(!t&&prefersDark)){document.documentElement.classList.add('dark');}
var l=localStorage.getItem('lang');
if(l!=='he'&&l!=='en'){l='he';}
document.documentElement.lang=l;
document.documentElement.dir=(l==='he')?'rtl':'ltr';
}catch(e){}})();`;
