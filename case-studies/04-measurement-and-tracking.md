# 04. Fixing measurement

[Back to overview](../README.md)

## The situation

Google Ads, GA4, Clarity and the booking system all reported bookings, and none of them agreed. Some of that is normal. Some of it came from setup problems: tags that matched too many pages, imports that could double count, and a key event that fired with no value.

## What I did

**1. Agreed one source per number.** Bookings and revenue in reports come from the booking system, counted by booking date, cancellations excluded. Ad tools are used for what they measure well: spend, clicks, impressions, calls. I wrote this down so nobody argues about it on Monday.

**2. Defined the booking channels.** "Website" means a guest booked on spacez.co. "Direct" means a repeat guest booking through the team. Both count as marketing-driven. OTA bookings don't.

**3. Stopped double counting.** Google Ads bids on its own booking tag and its own WhatsApp chat conversion. Every GA4 import into Ads stays secondary. I set GA4 key events for booking success and for WhatsApp leads (once per session), and added the WhatsApp chat platform's domain as an unwanted referral so it stopped stealing credit from the real source.

**4. Fixed the Clarity success rule.** The old rule was "URL contains /booking/booking_success". That also matched the thank-you and feedback pages that load right after, so one booking could count more than once. I replaced it with a regex that only matches the real success page:

```
/booking/booking_success(\?|$)
```

**5. Built payment funnels.** I added Clarity events for "pay full" and "split payment" and two funnels from checkout to booking success. While walking the live flow I found that "pay full" is a preselected radio button, so a click event misses everyone who never touches it. The split-payment event is reliable. I flagged the fix to the developers: pass the payment type with the booking.

**6. Fed real bookings back to Google Ads.** Every month, in the first three days, I add last month's non-OTA bookings to the sheet that feeds Google Ads offline conversions. Cancelled bookings are included on purpose: the guest did convert, and the cancellation was usually about dates or availability, not the ad. This gives smart bidding a picture of who actually books.

**7. Left a clean trail.** When a duplicate event was created by someone else on the team, I hid or renamed it instead of deleting it. You can't always know why something was made.

## What I'd tell the next person

- Fire on confirmed success, never on the click that starts payment.
- "URL contains" is almost always too loose for a success page. Use an exact match or a regex.
- Write down which tool owns which number. It saves an argument every week.

The full rule list is in [playbooks/tracking-rules.md](../playbooks/tracking-rules.md).
