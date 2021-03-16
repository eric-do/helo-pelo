import React, { FC } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const UserEdit: FC = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="email" />
      <TextInput source="username" />
      <PasswordInput source="password" />
      <BooleanInput source="is_active" />
      <BooleanInput source="is_superuser" />
    </SimpleForm>
  </Edit>
);
