import { useEffect } from 'react';
import { mktoFormChain } from './mktoFormChain';

const MarketoProvider = ({ children, config }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//402-ALY-118.mktoweb.com/js/forms2/js/forms2.min.js';
    script.async = true;

    script.onload = () => {
      mktoFormChain(config);
    };

    document.body.appendChild(script);

    // No necesitamos cleanup ya que el script debe persistir
  }, [config]); // Dependencia en config por si cambia dinámicamente

  return children;
};

export default MarketoProvider;
