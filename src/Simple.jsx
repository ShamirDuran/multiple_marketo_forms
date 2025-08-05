import { useMemo, useState } from 'react';
import MarketoProvider from './MarketoProvider';
import './App.css';

function SimpleExample() {
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => setCounter((c) => c + 1);

  // Memoiza la configuración para que no cambie su referencia en cada render
  const marketoConfig = useMemo(
    () => ({
      podId: '//402-ALY-118.mktoweb.com',
      munchkinId: '402-ALY-118',
      formIds: [1240], // ID del formulario de Marketo
    }),
    []
  );

  const formId = marketoConfig.formIds[0];

  return (
    <MarketoProvider config={marketoConfig}>
      {/* Formulario de contacto (instancia 1) */}
      <section className='contact-form bg-gray-100 p-6'>
        <h2 className='text-2xl font-semibold'>Solicita más información</h2>
        <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
        <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-1' />
      </section>

      {/* Formulario de contacto (instancia 1) */}
      <section className='contact-form bg-gray-100 p-6'>
        <h2 className='text-2xl font-semibold'>Solicita más información</h2>
        <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
        <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-1' />
      </section>
    </MarketoProvider>
  );
}

export default SimpleExample;
