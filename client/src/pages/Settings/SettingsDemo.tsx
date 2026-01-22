import { DataTable } from '@/mine/data-table';
import data from './data.json';

export default function Page() {
  return <DataTable data={data} />;
}
