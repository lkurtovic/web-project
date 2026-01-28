import { DataTable } from '@/mine/data-table';
import data from './data.json';

export default function FoodWaterTable() {
  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-lg bg-muted p-6">
      <h2></h2>
      <DataTable data={data} />
    </div>
  );
}
