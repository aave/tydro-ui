import { RequestedTokens, tokenSet } from 'cypress/support/helpers/token.helper';

import assets from '../../../fixtures/assets.json';
import constants from '../../../fixtures/constans.json';
import { skipState } from '../../../support/steps/common';
import { configEnvWithTenderlyPolygonFork } from '../../../support/steps/configuration.steps';
import { borrow, supply, withdraw } from '../../../support/steps/main.steps';
import { checkDashboardHealthFactor } from '../../../support/steps/verification.steps';

const tokensToRequest: RequestedTokens = {
  aMATICPolygonV3: 1,
};

const testData = {
  testCases: {
    borrow: {
      asset: assets.polygonV3Market.POL,
      amount: 1,
      apyType: constants.borrowAPYType.default,
      hasApproval: false,
      isRisk: true,
    },
    deposit2: {
      asset: assets.polygonV3Market.POL,
      amount: 1,
      hasApproval: true,
    },
    withdraw: {
      asset: assets.polygonV3Market.POL,
      isCollateral: true,
      amount: 9999,
      hasApproval: false,
      isMaxAmount: true,
      isRisk: true,
    },
  },
};
//due Matic frozen
describe.skip('CRITICAL CONDITIONS SPEC, POLYGON V3 MARKET', () => {
  const skipTestState = skipState(false);
  configEnvWithTenderlyPolygonFork({
    market: 'fork_proto_polygon_v3',
    v3: true,
    tokens: tokenSet(tokensToRequest),
  });
  borrow(testData.testCases.borrow, skipTestState, true);
  checkDashboardHealthFactor({ valueFrom: 1.0, valueTo: 1.11 }, skipTestState);
  supply(testData.testCases.deposit2, skipTestState, true);
  withdraw(testData.testCases.withdraw, skipTestState, false);
  checkDashboardHealthFactor({ valueFrom: 1.0, valueTo: 1.11 }, skipTestState);
});
