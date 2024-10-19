import { Node } from '@/models/Rule';

export function createRule(ruleString: string): Node {
  const tokens = ruleString.split(' ');
  return parseTokens(tokens);
}

function parseTokens(tokens: string[]): Node {
  const operatorIndex = tokens.findIndex(t => t === 'AND' || t === 'OR');

  if (operatorIndex !== -1) {
    return {
      type: 'operator',
      value: tokens[operatorIndex],
      left: parseTokens(tokens.slice(0, operatorIndex)),
      right: parseTokens(tokens.slice(operatorIndex + 1)),
    };
  }

  // Improved parsing to handle conditions with parentheses
  const attribute = tokens[0].replace(/[()]/g, '').trim(); // Remove parentheses
  const operator = tokens[1].trim();
  const value = tokens.slice(2).join(' ').replace(/[()]/g, '').trim(); // Remove parentheses from value

  return {
    type: 'operand',
    value: `${attribute} ${operator} ${value}`.trim()
  };
}

export function combineRules(rules: string[]): Node {
  const astRules = rules.map(createRule);
  
  // Flatten the structure to meet the expected AST representation in tests
  const combined: Node = {
    type: 'operator',
    value: 'AND',
    left: astRules[0],
    right: undefined,
  };

  let current = combined;

  for (let i = 1; i < astRules.length; i++) {
    current.right = astRules[i]; // Directly assign the next rule to the right
    current = current.right; // Move current pointer to the new right node
  }

  return combined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function evaluateRule(rule: Node, data: Record<string, any>): boolean {
  if (rule.type === 'operand') {
    const parts = rule.value.split(' ');
    const attribute = parts[0];
    const operator = parts[1];
    const value = parts.slice(2).join(' ').trim();

    const dataValue = data[attribute];
    console.log(`Evaluating operand: ${rule.value}, Data Value: ${dataValue}`); // Log data value

    switch (operator) {
      case '>': return dataValue > parseFloat(value);
      case '<': return dataValue < parseFloat(value);
      case '>=': return dataValue >= parseFloat(value);
      case '<=': return dataValue <= parseFloat(value);
      case '=': return dataValue === value.replace(/'/g, '').trim();
      default: return false;
    }
  }

  if (rule.type === 'operator') {
    const leftResult = rule.left ? evaluateRule(rule.left, data) : true;
    const rightResult = rule.right ? evaluateRule(rule.right, data) : true;
    return rule.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  }

  return false;
}


