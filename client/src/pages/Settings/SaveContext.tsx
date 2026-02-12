import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

// 1️⃣ Tip za context
export type SaveContextType = {
  save?: () => void;
  setDirty?: Dispatch<SetStateAction<boolean>>;
};

// 2️⃣ Context
export const SaveContext = createContext<SaveContextType>({});
