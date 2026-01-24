import { DataTable } from '@/mine/data-table';
import data from './data.json';
import { SettingsDialog } from '@/mine/SettingsDialog';

export default function Page() {
  return (
    <div>
      {/*<DataTable data={data} />*/}
      <div className="flex h-svh items-center justify-center">
        <SettingsDialog />
      </div>
    </div>
  );
}
