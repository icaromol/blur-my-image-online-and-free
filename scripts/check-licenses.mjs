// Fails when an installed dependency has a license outside the allowlist.
// Shipped (prod) dependencies must be permissive; dev tooling may also use MPL-2.0.
import { spawnSync } from "node:child_process";

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
const PROD_ALLOWED = new Set(PERMISSIVE);
const DEV_ALLOWED = new Set([...PERMISSIVE, "MPL-2.0"]);

// An SPDX expression passes when one OR alternative has every AND term allowed.
function isAllowed(expression, allowed) {
  const stripped = expression.replace(/[()]/g, " ");
  return stripped
    .split(/\s+OR\s+/i)
    .some((alternative) =>
      alternative.split(/\s+AND\s+/i).every((id) => allowed.has(id.trim())),
    );
}

function listLicenses(scopeFlags) {
  const result = spawnSync(
    "pnpm",
    ["licenses", "list", "--json", ...scopeFlags],
    {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (result.status !== 0) {
    console.error(result.stderr || result.error);
    process.exit(2);
  }
  // Shape: { "<license>": [{ name, versions, ... }] }
  return JSON.parse(result.stdout);
}

function violations(byLicense, allowed) {
  return Object.entries(byLicense)
    .filter(([license]) => !isAllowed(license, allowed))
    .flatMap(([license, packages]) =>
      packages.map((p) => `${p.name}@${p.versions.join(",")}  ${license}`),
    );
}

const prodLicenses = listLicenses(["--prod"]);
const allLicenses = listLicenses([]);

const failures = [
  ...violations(prodLicenses, PROD_ALLOWED).map((v) => `prod: ${v}`),
  ...violations(allLicenses, DEV_ALLOWED).map((v) => `any:  ${v}`),
];

if (failures.length > 0) {
  console.error(`License check failed:\n${[...new Set(failures)].join("\n")}`);
  process.exit(1);
}
const count = (o) => Object.values(o).reduce((n, list) => n + list.length, 0);
console.log(
  `License check passed: ${count(prodLicenses)} prod and ${count(allLicenses)} total packages.`,
);
