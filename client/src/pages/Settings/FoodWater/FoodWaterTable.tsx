'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataTable, type RowType } from '@/mine/data-table';
import { auth } from '@/firebase'; // 👈 Provjeri je li putanja do tvog firebase file-a točna
import rawData from './data.json';

type ContextType = {
  setSaveCallback: (cb: () => void) => void;
  setDirty: (d: boolean) => void;
};

export default function FoodWaterTable() {
  const { setSaveCallback, setDirty } = useOutletContext<ContextType>();

  // 1. Inicijalni podaci iz JSON-a
  const baseData: RowType[] = useMemo(() => {
    return rawData.map((item) => ({
      ...item,
      section: item.section as any,
      selected: false,
      quantity: item.amount ?? null,
    }));
  }, []);

  const [data, setData] = useState<RowType[]>(baseData);
  const [loading, setLoading] = useState(false);

  // Ref za sinkronizaciju podataka bez re-rendera callbacka
  const dataRef = useRef<RowType[]>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // 2. Load from server on mount (Slušamo Auth stanje)
  useEffect(() => {
    const loadData = async (uid: string) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${uid}/food-preferences`,
        );
        const savedItems = await res.json();

        if (savedItems && Array.isArray(savedItems) && savedItems.length > 0) {
          const merged = baseData.map((item) => {
            const found = savedItems.find((s) => s.id === item.id);
            if (found) {
              return { ...item, selected: true, quantity: found.quantity };
            }
            return item;
          });
          setData(merged);
        }
      } catch (err) {
        console.error('Greška pri učitavanju s baze:', err);
      }
    };

    // Firebase treba vremena da inicijalizira usera nakon refresh-a
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadData(user.uid);
      }
    });

    return () => unsubscribe();
  }, [baseData]);

  // 3. Save preferences
  const savePreferences = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Morate biti prijavljeni za spremanje!');
      return;
    }

    setLoading(true);
    const currentData = dataRef.current;
    const selectedItems = currentData
      .filter((row) => row.selected)
      .map((row) => ({
        id: row.id,
        quantity: row.quantity,
      }));

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.uid}/food-preferences`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedItems),
        },
      );

      if (res.ok) {
        console.log('✅ Uspješno spremljeno u bazu za:', user.uid);
        setDirty(false);
      }
    } catch (err) {
      console.error('Greška pri spremanju:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Registracija callbacka za roditeljsku komponentu
  useEffect(() => {
    setSaveCallback(() => savePreferences);
  }, [setSaveCallback]);

  // 5. Update funkcija za DataTable
  const updateRow = (id: number, patch: Partial<RowType>) => {
    setData((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      setDirty(true);
      return next;
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-lg bg-muted p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Food & Drink Preferences</h2>
        {loading && (
          <span className="text-sm animate-pulse text-blue-500">
            Spremanje...
          </span>
        )}
      </div>
      <DataTable
        data={data}
        setData={setData}
        originalData={baseData}
        setDirty={setDirty}
        updateRow={updateRow}
      />
    </div>
  );
}
