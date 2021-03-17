// in src/users.js
import React, { FC } from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EmailField,
  EditButton,
} from 'react-admin';

// eslint-disable-next-line import/prefer-default-export
export const UserList: FC = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="username" />
      <BooleanField source="is_active" />
      <BooleanField source="is_superuser" />
      <EditButton />
    </Datagrid>
  </List>
);
