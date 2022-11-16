import dayjs from 'dayjs'
import React, { useState } from "react";
import { Typography } from '@mui/material'
import { List, Datagrid, TextField, TextInput, DeleteButton, Create, SimpleForm, required, AutocompleteInput, useGetList, DateField, DateInput } from 'react-admin';

export const ReservationCreate = () => {
  const [searchText, setSearchText] = useState<string>()
  const [selectedBookId, setSelectedBookId] = useState<string>();

  const { data: books, isFetching: isFetchingBooks } = useGetList('books', {
    filter: (searchText && { title: searchText }) ,
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'title', order: 'ASC' },
  });

  const { data: reservationWindows, isFetching: isFetchingReservationWindows } = useGetList(`reservation-windows/${selectedBookId}`, {}, {
    enabled: !!selectedBookId
  })

  const choices = books?.map(book => ({ id: book.id, name: book.title }))
  return (
    <Create>
      <SimpleForm>
        <AutocompleteInput validate={[required()]} fullWidth loading={isFetchingBooks} source="book" choices={choices ?? []} setFilter={setSearchText}  onChange={setSelectedBookId} />
        <DateInput validate={[required()]} fullWidth source="startsAt" />
        <DateInput validate={[required()]} fullWidth source="endsAt" />

        {!isFetchingReservationWindows && reservationWindows?.map(reservationWindow => (
          <Typography key={reservationWindow.id}>{`Recommended Reservation Window: ${dayjs(reservationWindow.startsAt).format('YYYY-MM-DD')} - ${dayjs(reservationWindow.endsAt).format('YYYY-MM-DD')}`}</Typography>
        ))}
      </SimpleForm>
    </Create>
  )
}

export const ReservationList = (props: JSX.IntrinsicAttributes) => (
  <List {...props} filters={[<TextInput label="Search" source="title" alwaysOn />]}>
    <Datagrid>
      <TextField source="book.title" />
      <DateField source="startsAt" />
      <DateField source="endsAt" />
      <DeleteButton />
    </Datagrid>
  </List>
);

