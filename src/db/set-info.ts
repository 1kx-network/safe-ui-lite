import { ISafe, db } from '.';

export async function setDataDB(safeAddress: string, data: Partial<ISafe>): Promise<void> {
  // Проверяем, существует ли запись в базе данных для указанного safeAddress
  const existingSafe: ISafe | undefined = await db.safes.get({ address: safeAddress });

  if (existingSafe) {
    if (data.owners && data.owners.length > 0) {
      existingSafe.owners = data.owners;
    }
    if (data.transactions && data.transactions.length > 0) {
      existingSafe.transactions.unshift(...data.transactions);
    }
    await db.safes.put(existingSafe);
  } else {
    const newSafe: ISafe = {
      address: safeAddress,
      owners: data.owners || [],
      transactions: data.transactions || [],
    };
    await db.safes.add(newSafe);
  }
}
