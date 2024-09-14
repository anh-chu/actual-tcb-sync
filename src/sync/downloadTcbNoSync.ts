import { Parser } from "@json2csv/plainjs";
import { splitAndProcessTransaction } from "../tcb/process";
import { getArrangements, getTransactions } from "../tcb";
import { flattenObject } from "../util/flatten";

export async function downloadTcbNoSync(
  minDate: string,
  maxDate: string,
  from: number = 0,
  count: number = 1000
) {
  const arrangements = await getArrangements();
  const transactions = await getTransactions(minDate, maxDate, from, count);

  const files: any = [];

  const f = await splitAndProcessTransaction(transactions, arrangements);

  f.forEach((arrangement) => {
    if (!arrangement.transactions || !arrangement.transactions.length) return;
    const o = arrangement.transactions.map((item: any) => flattenObject(item));
    const fileName = `${arrangement.productTypeName} - ${arrangement.id}.csv`;
    const parser = new Parser({ delimiter: "," });
    const csv = parser.parse(o);
    files.push({ content: csv, fileName });
  });

  chrome.runtime.sendMessage({
    action: "download",
    body: files,
  });
}
