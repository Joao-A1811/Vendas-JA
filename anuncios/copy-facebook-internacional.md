# Ad Copy — Facebook/Instagram Ads (International)

Fill this in before launching a campaign in Meta Business Manager for a country outside Brazil.
Run **3 to 5 variations** of text and creative at the same time — never launch with a single version.

> Meta's recommended limits (the ad still runs beyond these, but gets truncated on some placements):
> - Primary text: ideally under 125 characters
> - Headline: up to 40 characters
> - Description: up to 30 characters

> Watch out per niche (otherwise the ad gets rejected or the account can be suspended):
> - **Weight loss/muscle gain**: forbidden to promise a specific number ("lose 10kg in 30 days"), forbidden "before and after" body photos, avoid body-shaming language.
> - **Investing**: forbidden to promise guaranteed or specific returns.
> - **Relationships**: nothing sexually suggestive, be careful with targeting by personal attributes. Focus on confidence, communication and social skills — never manipulation.

---

## Product
`{{PRODUCT_NAME}}`

## Target country / language
`{{ex: United States — English | Spain — Spanish | Portugal — Portuguese}}`

## Campaign objective
`{{ex: Lead generation | Conversion (sale) | Traffic to landing page}}`

## Audience (to configure in Ads Manager)
- Location: `{{ex: United States, major metro areas}}`
- Age: `{{ex: 25-55}}`
- Interests: `{{ex: personal finance, investing, entrepreneurship}}`
- Note: start with a **broad audience** (avoid stacking too many interests) and let the algorithm optimize after ~50 conversions.

## Localization checklist (do this per country, don't just translate)
- [ ] Currency shown on the landing page and Hotmart checkout matches the target country (e.g. USD, EUR)
- [ ] Copy is localized (not machine-translated) — idioms and pain points differ by market
- [ ] Payment methods available on Hotmart checkout are the common ones in that country (card, PayPal, etc.)
- [ ] Legal/compliance wording adjusted if required locally (e.g. financial disclaimers)

---

## Variation 1 — Pain / Problem
**Primary text:**
`{{Tired of losing money because you didn't know X? That can change today.}}`

**Headline:**
`{{Stop losing money on X}}`

**Description:**
`{{Learn the method in minutes}}`

**CTA (button):** Learn More / Sign Up / Shop Now

---

## Variation 2 — Social proof / Result
**Primary text:**
`{{Over {{N}} people already used this method to {{result}}. See how.}}`

**Headline:**
`{{The method that helped {{N}} people}}`

**Description:**
`{{Proven results}}`

**CTA (button):** Learn More

---

## Variation 3 — Curiosity / Question
**Primary text:**
`{{Did you know {{interesting fact related to the product}}? Find out what to do about it.}}`

**Headline:**
`{{The secret to {{topic}}}}`

**Description:**
`{{Find out now}}`

**CTA (button):** Learn More

---

## Variation 4 — Direct offer
**Primary text:**
`{{{{PRODUCT_NAME}} for just {{price}}. Limited-time offer.}}`

**Headline:**
`{{Special offer: {{PRODUCT_NAME}}}}`

**Description:**
`{{Limited time only}}`

**CTA (button):** Shop Now

---

## Checklist before publishing
- [ ] Meta Pixel installed on the landing page and firing events (PageView, Lead, InitiateCheckout) in Events Manager
- [ ] Landing page link includes UTMs (e.g. `?utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign_name}}&utm_content={{variation}}`)
- [ ] Ads account verified in Meta Business Manager (real business identity, no antidetect browser / multi-account setup)
- [ ] Daily budget and spend cap defined
- [ ] Audience, copy and creative reviewed against Meta's Advertising Policies and the per-niche notes above
