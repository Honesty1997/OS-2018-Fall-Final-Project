import React from 'react';
import Table from './Table';

import { Barber } from '../../server/controllers';

interface BarberTableProps {
  barbers: Barber[];
  title: string;
}
const BarberTable = ({ barbers, title }: BarberTableProps) => {
  const fields = [ 'name', 'state', 'client'];
  return <Table title={title} fields={fields} data={barbers} />;
};

export default BarberTable;
