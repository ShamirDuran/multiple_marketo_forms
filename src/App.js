import MarketoProvider from './MarketoProvider';
import './App.css';
import { useState } from 'react';

function App() {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  const marketoConfig = {
    podId: '//402-ALY-118.mktoweb.com',
    munchkinId: '402-ALY-118',
    formIds: [1236], // ID del formulario de Marketo
  };

  return (
    <MarketoProvider config={marketoConfig}>
      <div className='landing-page'>
        {/* Encabezado */}
        <header className='bg-blue-600 text-white p-6 text-center'>
          <h1 className='text-4xl font-bold'>Carrera de Ingeniería en Sistemas</h1>
          <p className='mt-2 text-lg'>Construye tu futuro en el mundo de la tecnología.</p>
        </header>

        {/* boton para contar */}
        <div className='text-center mt-4'>
          <button onClick={incrementCounter} className='bg-green-500 text-white px-4 py-2 rounded'>
            Contador: {counter}
          </button>
        </div>

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

        {/* Formulario de contacto */}
        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>Solicita más información</h2>
          <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
          <form className='mktoForm mt-4' data-formid='1236' data-forminstance='contact-form' />
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
