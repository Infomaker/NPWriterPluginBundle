const loadIframelyScript = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.async = true;
    scriptElem.src = ('https:' === document.location.protocol ? 'https:' : 'http:') + '//cdn.iframe.ly/embed.js';

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(scriptElem, firstScript);
}

export default loadIframelyScript
