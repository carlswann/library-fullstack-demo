import * as React from "react";
import { List, Datagrid, TextField, TextInput } from 'react-admin';

export const BookList = (props: JSX.IntrinsicAttributes) => (
  <List {...props} filters={[<TextInput label="Search" source="title" alwaysOn />]}>
    <Datagrid>
      <TextField source="title" />
    </Datagrid>
  </List>
);

