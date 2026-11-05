# 03. A corporate B2B lead engine

[Back to overview](../README.md)

## The situation

Companies in Bengaluru book whole villas for team offsites, parties and long stays. These bookings are large, but they don't go through the normal booking flow. A company wants a quote, a call and a bit of back and forth. The consumer campaigns weren't built for that.

## What I did

**1. A separate corporate search campaign (Sep 2026).** Its own keywords, its own negatives and a Google Ads lead form, so a company can ask for a quote without leaving the search result. The form asks only what sales needs to quote: group size in clear buckets (up to 10, 11 to 25, 26 to 50, more than 50) and the purpose of the booking.

**2. Leads straight into a shared sheet.** Google sends each lead form response by email. Copying those by hand was slow and leads waited. I set up a Google Sheet with a bound Apps Script that runs every 15 minutes:

- searches Gmail for new lead form emails
- writes one row per lead
- skips duplicates by matching lead date and phone number
- labels the email thread as imported so it's never processed twice

The sales team works the sheet with a simple status column: New, Contacted, Not Reachable, Follow-up, Quote Sent, Booked, Lost, Junk. A cleaned version of the script is in [code/lead-form-to-sheet](../code/lead-form-to-sheet/).

**3. A second product on the same engine (Nov 2026).** Spacez started offering whole villas as monthly offices for startups. Instead of a new campaign, I added a "villa as office" ad group inside the corporate campaign:

- 20 office keywords in phrase and exact match
- 27 ad group negatives to keep out day passes, hot desks, virtual offices, job seekers and party searches
- its own sitelinks and 18 image assets made from real villa photos, not renders
- the lead form updated so one form serves both offsites and offices, with a new purpose option for office space

I left the ad group paused for a final review before launch.

**4. Listings on B2B directories (Nov 2026).** Companies planning an offsite don't only search Google. Some browse vendor directories. I listed Spacez on Sortlist and Clutch, both on free plans. Each profile pitches the villas for offsites, events and corporate stays, and uses only facts from the website. Sortlist went live the same day. Clutch reviews new profiles before they're published. Social links on both sites sit behind paid plans, so I left them off rather than pay.

## What I'd tell the next person

- B2B leads need a fast, boring handoff. Automating the sheet mattered more than any ad copy change.
- Read the shared negative lists before writing keywords. The campaign already blocked words like "lease" and "monthly rent", so office keywords had to avoid them.
- Lead form questions can only use wording Google has pre-approved. Change the answers, not the questions, or the script that reads them breaks.
