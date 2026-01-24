import { DataTable } from '@/mine/data-table';
import data from './data.json';

import Page from './page';

export default function Page2() {
  return (
    <div className="flex align-center justify-center">
      <div className="w-[1500px] relative h-[630px] overflow-y-auto rounded-md">
        {/*<DataTable data={data} />*/}
        <Page></Page>
        {/*<Card className=" flex h-full w-full"></Card>*/}
      </div>
    </div>
  );
}
