import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { fetchUtils } from 'ra-core';
import { Admin, Resource } from 'react-admin';
import { BookList } from './containers/books';
import { ShortlistedBookCreate, ShortlistedBookList } from './containers/shortlisted-books';
import crudProvider from 'ra-data-nestjsx-crud'
import { authProvider } from './authProvider';
import { ReservationCreate, ReservationList } from './containers/reservations';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('admin_token');
  (options.headers as Headers).set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const theme = { palette: { mode: 'dark' as const } };
const dataProvider = crudProvider('http://localhost:3000/v1/admin/entities', httpClient);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Admin theme={theme} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="books" list={BookList} />
      <Resource name="shortlisted-books" list={ShortlistedBookList} create={ShortlistedBookCreate} options={{ label: 'Shortlist' }} />
      <Resource name="reservations" list={ReservationList} create={ReservationCreate} />
    </Admin>
  </React.StrictMode>,
);
