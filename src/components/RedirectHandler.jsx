import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { logger } from '../utils/logger';

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const [dest, setDest] = useState('');
  const [msg, setMsg] = useState('Resolving…');

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('urlMap') ?? '[]');
    const m = list.find(x => x.code === shortcode);
    if (!m) return setMsg('Invalid shortcode.');

    if (Date.now() > m.expires) {
      logger('warn', 'Expired visit', { shortcode });
      return setMsg('Link expired.');
    }

    m.clicks.push({ ts: Date.now(), src: document.referrer || 'direct', geo: 'N/A' });
    localStorage.setItem('urlMap', JSON.stringify(list));
    logger('info', 'Redirect', { shortcode });
    setDest(m.url);
  }, [shortcode]);

  return dest ? <Navigate to={dest} replace /> : <p style={{ padding: 24 }}>{msg}</p>;
}
