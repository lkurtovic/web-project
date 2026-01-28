import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { INTERESTS } from './InteresiPopis';
import type { InterestKey } from './InteresiPopis';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

export default function Interests() {
  const [selected, setSelected] = useState<Record<InterestKey, boolean>>(
    Object.fromEntries(INTERESTS.map((i) => [i.key, false])) as Record<
      InterestKey,
      boolean
    >,
  );

  const toggle = (key: InterestKey) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="px-10 py-5">
      <div className="mb-10">Choose your interests</div>

      <div className="mb-10">
        These interests will be used for planing days of your travel
      </div>

      <div className="flex gap-5 flex-wrap flex-row flex-1 min-h-0 rounded-lg bg-muted p-6">
        {INTERESTS.map(({ key, icon: Icon, label }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant={selected[key] ? 'default' : 'outline'}
                onClick={() => toggle(key)}
                className="flex items-center justify-center border-2 cursor-pointer"
              >
                <Icon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
