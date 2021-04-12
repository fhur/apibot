import { atom, selector, selectorFamily } from 'recoil';
import { ExecNode } from '@apibot/runtime';
import * as Nodes from './model/nodes';
import path from 'path';

async function readFileAsync(path: string): Promise<string> {
  return require('fs').readFileSync(path).toString();
}

export const $searchQuery = atom({
  key: 'searchQuery',
  default: '',
});

export const $currentConfigPath = atom({
  key: 'currentConfigPath',
  default:
    '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/apibot.config.json',
});

export const $currentConfig = selector({
  key: 'currentConfig',
  get: ({ get }) => {
    const currentConfigPath = get($currentConfigPath);
    const config = JSON.parse(require('fs').readFileSync(currentConfigPath));
    return config;
  },
});

export const $showDrawer = atom<boolean>({
  key: 'showDrawer',
  default: false,
});

type AlertType =
  | 'omnibox'
  | 'confirm-execute-node'
  | 'confirm-execute-graph'
  | undefined;

export const $showAlert = atom<AlertType>({
  key: 'showAlert',
  default: undefined,
});

export const $omniboxQuery = atom<string>({
  key: 'omniboxQuery',
  default: '',
});

export const $omniboxResults = selector<ExecNode[]>({
  key: 'omniboxResults',
  get: ({ get }) => {
    const omniboxQuery = get($omniboxQuery).trim().toLowerCase();
    if (omniboxQuery.length === 0) {
      return [];
    }
    const nodes = get($nodes);
    const filtered = nodes.filter((n) => {
      return (n.title || '').toLowerCase().includes(omniboxQuery);
    });
    return filtered;
  },
});

export const $selectedNodeId = atom<string | undefined>({
  key: 'selectedNodeId',
  default: undefined,
});

export const $selectedNode = selector<ExecNode | undefined>({
  key: 'selectedNode',
  get: ({ get }) => {
    const selectedGraph = get($selectedGraph);
    if (!selectedGraph) {
      return undefined;
    }

    const selectedNodeId = get($selectedNodeId);
    const children = Nodes.getChildren(selectedGraph);
    return children.find((c) => c.id === selectedNodeId);
  },
});

export const $executionRequestId = atom<string>({
  key: 'executionRequestId',
  default: undefined,
});

export const $selectedGraphId = atom<string | undefined>({
  key: 'selectedGraphId',
  default: undefined,
});

export const $selectedGraph = selector<ExecNode | undefined>({
  key: 'selectedGraph',
  get: ({ get }) => {
    const _selectedGraphId = get($selectedGraphId);
    return get($nodes).find((n) => n.title === _selectedGraphId);
  },
});

export const $currentExecution = selector<any>({
  key: 'currentExecution',
  get: async ({ get }) => {
    try {
      const pathToLogs = path.join(
        path.dirname(get($currentConfigPath)),
        'logs/latest.jsonl'
      );
      const text = await readFileAsync(pathToLogs);
      const lines = text
        .split('\n')
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
      const last = lines[lines.length - 1];
      return JSON.parse(last).scope;
    } catch (_) {
      return {};
    }
  },
});

