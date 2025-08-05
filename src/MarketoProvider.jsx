import { useEffect, useRef } from 'react';
import { mktoFormChain } from './mktoFormChain';

const MarketoProvider = ({ children, config }) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return; // 👈 evita re-ejecutar en re-renders/StrictMode
    initializedRef.current = true;

    const load = () => mktoFormChain(config);

    if (window.MktoForms2) {
      // Script ya estaba cargado
      load();
      return;
    }

    // Reutiliza el script si ya existe
    let script = document.querySelector('script[data-mkto="forms2"]');
    if (!script) {
      script = document.createElement('script');
      // si prefieres forzar https:
      // script.src = config.podId.replace(/^\/\//, 'https://') + '/js/forms2/js/forms2.min.js';
      script.src = `${config.podId}/js/forms2/js/forms2.min.js`;
      script.async = true;
      script.dataset.mkto = 'forms2';
      script.onload = load;
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', load, { once: true });
      // por si ya está listo:
      if (window.MktoForms2) load();
    }
  }, []); // 👈 sin dependencias (se ejecuta una sola vez)

  return children;
};

export default MarketoProvider;
