// This script checks if the page is being accessed via the 'file:' protocol.
// If so, it redirects to a user-friendly error page.
if (window.location.protocol === 'file:') {
    window.location.href = 'FailedtoLoadPage.html';
}