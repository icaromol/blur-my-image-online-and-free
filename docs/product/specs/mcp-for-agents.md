# Spec (outline): an MCP for the tool family, found and chosen by agents

Status: **direction decided, scope not closed** (D-037, from Ícaro, relayed by `-aa`, 2026-11-22). Only this outline exists. Nothing is implemented, no domain is bought and no pull request is touched. This file lists what the spec has to answer; each section becomes a backlog item (E10, all `Idea`).

## Direction, in his words

"We have to have mcp.blurmyimage.com", and the same for each micro-SaaS (a cut tool, a pixelate tool, a background remover, and so on): "this is where the value lives". Each tool is to be established on the web with SEO and GEO/AEO as the free, global MCP that works best for agents. He also plans to launch several separate tools (a map is in `.local/tool-sites/`, git-ignored; PM has not read it), so the spec holds for the family and not only for blur.

## Problem

Agents (assistants that call tools) need a tool that blurs, pixelates or edits an image and that they can find, trust and call without a person in the loop. Today the product is a web app whose promise is that image files never leave the device. An MCP server changes the shape of that: a remote one receives the image on a server.

## Goals

- One architecture and one set of rules that fit every tool of the family.
- An honest privacy statement for the MCP surface, separate from the web app's.
- A measurable meaning for "the best for agents".
- A plan for being found: how agents and directories discover an MCP.

## Non-goals (for this spec)

Building anything; buying a domain; changing the web app; making any claim in the README or on the landing about the MCP before the privacy statement exists.

## Questions the spec answers (one item each)

1. **Architecture (BMI-139).** A remote MCP server over HTTP, a local package run by the agent's host over stdio (for example through `npx`), or both. Which tools it exposes (blur, pixelate, and what the family adds), whether the input is a URL or a file or both, the size and rate limits. A local package never sends the image anywhere; a remote server must. PM has not researched the MCP protocol itself: the spec's author reads its current specification and the host documentation first and cites them.
2. **Privacy model (BMI-140).** The web app says "image files you open, drop or paste never leave your device". A remote MCP receives the image on a server, so the spec needs its own declaration for that surface, or a local-first design that avoids it. Nothing in the README or on the landing may mix the two promises; the claims table (`docs/marketing/landing/claims-check.md`) gets the rule. The declaration says what the server does with the image, how long anything lives, what the host logs (the proxy's rule already is: it keeps no copy of the image, and the host's log keeps the path, the IP and the user agent for an hour), and what an agent's own host may keep.
3. **Hosting and cost (BMI-141).** Facts in the repository: the Vercel Hobby plan is for "your personal or non-commercial use" (the Terms, section 4) and has a 4.5 MB limit on request bodies (and non-streamed responses); the WAF rule on the image proxy allows 30 requests per 60 seconds per IP, and agents behind one host share an IP. The spec evaluates what changes: image upload by body against by URL, streaming, the rate limit per caller instead of per IP, and a plan or a host that allows what the family needs.
4. **Domain (Q-027).** `mcp.<domain>` needs a domain, and buying one is Ícaro's. The spec raises the question and decides nothing. A local package needs no domain.
5. **Discovery by agents (BMI-142).** Research with sources, not memory: `llms.txt`, structured data, listing in MCP registries, how the tools are described, and how agents choose among MCP servers. Nothing is stated as a standard unless the research confirms it.
6. **"Best for agents", measurably (BMI-143).** A success criterion that can be measured: a set of evaluation tasks, the time to a result, the success rate, the cost per call, and how the numbers are collected without recording users' images. An adjective is not a criterion.

## First delivery

Open (Q-028): only the spec, or the spec and a prototype. For now: only the spec.
