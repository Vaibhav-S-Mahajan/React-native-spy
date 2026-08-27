# ──────────────────────────────────────────────────────────────────────
# React Native Spy — Release Makefile
# ──────────────────────────────────────────────────────────────────────
#
# Usage:
#   make patch   — bump patch version (0.1.0 → 0.1.1), commit, push, draft release
#   make minor   — bump minor version (0.1.0 → 0.2.0), commit, push, draft release
#   make major   — bump major version (0.1.0 → 1.0.0), commit, push, draft release
#
# What happens:
#   1. All uncommitted changes are staged and committed.
#   2. `npm version` bumps package.json + creates a git tag (vX.Y.Z).
#   3. The commit and tag are pushed to GitHub.
#   4. GitHub Actions (draft-release.yml) creates a draft release.
#   5. You review the draft on GitHub and click "Publish release".
#   6. GitHub Actions (release.yml) builds macOS/Windows/Linux installers
#      and uploads them to the release.
#   7. electron-updater picks up the new release for in-app updates.
#
# Prerequisites:
#   - git remote pointing to GitHub (origin)
#   - GitHub Actions workflows in .github/workflows/
# ──────────────────────────────────────────────────────────────────────

.PHONY: patch minor major _pre_release _push

# Default target
.DEFAULT_GOAL := help

# Branch we release from
RELEASE_BRANCH := main

# ── Helpers ───────────────────────────────────────────────────────────

_pre_release:
	@echo ""
	@echo "══════════════════════════════════════════════════════════"
	@echo "  Preparing release..."
	@echo "══════════════════════════════════════════════════════════"
	@BRANCH=$$(git rev-parse --abbrev-ref HEAD); \
	if [ "$$BRANCH" != "$(RELEASE_BRANCH)" ]; then \
		echo "Error: must be on the $(RELEASE_BRANCH) branch (currently on $$BRANCH)." >&2; \
		exit 1; \
	fi
	@git remote get-url origin >/dev/null 2>&1 || (echo "Error: git remote 'origin' is not configured." >&2; exit 1)
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "  Staging all changes..."; \
		git add -A; \
		git commit -m "chore: pre-release changes"; \
		echo "  Changes committed."; \
	else \
		echo "  Working tree is clean."; \
	fi

_push:
	@echo "  Pushing to GitHub..."
	@git push
	@git push --tags
	@TAG=$$(git describe --tags --abbrev=0) && \
		echo "" && \
		echo "══════════════════════════════════════════════════════════" && \
		echo "  Release $$TAG pushed!" && \
		echo "" && \
		echo "  Next steps:" && \
		echo "    1. Wait for the draft release to appear on GitHub" && \
		echo "    2. Review the release notes" && \
		echo "    3. Click 'Publish release' to trigger the build" && \
		echo "    4. Installers will be built for macOS, Windows, Linux" && \
		echo "    5. electron-updater will auto-notify existing users" && \
		echo "" && \
		echo "  https://github.com/dev-vaibhav0220/React-native-spy/releases" && \
		echo "══════════════════════════════════════════════════════════" && \
		echo ""

# ── Release targets ─────────────────────────────────────────────────

patch: _pre_release ## Bump patch version (x.y.Z), commit, push, draft release
	@echo "  Bumping patch version..."
	@npm version patch -m "release: %s"
	@$(MAKE) --no-print-directory _push

minor: _pre_release ## Bump minor version (x.Y.0), commit, push, draft release
	@echo "  Bumping minor version..."
	@npm version minor -m "release: %s"
	@$(MAKE) --no-print-directory _push

major: _pre_release ## Bump major version (X.0.0), commit, push, draft release
	@echo "  Bumping major version..."
	@npm version major -m "release: %s"
	@$(MAKE) --no-print-directory _push

# ── Dev targets ──────────────────────────────────────────────────────

dev: ## Start the dev server
	npm run dev

build: ## Build the app (renderer + preload + main)
	npm run build

help: ## Show this help
	@echo ""
	@echo "React Native Spy — Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-12s %s\n", $$1, $$2}'
	@echo ""
