export const mktoFormChain = (config) => {
  const arrayify = getSelection.call.bind([].slice);
  const MKTOFORM_ID_ATTRNAME = 'data-formid';

  // Fix inter-form label bug (igual que antes)
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

  // Load forms
  config.formIds.forEach((formId, formIdx) => {
    const onFormLoadByIndex = config.callbacks?.[formIdx]; // <- tu callback por índice

    const loadForm = window.MktoForms2.loadForm.bind(
      window.MktoForms2,
      config.podId,
      config.munchkinId,
      formId
    );

    const formEls = arrayify(document.querySelectorAll(`[${MKTOFORM_ID_ATTRNAME}="${formId}"]`));

    (function loadFormCb(queue, containerIdx = 0) {
      const formEl = queue.shift();
      if (!formEl) return;

      // (opcional) evita recargas repetidas si vuelves a llamar mktoFormChain
      if (formEl.getAttribute('data-mkto-initialized') === 'true') {
        return loadFormCb(queue, containerIdx + 1);
      }
      formEl.setAttribute('data-mkto-initialized', 'true');

      // Id temporal requerido por Marketo
      formEl.id = `mktoForm_${formId}`;

      const instanceKey = formEl.getAttribute('data-forminstance') || `${formId}-${containerIdx}`;
      const meta = { formId, formIdx, containerIdx, instanceKey, container: formEl };

      // ⬇️ IMPORTANTE: usar (form) => { ... } para recibir el objeto form
      loadForm((form) => {
        try {
          // 1) callback adjunto al nodo <form> vía ref (si lo usas)
          if (typeof formEl.__mktoOnLoad === 'function') {
            formEl.__mktoOnLoad(form, meta);
          }
          // 2) callback por índice desde config.callbacks
          if (typeof onFormLoadByIndex === 'function') {
            onFormLoadByIndex(form, meta);
          }
          // 3) callback global (opcional)
          if (typeof config.onFormLoad === 'function') {
            config.onFormLoad(form, meta);
          }
        } finally {
          // limpiar id temporal y seguir con la cola
          formEl.id = '';
          if (queue.length) loadFormCb(queue, containerIdx + 1);
        }
      });
    })(formEls.slice());
  });
};
