import InventoryTable from "./InventoryTable";

const InventoryPage = () => {
  const items = [
    { id: "INV-001", name: "Sample Item", qty: 1 },
    { id: "INV-002", name: "Sample Item 2", qty: 2 },
  ];

  return (
    <section>
      <h1>Inventory</h1>
      <InventoryTable items={items} />
    </section>
  );
};

export default InventoryPage;

