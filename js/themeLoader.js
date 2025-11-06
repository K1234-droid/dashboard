try {
    const savedScheme = localStorage.getItem('colorScheme');
    if (savedScheme === 'monochrome') {
        document.documentElement.classList.add('monochrome-scheme');
    }
} catch (e) {
    console.error('Failed to apply pre-render theme:', e);
}