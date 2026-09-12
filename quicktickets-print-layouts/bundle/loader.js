(async () => {
  'use strict';
  try {
    const compressed = Uint8Array.from(atob(window.__QTB || ''), c => c.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const payload = JSON.parse(await new Response(stream).text());
    const printStyle = document.createElement('style');
    printStyle.textContent = payload.printCss;
    const appStyle = document.createElement('style');
    appStyle.textContent = payload.appCss;
    document.head.append(printStyle, appStyle);
    Function(payload.spec)();
    Function(payload.app)();
    delete window.__QTB;
  } catch (error) {
    console.error(error);
    document.body.innerHTML = '<main style="font-family:Arial,sans-serif;padding:24px"><h1>Не удалось загрузить макеты</h1><p>Нужен современный браузер с поддержкой JavaScript.</p></main>';
  }
})();
