# Security policy

## Reporting a vulnerability

Report privately through GitHub: [Report a vulnerability](https://github.com/icaromol/blur-my-image-online-and-free/security/advisories/new). Do not open a public issue, pull request or discussion for it.

Include what you found, the steps or a proof of concept, and what an attacker gains. A request to `/api/image` or a short script is usually enough for a proxy problem.

This is a single-maintainer project. Targets, counted from the day you report:

| Step | Target |
| --- | --- |
| Acknowledge your report | 7 days |
| Confirm and triage (severity, whether it is in scope) | 14 days |
| Fix a high-severity issue | 30 days |
| Fix a medium or low-severity issue | 90 days |

The maintainer will keep you updated in the advisory, publish it once a fix is released, and credit you if you want to be named. There is no bug bounty.

## Supported versions

Only the production deployment and the `main` branch. The project is below 1.0.0, so fixes ship in the next release and older tags are not patched. If you self-host the Docker image, update to the latest release.

## In scope

- **The URL proxy (`/api/image`):** server-side request forgery (reaching private, loopback or link-local addresses, DNS rebinding, redirect or URL-parsing tricks), reading anything other than a public image, bypassing the size, type, port or timeout limits, and abusing it to attack other sites.
- **Cross-site scripting** and any other way to run attacker-controlled script in the app, including through an image, a URL or the clipboard.
- **Content Security Policy and security header bypasses** on the app's pages.
- **Violations of the privacy promise in the [README](README.md#privacy):** an image, its URL or its metadata leaving the browser when it should not, tracking, or EXIF data surviving an export.
- **Supply chain:** a compromised or malicious dependency, workflow or build step that reaches the shipped bundle.

## Out of scope

- **Blur is not redaction.** Blurred or pixelated text can sometimes be recovered. This is documented in the README's [Blur is not redaction](README.md#blur-is-not-redaction) section and is not a vulnerability.
- **Hosting platform request logs.** Vercel keeps its standard request log (path including the image URL, IP address, user agent) for a short time. The README says so. Report it to Vercel if you think the platform mishandles it.
- **Denial of service by volume.** Request flooding is handled by the platform's firewall and quota limits. Flaws that make a *single* request cost far more than the documented caps are in scope.
- **Missing headers or settings on hosts we do not control**, and reports that only show an outdated browser, a missing best-practice header on a static asset with no impact, or the output of an automated scanner without a working exploit.
- Social engineering, physical attacks, and anything that requires a compromised device or browser.

## Safe harbor

Good-faith research that follows this policy is welcome. Test against your own deployment or with a few requests to the hosted one, do not access or change other people's data, do not degrade the service, and give a reasonable time to fix before you disclose. The maintainer will not take legal action over research done this way.
