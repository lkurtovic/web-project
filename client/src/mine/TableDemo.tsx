'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import rawData from '@/pages/Settings/FoodWater/data.json';

interface TableDemoProps {
  costData?: Record<string, number | string>;
  userPreferences: { id: number; quantity: number }[];
}

export function TableDemo({ costData, userPreferences }: TableDemoProps) {
  // 1. Pomoćna funkcija za čišćenje broja (uklanja zareze i odvaja od simbola)
  const getNumber = (val: string | number | undefined) => {
    if (!val || val === '?') return 0;
    if (typeof val === 'number') return val;
    // Uzimamo prvi dio (broj), brišemo zarez i pretvaramo u float
    const parts = val
      .replace(/\u00a0/g, ' ')
      .trim()
      .split(' ');
    return parseFloat(parts[0].replace(/,/g, '')) || 0;
  };

  // 2. Filtriranje stavki
  const activeItems = rawData.filter((item) =>
    userPreferences.some((pref) => pref.id === item.id),
  );

  // 3. Računanje Totala i pronalaženje simbola valute
  let detectedCurrency = '';
  const total = costData
    ? activeItems.reduce((sum, item) => {
        const rawValue = costData[item.key];
        if (rawValue && rawValue !== '?' && !detectedCurrency) {
          // Uzimamo simbol (zadnji dio stringa) iz prve valjane cijene na koju naiđemo
          const parts = rawValue.toString().trim().split(/\s+/);
          if (parts.length > 1) detectedCurrency = parts[parts.length - 1];
        }

        const price = getNumber(rawValue);
        const pref = userPreferences.find((p) => p.id === item.id);
        const qty = pref ? pref.quantity : 0;
        return sum + price * qty;
      }, 0)
    : 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Section</TableHead>
          <TableHead className="w-[300px]">Item</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">
            Price ({detectedCurrency})
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeItems.map((item) => {
          const pref = userPreferences.find((p) => p.id === item.id);
          const quantity = pref?.quantity || 0;
          const price = costData ? costData[item.key] : null;

          return (
            <TableRow key={item.id}>
              <TableCell>{item.section}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className="text-right">{quantity}</TableCell>
              <TableCell className="text-right">
                {price !== null && price !== '?' ? (
                  price // Ovo ispisuje npr. "20.00 $" direktno iz API-ja
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="font-bold">
            Total
          </TableCell>
          <TableCell className="text-right font-bold">
            {costData ? (
              `${total.toFixed(2)} ${detectedCurrency}`
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
