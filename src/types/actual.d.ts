// type of a transaction inferred from the type reference where Field is the key and Type is the type of the key, required indicate required key
type ActualTransaction = {
  id?: string;
  account: string;
  date: string;
  amount?: number;
  payee?: string;
  payee_name?: string;
  imported_payee?: string;
  category?: string;
  notes?: string;
  imported_id?: string;
  transfer_id?: string;
  cleared?: boolean;
  subtransactions?: ActualTransaction[];
};
