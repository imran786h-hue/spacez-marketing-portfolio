# Tracking rules I follow

[Back to overview](../README.md)

1. **Fire on confirmed success.** A booking counts on the success page or the payment webhook, never on the "Pay" click.
2. **Match the success URL exactly.** "URL contains" catches thank-you, feedback and retry pages. Use exact match or a regex such as `/booking/booking_success(\?|$)`.
3. **One primary conversion per action.** Google Ads bids on its own booking tag and its own chat-start conversion. GA4 imports stay secondary.
4. **Check auto-created goals.** Google may add "Get directions" or "Phone call" as primary. Use campaign-specific goals instead of deleting them.
5. **Once per session for leads.** A WhatsApp lead counts once per session, not on every tap.
6. **Exclude your own tools as referrers.** Chat and payment domains go on the unwanted referral list.
7. **Feed real bookings back.** Upload offline conversions monthly so bidding learns from people who actually booked.
8. **Write down who owns each number.** Ad platform for spend and clicks, booking system for bookings and revenue.
9. **Don't delete what you didn't create.** Hide or rename duplicate events and ask the team.
10. **Test after every change.** Make a test conversion, confirm it arrives, then move on.
