const OPERATORS = new Set(["(", ")", "AND", "OR", "WITH"]);

// SPDX expressions: AND binds tighter than OR, parentheses group, operators are uppercase.
// `X WITH exception` counts as X. An expression passes when the whole of it is allowed;
// a malformed one throws, so the check fails closed.
export function isAllowed(expression, allowed) {
  const tokens = expression.match(/[()]|[^\s()]+/g) ?? [];
  let position = 0;

  const fail = (message) => {
    throw new SyntaxError(`${message} in "${expression}"`);
  };
  const accept = (token) => tokens[position] === token && ++position > 0;
  const identifier = (message) => {
    const token = tokens[position];
    if (token === undefined || OPERATORS.has(token)) fail(message);
    position++;
    return token;
  };

  function parseOr() {
    let result = parseAnd();
    while (accept("OR")) result = parseAnd() || result;
    return result;
  }

  function parseAnd() {
    let result = parseTerm();
    while (accept("AND")) result = parseTerm() && result;
    return result;
  }

  function parseTerm() {
    if (accept("(")) {
      const result = parseOr();
      if (!accept(")")) fail("Unbalanced parenthesis");
      return result;
    }
    const id = identifier("Expected a license");
    if (accept("WITH")) identifier("Expected an exception after WITH");
    return allowed.has(id);
  }

  const result = parseOr();
  if (position < tokens.length) fail(`Unexpected "${tokens[position]}"`);
  return result;
}
