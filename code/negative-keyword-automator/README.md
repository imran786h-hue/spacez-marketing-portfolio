# Negative keyword automator (Google Ads script)

Runs once a day. It reads yesterday's search terms and blocks only the ones that are clearly not guests: job seekers, property buyers, long-term renters, construction and support searches, and far-away destinations with no home city in the search. Every block is an exact match negative at campaign level.

## Safety rules

- Home cities, their local areas and every villa name are never blocked.
- A term that converted in the last 30 days, or that is one of our own keywords, is never blocked.
- Anything doubtful goes to a "Needs Review" tab and is not applied.
- Whole-word matching, so "goa" doesn't hit "goregaon".

## Making the log honest

The first version marked rows as applied without checking. A later audit found most of those negatives had never reached the account. This version fixes that:

- A row says APPLIED only after a Google Ads query confirms the negative is live. If not, it says NOT LIVE.
- Each run audits older APPLIED rows. Anything missing is relabelled, so the sheet always matches the account.
- To undo a block, type UNDO in the Status cell. The next run removes the negative and the term is never blocked again.
- Scripts can't add negatives to Performance Max campaigns, so those terms go to Needs Review to be added by hand. The next run marks them APPLIED once they're live.

## Setup

1. Paste `Code.gs` into Google Ads, Tools, Bulk actions, Scripts.
2. Set `SHEET_URL` to your own log sheet.
3. Keep `DRY_RUN: true` for the first preview, check the rows, then set it to `false`.
4. Schedule it daily.
