import { useMemo, useState } from 'react';
import MarketoProvider from './MarketoProvider';
import getPrograms from './utils/getPrograms';
import './App.css';

function App() {
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => setCounter((c) => c + 1);

  const marketoConfig = useMemo(
    () => ({
      podId: '//402-ALY-118.mktoweb.com',
      munchkinId: '402-ALY-118',
      formIds: [1236, 1240],
      callbacks: [
        (form) => {
          const PROGRAM_SELECTOR = '#mkto_programoriginal, select[name="mkto_programoriginal"]';
          const formElem = form.getFormElem?.()[0];
          if (!formElem) return;

          // Intenta poblar si ya existe al entrar
          const tryLoadPrograms = () => {
            const picklist = formElem.querySelector(PROGRAM_SELECTOR);
            if (!picklist) return;

            // Evita cargar dos veces sobre el mismo <select>
            if (picklist.dataset.programsLoaded === 'true') return;
            picklist.dataset.programsLoaded = 'true';

            getPrograms({
              formElem,
              selectSelector: PROGRAM_SELECTOR,
              // Puedes personalizar estos si algún form lo requiere
              // endpoint: 'https://.../programas.json',
              // parentProductId: '1fdcc153-9ef1-df11-bc9f-005056b460d2',
              // limit: 10,
            });
          };

          // Carga inicial si ya está renderizado
          tryLoadPrograms();

          // Configura observer una sola vez por form
          if (!formElem._programPicklistObserver) {
            let wasPresent = !!formElem.querySelector(PROGRAM_SELECTOR);

            const observer = new MutationObserver(() => {
              const picklist = formElem.querySelector(PROGRAM_SELECTOR);
              const isPresent = !!picklist;

              if (isPresent && !wasPresent) {
                // El selector apareció (o fue re-montado por Marketo)
                wasPresent = true;
                // Como es un nodo nuevo, no tendrá la marca y volveremos a cargar
                tryLoadPrograms();
              }

              if (!isPresent && wasPresent) {
                // El selector fue removido; reseteamos el flag
                wasPresent = false;
              }
            });

            observer.observe(formElem, { childList: true, subtree: true });
            // Guarda referencia para no volver a crear otro observer
            formElem._programPicklistObserver = observer;
          }

          // onSuccess original
          form.onSuccess(function (values) {
            // Redireccion controlada en base a la seleccion del usuario
            // Dentro de values, estan los valores de todos los campos tal cual como el usuario los ha completado, incluyendo lo hidden fields que hemos cargado.
            // Supongamos que se desea redireccionar a x landing si ha seleccionado el programa 'Diploma in Strategic Interior Design'.
            // Para esto, se debe validar por valor seleccionado
            console.log(form.vals());

            console.log('Formulario enviado con éxito:', values);

            switch (values.mkto_programoriginal) {
              case '9570641a-ca3f-ed11-9db0-002248801ebb':
                window.location.href =
                  'https://www.example.com/diploma-in-strategic-interior-design';
                break;

              default:
                break;
            }

            return false;
          });
        },
        (form) => {
          console.log('Formulario cargado 2');
          form.onSuccess?.(function (values) {
            return true;
          });
        },
      ],
    }),
    []
  );

  const [formId, formId2] = marketoConfig.formIds;

  return (
    <MarketoProvider config={marketoConfig}>
      <div className='landing-page'>
        {/* ... resto igual ... */}
        <div className='text-center mt-4'>
          <button onClick={incrementCounter} className='bg-green-500 text-white px-4 py-2 rounded'>
            Contador: {counter}
          </button>
        </div>

        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>Solicita más información</h2>
          <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
          <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-1' />
        </section>

        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>Solicita más información</h2>
          <p className='mt-2'>Completa el formulario y te contactaremos pronto.</p>
          <form
            className='mktoForm mt-4'
            data-formid={formId2}
            data-forminstance='contact-form-3'
          />
        </section>

        {/* ... resto igual ... */}
        <section className='contact-form bg-gray-100 p-6'>
          <h2 className='text-2xl font-semibold'>¿Listo para inscribirte?</h2>
          <p className='mt-2'>Déjanos tus datos y un asesor te guiará en el proceso.</p>
          <form className='mktoForm mt-4' data-formid={formId} data-forminstance='contact-form-2' />
        </section>
      </div>
    </MarketoProvider>
  );
}

export default App;
