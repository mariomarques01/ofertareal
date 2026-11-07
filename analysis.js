// A comparação é do mesmo SKU e loja; dados manuais não são verificação independente.
export function timestamp(value) {
  if (value?.toMillis) return value.toMillis();
  if (Number.isFinite(value?.seconds)) return value.seconds * 1000;
  return NaN;
}
export function analyzePrice(product, history, now = Date.now()) {
  const unknown = reason => ({label: 'Histórico insuficiente', reason, discount: 0});
  if (!Number.isFinite(product.price) || product.price <= 0) return unknown('Preço inválido.');
  const currentRows = history.filter(row => row.price === product.price && row.store === product.store && row.source === product.source);
  const updated = Math.max(...currentRows.map(row => timestamp(row.recordedAt)).filter(t => Number.isFinite(t) && t <= now));
  if (!Number.isFinite(updated) || updated > now || now - updated > 86400000)
    return {label:'Preço desatualizado', reason:'Sem confirmação nas últimas 24 horas. Confira na loja.',discount:0};
  if (!product.store?.trim() || !product.source?.trim()) return unknown('Loja e origem precisam estar identificadas.');
  // Exclui a observação atual, datas futuras e registros de outra loja/origem.
  const days = new Map();
  for (const row of history) {
    const time = timestamp(row.recordedAt);
    if (!Number.isFinite(row.price) || row.price <= 0 || !Number.isFinite(time) ||
      time >= updated || time < now - 30 * 86400000 ||
      row.store !== product.store || row.source !== product.source) continue;
    const day = new Date(time).toISOString().slice(0,10);
    if (day === new Date(updated).toISOString().slice(0,10)) continue;
    // Uma referência por dia; menor preço evita inflar a base com várias coletas.
    days.set(day, Math.min(days.get(day) ?? Infinity, row.price));
  }
  const values = [...days.values()].sort((a,b)=>a-b);
  if (values.length < 7) return unknown(`${values.length} de 7 dias anteriores necessários nos últimos 30 dias.`);
  const mid = Math.floor(values.length/2);
  const median = values.length%2 ? values[mid] : (values[mid-1]+values[mid])/2;
  const discount = (1-product.price/median)*100;
  const opportunity = discount >= 5 && product.price <= values[0];
  return {label: opportunity ? 'Abaixo do histórico registrado' : 'Sem oportunidade comprovada',
    reason:`${values.length} dias comparáveis • mediana ${median.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} • registros informados, sem verificação independente.`,
    discount: opportunity ? Math.floor(discount + 1e-9) : 0, median, minimum:values[0], days:values.length};
}
