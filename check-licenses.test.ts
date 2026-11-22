import { describe, expect, it } from "vitest";
// @ts-expect-error the script is plain .mjs, without type declarations
import { isAllowed } from "./scripts/spdx-allowed.mjs";

const allowed = new Set(["MIT", "Apache-2.0", "ISC"]);
const accepts = (expression: string) => isAllowed(expression, allowed);

describe("isAllowed", () => {
  it("accepts and rejects single identifiers", () => {
    expect(accepts("MIT")).toBe(true);
    expect(accepts("GPL-3.0-only")).toBe(false);
    expect(accepts("Unknown")).toBe(false);
    expect(accepts("Apache-2.0+")).toBe(false);
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

  it("requires uppercase operators", () => {
    expect(() => accepts("MIT or Apache-2.0")).toThrow(SyntaxError);
    expect(() => accepts("MIT and GPL-3.0-only")).toThrow(SyntaxError);
    expect(() => accepts("MIT with Classpath-exception-2.0")).toThrow(
      SyntaxError,
    );
  });

  it.each([
    ["(MIT OR Apache-2.0", /Unbalanced parenthesis/],
    ["MIT OR Apache-2.0)", /Unexpected "\)"/],
    ["((MIT)", /Unbalanced parenthesis/],
    ["", /Expected a license/],
    ["()", /Expected a license/],
    ["MIT AND", /Expected a license/],
    ["OR MIT", /Expected a license/],
    ["MIT OR OR ISC", /Expected a license/],
    ["MIT WITH", /Expected an exception after WITH/],
    ["MIT WITH )", /Expected an exception after WITH/],
    ["MIT WITH OR", /Expected an exception after WITH/],
    ["MIT WITH WITH X", /Expected an exception after WITH/],
    ["WITH", /Expected a license/],
    ["MIT ISC", /Unexpected "ISC"/],
  ])("fails closed on the malformed expression %j", (expression, message) => {
    expect(() => accepts(expression)).toThrow(SyntaxError);
    expect(() => accepts(expression)).toThrow(message);
  });

  it("names the expression in the error", () => {
    expect(() => accepts("(MIT")).toThrow('in "(MIT"');
  });

  it("rejects a malformed expression even when an allowed side comes first", () => {
    expect(() => accepts("MIT OR (GPL-3.0-only")).toThrow(SyntaxError);
  });
});
