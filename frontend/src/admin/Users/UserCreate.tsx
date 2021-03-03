import React, { FC } from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const UserCreate: FC = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="username" />
      <PasswordInput source="password" />
      <BooleanInput source="is_superuser" />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Create>
);
