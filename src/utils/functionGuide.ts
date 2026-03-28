export interface ParamGuide {
  readonly funcName: string
  readonly params: readonly string[]
  readonly separator: string
}

const MULTI_PARAM_FUNCTIONS: Record<string, ParamGuide> = {
  'nCr(': { funcName: 'nCr', params: ['n', 'r'], separator: ',' },
  'nPr(': { funcName: 'nPr', params: ['n', 'r'], separator: ',' },
  'gcd(': { funcName: 'gcd', params: ['a', 'b'], separator: ',' },
  'lcm(': { funcName: 'lcm', params: ['a', 'b'], separator: ',' },
  'mod(': { funcName: 'mod', params: ['a', 'b'], separator: ',' },
}

export function getParamGuide(value: string): ParamGuide | undefined {
  return MULTI_PARAM_FUNCTIONS[value]
}

export function isMultiParamFunction(value: string): boolean {
  return value in MULTI_PARAM_FUNCTIONS
}

export interface GuideState {
  funcName: string
  params: readonly string[]
  currentParamIndex: number
  values: string[]
}

export function createGuideState(guide: ParamGuide): GuideState {
  return {
    funcName: guide.funcName,
    params: guide.params,
    currentParamIndex: 0,
    values: guide.params.map(() => ''),
  }
}

export function formatGuideExpression(state: GuideState): string {
  const parts = state.params.map((param, i) => {
    if (state.values[i]) return state.values[i]
    if (i === state.currentParamIndex) return `▸${param}`
    return param
  })
  return `${state.funcName}(${parts.join(',')})`
}

export function formatGuideHint(state: GuideState): string {
  const paramName = state.params[state.currentParamIndex]
  const paramIndex = state.currentParamIndex + 1
  const total = state.params.length
  return `${paramIndex}/${total}: ${paramName} degerini girin, sonra virgul veya = basin`
}
