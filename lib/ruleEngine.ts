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
  const astRules = rules.map((r) => createRule(r));

  if (astRules.length === 1) return astRules[0];

  // Start combining the rules into a binary tree
  const combined: Node = {
    type: "operator",
    value: "AND",
    left: astRules[0],
    right: undefined,
  };

  let current = combined; // Pointer to the current node

  // Iterate through the remaining rules
  for (let i = 1; i < astRules.length; i++) {
    const newNode: Node = {
      type: "operator",
      value: "AND", // You can change this to 'OR' if needed
      left: current, // Current combined node becomes the left child
      right: astRules[i], // The next rule becomes the right child
    };

    current = newNode; // Move the pointer to the new node
  }

  return current; // Return the final combined AST
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


