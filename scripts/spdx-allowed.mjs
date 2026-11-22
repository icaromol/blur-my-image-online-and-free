import parse from "spdx-expression-parse";

const PERMISSIVE = [
  "0BSD",
  "Apache-2.0",
  "BlueOak-1.0.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "CC0-1.0",
  "ISC",
  "MIT",
  "Unlicense",
];
export const PROD_ALLOWED = new Set(PERMISSIVE);
// spdx-expression-parse pulls in spdx-exceptions (CC-BY-3.0, data only); dev tooling only.
export const DEV_ALLOWED = new Set([...PERMISSIVE, "MPL-2.0", "CC-BY-3.0"]);

// An expression passes when the whole of it is allowed: OR needs one allowed side, AND
// needs both. `X WITH exception` counts as X. A malformed or unknown expression makes
// the parser throw, so the check fails closed.
export function isAllowed(expression, allowed) {
  const allows = (node) => {
    if (node.conjunction === "and")
      return allows(node.left) && allows(node.right);
    if (node.conjunction === "or")
      return allows(node.left) || allows(node.right);
    return !node.plus && allowed.has(node.license);
  };
  let tree;
  try {
    tree = parse(expression);
  } catch (error) {
    throw new SyntaxError(
      `Invalid license expression "${expression}" (${error.message})`,
    );
  }
  return allows(tree);
}

function problem(license, allowed) {
  try {
    return isAllowed(license, allowed) ? null : license;
  } catch (error) {
    return `${license}  (${error.message})`;
  }
}

export function violations(byLicense, allowed) {
  return Object.entries(byLicense).flatMap(([license, packages]) => {
    const reason = problem(license, allowed);
    return reason
      ? packages.map((p) => `${p.name}@${p.versions.join(",")}  ${reason}`)
      : [];
  });
}
