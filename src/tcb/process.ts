import jsonQuery from "json-query";
import { getMappings } from "../util/mapping";
import { getExchangeRate } from "../util/currency";

// convert transaction of type Transaction to actual transaction of type ActualTransaction
export async function convertToActualTransaction(
  transaction: Transaction,
  arrangementMapping: { [key: string]: string },
  goalMapping: { [key: string]: string }
): Promise<ActualTransaction> {
  const a: ActualTransaction = {
    imported_id: transaction.id,
    date: transaction.bookingDate,
    amount: +transaction.transactionAmountCurrency.amount * 100,
    payee_name: transaction.counterPartyName,
    notes: transaction.description,
    account: arrangementMapping[transaction.arrangementId],
  };
  if (transaction.transactionAmountCurrency.currencyCode !== "VND") {
    const exchangRate = await getExchangeRate(
      transaction.transactionAmountCurrency.currencyCode
    );
    a.amount = Math.ceil(
      +transaction.transactionAmountCurrency.amount * exchangRate * 100
    );
  }
  if (transaction.counterPartyAccountNumber)
    if (
      Object.keys(goalMapping).includes(transaction.counterPartyAccountNumber)
    )
      a.payee = goalMapping[transaction.counterPartyAccountNumber];
  return a;
}

// split transactions into arrangements & process amount signs + notes
export async function splitAndProcessTransaction(
  transactions: Transaction[],
  arrangements: Arrangement[],
  forApi: boolean = false
) {
  const { am: arrangementMapping, gm: goalMapping } = await getMappings();
  const converted = await Promise.all(
    arrangements.map(async (arrangement) => {
      const group = jsonQuery(
        `transactions[*arrangementId=${arrangement.id}]`,
        {
          data: { transactions },
        }
      );
      const t = await Promise.all(
        group.value.map(async (transaction: Transaction) => {
          transaction.transactionAmountCurrency.amount =
            transaction.creditDebitIndicator == "DBIT"
              ? -transaction.transactionAmountCurrency.amount
              : +transaction.transactionAmountCurrency.amount;
          if (transaction.counterPartyAccountNumber)
            transaction.description += ` @ ${transaction.counterPartyAccountNumber}`;
          // remove "Giao dich thanh toan/Purchase - So The/Card No:" from beginning of transaction description
          if (
            transaction.description.startsWith(
              "Giao dich thanh toan/Purchase - So The/Card No:"
            )
          )
            transaction.description = transaction.description.replace(
              "Giao dich thanh toan/Purchase - So The/Card No:",
              ""
            );
          return forApi
            ? await convertToActualTransaction(
                transaction,
                arrangementMapping,
                goalMapping
              )
            : transaction;
        })
      );
      return {
        id: arrangement.id,
        productTypeName: arrangement.productTypeName,
        accountId: arrangementMapping[arrangement.id],
        transactions: t,
      };
    })
  );
  const nonEmpty = converted.filter((item) => item.transactions.length);
  if (forApi) return nonEmpty.filter((item) => item.accountId);
  return nonEmpty;
}
