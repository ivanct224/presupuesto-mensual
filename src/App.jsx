import React, { useState, useEffect, useRef } from 'react';
import { Check, Plus, Trash2, RotateCcw, Wallet, TrendingDown, TrendingUp, Phone } from 'lucide-react';

const STORAGE_KEY = 'presupuesto-mensual-v1';

const defaultData = {
  sueldoInicial: 880000,
  fijo: [
    { id: 'f1', name: 'Telefono', amount: 7900, checked: true },
    { id: 'f2', name: 'Telefono Claudia', amount: 9000, checked: true },
    { id: 'f3', name: 'Internet', amount: 12000, checked: true },
    { id: 'f4', name: 'Luz', amount: 30000, checked: false },
    { id: 'f5', name: 'Agua', amount: 32050, checked: true },
    { id: 'f6', name: 'Gas', amount: 20000, checked: false },
    { id: 'f7', name: 'Anticonceptivos', amount: 12000, checked: true },
    { id: 'f8', name: 'Arriendo', amount: 400000, checked: true },
    { id: 'f9', name: 'Bencina', amount: 51000, checked: false },
    { id: 'f10', name: 'Netflix', amount: 7000, checked: false },
    { id: 'f11', name: 'Spotify', amount: 10000, checked: false },
    { id: 'f12', name: 'Pan', amount: 30000, checked: false },
  ],
  plata: [
    { id: 'p1', name: 'Auto', amount: 10000, checked: false },
    { id: 'p2', name: 'Feria', amount: 15000, checked: false },
    { id: 'p3', name: 'Feria', amount: 20000, checked: false },
    { id: 'p4', name: 'Otro', amount: 15000, checked: false },
    { id: 'p5', name: 'Otro', amount: 20000, checked: false },
  ],
  variados: [
    { id: 'v1', name: 'Tarjeta CMR', amount: 0, checked: false },
    { id: 'v2', name: 'Variable Supermercado', amount: 70000, checked: false },
  ],
  cuota: {
    valorInicial: 425000,
    cuotaMensual: 35500,
    meses: [
      { id: 'm1', name: 'Diciembre', checked: true },
      { id: 'm2', name: 'Enero', checked: false },
      { id: 'm3', name: 'Febrero', checked: false },
      { id: 'm4', name: 'Marzo', checked: false },
      { id: 'm5', name: 'Abril', checked: false },
      { id: 'm6', name: 'Mayo', checked: false },
      { id: 'm7', name: 'Junio', checked: false },
      { id: 'm8', name: 'Julio', checked: false },
      { id: 'm9', name: 'Agosto', checked: false },
      { id: 'm10', name: 'Septiembre', checked: false },
      { id: 'm11', name: 'Octubre', checked: false },
      { id: 'm12', name: 'Noviembre', checked: false },
    ],
  },
};

function fmt(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('es-CL');
}

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore corrupted storage, fall back to defaults
  }
  return defaultData;
}

