import jsonQuery from "json-query";
import { arrangementMapping, goalMapping } from "../util/mapping";

// convert transaction of type Transaction to actual transaction of type ActualTransaction
export function convertToActualTransaction(
  transaction: Transaction
): ActualTransaction {
  const a: ActualTransaction = {
    imported_id: transaction.id,
    date: transaction.bookingDate,
    amount: +transaction.transactionAmountCurrency.amount * 100,
    payee_name: transaction.counterPartyName,
    notes: transaction.description,
    account: arrangementMapping[transaction.arrangementId],
  };
  if (transaction.counterPartyAccountNumber)
    if (
      Object.keys(goalMapping).includes(transaction.counterPartyAccountNumber)
    )
      a.payee = goalMapping[transaction.counterPartyAccountNumber];
  return a;
}

// split transactions into arrangements & process amount signs + notes
export function splitAndProcessTransaction(
  transactions: Transaction[],
  arrangements: Arrangement[],
  forApi: boolean = false
) {
  const converted = arrangements.map((arrangement) => {
    const group = jsonQuery(`transactions[*arrangementId=${arrangement.id}]`, {
      data: { transactions },
    });
    const t = group.value.map((transaction: Transaction) => {
      transaction.transactionAmountCurrency.amount =
        transaction.creditDebitIndicator == "DBIT"
          ? -transaction.transactionAmountCurrency.amount
          : +transaction.transactionAmountCurrency.amount;
      if (transaction.counterPartyAccountNumber)
        transaction.description += ` @ ${transaction.counterPartyAccountNumber}`;
      return forApi ? convertToActualTransaction(transaction) : transaction;
    });
    return {
      id: arrangement.id,
      productTypeName: arrangement.productTypeName,
      accountId: arrangementMapping[arrangement.id],
      transactions: t,
    };
  });
  const nonEmpty = converted.filter((item) => item.transactions.length);
  if (forApi) return nonEmpty.filter((item) => item.accountId);
  return nonEmpty;
}
