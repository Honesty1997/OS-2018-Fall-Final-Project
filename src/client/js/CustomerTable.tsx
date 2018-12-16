import React from 'react';

import Table from './Table';
import { Customer } from '../../server/controllers';

interface CustomerTableProps {
  customers: Customer[];
  state: string;
}

const CustomerTable = ({ customers, state }: CustomerTableProps) => {
  const fields = ['name', 'state'];
  return <Table fields={fields} data={ customers.filter(customer => customer.state === state) } />;
};

export default CustomerTable;
