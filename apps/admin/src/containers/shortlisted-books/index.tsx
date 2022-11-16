import React, { useState } from "react";
import { List, Datagrid, TextField, TextInput, DeleteButton, Create, SimpleForm, required, AutocompleteInput, useGetList } from 'react-admin';

export const ShortlistedBookCreate = () => {
  const [searchText, setSearchText] = useState<string>()
  const { data, isFetching } = useGetList('books', {
    filter: (searchText && { title: searchText }) ,
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'title', order: 'ASC' },
  });

  const choices = data?.map(book => ({ id: book.id, name: book.title }))
  return (
    <Create>
      <SimpleForm>
        <AutocompleteInput validate={[required()]} fullWidth loading={isFetching} source="book" choices={choices ?? []} setFilter={setSearchText} />
      </SimpleForm>
    </Create>
  )
}

export const ShortlistedBookList = (props: JSX.IntrinsicAttributes) => (
  <List 
    {...props} 
    filters={[
      <TextInput label="Search" source="title" alwaysOn />,
    ]}
    >
    <Datagrid>
      <TextField source="book.title" />
      <DeleteButton />
    </Datagrid>
  </List>
);

