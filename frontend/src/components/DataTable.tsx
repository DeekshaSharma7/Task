interface DataTableProps<T> {
  columns: string[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

const DataTable = <T extends { _id: string }>({
  columns,
  data,
  actions,
}: DataTableProps<T>) => (
  <table className="min-w-full border border-gray-200 rounded">
    <thead className="bg-gray-200">
      <tr>
        {columns.map((col) => (
          <th key={col} className="p-2 text-left border">
            {col}
          </th>
        ))}
        {actions && <th className="p-2 border">Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row._id} className="hover:bg-gray-100">
          {columns.map((col) => (
            <td key={col} className="p-2 border">
              {(row as any)[col.toLowerCase()]}
            </td>
          ))}
          {actions && <td className="p-2 border">{actions(row)}</td>}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
