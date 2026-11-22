import { describe, expect, it } from "vitest";
import {
  DEV_ALLOWED,
  isAllowed,
  PROD_ALLOWED,
  violations,
  // @ts-expect-error plain .mjs, without type declarations
} from "./scripts/spdx-allowed.mjs";

const allowed = new Set(["MIT", "Apache-2.0", "ISC"]);
const accepts = (expression: string) => isAllowed(expression, allowed);

describe("isAllowed", () => {
  it("accepts and rejects single identifiers", () => {
    expect(accepts("MIT")).toBe(true);
    expect(accepts("GPL-3.0-only")).toBe(false);
    expect(accepts("Apache-2.0+")).toBe(false);
  });

  it("fails closed on an identifier that is not on the SPDX list", () => {
    expect(() => accepts("Unknown")).toThrow(/Invalid license expression/);
    expect(() => accepts("MIT*")).toThrow(/Invalid license expression/);
  });

  it("needs one allowed side for OR", () => {
    expect(accepts("MIT OR GPL-3.0-only")).toBe(true);
    expect(accepts("GPL-3.0-only OR MIT")).toBe(true);
    expect(accepts("GPL-3.0-only OR AGPL-3.0-only")).toBe(false);
  });

  it("needs both sides allowed for AND", () => {
    expect(accepts("MIT AND Apache-2.0")).toBe(true);
    expect(accepts("MIT AND GPL-3.0-only")).toBe(false);
    expect(accepts("GPL-3.0-only AND MIT")).toBe(false);
  });

  it("binds AND tighter than OR", () => {
    expect(accepts("MIT OR GPL-3.0-only AND AGPL-3.0-only")).toBe(true);
    expect(accepts("GPL-3.0-only AND AGPL-3.0-only OR MIT")).toBe(true);
    expect(accepts("GPL-3.0-only OR MIT AND AGPL-3.0-only")).toBe(false);
  });

  it("keeps the grouping of parentheses", () => {
    expect(accepts("(MIT OR Apache-2.0) AND GPL-3.0-only")).toBe(false);
    expect(accepts("(MIT OR GPL-3.0-only) AND Apache-2.0")).toBe(true);
    expect(accepts("MIT AND (Apache-2.0 OR GPL-3.0-only)")).toBe(true);
    expect(accepts("MIT AND (GPL-3.0-only OR AGPL-3.0-only)")).toBe(false);
  });

  it("handles nested parentheses", () => {
    expect(accepts("((MIT))")).toBe(true);
    expect(accepts("(MIT AND (ISC OR GPL-3.0-only)) OR AGPL-3.0-only")).toBe(
      true,
    );
    expect(
      accepts("(MIT AND (GPL-3.0-only OR AGPL-3.0-only)) OR LGPL-3.0"),
    ).toBe(false);
    expect(accepts("MIT AND ((ISC AND GPL-3.0-only) OR Apache-2.0)")).toBe(
      true,
    );
    expect(accepts("MIT AND ((ISC AND GPL-3.0-only) OR AGPL-3.0-only)")).toBe(
      false,
    );
  });

  it("tolerates extra whitespace and tight parentheses", () => {
    expect(accepts("  (MIT   OR  GPL-3.0-only)  ")).toBe(true);
    expect(accepts("(MIT)AND(GPL-3.0-only)")).toBe(false);
  });

  it("treats WITH as the base license", () => {
    expect(accepts("MIT WITH Classpath-exception-2.0")).toBe(true);
    expect(accepts("GPL-2.0-only WITH Classpath-exception-2.0")).toBe(false);
    expect(
      accepts("(GPL-2.0-only WITH Classpath-exception-2.0) OR Apache-2.0"),
    ).toBe(true);
  });

  it("reads lowercase operators with the same grouping and precedence", () => {
    expect(accepts("MIT or GPL-3.0-only")).toBe(true);
    expect(accepts("MIT and GPL-3.0-only")).toBe(false);
    expect(accepts("(MIT or Apache-2.0) and GPL-3.0-only")).toBe(false);
    expect(accepts("GPL-2.0-only with Classpath-exception-2.0")).toBe(false);
  });

  it.each([
    ["(MIT OR Apache-2.0", /Expected `\)`/],
    ["MIT OR Apache-2.0)", /Syntax error/],
    ["((MIT)", /Expected `\)`/],
    ["", /Invalid license expression/],
    ["()", /Invalid license expression/],
    ["MIT AND", /Invalid license expression/],
    ["OR MIT", /Invalid license expression/],
    ["MIT OR OR ISC", /Expected expression/],
    ["MIT WITH", /Expected exception after `WITH`/],
    ["MIT WITH )", /Expected exception after `WITH`/],
    ["MIT WITH OR", /Expected exception after `WITH`/],
    ["MIT WITH WITH X", /Invalid license expression/],
    ["WITH", /Syntax error/],
    ["MIT ISC", /Syntax error/],
  ])("fails closed on the malformed expression %j", (expression, message) => {
    expect(() => accepts(expression)).toThrow(SyntaxError);
    expect(() => accepts(expression)).toThrow(message);
  });

  it("names the expression in the error", () => {
    expect(() => accepts("(MIT")).toThrow('expression "(MIT"');
  });

  it("rejects a malformed expression even when an allowed side comes first", () => {
    expect(() => accepts("MIT OR (GPL-3.0-only")).toThrow(SyntaxError);
  });
});

describe("allowlists", () => {
  const ccBy = (name: string) => ({
    "CC-BY-3.0": [{ name, versions: ["1.0.0"] }],
  });

  it("does not accept CC-BY-3.0 in production", () => {
    expect(isAllowed("CC-BY-3.0", PROD_ALLOWED)).toBe(false);
    expect(isAllowed("MIT AND CC-BY-3.0", PROD_ALLOWED)).toBe(false);
  });

  it("accepts CC-BY-3.0 in dev tooling", () => {
    expect(isAllowed("CC-BY-3.0", DEV_ALLOWED)).toBe(true);
  });

  it("fails a production package under CC-BY-3.0", () => {
    expect(violations(ccBy("shipped"), PROD_ALLOWED)).toEqual([
      "shipped@1.0.0  CC-BY-3.0",
    ]);
  });

  it("passes a dev package under CC-BY-3.0", () => {
    expect(violations(ccBy("tooling"), DEV_ALLOWED)).toEqual([]);
  });

  it("reports a malformed license with its package", () => {
    expect(
      violations(
        { "(MIT": [{ name: "odd", versions: ["2.0.0"] }] },
        DEV_ALLOWED,
      ),
    ).toEqual([
      expect.stringMatching(
        /^odd@2\.0\.0 {2}\(MIT {2}\(Invalid license expression/,
      ),
    ]);
  });

  it("keeps MPL-2.0 out of production", () => {
    expect(isAllowed("MPL-2.0", PROD_ALLOWED)).toBe(false);
    expect(isAllowed("MPL-2.0", DEV_ALLOWED)).toBe(true);
  });
});
