import React from 'react';
import { Person } from '../../server/controllers';

interface TableParameter {
  fields: Array<string>;
  data: Person[];
}

const Table = ({ fields, data }: TableParameter) => {
  const theads = fields.map(field => <th key={field}>{ field }</th>);
  const trows = data.map(ele => {
      return <tr key={ ele.name }>{ fields.map(key => <th>{ ele[key] }</th>) }</tr>;
    });
  return (
    <table>
      <thead>
        <tr>
        { theads }
        </tr>
      </thead>
      <tbody>
        { trows }
      </tbody>
    </table>
  );
};

export default Table;
