import { getBalances } from "./index";
import { getMappings } from "../util/mapping";
import { getExchangeRate } from "../util/currency";

export async function processFidelity() {
  const balances = await getBalances();
  const { bm: balanceMapping } = await getMappings();
  let accounts = {} as { [key: string]: number };
  const exchangeRate = await getExchangeRate("USD");

  balances.data.getContext.person.assets.forEach((asset) => {
    if (balanceMapping[asset.acctNum]) {
      const assetValue = asset.gainLossBalanceDetail.totalMarketVal;
      const accountId = balanceMapping[asset.acctNum];
      // convert asset value to VND
      const assetValueVnd = assetValue * exchangeRate;
      accounts[accountId] = assetValueVnd;
    }
  });

  console.log(accounts);

  return accounts;
}