function Section({ title, accent, items, onToggle, onEdit, onDelete, onAdd, total }) {
  return (
    <div className="bg-[#0f2438] rounded-xl border border-[#1c3a54] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ background: accent }}>
        <h2 className="text-[#08131f] font-semibold tracking-wide text-sm uppercase">{title}</h2>
        <span className="text-[#08131f] font-bold text-sm">${fmt(total)}</span>
      </div>
      <div className="divide-y divide-[#16324a]">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-2.5">
            <button
              onClick={() => onToggle(item.id)}
              className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.checked ? 'bg-[#3fb68f] border-[#3fb68f]' : 'border-[#3a5872]'
              }`}
              aria-label={item.checked ? 'Marcado como pagado' : 'Marcar como pagado'}
            >
              {item.checked && <Check size={16} strokeWidth={3} className="text-[#08131f]" />}
            </button>
            <input
              value={item.name}
              onChange={(e) => onEdit(item.id, 'name', e.target.value)}
              className={`flex-1 min-w-0 bg-transparent text-sm outline-none border-b border-transparent focus:border-[#3a5872] py-0.5 ${
                item.checked ? 'text-[#5c7c93] line-through' : 'text-[#e7eef4]'
              }`}
            />
            <div className="flex items-center shrink-0 gap-1">
              <span className="text-[#5c7c93] text-xs">$</span>
              <input
                type="number"
                value={item.amount}
                onChange={(e) => onEdit(item.id, 'amount', e.target.value)}
                className={`w-20 bg-transparent text-sm text-right outline-none border-b border-transparent focus:border-[#3a5872] py-0.5 ${
                  item.checked ? 'text-[#5c7c93]' : 'text-[#e7eef4]'
                }`}
              />
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="shrink-0 text-[#3a5872] hover:text-[#e05a5a] transition-colors p-1"
              aria-label="Eliminar"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#7ea6c2] hover:text-[#3fb68f] hover:bg-[#0a1c2c] transition-colors border-t border-[#16324a]"
      >
        <Plus size={14} /> Agregar item
      </button>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(loadData);
  const saveTimeout = useRef(null);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error guardando datos', e);
      }
    }, 300);
    return () => clearTimeout(saveTimeout.current);
  }, [data]);

  const toggle = (cat, id) =>
    setData((d) => ({ ...d, [cat]: d[cat].map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)) }));

  const edit = (cat, id, field, value) =>
    setData((d) => ({
      ...d,
      [cat]: d[cat].map((i) => (i.id === id ? { ...i, [field]: field === 'amount' ? (value === '' ? 0 : Number(value)) : value } : i)),
    }));

  const del = (cat, id) => setData((d) => ({ ...d, [cat]: d[cat].filter((i) => i.id !== id) }));

  const add = (cat) =>
    setData((d) => ({ ...d, [cat]: [...d[cat], { id: uid(cat), name: 'Nuevo item', amount: 0, checked: false }] }));

  const toggleMes = (id) =>
    setData((d) => ({
      ...d,
      cuota: { ...d.cuota, meses: d.cuota.meses.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m)) },
    }));

  const editCuota = (field, value) =>
    setData((d) => ({ ...d, cuota: { ...d.cuota, [field]: value === '' ? 0 : Number(value) } }));

  const resetMonth = () => {
    if (!window.confirm('Esto desmarca todos los pagos (mantiene montos y sueldo). ¿Continuar?')) return;
    setData((d) => ({
      ...d,
      fijo: d.fijo.map((i) => ({ ...i, checked: false })),
      plata: d.plata.map((i) => ({ ...i, checked: false })),
      variados: d.variados.map((i) => ({ ...i, checked: false })),
    }));
  };

  const sum = (arr) => arr.reduce((a, i) => a + (Number(i.amount) || 0), 0);
  const sumChecked = (arr) => arr.reduce((a, i) => a + (i.checked ? Number(i.amount) || 0 : 0), 0);

  const totalFijo = sum(data.fijo);
  const totalPlata = sum(data.plata);
  const totalVariados = sum(data.variados);
  const totalGeneral = totalFijo + totalPlata + totalVariados;

  const pagadoFijo = sumChecked(data.fijo);
  const pagadoPlata = sumChecked(data.plata);
  const pagadoVariados = sumChecked(data.variados);
  const totalPagado = pagadoFijo + pagadoPlata + pagadoVariados;

  const saldoActual = data.sueldoInicial - totalPagado;
  const saldoProyectado = data.sueldoInicial - totalGeneral;

  const mesesPagados = data.cuota.meses.filter((m) => m.checked).length;
  const mesesRestantes = data.cuota.meses.length - mesesPagados;

  return (
    <div className="min-h-screen bg-[#08131f] pb-10" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[#5c7c93] text-xs uppercase tracking-widest">Presupuesto</p>
            <h1 className="text-[#e7eef4] text-xl font-bold">Mi mes</h1>
          </div>
          <button
            onClick={resetMonth}
            className="flex items-center gap-1.5 text-xs text-[#7ea6c2] border border-[#1c3a54] rounded-lg px-3 py-2 hover:border-[#3a5872] transition-colors"
          >
            <RotateCcw size={14} /> Nuevo mes
          </button>
        </header>

        {/* Sueldo */}
        <div className="bg-[#0f2438] rounded-xl border border-[#1c3a54] p-4">
          <label className="text-[#5c7c93] text-xs uppercase tracking-wide">Sueldo inicial</label>
          <div className="flex items-center gap-2 mt-1">
            <Wallet size={18} className="text-[#3fb68f]" />
            <span className="text-[#7ea6c2] text-lg">$</span>
            <input
              type="number"
              value={data.sueldoInicial}
              onChange={(e) => setData((d) => ({ ...d, sueldoInicial: e.target.value === '' ? 0 : Number(e.target.value) }))}
              className="flex-1 bg-transparent text-[#e7eef4] text-2xl font-bold outline-none border-b border-transparent focus:border-[#3a5872]"
            />
          </div>
        </div>

        {/* Live summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0f2438] rounded-xl border border-[#1c3a54] p-3.5">
            <div className="flex items-center gap-1.5 text-[#5c7c93] text-[11px] uppercase tracking-wide">
              <TrendingDown size={13} /> Saldo actual
            </div>
            <p className={`text-xl font-bold mt-1 ${saldoActual < 0 ? 'text-[#e05a5a]' : 'text-[#e7eef4]'}`}>
              ${fmt(saldoActual)}
            </p>
            <p className="text-[10px] text-[#5c7c93] mt-0.5">Pagado hasta ahora: ${fmt(totalPagado)}</p>
          </div>
          <div className="bg-[#0f2438] rounded-xl border border-[#1c3a54] p-3.5">
            <div className="flex items-center gap-1.5 text-[#5c7c93] text-[11px] uppercase tracking-wide">
              <TrendingUp size={13} /> Libre proyectado
            </div>
            <p className={`text-xl font-bold mt-1 ${saldoProyectado < 0 ? 'text-[#e05a5a]' : 'text-[#3fb68f]'}`}>
              ${fmt(saldoProyectado)}
            </p>
            <p className="text-[10px] text-[#5c7c93] mt-0.5">Si pagas todo: ${fmt(totalGeneral)}</p>
          </div>
        </div>

        <Section
          title="Fijo"
          accent="#d97757"
          items={data.fijo}
          total={totalFijo}
          onToggle={(id) => toggle('fijo', id)}
          onEdit={(id, f, v) => edit('fijo', id, f, v)}
          onDelete={(id) => del('fijo', id)}
          onAdd={() => add('fijo')}
        />

        <Section
          title="Sacar plata"
          accent="#5aa9c9"
          items={data.plata}
          total={totalPlata}
          onToggle={(id) => toggle('plata', id)}
          onEdit={(id, f, v) => edit('plata', id, f, v)}
          onDelete={(id) => del('plata', id)}
          onAdd={() => add('plata')}
        />

        <Section
          title="Gastos variados"
          accent="#3fb68f"
          items={data.variados}
          total={totalVariados}
          onToggle={(id) => toggle('variados', id)}
          onEdit={(id, f, v) => edit('variados', id, f, v)}
          onDelete={(id) => del('variados', id)}
          onAdd={() => add('variados')}
        />

        {/* Cuota telefono */}
        <div className="bg-[#0f2438] rounded-xl border border-[#1c3a54] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#7e6ad9]">
            <h2 className="text-[#08131f] font-semibold tracking-wide text-sm uppercase flex items-center gap-1.5">
              <Phone size={14} /> Cuota telefono
            </h2>
            <span className="text-[#08131f] font-bold text-sm">
              {mesesPagados}/{data.cuota.meses.length}
            </span>
          </div>
          <div className="px-4 pt-3 pb-1 flex gap-4 text-xs">
            <div className="flex-1">
              <label className="text-[#5c7c93]">Valor inicial</label>
              <div className="flex items-center gap-1">
                <span className="text-[#7ea6c2]">$</span>
                <input
                  type="number"
                  value={data.cuota.valorInicial}
                  onChange={(e) => editCuota('valorInicial', e.target.value)}
                  className="w-full bg-transparent text-[#e7eef4] outline-none border-b border-transparent focus:border-[#3a5872] py-1"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[#5c7c93]">Cuota mensual</label>
              <div className="flex items-center gap-1">
                <span className="text-[#7ea6c2]">$</span>
                <input
                  type="number"
                  value={data.cuota.cuotaMensual}
                  onChange={(e) => editCuota('cuotaMensual', e.target.value)}
                  className="w-full bg-transparent text-[#e7eef4] outline-none border-b border-transparent focus:border-[#3a5872] py-1"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#16324a] mx-4 mt-1 mb-2 rounded-full overflow-hidden" style={{ width: 'calc(100% - 2rem)' }}>
            <div
              className="h-full bg-[#7e6ad9] transition-all"
              style={{ width: `${(mesesPagados / data.cuota.meses.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
            {data.cuota.meses.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMes(m.id)}
                className={`text-[10px] rounded-md py-1.5 border transition-colors ${
                  m.checked
                    ? 'bg-[#7e6ad9] border-[#7e6ad9] text-[#08131f] font-semibold'
                    : 'border-[#1c3a54] text-[#5c7c93]'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <p className="px-4 pb-3 text-[10px] text-[#5c7c93]">
            Quedan {mesesRestantes} cuotas (${fmt(mesesRestantes * data.cuota.cuotaMensual)} pendiente)
          </p>
        </div>

        <p className="text-center text-[10px] text-[#3a5872] pt-2">Los datos se guardan en este celular/navegador.</p>
      </div>
    </div>
  );
}
