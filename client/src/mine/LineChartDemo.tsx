import {
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartAreaInteractiveProps {
  data: { index: number; temperature: number; precipitation: number }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const filteredData = data; // možemo dodati filter po periodu kasnije
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const tickIndexes = filteredData
    .map((_, i) => i)
    .filter((_, i, arr) => i % Math.ceil(arr.length / 12) === 0)
    .map((tick, idx, arr) => {
      if (idx === 0) return tick + 1; // pomakni January malo udesno
      if (idx === arr.length - 1) return tick - 1; // pomakni December malo ulijevo
      return tick;
    });

  const chartConfig = {
    temperature: { label: 'Temperature (°C)', color: '#FF4D4D' }, // crvena
    precipitation: { label: 'Precipitation (mm)', color: '#4D79FF' }, // plava
  } satisfies ChartConfig;

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Weather Chart</CardTitle>
          <CardDescription>
            Showing average temperature & precipitation
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={tickIndexes}
              tickFormatter={(_, index) => months[index % 12]}
            />
            {/* Glavna Y os za temperaturu */}
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°C`}
            />
            {/* Dodatna Y os za padaline */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}mm`}
              domain={[0, (dataMax: number) => dataMax * 1.5]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label: number) => {
                    // label je index iz data
                    return months[label % 12]; // uzima mjesec iz months prema indexu
                  }}
                  indicator="dot"
                />
              }
            />

            {/* Area za temperaturu (crvena) */}
            <Area
              yAxisId="left"
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="#FF4D4D"
            />
            {/* Bar za padaline (plava) */}
            <Bar
              yAxisId="right"
              dataKey="precipitation"
              fill="#4D79FF"
              barSize={10}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
