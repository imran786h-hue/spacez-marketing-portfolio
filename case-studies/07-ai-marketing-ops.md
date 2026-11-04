# 07. AI-assisted marketing operations

[Back to overview](../README.md)

## The situation

I'm a one-person marketing function for a lot of moving parts: several ad platforms, three cities, dozens of villa profiles, a blog and a weekly report. Pulling numbers and doing repeat edits by hand took hours every day.

## What I did

**1. Connected Google Ads to Claude through MCP (Q3 2026).** Claude can query campaign, keyword and search term data directly. Weekly numbers, search term reviews and account checks that used to mean exports and spreadsheets now take minutes.

**2. Connected Meta Ads through the Marketing API.** A system user with read access and a small Python script pull campaign spend, clicks and results for any date range. See [code/meta-ads-reporting](../code/meta-ads-reporting/).

**3. Used a browser agent for repeat edits.** For jobs like updating website links across dozens of Google Business Profiles, or loading a finished blog draft into WordPress with Yoast settings, Claude works in a visible browser tab while I watch.

**4. Wrote the guardrails down.** The rules I set for myself:

| Rule | Why |
|---|---|
| Any new ad or campaign starts as a paused draft | Nothing goes live without my review |
| Facts come from the live villa page | AI tools fill gaps with guesses. Guests notice |
| No credentials in prompts or files | Tokens live in local environment files only |
| Don't delete what someone else built | Hide or rename instead, and ask |
| Scope changes to what was asked | An agent that "tidies up" other settings creates surprises |

## Result

This saves me about 2 to 3 hours a day. That time goes into strategy, creative and talking to the sales and operations teams instead of copying numbers between tabs.

## What I'd tell the next person

- Start with reporting. It's low risk and the time saved is obvious.
- Keep a human approval step on every write action, however good the tool is.
- Write your rules down once and reuse them. The AI follows a written rule far better than a remembered one.
