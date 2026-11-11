# 01. Rebuilding the Google Ads account

[Back to overview](../README.md)

## The situation

When I joined in December 2025, Google Ads was the main paid channel and most of the money went through a few broad campaigns. Brand searches, competitor searches and generic "villa in Bengaluru" searches sat side by side. That made it hard to tell what was working, and easy for irrelevant searches to eat budget.

Two things stood out in the first audit:

- **Search terms full of the wrong intent.** People looking to buy or lease property, find a PG, apply for jobs, or book a resort in another city were all triggering villa rental ads.
- **Conversion goals counting the wrong things.** Google had auto-created local actions such as "Get directions" and "Phone call" and set them as primary goals. Smart bidding was partly optimising for map clicks, not bookings.

## What I did

**1. Split the account by intent.**

| Campaign type | Why it exists |
|---|---|
| Brand search | Protects people already looking for Spacez, cheaply, and keeps OTAs from buying our name |
| Competitor and OTA search | Catches people comparing booking sites, with its own budget so it can't starve the rest |
| City search (Bengaluru, Mumbai, later Hyderabad) | Generic intent: private pool villas, group stays, party villas, weekend getaways |
| Single Property Ad Groups (SPAGs) | One ad group per high-demand villa, so searches for that villa land on that villa |
| Dedicated campaign for the flagship glass villa | Enough search demand of its own to deserve a separate budget |
| Event ad groups (IPL 2026) | Short windows of high demand, switched on and off with the season |
| Performance Max per city | Reach across Google's inventory, with bid strategy picked by how much conversion data each city had |

**2. Built a single-property framework.** For each villa worth its own ad group I wrote a fixed pack: 15 headlines, 4 descriptions, exact and phrase keywords, around 25 in-group negatives, sitelinks, callouts and display paths. Each pack also carries repeat-guest lines like "Welcome Back to [Villa]", because a good share of Spacez bookings come from people who have stayed before. The template is in [playbooks/spag-template.md](../playbooks/spag-template.md).

**3. Kept negatives in shared lists.** I built a campaign-level negative keyword list in December 2025 and keep extending it from the search terms report. Themes are in [playbooks/negative-keyword-themes.md](../playbooks/negative-keyword-themes.md). I also use a Google Ads script that flags irrelevant search terms so I'm not reading every row by hand.

**4. Targeted where guests are, not the whole city.** Radius targeting of 5 to 30 km around high-intent neighbourhoods works better for a villa business than city-wide targeting, because the villas are in specific localities and guests often book close to home.

**5. Fixed conversion goals.** I moved the account to campaign-specific goals, with the booking purchase and WhatsApp chat start as the primary conversions on every campaign. The local actions stayed as secondary instead of being deleted, so the history is kept. The booking tag now fires on the exact success page URL, not "URL contains", which had been catching thank-you and feedback pages too. More in [04. Fixing measurement](04-measurement-and-tracking.md).

**6. Wrote copy guests recognise.** Headlines follow the 30-character limit with dynamic keyword insertion where it helps. Copy leads with what people search for: private pools, 4 and 5 BHK group stays, central locations, and the live offer code.

**7. Ran seasons without rebuilding the account.** For New Year 2027 I rebuilt an old event campaign into one ad group each for Bengaluru, Mumbai and Hyderabad. Keyword Planner showed villa-specific New Year searches were tiny, so keywords centre on people looking for a party with a stay, not club tickets. The copy speaks to the real 31st night problems: queues, cover charges and the drive home at 2 AM. Before writing, I checked every villa page, which showed Hyderabad has no pool villas, so those ads never promise one. In the live campaigns, festive lines were swapped for New Year ones in place, keeping pins and live offer lines, and a sitelink opens each city's listing already set to 31 Dec. The rule I follow: change the lines that underperform, keep the ones that convert, and never claim an amenity the landing page doesn't show.

## Result

- ₹8.6 lakh (44%) of inefficient spend removed in Q1 2026
- Monthly spend down 61%, from ₹9.9 lakh to ₹3.8 lakh, by Q2 2026
- ROAS from 5.2x at takeover to 7.3x in Q1, 10.4x in Q2 and a 15.7x peak in Q3 2026
- CAC down 48%, CTR from 8% to 15%
- Direct booking revenue up 30% across 12 Google Ads campaigns

<sub>Self-reported. 15.7x is a peak, not an average.</sub>

## What I'd tell the next person

- Audit the conversion goals before you judge any campaign. If bidding chases the wrong action, nothing else you change will show up properly.
- Some keywords look bad on clicks and still bring bookings. I keep a short "do not pause" list of terms that convert later, even when the first numbers look poor.
- A villa with high clicks and no bookings is often a landing page problem, not a keyword problem. Check the page before building ads for it.
