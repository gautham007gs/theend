export const criticalCSS = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .hero-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 48rem;
    margin: 0 auto;
  }

  .header-primary {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    padding: 0.75rem 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .chat-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  .chat-list-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid hsl(var(--border));
    transition: background-color 0.2s;
  }

  .chat-list-item:hover {
    background-color: hsl(var(--secondary) / 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export function injectCriticalCSS() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
}
