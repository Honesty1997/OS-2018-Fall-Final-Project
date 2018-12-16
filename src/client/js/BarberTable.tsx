import React from 'react';
import Table from './Table';

import { Barber } from '../../server/controllers';

interface BarberTableProps {
  barbers: Barber[];
}
const BarberTable = ({ barbers }: BarberTableProps) => {
  const fields = [ 'name', 'state', 'client'];
  return <Table fields={fields} data={barbers} />;
};

export default BarberTable;