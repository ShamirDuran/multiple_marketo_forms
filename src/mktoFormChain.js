export const mktoFormChain = (config) => {
  const arrayify = getSelection.call.bind([].slice);
  const MKTOFORM_ID_ATTRNAME = 'data-formid';

  // Fix inter-form label bug
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
  config.formIds.forEach((formId) => {
    const loadForm = window.MktoForms2.loadForm.bind(
      window.MktoForms2,
      config.podId,
      config.munchkinId,
      formId
    );

    const formEls = arrayify(document.querySelectorAll(`[${MKTOFORM_ID_ATTRNAME}="${formId}"]`));

    (function loadFormCb(formEls) {
      const formEl = formEls.shift();
      formEl.id = `mktoForm_${formId}`;

      loadForm(() => {
        formEl.id = '';
        if (formEls.length) {
          loadFormCb(formEls);
        }
      });
    })(formEls);
  });
};
