import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableFooter,
} from '@/components/ui/table';

interface TableDemoProps {
  costData?: Record<string, number | string>;
}

export function TableDemo({ costData }: TableDemoProps) {
  const items = [
    { label: 'Meal at an Inexpensive Restaurant', key: 'mealInexpensive' },
    { label: "Combo Meal at McDonald's", key: 'mcDonaldsMeal' },
    { label: 'Soft Drink (12 oz)', key: 'softDrink' },
    { label: 'Bottled Water (12 oz)', key: 'bottledWater' },
    { label: 'Apples (1 lb)', key: 'apples' },
    { label: 'Bananas (1 lb)', key: 'bananas' },
    { label: 'Fresh White Bread (1 lb)', key: 'freshWhiteBread' },
    { label: 'Eggs (12, Large)', key: 'eggs' },
  ];

  // Compute total only if costData exists
  const total = costData
    ? items.reduce((sum, item) => {
        const val = parseFloat(costData[item.key] as string);
        return sum + (isNaN(val) ? 0 : val);
      }, 0)
    : 0;

  return (
    <Table>
      <TableCaption>Cost of one day worth of food</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Item</TableHead>
          <TableHead className="text-right">Price ($)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.key}>
            <TableCell>{item.label}</TableCell>
            <TableCell className="text-right">
              {costData ? (
                costData[item.key]
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">
            {costData ? (
              `$${total.toFixed(2)}`
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
