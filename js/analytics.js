/**
 * Livraria Sambambi - Rastreamento (Google Analytics + Meta Pixel)
 * Ficheiro dedicado apenas ao código de análise de dados (Exame IHM).
 * Incluído nas páginas que também carregam o script assíncrono:
 * <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y"></script>
 */

/* Google Analytics (gtag.js) */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-XXXXX-Y');

/* Meta Pixel */
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1234567890');
fbq('track', 'PageView');
