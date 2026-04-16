import { useState, useEffect } from 'react';

const RISK_THEME = {
  Crítico: {

    border: 'border-neutral-700',
    ledColor: 'bg-red-500',
    ledShadow: 'shadow-[0_0_8px_2px_rgba(239,68,68,0.7)]',
    statusLine1: 'Alerta: Ação Imediata',
    statusLine2: 'URGENTE',
    statusColor: 'text-red-400',
    circleColor: 'bg-red-500/20 border-red-500',
    highlightColor: 'text-red-400',

  },
  Alerta: {

    border: 'border-red-900',
    ledColor: 'bg-red-500',
    ledShadow: 'shadow-[0_0_6px_rgba(239,68,68,0.6)]',
    statusLine1: 'Alerta',
    statusLine2: 'Perigo',
    statusColor: 'text-red-400',
    circleColor: 'bg-red-500/20 border-red-500',
    highlightColor: 'text-red-400',
  },
  Instável: {
    border: 'border-yellow-900',
    ledColor: 'bg-yellow-400',
    ledShadow: 'shadow-[0_0_6px_rgba(234,179,8,0.6)]',
    statusLine1: 'Atenção Requerida',
    statusLine2: 'Instável',
    statusColor: 'text-yellow-400',
    circleColor: 'bg-yellow-400/20 border-yellow-400',
    highlightColor: 'text-yellow-400',
  },
  Baixo: {
    border: 'border-blue-900',
    ledColor: 'bg-blue-400',
    ledShadow: 'shadow-[0_0_6px_rgba(96,165,250,0.6)]',
    statusLine1: 'Operação Comum',
    statusLine2: 'Seguro',
    statusColor: 'text-blue-400',
    circleColor: 'bg-blue-400/20 border-blue-400',
    highlightColor: 'text-blue-400',
  },
};

const DEFAULT_THEME = RISK_THEME['Baixo'];

const IconPressure = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <circle cx="8" cy="8" r="5.5" />
    <line x1="8" y1="4" x2="8" y2="8.5" />
    <line x1="8" y1="8.5" x2="10.5" y2="10.5" />
  </svg>
);

const IconTemp = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <rect x="6.5" y="2" width="3" height="8.5" rx="1.5" />
    <circle cx="8" cy="12" r="2" />
    <line x1="9.5" y1="4" x2="11.5" y2="4" />
    <line x1="9.5" y1="6.5" x2="11.5" y2="6.5" />
  </svg>
);

const IconLeak = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M2 8 Q5 5 8 8 Q11 11 14 8" />
  </svg>
);

const IconRisk = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
    <path d="M8 2 L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5Z" />
  </svg>
);

const IconState = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="12" height="9" rx="1.5" />
    <polyline points="5,8 7,10 11,6" />
  </svg>
);

const IconFlare = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M8 2 C8 2 5 5.5 5 8.5C5 10.4 6.3 12 8 12C9.7 12 11 10.4 11 8.5C11 5.5 8 2 8 2Z" />
    <path d="M8 7 C8 7 6.5 8.5 6.5 9.5C6.5 10.3 7.2 11 8 11C8.8 11 9.5 10.3 9.5 9.5C9.5 8.5 8 7 8 7Z" fill="currentColor" opacity="0.5" />
  </svg>
);

const FIELD_CONFIG = [
  { key: 'pressao', label: 'Pressão', Icon: IconPressure, unit: 'bar', format: null },
  { key: 'temperatura', label: 'Temperatura', Icon: IconTemp, unit: 'ºC', format: null },
  { key: 'vazamento', label: 'Vazamento', Icon: IconLeak, unit: '', format: (v) => v ? 'Sim' : 'Não' },
  { key: 'risco', label: 'Risco', Icon: IconRisk, unit: '', format: null },
  { key: 'estado', label: 'Estado', Icon: IconState, unit: '', format: null },
  { key: 'flare', label: 'Flare', Icon: IconFlare, unit: '', format: (v) => v ? 'Necessário' : 'Desnecessário' },
];

function isHighAlert(risco) {
  return risco === 'Crítico' || risco === 'Alerta';
}

function DeviceRow({ Icon, label, value, highlight }) {
  return (
    <div className="flex justify-center gap-2 py-1 border-b border-white/5 last:border-0">
      <span className={`opacity-60 ${highlight ? highlight : 'text-slate-300'}`}>
        <Icon />
      </span>
      <span className="text-[9px] text-slate-400 w-14.5 shrink-0">{label}:</span>
      <span className={`text-[10px] font-medium ${highlight ? highlight : 'text-slate-200'}`}>
        {value}
      </span>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8080/data')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((error) => console.error('Erro ao buscar dados:', error));
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const theme = data.risco ? (RISK_THEME[data.risco] ?? DEFAULT_THEME) : DEFAULT_THEME;

  return (
    <div className="flex items-center justify-center flex-col h-screen w-full max-w-screen bg-gray-100">

        <div className='flex items-center justify-center w-full max-w-5xl p-10'>

      {/* Device shell */}
      <div className={`w-100 rounded-[10px] border-[3px] ${theme.border} bg-[#161b28] overflow-hidden transition-all duration-500`}>

        {/* Top bar */}
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-[#161b28] border-b-2 border-white/10">
          <div className={`w-2.5 h-2.5 rounded-full ${theme.ledColor} ${theme.ledShadow} transition-all duration-500`} />
          <span className="text-[8px] font-medium tracking-widest text-slate-400 uppercase">Monitor Preventivo</span>
        </div>

        {/* Screen */}
        <div className={`${theme.screen}  pt-3 pb-4 transition-colors duration-500`}>

          {/* Status header */}
          <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b-2 border-white/10">
            <div className={`w-5 h-5 rounded-full border-2 ${theme.circleColor} shrink-0 transition-all duration-500`} />
            <div>
              <p className={`text-[7.5px] uppercase tracking-wider ${theme.highlightColor} opacity-80 leading-none mb-0.5 transition-colors duration-500`}>
                {theme.statusLine1}
              </p>
              <p className={`text-[10px] font-medium ${theme.statusColor} leading-none transition-colors duration-500`}>
                {theme.statusLine2}
              </p>
            </div>
          </div>

          {/* Sensor rows */}
          {data ? (
            <div className=''>
              {FIELD_CONFIG.map(({ key, label, Icon, unit, format }) => {
                const raw = data[key];
                const formatted = format ? format(raw) : raw;
                const displayValue = unit ? `${formatted} ${unit}` : `${formatted}`;

                const isAlert = isHighAlert(data.risco);
                const isValueBad =
                  (key === 'vazamento' && raw === true) ||
                  (key === 'flare' && raw === true) ||
                  (key === 'risco') ||
                  (key === 'estado') ||
                  (isAlert && (key === 'pressao' || key === 'temperatura'));

                return (
                  <DeviceRow
                    key={key}
                    Icon={Icon}
                    label={label}
                    value={displayValue}
                    highlight={isValueBad ? theme.highlightColor : null}
                    />
                  );
              })}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 text-center py-2">Carregando...</p>
          )}
        </div>
      </div>
            </div>
    </div>
  );
}

export default App;