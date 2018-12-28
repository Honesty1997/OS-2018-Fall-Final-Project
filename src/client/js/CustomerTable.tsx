import React from 'react';

import Table from './Table';
import { Customer } from '../../server/controllers';

interface CustomerTableProps {
  customers: Customer[];
  state: string;
  title: string;
}

const CustomerTable = ({ customers, state, title }: CustomerTableProps) => {
  const fields = ['name', 'state'];
  return <Table title={title} fields={fields} data={ customers.filter(customer => customer.state === state) } />;
};

export default CustomerTable;
