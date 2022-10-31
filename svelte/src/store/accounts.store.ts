import { writable } from "svelte/store";

type Transfer = {
  from: string;
  to: string;
  amount: number;
};

export const accountsStore = writable<string[]>([]);
export const actualTransfer = writable<Transfer>();
