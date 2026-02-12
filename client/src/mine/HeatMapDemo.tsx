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

  const textColor = theme === 'dark' ? '#fff' : '#000';

  // 1. PRECIZNO FORMATIRANJE DANAŠNJEG DATUMA (YYYY/MM/DD)

  const today = new Date();

  const y = today.getFullYear();

  const m = String(today.getMonth() + 1).padStart(2, '0');

  const d = String(today.getDate()).padStart(2, '0');

  const todayStr = `${y}/${m}/${d}`; // Rezultat: "2026/02/06"

  const mapStartDate = new Date(y, today.getMonth(), 1);

  // 2. OSIGURAVAMO DA DANAS POSTOJI U PODACIMA (Pretvaramo sve crtice u kose crte)

  const finalData = React.useMemo(() => {
    const sanitizedData = flightData.map((item) => ({
      ...item,

      date: item.date.replace(/-/g, '/'), // Pretvara 2026-02-06 u 2026/02/06
    }));

    const hasToday = sanitizedData.some((d) => d.date === todayStr);

    if (!hasToday) {
      return [{ date: todayStr, count: 0 }, ...sanitizedData];
    }

    return sanitizedData;
  }, [flightData, todayStr]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col items-center">
        <HeatMap
          value={finalData}
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          startDate={mapStartDate}
          width={950}
          height={200}
          rectSize={20}
          rectProps={{ rx: 7 }}
          style={{ color: textColor }}
          legendCellSize={0}
          rectRender={(props, data) => {
            // Usporedba datuma

            const isToday = data.date === todayStr;

            const price = data.count || 0;

            return (
              <Tooltip key={data.date}>
                <TooltipTrigger asChild>
                  <g>
                    <rect
                      {...props}
                      // Ako je danas, forsiramo plavi obrub

                      stroke={isToday ? '#3b82f6' : props.stroke}
                      strokeWidth={isToday ? '3' : props.strokeWidth}
                      // Ako je danas i nema podataka, bojamo unutrašnjost lagano plavo

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
                        r="5"
                        fill="#3b82f6"
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                  </g>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="flex flex-col items-center border-blue-500"
                >
                  {isToday && (
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                      📍 You are here
                    </span>
                  )}

                  <div className="text-xs text-center">
                    <p className={isToday ? 'font-bold text-blue-500' : ''}>
                      {isToday ? 'Today' : data.date}
                    </p>

                    {price > 0 ? (
                      <p className="font-semibold text-green-500">${price}</p>
                    ) : (
                      <p className="text-muted-foreground italic text-[10px]">
                        No flights
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }}
        />

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500" />

            <span>Today (You are here)</span>
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
