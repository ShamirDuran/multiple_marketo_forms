/**
 * Carga programas en un <select> desde un endpoint JSON de AEM.
 * @param {Object} formElem - Elemento del formulario donde se encuentra el <select>.
 * @param {string} selectSelector - Selector CSS para el <select> donde se cargarán los programas.
 * @param {string} [endpoint] - URL del endpoint JSON que devuelve los programas.
 * @param {string} [parentProductId] - ID del producto padre para filtrar programas. Aca se debe ajustar dependiendo de la landing
 *                                    o del formulario que se esté utilizando.
 * @param {boolean} [withPlaceholder=true] - Si se debe incluir una opción de marcador de posición.
 * @param {number} [limit=10] - Número máximo de programas a cargar.
 * @param {string} [endpoint='https://publish-p147864-e1510969.adobeaemcloud.com/content/dam/ieprogram/json/programas.json'] -
 * URL del endpoint por defecto que devuelve los programas.
 * @param {string} [parentProductId='1fdcc153-9ef1-df11-bc9f-005056b460d2'] - ID del producto padre por defecto.
 * @param {boolean} [withPlaceholder=true] - Si se debe incluir una opción de marcador de posición.
 * @returns
 */
export default async function getPrograms({
  formElem,
  selectSelector,
  endpoint = 'https://publish-p147864-e1510969.adobeaemcloud.com/content/dam/ieprogram/json/programas.json',
  parentProductId = '1fdcc153-9ef1-df11-bc9f-005056b460d2',
  withPlaceholder = true,
  limit = 10,
} = {}) {
  try {
    if (!formElem) return;

    const picklist = formElem.querySelector(selectSelector);
    if (!picklist) return;

    // Limpia el <select> antes de poblarlo
    picklist.innerHTML = '';
    if (withPlaceholder) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Selecciona un programa';
      picklist.appendChild(opt);
    }

    const res = await fetch(endpoint, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const programs = Array.isArray(data?.value) ? data.value : [];
    const filtered = programs
      .filter((p) => p?.parentproductid?.productid === parentProductId)
      .slice(0, limit);

    for (const p of filtered) {
      const opt = document.createElement('option');
      opt.value = p?.productid ?? '';
      opt.textContent = p?.name ?? 'Sin nombre';
      picklist.appendChild(opt);
    }
  } catch (err) {
    // Evita romper la UI si hay fallos de red / formato
    console.warn('[getPrograms] No se pudieron cargar programas:', err);
  }
}
