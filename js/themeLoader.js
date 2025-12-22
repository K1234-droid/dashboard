try {
    const savedScheme = localStorage.getItem('colorScheme');
    const savedTheme = localStorage.getItem('theme');

    if (savedScheme === 'monochrome') {
        document.documentElement.classList.add('monochrome-scheme');
    }

    let isDark = false;
    if (savedTheme === 'dark') {
        isDark = true;
    } else if (savedTheme === 'light') {
        isDark = false;
    } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    let faviconPath = 'favicon.ico';
    if (savedScheme === 'monochrome') {
        if (isDark) {
            faviconPath = 'assets/icons/favicon_darkmode_monochrome.ico';
        } else {
            faviconPath = 'assets/icons/favicon_lightmode_monochrome.ico';
        }
    } else {
        if (isDark) {
            faviconPath = 'assets/icons/favicon_darkmode_default.ico';
        }
    }

    const faviconLink = document.getElementById('favicon-link');
    if (faviconLink) {
        faviconLink.href = faviconPath;
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            const link = document.getElementById('favicon-link');
            if (link) link.href = faviconPath;
        });
    }

} catch (e) {
    console.error('Failed to apply pre-render theme:', e);
}