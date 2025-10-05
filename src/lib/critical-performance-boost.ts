
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/maya-chat';
      document.head.appendChild(link);
    });
  } else {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/maya-chat';
    document.head.appendChild(link);
  }
}
