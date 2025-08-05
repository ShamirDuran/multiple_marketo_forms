import { useMemo, useState } from 'react';
import MarketoProvider from './MarketoProvider';
import './App.css';

function App() {
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
      <div className='landing-page'>
        {/* Encabezado */}
        <header className='bg-blue-600 text-white p-6 text-center'>
          <h1 className='text-4xl font-bold'>Carrera de Ingeniería en Sistemas</h1>
          <p className='mt-2 text-lg'>Construye tu futuro en el mundo de la tecnología.</p>
        </header>

        {/* Botón para contar (cambia estado sin duplicar forms) */}
        <div className='text-center mt-4'>
          <button onClick={incrementCounter} className='bg-green-500 text-white px-4 py-2 rounded'>
            Contador: {counter}
          </button>
        </div>

        {/* Formulario de contacto (instancia 1) */}
        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>Solicita más información</h2>
          <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
          <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-1' />
        </section>

        {/* Información del programa */}
        <section className='program-info p-6'>
          <h2 className='text-2xl font-semibold'>¿Qué ofrecemos?</h2>
          <p className='mt-4'>
            En la carrera de Ingeniería en Sistemas aprenderás a diseñar, desarrollar y gestionar
            soluciones tecnológicas innovadoras. Desde programación hasta inteligencia artificial,
            te preparamos para liderar la transformación digital.
          </p>
          <ul className='list-disc list-inside mt-4'>
            <li>Duración: 4 años</li>
            <li>Modalidad: Presencial o en línea</li>
            <li>Inicio: Febrero 2025</li>
          </ul>
        </section>

        {/* Otra sección con el mismo form (instancia 2) */}
        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>¿Listo para inscribirte?</h2>
          <p className='mt-2'>Déjanos tus datos y un asesor te guiará en el proceso.</p>
          <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-2' />
        </section>

        {/* Footer */}
        <footer className='bg-gray-800 text-white p-4 text-center'>
          <p>© 2025 Universidad Tecnológica. Todos los derechos reservados.</p>
        </footer>
      </div>
    </MarketoProvider>
  );
}

export default App;
