import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, Snackbar,
  TextField, Typography,
} from '@mui/material';
import { v4 as uuid } from 'uuid';
import { logger } from '../utils/logger';

const URL_RX = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
const randomCode = () => Math.random().toString(36).slice(2, 8);

export default function ShortenerForm() {
  const [rows, setRows] = useState([{ id: uuid(), url: '', mins: '', code: '' }]);
  const [out, setOut] = useState([]);
  const [snk, setSnk] = useState('');

  const change = (id, k, v) =>
    setRows(r => r.map(it => (it.id === id ? { ...it, [k]: v } : it)));

  const addRow = () =>
    rows.length < 5 && setRows(r => [...r, { id: uuid(), url: '', mins: '', code: '' }]);

  const validate = () => {
    const taken = JSON.parse(localStorage.getItem('urlMap') ?? '[]').map(m => m.code);
    for (const r of rows) {
      if (!URL_RX.test(r.url.trim())) return `Bad URL → ${r.url}`;
      if (r.mins && (+r.mins <= 0 || !/^\d+$/.test(r.mins))) return `Minutes must be +int`;
      if (r.code && !/^[a-zA-Z0-9]{3,10}$/.test(r.code)) return `Bad shortcode → ${r.code}`;
      if (r.code && taken.includes(r.code)) return `Shortcode collision → ${r.code}`;
    }
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return (setSnk(err), logger('warn', err));

    const now = Date.now();
    const maps = rows.map(r => ({
      code: r.code || randomCode(),
      url: r.url.trim(),
      created: now,
      expires: now + (+r.mins || 30) * 60_000,
      clicks: [],
    }));

    const store = JSON.parse(localStorage.getItem('urlMap') ?? '[]');
    localStorage.setItem('urlMap', JSON.stringify([...store, ...maps]));
    logger('info', 'Shortened', { n: maps.length });
    setOut(maps);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>

      {rows.map((r, i) => (
        <Card key={r.id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Long URL" required
                  value={r.url} onChange={e => change(r.id, 'url', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth label="Validity (mins)" placeholder="30"
                  value={r.mins} onChange={e => change(r.id, 'mins', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth label="Custom Code" placeholder="abc123"
                  value={r.code} onChange={e => change(r.id, 'code', e.target.value)}
                />
              </Grid>
            </Grid>

            {i === rows.length - 1 && rows.length < 5 && (
              <Button sx={{ mt: 2 }} onClick={addRow}>+ Add URL</Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" onClick={submit}>Shorten</Button>

      {out.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Results</Typography>
          {out.map(m => (
            <Card key={m.code} sx={{ mt: 2, p: 2 }}>
              <Typography><b>Short&nbsp;URL:</b> {location.origin}/{m.code}</Typography>
              <Typography><b>Expires:</b> {new Date(m.expires).toLocaleString()}</Typography>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar open={!!snk} autoHideDuration={4000} onClose={() => setSnk('')} message={snk}/>
    </Box>
  );
}
