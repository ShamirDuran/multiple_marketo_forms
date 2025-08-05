export const mktoFormChain = (config) => {
  const arrayify = getSelection.call.bind([].slice);
  const MKTOFORM_ID_ATTRNAME = 'data-formid';

  // Evita registrar múltiples veces en StrictMode o re-llamadas
  if (!window.__mktoLabelFixInstalled) {
    window.__mktoLabelFixInstalled = true;
    window.MktoForms2.whenRendered(function (form) {
      const formEl = form.getFormElem()[0];
      const rando = '_' + new Date().getTime() + Math.random();

      arrayify(formEl.querySelectorAll('label[for]'))
        .map((labelEl) => ({
          label: labelEl,
          for: formEl.querySelector('[id="' + labelEl.htmlFor + '"]'),
        }))
        .forEach((labelDesc) => {
          if (labelDesc.for) {
            if (!labelDesc.for.hasAttribute('data-uniquified')) {
              labelDesc.for.id += rando;
              labelDesc.for.setAttribute('data-uniquified', 'true');
            }
            labelDesc.label.htmlFor = labelDesc.for.id;
          }
        });
    });
  }

  // Carga de formularios (una sola vez por contenedor)
  config.formIds.forEach((formId) => {
    const loadForm = window.MktoForms2.loadForm.bind(
      window.MktoForms2,
      config.podId,
      config.munchkinId,
      formId
    );

    const formEls = arrayify(document.querySelectorAll(`[${MKTOFORM_ID_ATTRNAME}="${formId}"]`));

    (function loadFormCb(queue) {
      const formEl = queue.shift();
      if (!formEl) return;

      // 👇 Si ya fue inicializado, salta
      if (formEl.getAttribute('data-mkto-initialized') === 'true') {
        return loadFormCb(queue);
      }
      formEl.setAttribute('data-mkto-initialized', 'true');

      // Id temporal para anclar el render de Marketo
      formEl.id = `mktoForm_${formId}`;

      loadForm(() => {
        // Limpia el id para poder reutilizarlo en otro contenedor
        formEl.id = '';
        if (queue.length) {
          loadFormCb(queue);
        }
      });
    })(formEls.slice());
  });
};
