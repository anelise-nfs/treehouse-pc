import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt, table } from '../_portableText';

/**
 * Early Bird Membership Agreement, transcribed from the attorney’s draft.
 *
 * COPY IS VERBATIM. Nothing below is rewritten, shortened, merged or
 * reordered, including the all-capitals passages and the one sentence in 2.4
 * that reads as though it is missing a comma. Legal text means what it says;
 * conspicuousness of a renewal term, an autopay authorisation and an
 * arbitration clause is a statutory requirement in several states rather than
 * a typographic preference, so the capitals stay and the component must never
 * transform them.
 *
 * STRUCTURAL CHOICES, all of which preserve the source’s own hierarchy:
 *
 * - The numbered sections, SCHEDULE A and FACILITY RULES become h2, because
 *   the page’s h1 is its title. Schedule A’s rule groups, which the source
 *   writes as `##`, become h3 under them.
 * - The 'N.N Heading.' leads stay INSIDE their paragraph as bold runs. The
 *   source writes them as run-in heads — the lead and the clause it governs
 *   are one paragraph — and promoting them to headings would split 60 clauses
 *   into 120 elements and change the shape of the agreement.
 * - The two rate grids in 2.2 and 2.3 are real tables, with the tier as each
 *   row’s header cell. They are the only part of the document where the
 *   meaning lives in the alignment rather than the prose.
 * - The markdown autolinks around the contact address become real mailtos.
 * - Possessives are set with a typographic apostrophe throughout, as they are
 *   on /privacy and /terms. The draft mixes the two glyphs; one document
 *   using both reads as a transcription error, and the choice of glyph is
 *   typesetting rather than wording.
 *
 * NO EFFECTIVE DATE IS SHOWN. The agreement is executed at checkout and its
 * Effective Date is whatever day each member signs, so the page cannot know
 * it — printing one would be stating a fact about every member that is true
 * of none. The eyebrow carries a document version instead, which is what
 * identifies which wording someone agreed to.
 *
 * NOT INDEXED, and so not in the sitemap either (app/sitemap.ts derives its
 * URLs from the indexable pages). This is a reference document linked from
 * the point of sale, not a page anyone should arrive at from a search.
 */
