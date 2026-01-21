import HeatMap from '@uiw/react-heat-map';
import { useTheme } from '@/mine/theme-provider';
import Tooltip from '@uiw/react-tooltip';
import { TableCaption, Table } from "@/components/ui/table";

interface DemoProps {
  flightData: { date: string; count: number }[];
}

const Demo = ({ flightData }: DemoProps) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <div>
      <Table>
        <HeatMap
          value={flightData}
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          startDate={new Date(flightData[0]?.date || '2026-01-01')}
          width={950}
          height={200}
          rectSize={20}
          rectProps={{ rx: 7 }}
          style={{ color: textColor }}
          rectRender={(props, data) => (
            <Tooltip
              content={`Flight price: $${data.count || 0}`}
              placement="top"
            >
              <rect {...props} />
            </Tooltip>
          )}
        />
        <TableCaption>Cost of direct flight</TableCaption>
      </Table>
    </div>
  );
};

export default Demo;
