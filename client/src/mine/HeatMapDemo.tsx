'use client';

import * as React from 'react';
import HeatMap from '@uiw/react-heat-map';
import { useTheme } from '@/mine/theme-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DemoProps {
  flightData: { date: string; count: number }[];
}

const Demo = ({ flightData }: DemoProps) => {
  const { theme } = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(950);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const textColor = theme === 'dark' ? '#fff' : '#000';

  // --- RESPONSIVE LOGIC ---
  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Uzimamo širinu diva, ali ograničavamo na max 950 da ne pobjegne na ultra-wide ekranima
        const newWidth = containerRef.current.offsetWidth;
        setContainerWidth(newWidth > 950 ? 950 : newWidth);
      }
    };

    handleResize(); // Inicijalno postavljanje
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- DATE LOGIC (Tvoj postojeći kod) ---
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const todayStr = `${y}/${m}/${d}`;
  const mapStartDate = new Date(y, today.getMonth(), 1);

  const finalData = React.useMemo(() => {
    const sanitizedData = flightData.map((item) => ({
      ...item,
      date: item.date.replace(/-/g, '/'),
    }));
    const hasToday = sanitizedData.some((d) => d.date === todayStr);
    if (!hasToday) {
      return [{ date: todayStr, count: 0 }, ...sanitizedData];
    }
    return sanitizedData;
  }, [flightData, todayStr]);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Dodajemo ref i w-full na ovaj div */}
      <div
        ref={containerRef}
        className="w-full flex flex-col items-center overflow-hidden"
      >
        <HeatMap
          value={finalData}
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          startDate={mapStartDate}
          width={containerWidth} // Koristimo dinamičku širinu
          height={200}
          rectSize={containerWidth < 500 ? 12 : 20} // Smanjujemo kvadratiće na mobitelu
          rectProps={{ rx: 7 }}
          style={{ color: textColor, maxWidth: '100%' }}
          legendCellSize={0}
          rectRender={(props, data) => {
            const isToday = data.date === todayStr;
            const price = data.count || 0;

            return (
              <Tooltip key={data.date}>
                <TooltipTrigger asChild>
                  <g>
                    <rect
                      {...props}
                      stroke={isToday ? '#3b82f6' : props.stroke}
                      strokeWidth={isToday ? '3' : props.strokeWidth}
                      fill={
                        isToday && price === 0
                          ? theme === 'dark'
                            ? '#1e3a8a'
                            : '#dbeafe'
                          : props.fill
                      }
                    />
                    {isToday && (
                      <circle
                        cx={Number(props.x) + Number(props.width) / 2}
                        cy={Number(props.y) + Number(props.height) / 2}
                        r={containerWidth < 500 ? '3' : '5'} // Smanjujemo točkicu na mobitelu
                        fill="#3b82f6"
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-blue-500">
                  {/* Tvoj postojeći Tooltip Content... */}
                  <div className="text-xs text-center">
                    <p className={isToday ? 'font-bold text-blue-500' : ''}>
                      {isToday ? 'Today' : data.date}
                    </p>
                    <p className="font-semibold text-green-500">
                      {price > 0 ? `$${price}` : 'No flights'}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }}
        />

        {/* Legenda (Tvoj postojeći kod) */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground text-center">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-green-500 opacity-50" />
            <span>Flight Prices</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Demo;
