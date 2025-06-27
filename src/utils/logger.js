
const store = [];
const colors = { info: 'blue', warn: 'orange', error: 'red' };

export function logger(level = 'info', msg = '', meta = {}) {
  const rec = { ts: new Date().toISOString(), level, msg, ...meta };
  store.push(rec);

  
  console[level === 'error' ? 'error' : 'info'](
    `%c[${level.toUpperCase()}] ${rec.ts}: ${msg}`,
    `color:${colors[level] || 'inherit'}`,
    meta
  );
  
}

export const getLogs = () => [...store];
