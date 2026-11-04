# 06. SEO and AI search visibility

[Back to overview](../README.md)

## The situation

Guests now ask ChatGPT, Gemini and Claude where to stay, as well as Google. Those tools lean on sources they can read and trust: clear pages, structured data and real conversations in communities. Spacez had a blog, but it wasn't built for either kind of search.

## What I did

**1. Ran the blog as a system.** 45 posts on blog.spacez.co, each with a fixed brief: headline, slug, meta description under 155 characters, focus keyphrase, real villa photos with descriptive alt text, and a short direct answer under every question heading. I aim for every Yoast check to be green, along with the overall score. The checklist is in [playbooks/blog-seo-checklist.md](../playbooks/blog-seo-checklist.md).

Topics follow what guests search: villas by locality, festival and event stays, group trips, birthdays, work-from-villa, corporate offsites and Mumbai stays.

**2. Added the schema stack.** Using WPCode on WordPress:

- Organization
- FAQ (kept separate from Article)
- VideoObject for video posts
- BreadcrumbList
- Person schema for the author
- Review data that points to real off-site reviews only

**3. Published llms.txt.** A plain-text map of the brand and key pages at the blog root, so AI crawlers can find the important content quickly.

**4. Did the Search Console work.** I resubmitted both sitemaps (the blog sitemap hadn't been read in months), inspected the villa pages for Bengaluru, Mumbai and Hyderabad, requested indexing where needed, and worked through blog posts a few a day within the inspection limit. I handed the developers a fix list: lowercase 301 redirects for case-duplicate URLs, booking pages out of the sitemap and noindexed, and schema errors fixed on the blog.

**5. Showed up in communities.** Short, helpful answers on Quora and Reddit, written like a person, without pushing the brand where community rules don't allow it. One account per purpose, kept separate from my personal work.

## Where it got to

- Organic bookings grew from 10 to 20 a month through SEO and AEO
- Within 3 months, Spacez was recommended in ChatGPT, Gemini and Claude for selected Bengaluru luxury-stay questions
- 45 blog posts, 3 Reddit accounts and 56 Google Business Profiles behind it, with new villas added every month

I treat AI recommendations as a signal to keep going, not a ranking I can promise. AI answers change, so I check named questions on named platforms and date the result.

## What I'd tell the next person

- AI search rewards the same basics as good SEO: clear facts, structured data, real reviews and real mentions.
- Community answers that read like ads get removed and cost the account its reputation. Answer the question first.
- Watch the inspection quota in Search Console and work from a priority list.
