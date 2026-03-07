type InventoryItem = {
  id: string;
  name: string;
  qty: number;
};

type Props = {
  items: InventoryItem[];
};

const InventoryTable = ({ items }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.qty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;

