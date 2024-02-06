/* Variables

chain button - .network_button attr network
amount field - .borrow_amount
main = #borrow_form
*/

const borrowApp = Vue.createApp({
  data: () => ({
    amount: 0,
    chain: "matic",
    lendingToken: "USDC",
    collateralToken: "",
    collateralTokens: [],
    requiredCollateral: 0,
  }),
  watch: {
    amount() {
      this.getCollateralAmount();
    },
    chain() {
      this.getCollateralToken();
      this.getCollateralAmount();
    },
    lendingToken() {
      this.getCollateralAmount();
    },
    collateralToken() {
      this.getCollateralAmount();
    },
  },
  computed: {
    collSymbol() {
      const s = this.collateralTokens.find(
        (t) => t.address === this.collateralToken
      );
      if (s) return s.symbol;
      return "";
    },
  },
  methods: {
    changeChain(chain) {
      this.chain = chain;
    },
    async getCollateralToken() {
      try {
        const res = await fetch(
          `https://dash.internal.teller.org/get_collateral_tokens?chain=${this.chain}&lendingTokenSymbol=${this.lendingToken}`
        );
        const data = await res.json();
        this.collateralTokens = data;
      } catch (err) {
        alert(err.message);
      }
    },
    async getCollateralAmount() {
      if (
        !this.collateralToken ||
        !this.amount ||
        !this.chain ||
        !this.lendingToken
      ) {
        return;
      }
      try {
        const res =
          await fetch(`https://dash.internal.teller.org/get_collateral_amount?collateralTokenAddress=${this.collateralToken}&amount=${this.amount}&chain=${this.chain}&lendingTokenSymbol=${this.lendingToken}
        `);
        const data = await res.json();
        this.requiredCollateral =
          Math.round(data.required_collateral * 100) / 100;
      } catch (err) {}
    },
  },
  mounted() {
    this.getCollateralToken();
  },
});
borrowApp.mount("#borrow_form");
