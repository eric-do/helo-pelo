import React from 'react';
import type { FC } from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

// eslint-disable-next-line import/prefer-default-export
export const UserCreate: FC = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
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
