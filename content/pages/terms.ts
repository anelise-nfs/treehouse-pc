import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';

/**
 * Website Terms of Use, transcribed from the attorney's draft.
 *
 * COPY IS VERBATIM, including the all-capitals passages in sections 12 and 13.
 * Those are set that way on purpose — conspicuousness of a disclaimer and a
 * limitation of liability is a legal requirement in several states, not a
 * typographic preference — so they are not sentence-cased, and the component
 * must never transform them.
 *
 * The only edits are structural: the source's `#` headings become h2 because
 * the page's h1 is its title, and the contact address becomes a real mailto.
 *
 * The effective date is set rather than left as the draft's [INSERT DATE].
 */
export const termsPage: Page = {
  _id: 'page.terms',
  _type: 'page',
  title: 'Terms of Use',
  slug: 'terms',
  headerVariant: 'topbar',
  seo: {
    title: 'Terms of Use — Treehouse Park City',
    description:
      'The Website Terms of Use governing access to and use of the Treehouse LLC website and online services.',
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // No doodles, matching /privacy — see the note there.
      title: 'Terms of Use',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with the other
        // sub-pages.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'terms',
      _type: 'legalDocument',
      eyebrow: 'Treehouse LLC | Park City, Utah',
      effectiveDate: 'Effective Date: November 19, 2026',
      body: pt(
        'These Website Terms of Use ("Terms") govern your access to and use of the website, online account, reservation and purchasing features, forms, and other online services made available by Treehouse LLC, doing business as Treehouse ("Treehouse," "we," "us," or "our") (collectively, the "Site"). By accessing or using the Site, you agree to these Terms. If you do not agree, do not use the Site.',
        {
          style: 'blockquote',
          text: 'Important: These Terms govern the Site. Admission to or participation at the Treehouse facility is also subject to the applicable Membership Agreement, Participation Agreement and Waiver, Facility Rules, and purchase or reservation terms. The applicable separate agreement controls if it conflicts with these Terms on membership, payment, cancellation, safety, participation, risk allocation, or facility use.',
        },

        { style: 'h2', text: '1. Eligibility and Use of the Site' },
        'You must be at least 18 years old to create an account, make a purchase, enter into a membership, make a reservation, or sign a waiver through the Site. A minor may use the Site only with the involvement and supervision of a parent or legal guardian. If you use the Site for another person or entity, you represent that you have authority to act for that person or entity.',

        { style: 'h2', text: '2. Information About Treehouse' },
        'The Site provides information about Treehouse’s children’s indoor play facility in Park City, Utah, including memberships, day admission, classes, parties, events, food and beverage offerings, hours, rules, and other services. Content is provided for general information and may be changed or corrected without notice. Hours, capacity, programs, equipment, pricing, and availability may change. A listing on the Site is not a guarantee that a service, time, or amenity will be available.',

        { style: 'h2', text: '3. Accounts and Account Security' },
        'Some features may require an account. You agree to provide accurate, current, and complete information; keep it updated; protect your credentials; and notify Treehouse promptly of suspected unauthorized use. You are responsible for activity through your account to the extent permitted by law. Treehouse may suspend or terminate access where reasonably necessary to protect the Site, Treehouse, or other users, or to address a suspected violation of these Terms or another applicable agreement.',

        { style: 'h2', text: '4. Purchases, Reservations, Memberships, and Waivers' },
        'Purchases, reservations, memberships, and facility participation may be subject to additional terms presented at checkout or signature. Prices are stated in U.S. dollars and exclude applicable taxes unless otherwise stated. Payment may be processed by a third-party processor. Treehouse may correct errors and, where an error materially affects a transaction, cancel the affected transaction and issue any refund required by the applicable agreement or law.',
        'A reservation request or order is not final until confirmed. Capacity limits, age and size restrictions, Facility Rules, and waiver requirements may apply. Each participant must have any required waiver on file before participating. Purchasing admission, a membership, or a reservation does not waive safety rules or supervision requirements.',

        { style: 'h2', text: '5. No Childcare or Supervision Through the Site' },
        'Nothing on the Site represents that Treehouse provides childcare or assumes responsibility for supervising children. Adults remain responsible for active supervision as stated in the applicable waiver, Membership Agreement, and Facility Rules. Information on the Site is not medical, safety, or professional advice and does not replace an adult’s judgment about whether an activity is suitable for a participant.',

        { style: 'h2', text: '6. Electronic Communications and Signatures' },
        'When you provide an email address or telephone number, submit a form, or complete a transaction, you consent to receive transaction and service communications electronically, subject to applicable law. Electronic signatures and records may be used for agreements and waivers. Marketing communications are governed by the choices described in our Privacy Policy and any consent presented when you subscribe.',

        { style: 'h2', text: '7. Privacy' },
        'Our Privacy Policy explains how we collect, use, and disclose personal information. By using the Site, you acknowledge that information will be handled as described in that Policy.',

        { style: 'h2', text: '8. Intellectual Property' },
        'The Site and its content, including text, graphics, logos, photographs, videos, designs, software, and arrangement, are owned by Treehouse or its licensors and protected by law. Subject to these Terms, Treehouse grants you a limited, personal, nonexclusive, nontransferable, revocable license to access and use the Site for lawful, noncommercial purposes related to evaluating or purchasing Treehouse services. You may not copy, modify, distribute, sell, license, publicly display, create derivative works from, scrape, frame, or exploit the Site or content except with Treehouse’s prior written permission or as permitted by law. Treehouse’s name and logos may not be used without prior written permission.',

        { style: 'h2', text: '9. User Submissions and Feedback' },
        'You are responsible for information, reviews, photographs, videos, messages, and other materials you submit. You represent that you have the right to submit them and that they do not violate law or another person’s rights. You grant Treehouse a nonexclusive, worldwide, royalty-free license to use, reproduce, and display submissions as reasonably necessary to operate the Services, respond to you, and exercise rights you specifically authorize. Promotional use of photographs or video of guests is governed by the applicable consent or waiver. Treehouse may use suggestions and feedback without compensation or restriction, but will handle personal information under the Privacy Policy.',

        { style: 'h2', text: '10. Prohibited Conduct' },
        'You may not:',
        { bullet: 'Use the Site for unlawful, fraudulent, harassing, deceptive, or harmful activity.' },
        {
          bullet:
            'Provide false information, impersonate another person, or misrepresent your authority regarding a child, participant, reservation, membership, waiver, or payment method.',
        },
        {
          bullet:
            'Attempt to access another account or any nonpublic system, data, or feature without authorization.',
        },
        {
          bullet:
            'Interfere with the Site’s operation or security, introduce malicious code, evade access controls, or test vulnerabilities without written authorization.',
        },
        {
          bullet:
            'Use bots, scrapers, or other automated means to access or collect Site content, except ordinary search-engine indexing that follows our instructions.',
        },
        { bullet: 'Infringe intellectual-property, privacy, publicity, or other rights.' },
        {
          bullet:
            'Use the Site to resell admissions, memberships, reservations, or benefits unless Treehouse expressly permits it.',
        },

        { style: 'h2', text: '11. Third-Party Services and Links' },
        'The Site may link to or integrate services operated by third parties, such as payment, reservation, mapping, social-media, or analytics providers. Treehouse does not control and is not responsible for third-party services, content, availability, security, or privacy practices. Your use of a third-party service may be governed by that provider’s terms and policies.',

        { style: 'h2', text: '12. Site Availability and Disclaimer' },
        'THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE FULLEST EXTENT PERMITTED BY LAW, TREEHOUSE DISCLAIMS IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. TREEHOUSE DOES NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR THAT SITE CONTENT WILL ALWAYS BE ACCURATE, COMPLETE, OR CURRENT.',
        'These disclaimers concern the Site. They do not expand, reduce, or replace duties, rights, releases, or limitations contained in an applicable Membership Agreement, waiver, Facility Rule, or other written agreement, and do not exclude warranties that cannot lawfully be excluded.',

        { style: 'h2', text: '13. Limitation of Liability' },
        'TO THE FULLEST EXTENT PERMITTED BY LAW, TREEHOUSE AND ITS OWNERS, MANAGERS, EMPLOYEES, AGENTS, SERVICE PROVIDERS, AND LICENSORS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR LOSS OF DATA, PROFITS, REVENUE, OR GOODWILL, ARISING FROM OR RELATING TO THE SITE, EVEN IF ADVISED THAT SUCH DAMAGES ARE POSSIBLE.',
        'TO THE FULLEST EXTENT PERMITTED BY LAW, THE AGGREGATE LIABILITY OF TREEHOUSE AND THOSE PARTIES FOR CLAIMS ARISING FROM OR RELATING SOLELY TO THE SITE WILL NOT EXCEED THE GREATER OF (A) $100 OR (B) THE AMOUNT YOU PAID TO TREEHOUSE THROUGH THE SITE FOR THE TRANSACTION GIVING RISE TO THE CLAIM DURING THE SIX MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY. This Section does not limit liability that cannot lawfully be limited and does not govern a claim for bodily injury or facility participation to the extent that claim is governed by a separate written agreement or applicable law.',

        { style: 'h2', text: '14. Indemnification' },
        'To the extent permitted by law, you agree to indemnify and hold harmless Treehouse and its owners, managers, employees, and agents from third-party claims, damages, liabilities, and reasonable costs arising from your unlawful use of the Site, your violation of these Terms, or content you submit that violates another person’s rights. This Section does not require you to indemnify Treehouse for Treehouse’s own negligence or misconduct and does not alter protections applicable to minors.',

        { style: 'h2', text: '15. Governing Law and Disputes' },
        'These Terms are governed by Utah law, without regard to conflict-of-laws principles. Any dispute arising solely from the Site or these Terms that is not governed by a separate written arbitration agreement will be brought exclusively in the state or federal courts having jurisdiction in Summit County, Utah, and each party consents to that venue and jurisdiction. The arbitration provisions in an applicable Membership Agreement or Participation Agreement and Waiver govern disputes within their scope. Nothing in this Section prevents an eligible individual claim in small claims court.',

        { style: 'h2', text: '16. Changes to the Site or These Terms' },
        'Treehouse may modify or discontinue the Site or update these Terms from time to time. Updated Terms will be posted with a revised Effective Date. Changes apply prospectively when posted, except where additional notice or consent is required by law. Continued use after the effective date of updated Terms constitutes acceptance of the updated Terms.',

        { style: 'h2', text: '17. General Terms' },
        'If a provision of these Terms is unenforceable, it will be enforced to the maximum extent permitted and the remainder will remain in effect. Treehouse’s failure to enforce a provision is not a waiver. You may not assign these Terms without Treehouse’s consent; Treehouse may assign them in connection with a reorganization, financing, sale, or transfer of its business or assets. These Terms and the Privacy Policy are the entire agreement regarding general use of the Site, but do not replace a Membership Agreement, waiver, Facility Rule, checkout term, or other separate agreement.',

        { style: 'h2', text: '18. Contact Information' },
        'Treehouse LLC',
        '1209 Center Drive',
        'Park City, Utah 84098',
        ['Email: ', { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' }],
      ),
    },
  ],
};
