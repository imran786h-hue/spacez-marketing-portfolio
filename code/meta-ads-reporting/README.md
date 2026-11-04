# Meta Ads weekly insights puller

[Back to overview](../../README.md)

A small Python script I use to put Meta Ads numbers next to Google Ads in the weekly report. No libraries to install.

## Setup

1. In Meta Business Settings, create a system user and give it access to the ad account with view performance rights.
2. Generate a token for that system user with the `ads_read` permission.
3. Copy `.env.example` to `.env` and fill in the token, ad account ID and API version.

## Run

```bash
python3 meta_insights.py --check                    # confirms the token works
python3 meta_insights.py                            # last full Monday to Sunday week
python3 meta_insights.py 2026-10-12 2026-10-18      # any date range
```

Output is one line per campaign, sorted by spend, with clicks and the main actions, plus a total.

## Notes

- Keep `.env` out of git. The repo's `.gitignore` already does this.
- Read-only by design. Anything that creates or edits ads should be a separate, reviewed step.
