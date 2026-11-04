# Google Ads lead form emails to Google Sheet

[Back to overview](../../README.md)

A Google Apps Script that turns Google Ads lead form notification emails into rows in a shared sheet, so sales can call a lead within minutes instead of waiting for someone to copy it over.

This is a cleaned reference version of the script I run for the corporate campaign. It has no real sheet, label or account details.

## What it does

- Runs every 15 minutes on a time trigger
- Searches Gmail for new lead form emails
- Reads each answer by its question label
- Skips a lead if the same date and phone number are already in the sheet
- Labels the email thread so it's never imported twice
- Sets every new row to status "New" for the sales team

## Setup

1. Create a Google Sheet and open **Extensions > Apps Script**.
2. Paste `Code.gs`.
3. Edit `LABELS` to match your lead form questions.
4. Run `setup()` once and approve the Gmail and Sheets permissions. The account running it must receive the lead emails.

## Status values the team uses

New, Contacted, Not Reachable, Follow-up, Quote Sent, Booked, Lost, Junk.

## Notes

- Lead emails don't carry the ad group or click ID, so those can't be filled automatically.
- If you change a question's wording in the form, update `LABELS` too.