export const $nodes = atom<ExecNode[]>({
  key: 'nodes',
  default: [
    {
      id: 'fetchInsisPolicy',
      type: 'apibot.chain',
      title: 'fetchInsisPolicy',
      config: [
        {
          name: 'fns',
          value: [
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchLightPolicy.js Object.fetchLightPolicy 6:22',
              type: 'apibot.http-node',
              title: 'fetchLightPolicy',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}/light',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchInsisPolicy.js fetchInsisPolicy 7:99',
              type: 'apibot.extract-body',
              title: 'fetchInsisPolicy',
              config: [
                {
                  name: 'extract',
                  value: '$.externalPolicyId',
                },
                {
                  name: 'as',
                  value: 'externalPolicyId',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchInsisPolicy.js fetchInsisPolicy 7:181',
              type: 'apibot.http-node',
              title: 'fetchInsisPolicy',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/administrations/insis/policy/{externalPolicyId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'fetchLightPolicy',
      type: 'apibot.http-node',
      title: 'fetchLightPolicy',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/policy-administration/api/v1/policies/{policyId}/light',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'fetchPolicy',
      type: 'apibot.http-node',
      title: 'fetchPolicy',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value: '{rootUrl}/policy-administration/api/v1/policies/{policyId}',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
          value: {
            includeTax: 'false',
          },
        },
      ],
    },
    {
      id: 'fetchPolicyEvents',
      type: 'apibot.http-node',
      title: 'fetchPolicyEvents',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value: '{rootUrl}/policy-administration/api/v1/events/{policyId}',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'fetchWindowedSnapshots',
      type: 'apibot.http-node',
      title: 'fetchWindowedSnapshots',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/policy-administration/api/v1/commit-log/{policyId}/windowed-snapshots',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
          value: {
            timestamp: '2295-01-20T13:45:58.432Z',
          },
        },
      ],
    },
    {
      id: 'mtaAllowance',
      type: 'apibot.http-node',
      title: 'mtaAllowance',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'mtaExecuteQuotation',
      type: 'apibot.http-node',
      title: 'mtaExecuteQuotation',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations/quotations/{quotationId}',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'mtaQuoteHurrycanModifyRiskAnswer',
      type: 'apibot.http-node',
      title: 'mtaQuoteHurrycanModifyRiskAnswer',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations/quotations',
        },
        {
          name: 'body',
          value: {
            start: '{mtaDate}',
            context: {
              MOT_DE_22: 42,
            },
            operationType: 'MODIFY_RISK_ANSWERS',
          },
        },
        {
          name: 'headers',
          value: {
            'x-caller': '{xCaller}',
            'content-type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createGmdiPolicy',
      type: 'apibot.chain',
      title: 'createGmdiPolicy',
      config: [
        {
          name: 'fns',
          value: [
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/scenarios/createGmdiPolicy.js createGdmiShoppingCart 11:22',
              type: 'apibot.http-node',
              title: 'createGdmiShoppingCart',
              config: [
                {
                  name: 'method',
                  value: 'POST',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/cart/',
                },
                {
                  name: 'body',
                  value: {
                    language: 'nl',
                    partnerId: 'ORANJE',
                    productId: 'GMDI',
                    answers: [
                      {
                        questionId: 'MOT_NL_BEGIN',
                        answer: '2021-04-07 12:45:58',
                      },
                      {
                        questionId: 'MOT_NL_END',
                        answer: '2021-04-16 12:45:58',
                      },
                      {
                        questionId: 'MOT_NL_PLATE',
                        answer: '{plateNumber}',
                      },
                    ],
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                    'X-Caller': 'internal',
                    'Content-Type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'createPolicy',
      type: 'apibot.chain',
      title: 'createPolicy',
      config: [
        {
          name: 'fns',
          value: [
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchRiskQuestion.js Object.fetchRiskQuestion 25:22',
              type: 'apibot.chain',
              title: 'fetchRiskQuestion',
              config: [
                {
                  name: 'fns',
                  value: [
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchRiskQuestion.js Object.fetchRiskQuestion 25:38',
                      type: 'apibot.http-node',
                      title: 'fetchRiskQuestion',
                      config: [
                        {
                          name: 'method',
                          value: 'GET',
                        },
                        {
                          name: 'url',
                          value: '{rootUrl}/quotation/api/v1/risk/{productId}',
                        },
                        {
                          name: 'body',
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                          },
                        },
                        {
                          name: 'queryParams',
                          value: {
                            language: '{language}',
                          },
                        },
                      ],
                    },
                    {
                      id:
                        '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
                      type: 'apibot.assert-status',
                      title: 'assertOk',
                      config: [
                        {
                          name: 'from',
                          value: 200,
                        },
                        {
                          name: 'to',
                          value: 299,
                        },
                      ],
                    },
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchRiskQuestion.js Object.fetchRiskQuestion 30:41',
                      type: 'apibot.extract-body',
                      title: 'fetchRiskQuestion',
                      config: [
                        {
                          name: 'extract',
                          value: '$',
                        },
                        {
                          name: 'as',
                          value: 'riskQuestions',
                        },
                      ],
                    },
                    {
                      type: 'apibot.eval',
                      title: '',
                    },
                  ],
                },
              ],
            },
            {
              type: 'apibot.when',
              title: 'When',
              config: [
                {
                  name: 'args',
                  value: {
                    "$.partnerId == 'HURRYCAN'": {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/createHurrycanShoppingCart.js Object.createHurrycanShoppingCart 6:22',
                      type: 'apibot.http-node',
                      title: 'createHurrycanShoppingCart',
                      config: [
                        {
                          name: 'method',
                          value: 'POST',
                        },
                        {
                          name: 'url',
                          value: '{rootUrl}/quotation/api/v1/cart/',
                        },
                        {
                          name: 'body',
                          value: {
                            language: '{language}',
                            partnerId: 'HURRYCAN',
                            productId: 'GSMOTOR',
                            answers: [
                              {
                                questionId: 'MOT_DE_01',
                                answer: '1999-12-26',
                              },
                              {
                                questionId: 'MOT_DE_02',
                                answer: '1',
                              },
                              {
                                questionId: 'MOT_DE_04',
                                answer: '98708',
                              },
                              {
                                questionId: 'MOT_DE_04_B',
                                answer: 'Gehren',
                              },
                              {
                                questionId: 'MOT_DE_05',
                                answer: 1997,
                              },
                              {
                                questionId: 'MOT_DE_06',
                                answer: '1997-11-11',
                              },
                              {
                                questionId: 'MOT_DE_07',
                                answer: '1998-10-10',
                              },
                              {
                                questionId: 'MOT_DE_08',
                                answer: '4136',
                              },
                              {
                                questionId: 'MOT_DE_09',
                                answer: 'ALM',
                              },
                              {
                                questionId: 'MOT_DE_19',
                                answer: '05',
                              },
                              {
                                questionId: 'SF_CLASS_MTPL',
                                answer: '10',
                              },
                              {
                                questionId: 'SF_CLASS_MOD',
                                answer: '10',
                              },
                              {
                                questionId: 'MOT_DE_26',
                                answer: '0',
                              },
                              {
                                questionId: 'MOT_DE_28',
                                answer: '1',
                              },
                              {
                                questionId: 'MOT_DE_24',
                                answer: '1',
                              },
                              {
                                questionId: 'MOT_DE_34',
                                answer: '0',
                              },
                              {
                                questionId: 'MOT_DE_30',
                                answer: '1',
                              },
                              {
                                questionId: 'MOT_DE_20_B',
                                answer: '1',
                              },
                              {
                                questionId: 'MOT_DE_03',
                                answer: '1995-12-12',
                              },
                              {
                                questionId: 'MOT_DE_27',
                                answer: 2010,
                              },
                              {
                                questionId: 'MOT_DE_35',
                                answer: '0',
                              },
                              {
                                questionId: 'MOT_DE_36_B',
                                answer: '1',
                              },
                            ],
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'X-Caller': 'internal',
                            'Content-Type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                    "$.partnerId == 'ASTRID'": {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/createAstridShoppingCart.js Object.createAstridShoppingCart 6:22',
                      type: 'apibot.http-node',
                      title: 'createAstridShoppingCart',
                      config: [
                        {
                          name: 'method',
                          value: 'POST',
                        },
                        {
                          name: 'url',
                          value: '{rootUrl}/quotation/api/v1/cart/',
                        },
                        {
                          name: 'body',
                          value: {
                            language: '{language}',
                            productId: 'HEMSAKER',
                            answers: [
                              {
                                questionId: 'ROOMS',
                                answer: '2',
                              },
                              {
                                questionId: 'ADULTS',
                                answer: '2',
                              },
                              {
                                questionId: 'CHILDREN',
                                answer: '0',
                              },
                              {
                                questionId: 'LIVING_STANDARD',
                                answer: '1',
                              },
                              {
                                questionId: 'CITY_CH',
                                answer: '1933-CH3611',
                              },
                              {
                                questionId: 'OWNERSHIP',
                                answer: '1',
                              },
                              {
                                questionId: 'DOB_HH_CH',
                                answer: '1990-12-30',
                              },
                            ],
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'X-Caller': 'internal',
                            'Content-Type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                    "$.partnerId == 'ORANJE'": {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/createOranjeShoppingCart.js Object.createOranjeShoppingCart 10:22',
                      type: 'apibot.http-node',
                      title: 'createOranjeShoppingCart',
                      config: [
                        {
                          name: 'method',
                          value: 'POST',
                        },
                        {
                          name: 'url',
                          value: '{rootUrl}/quotation/api/v1/cart/',
                        },
                        {
                          name: 'body',
                          value: {
                            language: 'nl',
                            partnerId: 'ORANJE',
                            productId: 'MDI',
                            answers: [
                              {
                                questionId: 'MOT_NL_BEGIN',
                                answer: '2021-04-07 12:45:58',
                              },
                              {
                                questionId: 'MOT_NL_END',
                                answer: '2021-04-16 12:45:58',
                              },
                              {
                                questionId: 'MOT_NL_PLATE',
                                answer: '{plateNumber}',
                              },
                            ],
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'X-Caller': 'internal',
                            'Content-Type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                    else: {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/createShoppingCart.js Object.createShoppingCart 6:22',
                      type: 'apibot.http-node',
                      title: 'createShoppingCart',
                      config: [
                        {
                          name: 'method',
                          value: 'POST',
                        },
                        {
                          name: 'url',
                          value: '{rootUrl}/quotation/api/v1/cart/',
                        },
                        {
                          name: 'body',
                          value: {
                            language: '{language}',
                            partnerId: '{partnerId}',
                            productId: '{productId}',
                            answers: {
                              $get: 'riskAnswers',
                            },
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'X-Caller': 'internal',
                            'Content-Type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/scenarios/createPolicy.js createPolicy 28:41',
              type: 'apibot.extract-header',
              title: 'createPolicy',
              config: [
                {
                  name: 'headerName',
                  value: 'cartid',
                },
                {
                  name: 'name',
                  value: 'cartId',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchShoppingCart.js Object.fetchShoppingCart 6:22',
              type: 'apibot.http-node',
              title: 'fetchShoppingCart',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/cart/{cartId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: 'assertBodyEquals',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/scenarios/createPolicy.js createPolicy 31:19',
              type: 'apibot.extract-body',
              title: 'createPolicy',
              config: [
                {
                  name: 'extract',
                  value: '$.underwriting',
                },
                {
                  name: 'as',
                  value: 'underwritingQuestions',
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/addCustomer.js Object.addCustomer 6:22',
              type: 'apibot.http-node',
              title: 'addCustomer',
              config: [
                {
                  name: 'method',
                  value: 'PUT',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/cart/{cartId}/customer/',
                },
                {
                  name: 'body',
                  value: {
                    firstName: 'John',
                    lastName: 'Doe',
                    gender: 'MALE',
                    birthDate: '1999-12-26',
                    email:
                      'iptiq-test+0.3iqoreeu0x90.b1eluyzadd9@mailinator.com',
                    addresses: {
                      $get: 'addresses',
                    },
                    phoneNumbers: ['+0000000000'],
                    metadata: {
                      vin: '{vin}',
                      plateNumber: '{plateNumber}',
                    },
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                    'content-type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/addParticipant.js Object.addParticipant 6:22',
              type: 'apibot.http-node',
              title: 'addParticipant',
              config: [
                {
                  name: 'method',
                  value: 'PUT',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/quotation/api/v1/cart/{cartId}/participants/',
                },
                {
                  name: 'body',
                  value: {
                    $get: 'policyParticipants',
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                    'Content-Type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.when',
              title: 'When',
              config: [
                {
                  name: 'args',
                  value: {
                    "$.partnerId == 'ORANJE'": {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/setOranjeContractTerms.js Object.setOranjeContractTerms 10:22',
                      type: 'apibot.http-node',
                      title: 'setOranjeContractTerms',
                      config: [
                        {
                          name: 'method',
                          value: 'PUT',
                        },
                        {
                          name: 'url',
                          value:
                            '{rootUrl}/quotation/api/v1/cart/{cartId}/contractTerms/',
                        },
                        {
                          name: 'body',
                          value: {
                            paymentFrequency: '{paymentFrequency}',
                            startDate: '2021-04-07',
                            endDate: '2021-04-16',
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'content-type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                    else: {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/setContractTerms.js Object.setContractTerms 10:22',
                      type: 'apibot.http-node',
                      title: 'setContractTerms',
                      config: [
                        {
                          name: 'method',
                          value: 'PUT',
                        },
                        {
                          name: 'url',
                          value:
                            '{rootUrl}/quotation/api/v1/cart/{cartId}/contractTerms/',
                        },
                        {
                          name: 'body',
                          value: {
                            paymentFrequency: '{paymentFrequency}',
                            startDate: '2021-04-07',
                            collectionDay: {
                              $get: 'collectionDay',
                            },
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'content-type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/setUnderwriting.js Object.setUnderwriting 23:22',
              type: 'apibot.chain',
              title: 'setUnderwriting',
              config: [
                {
                  name: 'fns',
                  value: [
                    {
                      type: 'apibot.eval',
                      title: '',
                    },
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/setUnderwriting.js Object.setUnderwriting 23:65',
                      type: 'apibot.http-node',
                      title: 'setUnderwriting',
                      config: [
                        {
                          name: 'method',
                          value: 'PUT',
                        },
                        {
                          name: 'url',
                          value:
                            '{rootUrl}/quotation/api/v1/cart/{cartId}/underwriting/',
                        },
                        {
                          name: 'body',
                          value: {
                            answers: {
                              $get: 'underwritingAnswers',
                            },
                          },
                        },
                        {
                          name: 'headers',
                          value: {
                            'API-KEY': '{quotationApiKey}',
                            'Content-Type': 'application/json',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: 'assertBodyEquals',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/registerShoppingCart.js Object.registerShoppingCart 6:22',
              type: 'apibot.http-node',
              title: 'registerShoppingCart',
              config: [
                {
                  name: 'method',
                  value: 'PUT',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/cart/{cartId}/register/',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchShoppingCart.js Object.fetchShoppingCart 6:22',
              type: 'apibot.http-node',
              title: 'fetchShoppingCart',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/cart/{cartId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/scenarios/createPolicy.js createPolicy 45:151',
              type: 'apibot.extract-body',
              title: 'createPolicy',
              config: [
                {
                  name: 'extract',
                  value: '$.policyId',
                },
                {
                  name: 'as',
                  value: 'policyId',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/addPayment.js Object.addPayment 6:22',
              type: 'apibot.http-node',
              title: 'addPayment',
              config: [
                {
                  name: 'method',
                  value: 'POST',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/quotation/api/v1/cart/{cartId}/payment/{paymentType}',
                },
                {
                  name: 'body',
                  value: {
                    $get: 'paymentRequest',
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                    'Content-Type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchLightPolicy.js Object.fetchLightPolicy 6:22',
              type: 'apibot.http-node',
              title: 'fetchLightPolicy',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}/light',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id: 'TODO',
              type: 'apibot.repeat-until',
              title: 'Repeat Until',
              config: [
                {
                  name: 'repeat',
                  value: {
                    id:
                      '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchLightPolicy.js Object.fetchLightPolicy 6:22',
                    type: 'apibot.http-node',
                    title: 'fetchLightPolicy',
                    config: [
                      {
                        name: 'method',
                        value: 'GET',
                      },
                      {
                        name: 'url',
                        value:
                          '{rootUrl}/policy-administration/api/v1/policies/{policyId}/light',
                      },
                      {
                        name: 'body',
                      },
                      {
                        name: 'headers',
                        value: {
                          'x-caller': '{xCaller}',
                        },
                      },
                      {
                        name: 'queryParams',
                      },
                    ],
                  },
                },
                {
                  name: 'until',
                },
                {
                  name: 'waitMillis',
                  value: 5000,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchPolicy.js Object.fetchPolicy 6:22',
              type: 'apibot.http-node',
              title: 'fetchPolicy',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                  value: {
                    includeTax: 'false',
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'mtaChangeBonusMallusClass',
      type: 'apibot.chain',
      title: 'mtaChangeBonusMallusClass',
      config: [
        {
          name: 'fns',
          value: [
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/mtaAllowance.js Object.mtaAllowance 6:22',
              type: 'apibot.http-node',
              title: 'mtaAllowance',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/scenarios/mtaChangeBonusMallusClass.js mtaChangeBonusMallusClass 10:69',
              type: 'apibot.extract-body',
              title: 'mtaChangeBonusMallusClass',
              config: [
                {
                  name: 'extract',
                },
                {
                  name: 'as',
                  value: 'mtaDate',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/mtaQuoteHurrycanModifyRiskAnswer.js Object.mtaQuoteHurrycanModifyRiskAnswer 6:22',
              type: 'apibot.http-node',
              title: 'mtaQuoteHurrycanModifyRiskAnswer',
              config: [
                {
                  name: 'method',
                  value: 'POST',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations/quotations',
                },
                {
                  name: 'body',
                  value: {
                    start: '{mtaDate}',
                    context: {
                      MOT_DE_22: 42,
                    },
                    operationType: 'MODIFY_RISK_ANSWERS',
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                    'content-type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id: 'TODO',
              type: 'apibot.extract-response',
              title: 'Extract Response',
              config: [
                {
                  name: 'extractor',
                },
                {
                  name: 'as',
                  value: 'quotationId',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/mtaExecuteQuotation.js Object.mtaExecuteQuotation 6:22',
              type: 'apibot.http-node',
              title: 'mtaExecuteQuotation',
              config: [
                {
                  name: 'method',
                  value: 'POST',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}/operations/quotations/{quotationId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'PA_823_premiumCalculation',
      type: 'apibot.chain',
      title: 'PA_823_premiumCalculation',
      config: [
        {
          name: 'fns',
          value: [
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchInsisPolicy.js Object.fetchInsisPolicy 7:22',
              type: 'apibot.chain',
              title: 'fetchInsisPolicy',
              config: [
                {
                  name: 'fns',
                  value: [
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchLightPolicy.js Object.fetchLightPolicy 6:22',
                      type: 'apibot.http-node',
                      title: 'fetchLightPolicy',
                      config: [
                        {
                          name: 'method',
                          value: 'GET',
                        },
                        {
                          name: 'url',
                          value:
                            '{rootUrl}/policy-administration/api/v1/policies/{policyId}/light',
                        },
                        {
                          name: 'body',
                        },
                        {
                          name: 'headers',
                          value: {
                            'x-caller': '{xCaller}',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                    {
                      id:
                        '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
                      type: 'apibot.assert-status',
                      title: 'assertOk',
                      config: [
                        {
                          name: 'from',
                          value: 200,
                        },
                        {
                          name: 'to',
                          value: 299,
                        },
                      ],
                    },
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchInsisPolicy.js Object.fetchInsisPolicy 7:99',
                      type: 'apibot.extract-body',
                      title: 'fetchInsisPolicy',
                      config: [
                        {
                          name: 'extract',
                          value: '$.externalPolicyId',
                        },
                        {
                          name: 'as',
                          value: 'externalPolicyId',
                        },
                      ],
                    },
                    {
                      id:
                        '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchInsisPolicy.js Object.fetchInsisPolicy 7:181',
                      type: 'apibot.http-node',
                      title: 'fetchInsisPolicy',
                      config: [
                        {
                          name: 'method',
                          value: 'GET',
                        },
                        {
                          name: 'url',
                          value:
                            '{rootUrl}/policy-administration/api/v1/administrations/insis/policy/{externalPolicyId}',
                        },
                        {
                          name: 'body',
                        },
                        {
                          name: 'headers',
                          value: {
                            'x-caller': '{xCaller}',
                          },
                        },
                        {
                          name: 'queryParams',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchPolicy.js Object.fetchPolicy 6:22',
              type: 'apibot.http-node',
              title: 'fetchPolicy',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/policies/{policyId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                  value: {
                    includeTax: 'false',
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/fetchWindowedSnapshots.js Object.fetchWindowedSnapshots 7:22',
              type: 'apibot.http-node',
              title: 'fetchWindowedSnapshots',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/policy-administration/api/v1/commit-log/{policyId}/windowed-snapshots',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'x-caller': '{xCaller}',
                  },
                },
                {
                  name: 'queryParams',
                  value: {
                    timestamp: '2295-01-20T13:45:58.455Z',
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: '',
            },
          ],
        },
      ],
    },
    {
      id: 'addCustomer',
      type: 'apibot.http-node',
      title: 'addCustomer',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/customer/',
        },
        {
          name: 'body',
          value: {
            firstName: 'John',
            lastName: 'Doe',
            gender: 'MALE',
            birthDate: '1999-12-26',
            email: 'iptiq-test+0.r1sd4qhboyc0.28mgcneca6u@mailinator.com',
            addresses: {
              $get: 'addresses',
            },
            phoneNumbers: ['+0000000000'],
            metadata: {
              vin: '{vin}',
              plateNumber: '{plateNumber}',
            },
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'content-type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'addDirectDebit',
      type: 'apibot.http-node',
      title: 'addDirectDebit',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/quotation/api/v1/cart/{cartId}/payment/DIRECT_DEBIT',
        },
        {
          name: 'body',
          value: {
            iban: 'NL70RABO3518588532',
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'addParticipant',
      type: 'apibot.http-node',
      title: 'addParticipant',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/participants/',
        },
        {
          name: 'body',
          value: {
            $get: 'policyParticipants',
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'addPayment',
      type: 'apibot.http-node',
      title: 'addPayment',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value:
            '{rootUrl}/quotation/api/v1/cart/{cartId}/payment/{paymentType}',
        },
        {
          name: 'body',
          value: {
            $get: 'paymentRequest',
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'addThirdPartyPayment',
      type: 'apibot.http-node',
      title: 'addThirdPartyPayment',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/payment/THIRD_PARTY',
        },
        {
          name: 'body',
          value: {
            partnerPaymentGateway: 'PAYPAL',
            partnerPaymentGatewayMethod: 'UNKNOWN',
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createAstridShoppingCart',
      type: 'apibot.http-node',
      title: 'createAstridShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: '{language}',
            productId: 'HEMSAKER',
            answers: [
              {
                questionId: 'ROOMS',
                answer: '2',
              },
              {
                questionId: 'ADULTS',
                answer: '2',
              },
              {
                questionId: 'CHILDREN',
                answer: '0',
              },
              {
                questionId: 'LIVING_STANDARD',
                answer: '1',
              },
              {
                questionId: 'CITY_CH',
                answer: '1933-CH3611',
              },
              {
                questionId: 'OWNERSHIP',
                answer: '1',
              },
              {
                questionId: 'DOB_HH_CH',
                answer: '1990-12-30',
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createElftalShoppingCart',
      type: 'apibot.http-node',
      title: 'createElftalShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: 'de',
            partnerId: 'ELFTAL',
            productId: 'AFTRAP',
            answers: [
              {
                questionId: 'RD_DE_RENT_COLD',
                answer: 1,
              },
              {
                questionId: 'RD_DE_RENT_WARM',
                answer: 2,
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createHurrycanShoppingCart',
      type: 'apibot.http-node',
      title: 'createHurrycanShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: '{language}',
            partnerId: 'HURRYCAN',
            productId: 'GSMOTOR',
            answers: [
              {
                questionId: 'MOT_DE_01',
                answer: '1999-12-26',
              },
              {
                questionId: 'MOT_DE_02',
                answer: '1',
              },
              {
                questionId: 'MOT_DE_04',
                answer: '98708',
              },
              {
                questionId: 'MOT_DE_04_B',
                answer: 'Gehren',
              },
              {
                questionId: 'MOT_DE_05',
                answer: 1997,
              },
              {
                questionId: 'MOT_DE_06',
                answer: '1997-11-11',
              },
              {
                questionId: 'MOT_DE_07',
                answer: '1998-10-10',
              },
              {
                questionId: 'MOT_DE_08',
                answer: '4136',
              },
              {
                questionId: 'MOT_DE_09',
                answer: 'ALM',
              },
              {
                questionId: 'MOT_DE_19',
                answer: '05',
              },
              {
                questionId: 'SF_CLASS_MTPL',
                answer: '10',
              },
              {
                questionId: 'SF_CLASS_MOD',
                answer: '10',
              },
              {
                questionId: 'MOT_DE_26',
                answer: '0',
              },
              {
                questionId: 'MOT_DE_28',
                answer: '1',
              },
              {
                questionId: 'MOT_DE_24',
                answer: '1',
              },
              {
                questionId: 'MOT_DE_34',
                answer: '0',
              },
              {
                questionId: 'MOT_DE_30',
                answer: '1',
              },
              {
                questionId: 'MOT_DE_20_B',
                answer: '1',
              },
              {
                questionId: 'MOT_DE_03',
                answer: '1995-12-12',
              },
              {
                questionId: 'MOT_DE_27',
                answer: 2010,
              },
              {
                questionId: 'MOT_DE_35',
                answer: '0',
              },
              {
                questionId: 'MOT_DE_36_B',
                answer: '1',
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createImmosScoutShoppingCart',
      type: 'apibot.http-node',
      title: 'createImmosScoutShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: 'de',
            partnerId: 'PATHFINDER',
            productId: 'MIETAUSFALL',
            answers: [
              {
                questionId: 'RD_DE_RENT_COLD',
                answer: 1,
              },
              {
                questionId: 'RD_DE_RENT_WARM',
                answer: 2,
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createOranjeShoppingCart',
      type: 'apibot.http-node',
      title: 'createOranjeShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: 'nl',
            partnerId: 'ORANJE',
            productId: 'MDI',
            answers: [
              {
                questionId: 'MOT_NL_BEGIN',
                answer: '2021-04-07 12:45:58',
              },
              {
                questionId: 'MOT_NL_END',
                answer: '2021-04-16 12:45:58',
              },
              {
                questionId: 'MOT_NL_PLATE',
                answer: '{plateNumber}',
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'createShoppingCart',
      type: 'apibot.http-node',
      title: 'createShoppingCart',
      config: [
        {
          name: 'method',
          value: 'POST',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/',
        },
        {
          name: 'body',
          value: {
            language: '{language}',
            partnerId: '{partnerId}',
            productId: '{productId}',
            answers: {
              $get: 'riskAnswers',
            },
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'X-Caller': 'internal',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'fetchRiskQuestion',
      type: 'apibot.chain',
      title: 'fetchRiskQuestion',
      config: [
        {
          name: 'fns',
          value: [
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchRiskQuestion.js fetchRiskQuestion 25:38',
              type: 'apibot.http-node',
              title: 'fetchRiskQuestion',
              config: [
                {
                  name: 'method',
                  value: 'GET',
                },
                {
                  name: 'url',
                  value: '{rootUrl}/quotation/api/v1/risk/{productId}',
                },
                {
                  name: 'body',
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                  },
                },
                {
                  name: 'queryParams',
                  value: {
                    language: '{language}',
                  },
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/personal/apibot/runtime/build/nodes/assertions.js Object.assertOk 6:12',
              type: 'apibot.assert-status',
              title: 'assertOk',
              config: [
                {
                  name: 'from',
                  value: 200,
                },
                {
                  name: 'to',
                  value: 299,
                },
              ],
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/fetchRiskQuestion.js fetchRiskQuestion 30:41',
              type: 'apibot.extract-body',
              title: 'fetchRiskQuestion',
              config: [
                {
                  name: 'extract',
                  value: '$',
                },
                {
                  name: 'as',
                  value: 'riskQuestions',
                },
              ],
            },
            {
              type: 'apibot.eval',
              title: '',
            },
          ],
        },
      ],
    },
    {
      id: 'fetchShoppingCart',
      type: 'apibot.http-node',
      title: 'fetchShoppingCart',
      config: [
        {
          name: 'method',
          value: 'GET',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'registerShoppingCart',
      type: 'apibot.http-node',
      title: 'registerShoppingCart',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/register/',
        },
        {
          name: 'body',
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'setContractTerms',
      type: 'apibot.http-node',
      title: 'setContractTerms',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/contractTerms/',
        },
        {
          name: 'body',
          value: {
            paymentFrequency: '{paymentFrequency}',
            startDate: '2021-04-07',
            collectionDay: {
              $get: 'collectionDay',
            },
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'content-type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'setOranjeContractTerms',
      type: 'apibot.http-node',
      title: 'setOranjeContractTerms',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/contractTerms/',
        },
        {
          name: 'body',
          value: {
            paymentFrequency: '{paymentFrequency}',
            startDate: '2021-04-07',
            endDate: '2021-04-16',
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'content-type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'setQuote',
      type: 'apibot.http-node',
      title: 'setQuote',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/quote/',
        },
        {
          name: 'body',
          value: {
            brickRefinements: [
              {
                id: '266_267',
                deductible: '15000',
              },
              {
                id: '268',
                selected: false,
                coverageRefinements: [
                  {
                    id: 'P_FULL_MOD',
                    deductible: '15000',
                    selected: true,
                  },
                ],
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'setUnderwriting',
      type: 'apibot.chain',
      title: 'setUnderwriting',
      config: [
        {
          name: 'fns',
          value: [
            {
              type: 'apibot.eval',
              title: '',
            },
            {
              id:
                '/Users/fernandohur/iptiq/iptiq-policy-admin-tester/build/endpoints/quotation/setUnderwriting.js setUnderwriting 23:65',
              type: 'apibot.http-node',
              title: 'setUnderwriting',
              config: [
                {
                  name: 'method',
                  value: 'PUT',
                },
                {
                  name: 'url',
                  value:
                    '{rootUrl}/quotation/api/v1/cart/{cartId}/underwriting/',
                },
                {
                  name: 'body',
                  value: {
                    answers: {
                      $get: 'underwritingAnswers',
                    },
                  },
                },
                {
                  name: 'headers',
                  value: {
                    'API-KEY': '{quotationApiKey}',
                    'Content-Type': 'application/json',
                  },
                },
                {
                  name: 'queryParams',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'addCustomer',
      type: 'apibot.http-node',
      title: 'addCustomer',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/customer/',
        },
        {
          name: 'body',
          value: {
            firstName: 'John',
            lastName: 'Doe',
            gender: 'MALE',
            birthDate: '1999-12-26',
            email: 'iptiqtest_johndoe@iptiq.com',
            addresses: [
              {
                type: 'DOMICILE',
                city: 'Gehren',
                countryCode: 'DE',
                streetName: 'Bahnhofstrasse',
                streetNumber: '12',
                zipCode: '98708',
              },
              {
                type: 'POLICY',
                city: 'Gehren',
                countryCode: 'DE',
                streetName: 'Bahnhofstrasse',
                streetNumber: '12',
                zipCode: '98708',
              },
            ],
            phoneNumbers: ['+0000000000'],
            metadata: {},
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'content-type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
    {
      id: 'setUnderwriting',
      type: 'apibot.http-node',
      title: 'setUnderwriting',
      config: [
        {
          name: 'method',
          value: 'PUT',
        },
        {
          name: 'url',
          value: '{rootUrl}/quotation/api/v1/cart/{cartId}/underwriting/',
        },
        {
          name: 'body',
          value: {
            answers: [
              {
                questionId: 'RD_DE_CREDIT',
                answer: '1',
              },
            ],
          },
        },
        {
          name: 'headers',
          value: {
            'API-KEY': '{quotationApiKey}',
            'Content-Type': 'application/json',
          },
        },
        {
          name: 'queryParams',
        },
      ],
    },
  ].sort((a: any, b: any) => Nodes.compare(a, b)) as any,
});

export const $searchResultNodes = selector({
  key: 'searchResultNodes',
  get: ({ get }) => {
    const _searchQuery = get($searchQuery).trim().toLowerCase();
    const _nodes = get($nodes);
    const filtered = _nodes.filter((n) => {
      return (n.title || '').toLowerCase().includes(_searchQuery);
    });
    return filtered;
  },
});

export const $selectedEnvironmentId = atom<string | undefined>({
  key: 'selectedEnvironmentId',
  default: 'dint',
});

export const $environments = selector<string[]>({
  key: 'environments',
  get: ({ get }) => {
    const currentConfig = get($currentConfig);
    return Object.keys(currentConfig.envs);
  },
});
