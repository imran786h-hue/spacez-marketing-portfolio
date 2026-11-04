# 02. Opening new channels and a new city

[Back to overview](../README.md)

## The situation

Spacez was leaning on Google Search and Performance Max in two cities. That's a fine core, but it leaves the brand exposed if costs rise in one channel, and it ignores places where people now look for stays, like video and AI chat.

## What I did

### Hyderabad (research May 2026, live by Q3 2026)

I put together a market research deck on Hyderabad before spending anything: localities with villa demand, how guests there search, and which villas we could actually offer. Then I launched Hyderabad on Google Ads with its own campaigns and its own column in the weekly report, so it could be judged on its own terms instead of hiding inside a total.

### Google App install campaign (Q3 2026)

Spacez has a booking app. I set up an App campaign to drive installs and made the creatives for it, including a short install video in August 2026.

### YouTube video ads

I run YouTube campaigns for Bengaluru and Mumbai to build reach at a low cost per view. I wrote the scripts myself: a 10-second YouTube ad and reel scripts for seven villas, each built around one thing a guest would remember about that villa.

### ChatGPT Ads (Q3 2026)

Spacez was early on ChatGPT Ads, starting with Bengaluru private villa targeting. I ran two versions side by side: one optimising for clicks and one for order creation, so we could see which signal the system learned from better. It now has its own section in the weekly report.

### Meta Ads

- A carousel campaign sending Instagram and Facebook traffic to the website.
- A lead form campaign to hire villa caretakers in Bengaluru and Mumbai. This one taught me to set the Employment special ad category up front (job ads get rejected otherwise) and to use ad set budgets per city, because a small campaign budget otherwise drifts into one city.
- Meta data pulled through the Marketing API with a read-only system user, so Meta sits next to Google in reporting. See [code/meta-ads-reporting](../code/meta-ads-reporting/).

## What I'd tell the next person

- Give every new market and channel its own line in the report from day one. Blended totals hide a weak launch for months.
- Test on a small budget with one clear question, then decide. "Does the order-creation signal beat the click signal?" is a better test than "let's try ChatGPT Ads".
- For video, the script matters more than the edit. Start with one guest moment per villa.
