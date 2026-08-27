# Security Policy

## Reporting a vulnerability

Please do not open a public issue. Report privately through GitHub's
[private vulnerability reporting](https://github.com/Vaibhav-S-Mahajan/React-native-spy/security/advisories/new)
and you will get a first response within a week.

Useful details: what an attacker can do, the app version and OS, and the
smallest set of steps that demonstrates it.

## Supported versions

Only the latest release gets fixes. There are no long-term support branches.

## Threat model worth understanding

React Native Spy is a **local development tool**, and its security properties
follow from that:

- The WebSocket server binds to `0.0.0.0` so physical devices on your LAN can
  reach it. **Anyone on the same network can connect to it** and both read the
  debug stream and send commands to a connected app. There is no
  authentication. Do not run it on an untrusted network — a café, a conference,
  a shared office VLAN.
- The captured stream contains whatever your app logs: auth tokens, request
  bodies, storage contents. It stays on your machine (`sessionStorage` plus an
  in-memory buffer, no backend, no telemetry) but it is not encrypted at rest.
- Automatic project setup **writes to your source tree**. It backs up modified
  files as `.rnspy.bak` and rolls back a failed write, but you should review the
  plan it shows you before applying it.
- The client snippet is wrapped in `if (__DEV__)`, so it is stripped from release
  bundles. Verify this holds if you customise the snippet.
- Desktop builds are **unsigned** on every platform. Gatekeeper and SmartScreen
  will warn on first launch. Download only from the
  [GitHub releases page](https://github.com/Vaibhav-S-Mahajan/React-native-spy/releases).

Reports about the unauthenticated LAN server are valid and welcome — an
authentication story is a known gap, not a design decision anyone is attached
to.
