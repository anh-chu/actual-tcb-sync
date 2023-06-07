type Arrangement = {
  id: string;
  name: string;
  creditLimit: number;
  BBAN: string;
  currency: string;
  number: string;
  legalEntityIds: string[];
  productId: string;
  productKindName: string;
  productTypeName: string;
  bankBranchCode: string;
  visible: boolean;
  creditCardAccountNumber: string;
  outstandingPayment: number;
  debitCards: any[];
  accountHolderName: string;
  accountHolderNames: string;
  favorite: boolean;
  product: {
    externalId: string;
    externalTypeId: string;
    typeName: string;
    productKind: {
      id: number;
      externalKindId: string;
      kindName: string;
      kindUri: string;
    };
  };
  parentId: string;
  additions: {
    cardIcCard: string;
    cardDisplayDefault: string;
    cardIsSupplementary: string;
    guid: string;
    branch: string;
    cardStatus: string;
  };
};

type Goal = {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  background: string;
  createdAt: string;
};

type Transaction = {
  id: string;
  arrangementId: string;
  reference: string;
  description: string;
  typeGroup: string;
  type: string;
  category: string;
  bookingDate: string;
  valueDate: string;
  creditDebitIndicator: string;
  transactionAmountCurrency: {
    amount: string | number;
    currencyCode: string;
  };
  counterPartyName?: string;
  counterPartyAccountNumber?: string;
  counterPartyBankName?: string;
  runningBalance?: number;
  additions?: {
    creditBank: string;
    debitAcctName: string;
    creditAcctNo: string;
    debitBank: string;
    debitAcctNo: string;
    creditAcctName: string;
  };
  checkImageAvailability: string;
  creationTime: string;
};
