import React from 'react';
import { Person } from '../../server/controllers';

interface TableProps {
  fields: Array<string>;
  data: Person[];
  title: string;
}

const Table = ({ fields, data, title }: TableProps) => {
  const theads = fields.map(field => <th key={field}>{ field }</th>);
  const trows = data.map(ele => {
      return <tr key={ ele.name }>{ fields.map(key => <th key={key}>{ ele[key] }</th>) }</tr>;
    });
  return (
    <section className='card grey lighten-4'>
      <div className='card-content'>
        <span className="card-title">{title}</span>
        <table>
          <thead>
            <tr>
              {theads}
            </tr>
          </thead>
          <tbody>
            {trows}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Table;