export const membershipAgreementPage: Page = {
  _id: 'page.early-bird-membership-agreement',
  _type: 'page',
  title: 'Early Bird Membership Agreement',
  slug: 'early-bird-membership-agreement',
  headerVariant: 'topbar',
  seo: {
    title: 'Early Bird Membership Agreement — Treehouse Park City',
    description:
      'The membership agreement governing Early Bird founding memberships at Treehouse Park City, including annual terms, renewal, cancellation, billing and facility rules.',
    // A checkout reference, not a marketing page. Out of the index, and out
    // of the sitemap as a consequence rather than by a second edit.
    noIndex: true,
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // No doodles, matching /privacy and /terms — see the note there.
      title: 'Early Bird Membership Agreement',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with the other
        // sub-pages.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'agreement',
      _type: 'legalDocument',
      eyebrow: 'Treehouse LLC | Park City, Utah | Version: November 20, 2026',
      body: [
        ...pt(
          { style: 'h2', text: 'IMPORTANT TERMS. PLEASE READ BEFORE SIGNING.' },
          {
            bullet: [
              {
                text: 'Every Membership begins with a required twelve (12) month Annual Term, whether you pay in full or in twelve (12) monthly installments.',
                bold: true,
              },
              ' Monthly installments do not make your Membership month-to-month or let you cancel early. Annual Terms cannot be cancelled mid-term except as stated in Sections 3.7, 3.8, 10, and 12.3 or as required by law. A membership freeze is available under Section 7.',
            ],
          },
          {
            bullet: [
              {
                text: 'IF TREEHOUSE SENDS THE REQUIRED RENEWAL NOTICE, YOUR MEMBERSHIP WILL AUTOMATICALLY RENEW FOR ANOTHER ANNUAL TERM UNLESS YOU CANCEL OR ELECT TO SWITCH TO MONTH-TO-MONTH BEFORE YOUR CURRENT ANNUAL TERM ENDS. TREEHOUSE WILL CHARGE YOUR PAYMENT METHOD ON FILE IN FULL OR IN MONTHLY INSTALLMENTS, USING YOUR EXISTING PAYMENT PLAN UNLESS YOU AND TREEHOUSE AGREE TO A CHANGE BEFORE RENEWAL.',
                bold: true,
              },
              ' Month-to-month Membership is available only after the Annual Term ends, including any extension. We will send you a reminder 30 to 60 days before the Annual Term ends (Sections 3.3, 3.4, and 3.9).',
            ],
          },
          {
            bullet: [
              { text: 'Month-to-month memberships may be cancelled at any time', bold: true },
              ', effective at the end of the current paid month, by email, online, or in person (Section 3.6).',
            ],
          },
          {
            bullet: [
              {
                text: 'You may cancel this Agreement within three (3) business days after signing for a full refund',
                bold: true,
              },
              ' (Section 3.7). Purchases made before the Facility opens carry additional cancellation rights (Section 3.8).',
            ],
          },
          {
            bullet: [
              { text: 'Early Bird rates are locked for thirty-six (36) months', bold: true },
              ' (Section 4.2). ',
              {
                text: 'Founding Member status is a title only. It is not a lifetime membership, rate, or discount',
                bold: true,
              },
              ' (Section 4.7).',
            ],
          },

          'This Membership Agreement ("Agreement") is entered into as of the Effective Date by and between Treehouse LLC, a Utah limited liability company ("Treehouse," "we," "us," or "our"), and the undersigned parent or legal guardian ("Member," "you," or "your"). This Agreement governs your membership at the Treehouse children’s indoor play facility located at 1209 Center Drive, Park City, Utah 84098 (the "Facility"). By signing below, you confirm that you have read, understand, and agree to this Agreement, including the Waiver and Facility Rules incorporated under Section 11.',

          { style: 'h2', text: '1. Definitions' },
          'In this Agreement, the following terms have the meanings below:',
          {
            bullet: [
              '"',
              { text: 'Annual Term', bold: true },
              '" means a twelve (12) month membership commitment, payable in full or in twelve (12) monthly installments under Section 9.2, as extended under Sections 7 and 8.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Authorized Adult', bold: true },
              '" means the Member and any other adult, age 18 or older, whom the Member designates in writing and who has signed the Waiver.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Early Bird Membership', bold: true },
              '" means a founding membership purchased under Section 4. An Early Bird Membership holder is an "',
              { text: 'Early Bird Member', bold: true },
              '."',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Facility Rules', bold: true },
              '" means Treehouse’s posted rules, policies, and safety requirements for the Facility, as updated from time to time, including those attached as Schedule A.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Member Children', bold: true },
              '" means the children listed in this Agreement or later added under Section 6, for each of whom the Member is a parent or legal guardian or otherwise has lawful authority to consent to participation.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Membership', bold: true },
              '" means the membership and related rights granted under this Agreement.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Membership Start Date', bold: true },
              '" means (a) for an Early Bird Membership, the Opening Date; and (b) for a Regular Membership, the date stated in the Membership Selections above.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Opening Date', bold: true },
              '" means the first day the Facility is open to members for regular play, as announced by Treehouse in writing.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Rate Lock Period', bold: true },
              '" has the meaning given in Section 4.2.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Regular Membership', bold: true },
              '" means any Membership that is not an Early Bird Membership.',
            ],
          },
          {
            bullet: [
              '"',
              { text: 'Waiver', bold: true },
              '" means Treehouse’s Participation Agreement, Acknowledgment and Assumption of Risks, and Release of Liability, as updated from time to time.',
            ],
          },

          { style: 'h2', text: '2. Membership Types, Tiers, and Rates' },
          [
            { text: '2.1 Membership Types and Tiers.', bold: true },
            ' Treehouse offers two membership types: (a) Early Bird (founding) Memberships, which are limited and are also governed by Section 4; and (b) Regular Memberships. Each Membership provides unlimited play for the Member Children at the tier selected above (1 Child, 2 Children, or 3 or More Children). A Membership covers only the Member Children named in this Agreement.',
          ],
          [
            { text: '2.2 Regular Membership Rates.', bold: true },
            ' Regular Memberships begin with the required Annual Term under Section 3.1. The Annual Term total may be paid in full or in twelve (12) equal monthly installments under Section 9.2. The separate month-to-month rates apply only after an Annual Term under Section 3.3 or 3.4, subject to Section 9.5. Regular Membership rates as of the Effective Date are:',
          ],
        ),

        table(
          ['Tier', 'Month-to-Month Rate (after Annual Term)', 'Annual Term Total'],
          [
            ['1 Child', '$150', '$1,800'],
            ['2 Children', '$250', '$3,000'],
            ['3 or More Children', '$350', '$4,200'],
          ],
        ),

        ...pt([
          { text: '2.3 Early Bird Membership Rates.', bold: true },
          ' Early Bird Memberships begin with the required Annual Term under Section 3.1. The Annual Term total may be paid in full or in twelve (12) equal monthly installments under Section 9.2. The separate month-to-month rates apply only after an Annual Term and while the Rate Lock Period still applies. Early Bird rates are:',
        ]),

        table(
          ['Tier', 'Month-to-Month Rate (after Annual Term)', 'Annual Term Total'],
          [
            ['1 Child', '$140', '$1,680'],
            ['2 Children', '$235', '$2,820'],
            ['3 or More Children', '$330', '$3,960'],
          ],
        ),

        ...pt(
          [
            { text: '2.4 Availability.', bold: true },
            ' Memberships are subject to availability. Treehouse intends to limit the total number of active Memberships, including Early Bird Memberships to a reasonable number in Treehouse’s discretion and may maintain a waitlist once that limit is reached.',
          ],
          [
            { text: '2.5 Taxes.', bold: true },
            ' All rates are stated before applicable sales and other taxes, which will be added to each charge where required by law.',
          ],

          { style: 'h2', text: '3. Term, Renewal, and Cancellation' },
          [
            { text: '3.1 Required Initial Annual Term.', bold: true },
            ' Every Membership, whether Early Bird or Regular, begins with a mandatory twelve (12) month Annual Term on the Membership Start Date. You agree to pay the full Annual Term total, either in one payment or in twelve (12) monthly installments under Section 9.2. Installments are a payment option, not a month-to-month Membership, and do not shorten the commitment or give you a right to cancel early. Any freeze under Section 7 or closure pause under Section 8 extends the Annual Term. Month-to-month Membership may begin only after the initial Annual Term ends, including any extensions.',
          ],
          [
            { text: '3.2 No Cancellation During an Annual Term.', bold: true },
            ' You may not cancel an Annual Term, stop owing installments by discontinuing use, or obtain a refund of amounts already paid, except as provided in Section 3.7 (Three-Business-Day Right to Cancel), Section 3.8 (Purchases Before the Facility Opens), Section 10 (Medical and Hardship Exception), and Section 12.3 (Termination Without Cause; Permanent Closure), or as required by law. If you need to pause use during an Annual Term, you may request a freeze under Section 7.',
          ],
          [
            {
              text: '3.3 Automatic Renewal of Annual Terms. IF TREEHOUSE SENDS THE NOTICE REQUIRED BY SECTION 3.9 AND YOU DO NOT CANCEL UNDER SECTION 3.6 OR ELECT TO SWITCH TO MONTH-TO-MONTH UNDER SECTION 3.4 BEFORE YOUR ANNUAL TERM ENDS, YOUR MEMBERSHIP WILL AUTOMATICALLY RENEW FOR ANOTHER ANNUAL TERM BEGINNING THE DAY AFTER YOUR CURRENT TERM ENDS. TREEHOUSE WILL CHARGE YOUR PAYMENT METHOD ON FILE THE RENEWAL AMOUNTS, INCLUDING APPLICABLE TAXES, AS STATED IN THE NOTICE, USING YOUR EXISTING PAYMENT PLAN UNLESS YOU AND TREEHOUSE AGREE TO A CHANGE BEFORE RENEWAL.',
              bold: true,
            },
            ' Each renewed Annual Term is subject to Section 3.2 and renews on the same basis. The Annual Term total for a renewal is (a) for Early Bird Members, the Early Bird Annual Term total for any Annual Term that begins during the Rate Lock Period, as provided in Section 4.3; and (b) otherwise, the then-current Regular Annual Term total for your tier. If Treehouse does not send the required notice, your Membership will not renew for another Annual Term and will instead continue month-to-month under Section 3.5 at the applicable monthly rate under Section 3.4, unless you cancel under Section 3.6.',
          ],
          [
            { text: '3.4 Switching Between Annual and Month-to-Month.', bold: true },
            ' (a) You may elect to switch to a month-to-month Membership at the end of your initial or any renewed Annual Term by notifying Treehouse, by any method listed in Section 3.6, before that Annual Term ends. The switch takes effect the day after the Annual Term ends, including any extension under Section 7 or 8. (b) While on a month-to-month basis, you may elect a new Annual Term by notifying Treehouse and selecting a payment plan under Section 9.2. The new Annual Term begins the day after your current paid month ends. (c) The applicable monthly rate is (i) for Early Bird Members during the Rate Lock Period, the Early Bird monthly rate; and (ii) otherwise, the then-current Regular monthly rate for your tier, as disclosed under Section 3.9 or Section 9.5, as applicable.',
          ],
          [
            { text: '3.5 Month-to-Month Memberships.', bold: true },
            ' A month-to-month Membership may begin only after an Annual Term ends, either by election under Section 3.4 or as provided in Section 3.3 if Treehouse does not send the required annual renewal notice. It renews automatically each month on the monthly billing date described in Section 9.2 until cancelled. Month-to-month Members are not eligible for a freeze under Section 7.',
          ],
          [
            {
              text: '3.6 Cancellation of Month-to-Month Memberships; Stopping Annual Renewal.',
              bold: true,
            },
            ' You may cancel a month-to-month Membership at any time after the initial annual commitment, for any reason, by any of the following methods: (a) email to ',
            { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' },
            '; (b) through your online member account; or (c) in person at the Facility front desk. Treehouse will confirm your cancellation in writing. A cancellation received before your next monthly billing date takes effect at the end of your current paid month, and no further monthly charges will be made. Treehouse does not prorate or refund partial months. You may also use these methods at any time before your Annual Term ends to cancel your Membership effective at the end of that Annual Term, or to switch to month-to-month under Section 3.4. Either choice will stop your Membership from renewing for another Annual Term.',
          ],
          [
            {
              text: '3.7 Three-Business-Day Right to Cancel. YOU MAY CANCEL THIS AGREEMENT FOR ANY REASON WITHIN THREE (3) BUSINESS DAYS AFTER THE DAY YOU SIGN IT BY SENDING WRITTEN NOTICE OF CANCELLATION TO TREEHOUSE BY EMAIL TO HOLLER@TREEHOUSEPARKCITY.COM OR BY MAIL TO 1209 CENTER DRIVE, PARK CITY, UTAH 84098.',
              bold: true,
            },
            ' Treehouse will refund all amounts paid under this Agreement within ten (10) business days after receiving your notice.',
          ],
          [
            { text: '3.8 Purchases Before the Facility Opens.', bold: true },
            ' If you sign this Agreement and pay before the Opening Date, and the Facility is not fully operational and available for member use within sixty (60) days after the date you sign, you may cancel this Agreement at any time until three (3) business days after the Facility becomes fully operational and available for use, by written notice sent as described in Section 3.7. Treehouse will refund all amounts you paid, less the lesser of (a) the reasonable value of any services you actually received or (b) twenty-five dollars ($25). Preparing and processing this Agreement is not a service for which any amount may be deducted.',
          ],
          [
            { text: '3.9 Renewal Notices.', bold: true },
            ' At least thirty (30) days, but not more than sixty (60) days, before the end of each Annual Term, Treehouse will send you a written notice by email that clearly and conspicuously states: (a) the date your Annual Term ends and the date your Membership will automatically renew for another Annual Term; (b) the total cost of the renewed Annual Term, including taxes, the payment plan, the amount and timing of the payment or installments, and the separate monthly rate that would apply if you switch to month-to-month; and (c) how to cancel or switch to month-to-month, and that you may do so at any time before the renewal date. If a freeze or closure pause extends your Annual Term after the notice is sent, Treehouse will send an updated notice within the same 30-to-60-day window before the extended end date.',
          ],

          { style: 'h2', text: '4. Early Bird (Founding) Memberships' },
          [
            { text: '4.1 Availability.', bold: true },
            ' Early Bird Memberships are limited to the first seventy-five (75) Memberships sold. Once seventy-five (75) Memberships have been sold the Early Bird Memberships will no longer be available. Each Early Bird Membership begins with an initial Annual Term starting on the Opening Date.',
          ],
          [
            { text: '4.2 Early Bird Rate Lock.', bold: true },
            ' Your Early Bird rate for your tier, monthly or annual as applicable, is locked for thirty-six (36) months beginning on the Opening Date (the "Rate Lock Period"). The Rate Lock Period covers your initial Annual Term and two (2) additional years, whether your Membership renews for additional Annual Terms or continues month-to-month. The Rate Lock Period is extended day-for-day by any freeze under Section 7 and any closure pause under Section 8. Treehouse will not increase your Early Bird rate during the Rate Lock Period.',
          ],
          [
            { text: '4.3 Rates After the Rate Lock Period.', bold: true },
            ' After the Rate Lock Period ends, your Membership will be charged Treehouse’s then-current Regular Membership rate for your tier and payment plan. Treehouse will give you at least thirty (30) days’ written notice before the new rate first applies, which notice may be included in a notice under Section 3.9. If an Annual Term begins during the Rate Lock Period, the Early Bird annual rate applies for that entire Annual Term, even if the Annual Term ends after the Rate Lock Period. The then-current Regular rate will apply beginning with the next Annual Term or month-to-month period.',
          ],
          [
            { text: '4.4 Conditions of the Rate Lock.', bold: true },
            ' The Rate Lock Period applies only while your Membership remains continuously active, including during freezes and closure pauses. If your Membership is cancelled, ends, or is terminated for cause, the Early Bird rate ends and will not be reinstated if you later rejoin. If you add a child or change tiers during the Rate Lock Period, the Early Bird rate for the new tier applies for the remainder of the Rate Lock Period.',
          ],
          [
            { text: '4.5 Early Bird Benefits.', bold: true },
            ' In addition to the benefits in Section 5, Early Bird Members receive: (a) an invitation for the Member and the Member Children to an exclusive pre-opening play party, held on a date selected by Treehouse before the Opening Date; (b) Treehouse merchandise selected by Treehouse; and (c) Founding Member status under Section 4.6. These benefits have no cash value and are not refundable or transferable.',
          ],
          [
            { text: '4.6 Founding Member Status.', bold: true },
            ' Each Early Bird Member will be recognized by Treehouse as a "Founding Member" for the Member’s lifetime, including after the Membership ends, for as long as Treehouse or its successor operates the Facility, unless the Membership is terminated for cause under Section 12. Founding Member status is personal to the Member and may not be transferred.',
          ],
          [
            {
              text: '4.7 No Lifetime Membership, Rate, or Discount. FOUNDING MEMBER STATUS IS A RECOGNITION TITLE ONLY. IT IS NOT A LIFETIME MEMBERSHIP AND DOES NOT ENTITLE THE MEMBER TO ANY RATE, PRICE LOCK, DISCOUNT, ACCESS, OR OTHER BENEFIT AFTER THE RATE LOCK PERIOD OR AFTER THE MEMBERSHIP ENDS.',
              bold: true,
            },
            ' The only pricing commitment made to Early Bird Members is the rate lock described in Section 4.2. Treehouse may, but is not required to, offer Founding Members additional recognition or perks from time to time, and Treehouse may change or discontinue any such additional offer at any time.',
          ],

          { style: 'h2', text: '5. Membership Benefits' },
          [
            { text: '5.1 Benefits.', bold: true },
            ' While your Membership is active and in good standing, you receive: (a) unlimited play for the Member Children during regular Facility operating hours, subject to capacity limits and the Facility Rules; (b) skip-the-line entry using your member QR code; (c) member pricing on classes and workshops, as published by Treehouse from time to time; (d) member benefits on one (1) birthday party for each Member Child per 12-month period; and (e) one (1) buddy pass per calendar month under Section 5.2. Classes, workshops, birthday parties, private events, food and beverages, and other separately priced items are not included in the Membership except at member pricing.',
          ],
          [
            { text: '5.2 Buddy Pass.', bold: true },
            ' Each Membership includes one (1) buddy pass per calendar month, which allows one (1) guest to join the Member Children for one (1) visit at no charge, subject to the following: (a) buddy passes do not roll over, have no cash value, and are not available during a freeze or suspension; (b) only one (1) guest may be admitted per visit; (c) the guest must be accompanied and actively supervised at all times by the Member or an Authorized Adult who remains at the Facility; (d) before the guest may play, a Waiver must be signed for the guest as required by Section 11.2; (e) the guest must meet all age, size, and other requirements in the Facility Rules; and (f) Treehouse may limit buddy pass use during private events or when the Facility is at capacity. The Member is responsible for the guest’s compliance with the Facility Rules while at the Facility.',
          ],
          [
            { text: '5.3 Changes to Programs, Hours, and Equipment.', bold: true },
            ' Treehouse may modify operating hours, programming, classes, play structures, equipment, and amenities, and may temporarily close any area or piece of equipment for maintenance, safety, or private events. No specific play structure, piece of equipment, class, or amenity is guaranteed to remain available, and these changes do not breach this Agreement. Closures of the entire Facility are governed by Section 8.',
          ],

          { style: 'h2', text: '6. Adding Children and Changing Tiers' },
          [
            { text: '6.1 Adding a Child.', bold: true },
            ' You may add a child to your Membership at any time by notifying Treehouse and signing the Waiver for that child. If adding a child moves your Membership to a higher tier, the upgrade takes effect on the date the child is added. If your Membership is already in the 3 or More Children tier, additional children may be added at no additional charge.',
          ],
          [
            { text: '6.2 Upgrades During an Annual Term.', bold: true },
            ' If you move to a higher tier during an Annual Term, you will pay the difference between the annual rate for your new tier and the annual rate for your current tier, prorated by day for the remainder of the Annual Term. Your Annual Term end date does not change. During the Rate Lock Period, Early Bird Members pay this difference using Early Bird rates.',
          ],
          [
            { text: '6.3 Tier Changes for Month-to-Month Memberships.', bold: true },
            ' For a month-to-month Membership, an upgrade takes effect when the child is added, and Treehouse will charge the prorated difference for the rest of the current month at that time. The new monthly rate applies beginning on the next billing date. A move to a lower tier takes effect on the next billing date after Treehouse receives your request.',
          ],
          [
            { text: '6.4 No Downgrades During an Annual Term.', bold: true },
            ' You may not move to a lower tier during an Annual Term. You may select a lower tier for any month-to-month period or new Annual Term that follows.',
          ],
          [
            { text: '6.5 Eligible Children.', bold: true },
            ' Play privileges are available only to Member Children who meet the age and size requirements in the Facility Rules as determined by Treehouse. Member Children may not be substituted or exchanged for other children.',
          ],

          { style: 'h2', text: '7. Membership Freeze' },
          [
            { text: '7.1 Eligibility.', bold: true },
            ' Freezes are available to Early Bird and Regular Members during any Annual Term, whether paid in full or in installments. Month-to-month Members are not eligible for a freeze and may cancel instead under Section 3.6.',
          ],
          [
            { text: '7.2 Freeze Allowance.', bold: true },
            ' You may freeze your Membership for up to three (3) months total during each Annual Term, either all at once or in multiple freezes. Each freeze must last at least one (1) month and must be taken in whole-month increments. Unused freeze time does not carry over to a later Annual Term.',
          ],
          [
            { text: '7.3 Requests.', bold: true },
            ' You must request each freeze in advance, by email, or in person, at least seven (7) days before the freeze start date. Freezes cannot be applied retroactively. Treehouse will confirm the freeze start and end dates in writing.',
          ],
          [
            { text: '7.4 Effect of a Freeze.', bold: true },
            ' During a freeze, Member Children may not use the Facility and member benefits, including buddy passes, are unavailable. Your Annual Term end date, and for Early Bird Members the Rate Lock Period, are extended by the length of the freeze so that no paid membership time is lost. If you pay in installments, any installment not yet due when the freeze begins is deferred under Section 9.2. There is no fee for a freeze. Your Membership automatically resumes at the end of the freeze.',
          ],
          [
            { text: '7.5 Renewed Annual Terms.', bold: true },
            ' A new freeze allowance under Section 7.2 applies to each new Annual Term.',
          ],

          { style: 'h2', text: '8. Facility Closures' },
          'If Treehouse closes the entire Facility to members for any reason, including maintenance, repairs, weather, emergencies, or government order, for five (5) or more consecutive days (excluding regularly scheduled holiday closures listed in the Facility Rules), all Memberships are automatically paused for the length of the closure and resume when the Facility reopens. No request is needed. For an Annual Term, the Annual Term end date, and for Early Bird Members the Rate Lock Period, are extended by the length of the closure. If you pay in installments, any installment not yet due when the closure pause begins is deferred under Section 9.2. For a month-to-month Membership, Treehouse will credit your next monthly charge for the closure period, prorated by day. A closure pause does not count against your freeze allowance. If the Facility remains closed for more than ninety (90) consecutive days, Section 12.3 applies.',

          { style: 'h2', text: '9. Billing and Payment' },
          [
            { text: '9.1 Payment Method and Autopay Authorization.', bold: true },
            ' You must keep a valid credit card, debit card, or bank account on file for as long as your Membership is active. ',
            {
              text: 'BY SIGNING THIS AGREEMENT, YOU AUTHORIZE TREEHOUSE TO CHARGE YOUR PAYMENT METHOD ON FILE FOR: (a) THE FULL ANNUAL TERM AMOUNT OR EACH INSTALLMENT, AS APPLICABLE, ON THE DATES SPECIFIED IN SECTION 9.2 FOR THE INITIAL ANNUAL TERM, ANY AUTOMATIC RENEWAL UNDER SECTION 3.3, AND ANY ANNUAL TERM YOU ELECT UNDER SECTION 3.4; (b) THE APPLICABLE MONTHLY RATE ON EACH MONTHLY BILLING DATE FOR ANY MONTH-TO-MONTH PERIOD, INCLUDING AFTER YOU SWITCH TO MONTH-TO-MONTH UNDER SECTION 3.4 OR YOUR MEMBERSHIP CONTINUES MONTH-TO-MONTH UNDER SECTION 3.3; (c) PRORATED UPGRADE CHARGES UNDER SECTION 6; AND (d) APPLICABLE TAXES AND FEES UNDER THIS AGREEMENT.',
              bold: true,
            },
            ' This authorization continues until your Membership ends and all amounts owed are paid. You may update your payment method at any time through your online member account or at the front desk.',
          ],
          [
            { text: '9.2 Billing Dates.', bold: true },
            ' (a) For the initial Annual Term, the full payment or first installment is due at signing. For any subsequent Annual Term, the full payment or first installment is due on the first day of that term. If you pay in installments, each installment is one-twelfth of the Annual Term total, subject to any rounding adjustment on the final installment. The remaining eleven (11) installments are billed monthly, starting one month after the first day of the Annual Term. A freeze under Section 7 or a closure pause under Section 8 defers each installment not yet due when the pause begins by the length of the pause; it does not reduce the number or amount of installments. Treehouse will confirm the revised billing dates in writing. (b) For a month-to-month Membership, the first monthly charge is due the day after the Annual Term ends, including any extension, and later monthly charges are billed in advance on the same day of each following month. (c) If a scheduled monthly billing day does not exist in a given month, the charge is due on the last day of that month.',
          ],
          [
            { text: '9.3 Failed Payments.', bold: true },
            ' If a payment is declined or fails, Treehouse will notify you by email and may retry the charge up to three (3) times over the following thirty (30) days. Treehouse may charge a failed-payment fee of $25 for each failed payment, to the extent permitted by law. If the past-due amount is not paid within ten (10) days after Treehouse’s notice, Treehouse may suspend Facility access until it is paid. If the past-due amount remains unpaid thirty (30) days after Treehouse’s notice, Treehouse may terminate the Membership, and you will remain responsible for all amounts owed through the termination date. A suspension for non-payment does not extend your Annual Term or the Rate Lock Period.',
          ],
          [
            { text: '9.4 Collections.', bold: true },
            ' If Treehouse refers an unpaid balance for collection, you agree to pay reasonable collection costs and attorneys’ fees incurred by Treehouse, to the extent permitted by law.',
          ],
          [
            { text: '9.5 Rate Changes.', bold: true },
            ' Treehouse may change its membership rates from time to time, subject to the following: (a) the rate for an Annual Term will not change during that Annual Term; (b) Early Bird rates will not change during the Rate Lock Period; (c) for a month-to-month Membership, Treehouse will give you at least thirty (30) days’ written notice before a new rate applies, and you may cancel under Section 3.6 before the new rate takes effect; and (d) the rates that would apply following an Annual Term will be stated in the notice under Section 3.9, when sent.',
          ],
          [
            { text: '9.6 Refunds.', bold: true },
            ' Except as stated in Sections 3.7, 3.8, 10, and 12.3, or as required by law, all payments are non-refundable, and Treehouse does not issue refunds or credits for unused visits, partial months, or periods when Member Children do not use the Facility.',
          ],

          { style: 'h2', text: '10. Medical and Hardship Exception' },
          'If the Member or a Member Child experiences a serious medical condition or other genuine hardship that prevents use of the Facility, you may submit a written request, with reasonable supporting documentation, for a full or partial refund, a release from an Annual Term, or another accommodation. Treehouse will consider each request in good faith but may grant or deny it in its sole discretion. Any accommodation is granted as a courtesy, is not a right under this Agreement, and does not obligate Treehouse to grant any other request.',

          { style: 'h2', text: '11. Waiver, Facility Rules, and Supervision' },
          [
            { text: '11.1 Waiver.', bold: true },
            ' The Member must sign the Waiver for each Member Child before the child first uses the Facility, and each Authorized Adult must sign the Waiver before supervising a Member Child at the Facility. Because each signed Waiver applies for twelve (12) months unless a newer version is signed, the Member and each Authorized Adult must sign a new Waiver at least once every twelve (12) months and whenever Treehouse issues an updated Waiver. Treehouse may deny Facility access until a current Waiver is on file, and a denial for that reason does not extend the Annual Term or reduce any amount owed. The Waiver is incorporated into this Agreement by reference. The Member and each Authorized Adult agree to remain bound by the Waiver throughout the Membership, and the Member Children participate subject to the Waiver, in each case to the fullest extent permitted by Utah law.',
          ],
          [
            { text: '11.2 Guests.', bold: true },
            ' Before any guest, including a buddy pass guest, uses the Facility, a Waiver must be signed for that guest by the guest’s own parent or legal guardian (or, for an adult guest, by the guest). A Member or Authorized Adult may not sign the Waiver for a guest child unless the Member or Authorized Adult is that child’s parent or legal guardian or otherwise has lawful authority to consent to the child’s participation.',
          ],
          [
            { text: '11.3 Supervision.', bold: true },
            ' Treehouse does not provide childcare or supervision. The Member or an Authorized Adult must remain at the Facility and actively supervise each Member Child and each guest at all times, as required by the Waiver and the Facility Rules.',
          ],
          [
            { text: '11.4 Facility Rules.', bold: true },
            ' The Member, Member Children, Authorized Adults, and guests must comply with the Facility Rules, posted signs, and staff instructions. The Facility Rules in effect on the Effective Date are attached as Schedule A. Treehouse may update the Facility Rules at any time by posting them at the Facility and on its website, and updated rules apply once posted.',
          ],
          [
            { text: '11.5 Order of Precedence.', bold: true },
            ' If this Agreement conflicts with the Waiver on any matter of risk, release, indemnity, or liability, the Waiver controls. If this Agreement conflicts with the Waiver or the Facility Rules on any matter of membership, billing, cancellation, or refunds, this Agreement controls.',
          ],

          { style: 'h2', text: '12. Suspension and Termination by Treehouse' },
          [
            { text: '12.1 Suspension or Termination for Cause.', bold: true },
            ' Treehouse may suspend or terminate a Membership, or restrict any individual’s access to the Facility, if Treehouse reasonably determines that the Member, a Member Child, an Authorized Adult, or a guest has: (a) engaged in conduct that endangers the health or safety of any person; (b) violated the Facility Rules or the Waiver, including the supervision and alcohol provisions of the Waiver; (c) engaged in harassment, threats, abusive or disruptive behavior, theft, or intentional property damage; (d) provided false information, including about a child’s eligibility, or allowed anyone other than the Member Children to use the Membership; or (e) failed to pay amounts owed as described in Section 9.3. If Treehouse reasonably believes a safety risk exists, it may act immediately. Otherwise, Treehouse may, in its discretion, give written notice and a reasonable opportunity to correct a first violation before terminating the Membership.',
          ],
          [
            { text: '12.2 Effect of Termination for Cause.', bold: true },
            ' If a Membership is terminated for cause: (a) prepaid dues are not refunded; (b) the Member remains responsible for all amounts owed through the termination date; and (c) any Early Bird rate lock ends and Founding Member status may be revoked. A suspension does not extend the Annual Term or the Rate Lock Period.',
          ],
          [
            { text: '12.3 Termination Without Cause; Permanent Closure.', bold: true },
            ' Treehouse may terminate any Membership without cause on at least thirty (30) days’ written notice. If Treehouse terminates a Membership without cause or permanently closes the Facility, or if the Facility remains closed for more than ninety (90) consecutive days and you request in writing to end your Membership, Treehouse will prorate the Annual Term total by day through the effective termination date, excluding freeze and closure-pause days, and refund any amount paid in excess of that prorated total. Any unpaid balance is limited to the prorated amount owed, and Treehouse will stop scheduled installment and month-to-month charges.',
          ],

          { style: 'h2', text: '13. Non-Transferability; Assignment' },
          'Your Membership, any Early Bird rate, and Founding Member status are personal to you and the Member Children and may not be sold, transferred, shared, or assigned. Treehouse may assign this Agreement to a successor operator of the Facility, who will be bound by this Agreement, including the Early Bird rate lock and Founding Member status.',

          { style: 'h2', text: '14. Amendments' },
          'Treehouse may amend this Agreement by giving you at least thirty (30) days’ written notice. An amendment applies to a month-to-month Membership beginning on the first billing date after the notice period ends, and you may cancel before then under Section 3.6. An amendment applies to an Annual Term only when the next Annual Term or month-to-month period begins, unless you agree otherwise in writing. No amendment will increase the rate for an Annual Term already in progress, shorten the Rate Lock Period, or reduce Founding Member status. Updates to the Facility Rules are governed by Section 11.4.',

          { style: 'h2', text: '15. Notices and Electronic Communications' },
          [
            'Treehouse will send notices to the email address you provide, and a notice is effective when sent unless Treehouse receives a delivery-failure message. You must keep your email address current. You may send notices to Treehouse by email to ',
            { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' },
            ' or by mail to 1209 Center Dr., Park City, Utah 84098. You consent to receive this Agreement, notices, receipts, and other communications electronically.',
          ],

          { style: 'h2', text: '16. Governing Law and Dispute Resolution' },
          [
            { text: '16.1 Governing Law.', bold: true },
            ' This Agreement is governed by the laws of the State of Utah, without regard to its conflict-of-laws principles.',
          ],
          [
            {
              text: '16.2 Arbitration. PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR RIGHT TO COURT PROCEEDINGS AND A JURY TRIAL.',
              bold: true,
            },
            ' Except as stated in this Section, any dispute or claim between Treehouse and the Member, in the Member’s individual capacity, arising out of or relating to this Agreement or the Membership will be resolved by final and binding arbitration rather than in court. This Section does not apply to a Member Child’s own claims or to any claim that applicable law does not permit to be arbitrated, and either party may instead bring an individual claim in small claims court if the claim qualifies. The arbitration will be administered by JAMS under its Streamlined Arbitration Rules & Procedures (or, for a claim over $250,000, its Comprehensive Arbitration Rules & Procedures) and the JAMS Consumer Arbitration Minimum Standards, each as in effect when the arbitration begins. If the Member starts the arbitration, the Member will pay no more than the consumer filing fee permitted by the JAMS Consumer Arbitration Minimum Standards, and Treehouse will pay all other JAMS fees and the arbitrator’s fees. If Treehouse starts the arbitration, Treehouse will pay all JAMS fees and the arbitrator’s fees. Any in-person hearing will be held in the Utah county in which the Facility is located, but the Member may choose to participate by video or telephone. The arbitrator may award any individual relief that would otherwise be available in court. Claims may be brought only on an individual basis and not as a class or representative action. The Federal Arbitration Act governs this Section to the extent applicable; otherwise, the Utah Uniform Arbitration Act governs.',
          ],
          [
            { text: '16.3 Right to Opt Out.', bold: true },
            ' The Member may reject Section 16.2 by emailing ',
            { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' },
            ' within thirty (30) days after signing this Agreement, stating the Member’s name and that the Member rejects arbitration. Rejecting arbitration will not affect any other part of this Agreement or the Waiver. If Section 16.2 is found unenforceable for any reason other than an opt-out, Treehouse and the Member waive any right to a jury trial for the claims covered by Section 16.2, to the extent permitted by law. ',
            {
              text: 'BY AGREEING TO ARBITRATION, TREEHOUSE AND THE MEMBER UNDERSTAND THAT COVERED DISPUTES WILL BE DECIDED BY AN ARBITRATOR RATHER THAN A JUDGE OR JURY.',
              bold: true,
            },
          ],

          { style: 'h2', text: '17. General Terms' },
          'This Agreement, together with the Waiver and the Facility Rules, is the entire agreement between Treehouse and the Member regarding the Membership. If any provision of this Agreement is found unenforceable, it will be enforced to the maximum extent permitted, and the rest of this Agreement will remain in effect. Treehouse’s failure to enforce any provision is not a waiver of that provision. Sections 4.6, 4.7, 9.4, 11, 12.2, 16, and 17 survive the end of this Agreement. Electronic signatures have the same effect as handwritten signatures. Treehouse will provide you with a fully completed copy of this Agreement when you sign it, and you may request a copy at any time.',

          { style: 'h2', text: '18. Signatures' },
          [
            {
              text: 'BY SIGNING BELOW, THE MEMBER ACKNOWLEDGES THAT THE MEMBER HAS READ AND AGREES TO THIS AGREEMENT, INCLUDING THE REQUIRED ANNUAL COMMITMENT IN SECTION 3.1, THE NO-CANCELLATION TERMS FOR ANNUAL TERMS IN SECTION 3.2, THE AUTOMATIC RENEWAL OF ANNUAL TERMS IN SECTION 3.3, THE AUTOPAY AUTHORIZATION IN SECTION 9.1, AND THE ARBITRATION PROVISION IN SECTION 16, AND HAS RECEIVED A COPY OF THE WAIVER AND THE FACILITY RULES.',
              bold: true,
            },
          ],

          { style: 'h2', text: 'SCHEDULE A' },
          { style: 'h2', text: 'FACILITY RULES' },
          [
            { text: 'Treehouse Front-Desk Rules', bold: true },
            ' — Be brave. Be kind. Be curious. These rules apply to everyone visiting the Facility. Read the signs for each activity and follow staff instructions.',
          ],

          { style: 'h3', text: 'Check-in and supervision' },
          {
            bullet:
              'Check in before entering the play areas. Check in guests and redeem buddy passes at the front desk before play. Do not share your member code.',
          },
          {
            bullet:
              'A current Treehouse Waiver must be on file before play or supervision, as applicable. A parent or legal guardian must sign for a child unless another person has lawful authority to consent; adult guests sign for themselves. See Agreement Sections 5.2 and 11 for the full guest, buddy-pass, and Waiver requirements.',
          },
          {
            bullet:
              'No drop-offs. Parents and caregivers must stay at the Facility and actively supervise the children in their care, including guest children, at all times. Stay close enough to see and respond to them promptly. Treehouse staff do not provide childcare or take over supervision.',
          },
          {
            // The attorney’s draft carries '[To be added]' highlighted in both
            // slots here; this is the client’s wording in its place. Still a
            // standing placeholder in substance — replace this sentence with
            // the real hours and holiday closures once they are set, rather
            // than adding them alongside it.
            bullet:
              'Operating hours and regularly scheduled holiday closures are to be determined and will be announced at a later date. Check the front desk or Treehouse website for updates.',
          },

          { style: 'h3', text: 'Play areas and equipment' },
          {
            bullet:
              'The toddler area is for children under age 3. Follow posted age, height, size, and capacity limits for each activity. Adults may enter play areas to supervise, but may use equipment only where signs or staff permit it.',
          },
          {
            bullet:
              'Walk in the play areas. No running, chasing, pushing, bullying, rough play, or throwing objects. Take turns and give others room.',
          },
          {
            bullet:
              'Go down slides feet first, one person at a time. Wait until the landing is clear; never climb up a slide or block its exit. Do not climb on netting, barriers, or the outside of play structures. Use only designated climbing surfaces.',
          },
          {
            bullet:
              'Use equipment only as intended. Stay out of closed or staff-only areas and keep exits and walkways clear.',
          },

          { style: 'h3', text: 'Socks, clothing, and belongings' },
          {
            bullet:
              'No shoes or bare feet in play areas. Children must wear grip socks at all times in play areas. Supervising adults may wear clean regular socks or grip socks. Grip socks are available for purchase at the front desk.',
          },
          {
            bullet:
              'Before entering, remove loose jewelry, lanyards, and sharp objects; empty loose items from pockets and secure long hair. Keep bags, strollers, and other belongings away from play equipment and exits.',
          },
          {
            bullet:
              'No food, drinks, or gum in play areas. Use designated eating areas and put litter in the bins. No smoking or vaping inside the Facility.',
          },

          { style: 'h3', text: 'Illness, accessibility, and safety concerns' },
          {
            bullet:
              'If you or a child in your care is sick or may be contagious, please postpone your visit. If symptoms develop during a visit, stop play and leave the play area.',
          },
          {
            bullet:
              'If an injury, pregnancy, or health condition may make a particular activity unsafe for you or your child, skip that activity until you can participate safely. Ask the front desk about activity requirements, accessible alternatives, or reasonable modifications. Treehouse considers requests individually and bases any safety restrictions on actual risks, consistent with applicable law.',
          },
          {
            bullet:
              'Stop using equipment if it appears damaged or unsafe. Report injuries, spills, damaged equipment, or unsafe conduct to a Treehouse team member immediately. In an emergency, follow staff directions and use designated exits.',
          },

          { style: 'h3', text: 'Enforcement and Waiver' },
          'Staff may stop unsafe play, close equipment, restrict access, or ask anyone who violates these rules or creates a safety risk to leave. Membership suspension or termination is governed by Section 12 of the Agreement. These rules do not replace the Waiver or alter any rights or duties under applicable law.',

          { style: 'h3', text: 'Membership policy summary' },
          {
            bullet: [
              { text: 'Term and cancellation (Section 3).', bold: true },
              ' All memberships begin with a required 12-month term, payable in full or in installments. Installments are not a month-to-month membership. Unless an exception applies, you cannot cancel mid-term. To stop annual renewal or switch to month-to-month, notify Treehouse before the Annual Term ends. Once you are on a month-to-month plan, cancel before your next billing date to end the membership at the end of the current paid month.',
            ],
          },
          {
            bullet: [
              { text: 'Freezes (Section 7).', bold: true },
              ' Annual members may request up to three months of freeze time per Annual Term in whole-month increments. Request a freeze at least seven days before it starts. A freeze extends the Annual Term and defers installments not yet due; play and member benefits are unavailable during the freeze.',
            ],
          },
          {
            bullet: [
              { text: 'Refunds (Section 9.6).', bold: true },
              ' Payments are generally nonrefundable. See Sections 3.7 and 3.8 for the three-business-day cancellation right and pre-opening purchase protections, and Sections 10 and 12.3 for other exceptions. Rights required by law also apply.',
            ],
          },
          'This summary does not change the Agreement. If it conflicts with the Agreement on membership, billing, cancellation, or refunds, the Agreement controls.',
        ),
      ],
    },
  ],
};
