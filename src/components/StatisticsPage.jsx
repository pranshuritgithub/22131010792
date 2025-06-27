import React, { useEffect, useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';

export default function StatisticsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('urlMap') ?? '[]'));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Statistics</Typography>

      {data.map(m => (
        <Card key={m.code} sx={{ mb: 3, p: 2 }}>
          <Typography><b>{location.origin}/{m.code}</b> → {m.url}</Typography>
          <Typography>
            Created: {new Date(m.created).toLocaleString()} &nbsp;|&nbsp;
            Expires: {new Date(m.expires).toLocaleString()}
          </Typography>
          <Typography>Clicks: {m.clicks.length}</Typography>

          {m.clicks.length > 0 && (
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Geo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {m.clicks.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{new Date(c.ts).toLocaleString()}</TableCell>
                    <TableCell>{c.src}</TableCell>
                    <TableCell>{c.geo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      ))}
    </Box>
  );
}
