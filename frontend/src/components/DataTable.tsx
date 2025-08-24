export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const DataTable = <T extends { _id: string }>({
  columns,
  data,
}: DataTableProps<T>) => (
  <table className="min-w-full border border-gray-200 rounded">
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className="p-3 text-left border-b text-gray-600 font-medium"
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row._id} className="hover:bg-gray-50">
          {columns.map((col) => (
            <td key={col.key} className="p-3 border-b text-gray-700">
              {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
