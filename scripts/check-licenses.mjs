// Fails when an installed dependency has a license outside the allowlist.
// Shipped (prod) dependencies must be permissive; dev tooling may also use MPL-2.0 and CC-BY-3.0 (see spdx-allowed.mjs).
import { spawnSync } from "node:child_process";
import { DEV_ALLOWED, PROD_ALLOWED, violations } from "./spdx-allowed.mjs";

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
