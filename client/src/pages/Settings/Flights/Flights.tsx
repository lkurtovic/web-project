// pages/settings/SettingsHome.tsx
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function Flights() {
  const MAX_DISTANCE = 6;
  const [range, setRange] = useState<[number, number]>([1, 4]);

  const handleChange = (next: number[]) => {
    let [left, right] = next;

    // ako pređe max razliku, "zadnja" točka se povlači za prednjom
    if (right - left > MAX_DISTANCE) {
      if (left !== range[0]) {
        // pomiče se lijeva -> pomakni desnu
        right = left + MAX_DISTANCE;
      } else {
        // pomiče se desna -> pomakni lijevu
        left = right - MAX_DISTANCE;
      }
    }

    setRange([left, right]);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-muted p-6 rounded-lg">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center mb-5">
            <span className="text-sm text-muted-foreground">
              Search flights starting in {range[0]} months, <br /> covering the
              next {range[1] - range[0]} months
            </span>
          </div>

          <Slider
            value={range}
            onValueChange={handleChange}
            max={12}
            step={0.5}
            minStepsBetweenThumbs={1}
            className="mx-auto w-full max-w-xs"
          />

          <span className="text-xs text-muted-foreground">
            You can search flights for up to 6 months at a time.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
