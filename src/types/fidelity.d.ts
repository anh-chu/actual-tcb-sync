type Asset = {
  acctNum: string;
  preferenceDetail: {
    name: string;
  };
  gainLossBalanceDetail: {
    totalMarketVal: number;
  };
};

type Balances = {
  data: {
    getContext: {
      person: {
        assets: Asset[];
      };
    };
  };
};
