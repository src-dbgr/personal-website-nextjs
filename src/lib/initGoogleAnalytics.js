export function initGoogleAnalytics(trackingId) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', trackingId, {
    anonymize_ip: true,
    cookie_flags: 'samesite=none;secure',
  });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  script.async = true;
  document.head.appendChild(script);
}