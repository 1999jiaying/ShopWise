'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type StockLevel = 'red' | 'green' | 'yellow';
type Category = 'ingredient' | 'ready-food';

export interface FoodItemData {
  name: string;
  weight: string;
  cost: string;
}

export interface WasteTypeData {
  name: string;
  weight: string;
  cost: string;
}

export interface SurplusItem {
  id: number;
  name: string;
  surplusQty: string;
  giveQty: string;
  expiresIn: string;
  checked: boolean;
  stockLevel: StockLevel;
  pickedUp: number;
  leftover: number;
  category: Category;
}

const INITIAL_FOOD_ITEMS: FoodItemData[] = [
  { name: 'Croissant',       weight: '2 kg',   cost: '€16,00' },
  { name: 'Salad greens', weight: '1.5 kg', cost: '€3,00'  },
  { name: 'Bread',        weight: '3 kg',   cost: '€1,20'  },
];

const INITIAL_WASTE_TYPES: WasteTypeData[] = [
  { name: 'Wrong order', weight: '2 kg', cost: '€9,00' },
  { name: 'Plate waste', weight: '2 kg', cost: '€8,00' },
  { name: 'Over-prep',   weight: '1 kg', cost: '€4,00' },
  { name: 'Spoilage',    weight: '0 kg', cost: '€0,00' },
];

const INITIAL_SURPLUS: SurplusItem[] = [
  { id: 1, name: 'Croissant',     surplusQty: '10 pcs',  giveQty: '10 pcs',  expiresIn: 'in 5 days', checked: true, stockLevel: 'red',    pickedUp: 1, leftover: 0,   category: 'ready-food' },
  { id: 2, name: 'Dairy',         surplusQty: '1 L',     giveQty: '1 L',     expiresIn: 'in 5 days', checked: true, stockLevel: 'red',    pickedUp: 1,   leftover: 0,   category: 'ingredient' },
  { id: 3, name: 'Ciabatta Bread',surplusQty: '2 pcs',   giveQty: '2 pcs',   expiresIn: 'in 5 days', checked: true, stockLevel: 'yellow', pickedUp: 1,   leftover: 1,   category: 'ready-food' },
  { id: 4, name: 'Sandwich',      surplusQty: '1 pcs',   giveQty: '1 pcs',   expiresIn: 'in 5 days', checked: true, stockLevel: 'green',  pickedUp: 1,   leftover: 0,   category: 'ready-food' },
  { id: 5, name: 'Carrot cake',   surplusQty: '2 pcs',   giveQty: '2 pcs',   expiresIn: 'in 3 days', checked: true, stockLevel: 'yellow', pickedUp: 1,   leftover: 1,   category: 'ready-food' },
  { id: 6, name: 'Pasta salad',   surplusQty: '0.5 kg',  giveQty: '0.5 kg',  expiresIn: 'in 2 days', checked: true, stockLevel: 'red',    pickedUp: 0,   leftover: 0.5, category: 'ready-food' },
];

function parseNum(str: string): number {
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

interface WasteContextValue {
  foodItems: FoodItemData[];
  wasteTypeItems: WasteTypeData[];
  surplusItems: SurplusItem[];
  setSurplusItems: React.Dispatch<React.SetStateAction<SurplusItem[]>>;
  logWaste: (data: { item: string; quantity: string; wasteType: string }) => void;
}

const WasteContext = createContext<WasteContextValue | null>(null);

export function WasteProvider({ children }: { children: ReactNode }) {
  const [foodItems, setFoodItems] = useState<FoodItemData[]>(INITIAL_FOOD_ITEMS);
  const [wasteTypeItems, setWasteTypeItems] = useState<WasteTypeData[]>(INITIAL_WASTE_TYPES);
  const [surplusItems, setSurplusItems] = useState<SurplusItem[]>(INITIAL_SURPLUS);

  function logWaste(data: { item: string; quantity: string; wasteType: string }) {
    const qty = parseNum(data.quantity);

    setFoodItems(prev => {
      const idx = prev.findIndex(f => f.name.toLowerCase() === data.item.toLowerCase());
      if (idx !== -1) {
        const updated = [...prev];
        const total = +(parseNum(updated[idx].weight) + qty).toFixed(2);
        updated[idx] = { ...updated[idx], weight: `${total} kg` };
        return updated;
      }
      return [...prev, { name: data.item, weight: `${qty} kg`, cost: '' }];
    });

    setWasteTypeItems(prev => {
      const idx = prev.findIndex(w => w.name === data.wasteType);
      if (idx !== -1) {
        const updated = [...prev];
        const total = +(parseNum(updated[idx].weight) + qty).toFixed(2);
        updated[idx] = { ...updated[idx], weight: `${total} kg` };
        return updated;
      }
      return [...prev, { name: data.wasteType, weight: `${qty} kg`, cost: '' }];
    });

    setSurplusItems(prev => {
      const idx = prev.findIndex(s => s.name.toLowerCase() === data.item.toLowerCase());
      if (idx !== -1) {
        const updated = [...prev];
        const current = parseNum(updated[idx].surplusQty);
        const total = +(current + qty).toFixed(2);
        updated[idx] = { ...updated[idx], surplusQty: `${total} kg`, giveQty: `${total} kg`, leftover: total };
        return updated;
      }
      const newId = Math.max(0, ...prev.map(s => s.id)) + 1;
      return [...prev, {
        id: newId,
        name: data.item,
        surplusQty: `${qty} kg`,
        giveQty: `${qty} kg`,
        expiresIn: 'in 1 day',
        checked: true,
        stockLevel: 'red' as StockLevel,
        pickedUp: 0,
        leftover: qty,
        category: 'ingredient' as Category,
      }];
    });
  }

  return (
    <WasteContext.Provider value={{ foodItems, wasteTypeItems, surplusItems, setSurplusItems, logWaste }}>
      {children}
    </WasteContext.Provider>
  );
}

export function useWaste() {
  const ctx = useContext(WasteContext);
  if (!ctx) throw new Error('useWaste must be used within WasteProvider');
  return ctx;
}
