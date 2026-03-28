export interface ParamGuide {
  readonly funcName: string
  readonly params: readonly string[]
  readonly separator: string
}

const GUIDED_FUNCTIONS: Record<string, ParamGuide> = {
  // Tek parametreli
  'sin(': { funcName: 'sin', params: ['aci'], separator: ',' },
  'cos(': { funcName: 'cos', params: ['aci'], separator: ',' },
  'tan(': { funcName: 'tan', params: ['aci'], separator: ',' },
  'arcsin(': { funcName: 'arcsin', params: ['deger'], separator: ',' },
  'arccos(': { funcName: 'arccos', params: ['deger'], separator: ',' },
  'arctan(': { funcName: 'arctan', params: ['deger'], separator: ',' },
  'sinh(': { funcName: 'sinh', params: ['x'], separator: ',' },
  'cosh(': { funcName: 'cosh', params: ['x'], separator: ',' },
  'tanh(': { funcName: 'tanh', params: ['x'], separator: ',' },
  'log10(': { funcName: 'log10', params: ['x'], separator: ',' },
  'ln(': { funcName: 'ln', params: ['x'], separator: ',' },
  '√(': { funcName: '√', params: ['x'], separator: ',' },
  '∛(': { funcName: '∛', params: ['x'], separator: ',' },
  'abs(': { funcName: 'abs', params: ['x'], separator: ',' },
  'isPrime(': { funcName: 'isPrime', params: ['n'], separator: ',' },
  'round(': { funcName: 'round', params: ['x'], separator: ',' },
  'ceil(': { funcName: 'ceil', params: ['x'], separator: ',' },
  'floor(': { funcName: 'floor', params: ['x'], separator: ',' },
  // Cift parametreli
  'nCr(': { funcName: 'nCr', params: ['n', 'r'], separator: ',' },
  'nPr(': { funcName: 'nPr', params: ['n', 'r'], separator: ',' },
  'gcd(': { funcName: 'gcd', params: ['a', 'b'], separator: ',' },
  'lcm(': { funcName: 'lcm', params: ['a', 'b'], separator: ',' },
  'mod(': { funcName: 'mod', params: ['a', 'b'], separator: ',' },
}

export function getParamGuide(value: string): ParamGuide | undefined {
  return GUIDED_FUNCTIONS[value]
}

export function isGuidedFunction(value: string): boolean {
  return value in GUIDED_FUNCTIONS
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

  if (total === 1) {
    return `${paramName} degerini girin, sonra = basin`
  }
  return `${paramIndex}/${total}: ${paramName} degerini girin, sonra virgul veya = basin`
}
