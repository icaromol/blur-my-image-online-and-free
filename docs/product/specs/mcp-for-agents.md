# Spec outline: an MCP server for Blur My Image and its sister tools

**Status: spec outline only. Nothing is implemented.** There is no MCP server or package to install, no domain for it and no release date. This page lists the questions the spec has to answer before anything is built.

## What this is

An MCP (Model Context Protocol) server lets an AI assistant or agent call a tool on its own, without a person in a browser. The plan is an MCP for Blur My Image that agents can find and call to blur or pixelate an image, and one for each tool the maintainer plans to launch next to it (a cut tool, a background remover, and so on). The same architecture and rules should hold for all of them.

## Where it stands

- **Only this outline exists.** Whether the first delivery is the spec alone or the spec and a prototype is still open ([Q-028](../decisions.md)); until it is decided, the first delivery is only the spec.
- **Nothing to use yet.** No server, no package, no domain: buying a domain for `mcp.<domain>` is an open question ([Q-027](../decisions.md)), and a local package would need none.
- **The web app's privacy promise does not cover the MCP.** "Image files you open, drop or paste never leave your device" is about the web app. A remote MCP server would receive the image, so the MCP gets its own privacy statement (question 2 below) before anything about its privacy is claimed.
- **The direction is decided, the scope is not.** The maintainer set the direction on 2026-11-22 ([D-037](../decisions.md)); the six questions below are open, each one an `Idea` in epic E10 of the [backlog](../backlog.md).

## Open questions

1. Architecture: a remote server, a local package or both; which tools; the input; the limits (BMI-139).
2. A privacy statement for the MCP, separate from the web app's (BMI-140).
3. Hosting and cost (BMI-141).
4. The domain (Q-027).
5. How agents and directories find an MCP (BMI-142).
6. A measurable meaning for "the best MCP for agents" (BMI-143).

Plus the first delivery (Q-028). Each is detailed in "Questions the spec answers" below. `BMI-###` items are in [`backlog.md`](../backlog.md); `D-###` decisions and `Q-###` open questions are in [`decisions.md`](../decisions.md).

## Direction, in the maintainer's words

"We have to have mcp.blurmyimage.com", and the same for each micro-SaaS (a cut tool, a pixelate tool, a background remover, and so on): "this is where the value lives". Each tool is to be established on the web with SEO and GEO/AEO as the free, global MCP that works best for agents. Several separate tools are planned, so the spec holds for the family and not only for blur.

## Problem

Agents (assistants that call tools) need a tool that blurs, pixelates or edits an image and that they can find, trust and call without a person in the loop. Today the product is a web app whose promise is that image files never leave the device. An MCP server changes the shape of that: a remote one receives the image on a server.

## Goals

- One architecture and one set of rules that fit every tool of the family.
- An honest privacy statement for the MCP surface, separate from the web app's.
- A measurable meaning for "the best for agents".
- A plan for being found: how agents and directories discover an MCP.

## Non-goals (for this spec)

Building anything; buying a domain; changing the web app; making any claim about the MCP in the README, or on the landing beyond the one card below, before the privacy statement exists.

**The landing's MCP card (D-043).** The maintainer asked for it: section 4 of the landing, "Use it your way", has a card for the MCP, visible now and marked as in development. Until the MCP's own privacy statement exists (BMI-140), the card may carry the maintainer's line "by design, from devs to devs" and say only that the MCP is in development and not available yet and that the page's privacy notes cover the web app only, with a link to this spec (to the MCP's own page once it exists, Q-027). It states no tool, input type, date or privacy rule for the MCP, and nothing of the MCP's promise mixes with the web app's (D-037). When the link moves to the MCP's page, the card is checked again against that statement. The rule is row 77 of `docs/marketing/landing/claims-check.md`. This exception came with the decision on the card (D-043); it adds nothing to the MCP's scope.

## Questions the spec answers (one item each)

1. **Architecture (BMI-139).** A remote MCP server over HTTP, a local package run by the agent's host over stdio (for example through `npx`), or both. Which tools it exposes (blur, pixelate, and what the family adds), whether the input is a URL or a file or both, the size and rate limits. A local package never sends the image anywhere; a remote server must. The MCP protocol itself has not been researched for this outline: the spec's author reads its current specification and the host documentation first and cites them.
2. **Privacy model (BMI-140).** The web app says "image files you open, drop or paste never leave your device". A remote MCP receives the image on a server, so the spec needs its own declaration for that surface, or a local-first design that avoids it. Nothing in the README or on the landing may mix the two promises; the claims table (`docs/marketing/landing/claims-check.md`) gets the rule. The declaration says what the server does with the image, how long anything lives, what the host logs (the proxy's rule already is: it keeps no copy of the image, and the host's log keeps the path, the IP and the user agent for an hour), and what an agent's own host may keep.
3. **Hosting and cost (BMI-141).** Facts in the repository (the [README](../../../README.md)'s stack table and [`docs/hosting.md`](../../hosting.md), where the web app fits the plan's non-commercial rule today): the Vercel Hobby plan is for "your personal or non-commercial use" (the Terms, section 4) and has a 4.5 MB limit on request bodies (and non-streamed responses); the WAF rule on the image proxy allows 30 requests per 60 seconds per IP, and agents behind one host share an IP. The spec evaluates what changes: image upload by body against by URL, streaming, the rate limit per caller instead of per IP, and a plan or a host that allows what the family needs.
4. **Domain (Q-027).** `mcp.<domain>` needs a domain, and buying one is the maintainer's decision. The spec raises the question and decides nothing. A local package needs no domain.
5. **Discovery by agents (BMI-142).** Research with sources, not memory: `llms.txt`, structured data, listing in MCP registries, how the tools are described, and how agents choose among MCP servers. Nothing is stated as a standard unless the research confirms it.
6. **"Best for agents", measurably (BMI-143).** A success criterion that can be measured: a set of evaluation tasks, the time to a result, the success rate, the cost per call, and how the numbers are collected without recording users' images. An adjective is not a criterion.

## First delivery

Open (Q-028): only the spec, or the spec and a prototype. For now: only the spec.
