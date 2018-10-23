export default function loadCSS(url) {
  return new Promise((resolve, reject) => {
    try {
      const style = document.createElement('style');
      style.textContent = '@import "' + url + '"';

      const fi = setInterval(function() {
        try {
          // Only populated when file is loaded
          if (style.sheet.cssRules) {
            clearInterval(fi);
            resolve();
          }
        } catch (e) {
          throw e;
        }
      }, 10);

      document.head.appendChild(style);
    } catch (err) {
      reject(err);
    }
  });
}
