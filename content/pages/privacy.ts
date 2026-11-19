import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';

/**
 * Privacy Policy, transcribed from the attorney's draft.
 *
 * COPY IS VERBATIM. Nothing below is rewritten, shortened, merged or
 * reordered, including the sections whose wording reads oddly out of context —
 * legal text means what it says and an editorial improvement is a change to
 * the agreement. The only edits are structural: the source's `#` headings
 * become h2 because the page's h1 is its title, and the markdown autolink
 * around the contact address becomes a real mailto.
 *
 * The effective date is set rather than left as the draft's [INSERT DATE].
 */
export const privacyPage: Page = {
  _id: 'page.privacy',
  _type: 'page',
  title: 'Privacy Policy',
  slug: 'privacy',
  headerVariant: 'topbar',
  seo: {
    title: 'Privacy Policy — Treehouse Park City',
    description:
      'How Treehouse LLC collects, uses, and discloses personal information through its website and at its Park City facility.',
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // No doodles. The two sub-pages that carry them are selling something;
      // this one is a legal document, and a marker drawn in crayon beside the
      // word "Privacy Policy" undercuts it.
      title: 'Privacy Policy',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with the other
        // sub-pages.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'policy',
      _type: 'legalDocument',
      eyebrow: 'Treehouse LLC | Park City, Utah',
      effectiveDate: 'Effective Date: November 19, 2026',
      body: pt(
        'This Privacy Policy explains how Treehouse LLC, doing business as Treehouse ("Treehouse," "we," "us," or "our"), collects, uses, and discloses personal information when you visit our website, create or use an account, purchase a membership or other service, register for a visit, sign a waiver, contact us, or otherwise interact with us online or at our Park City, Utah facility (collectively, the "Services").',
        {
          style: 'blockquote',
          text: 'This Policy describes our information practices. Separate terms, including our Membership Agreement, Participation Agreement and Waiver, Facility Rules, and Website Terms of Use, govern use of particular services and activities.',
        },

        { style: 'h2', text: '1. Personal Information We Collect' },
        'The information we collect depends on how you interact with us and may include:',
        {
          bullet:
            'Contact and account information, such as name, mailing address, email address, telephone number, username, password, and account preferences.',
        },
        {
          bullet:
            'Membership and transaction information, such as membership type and tier, member children, authorized adults, purchases, reservations, classes, parties, discounts, billing status, and transaction history.',
        },
        {
          bullet:
            'Participant and waiver information, such as names and birth dates of adult and minor participants, relationship to a minor, electronic signatures, emergency contact information, acknowledgments, and records showing acceptance of agreements and facility rules.',
        },
        {
          bullet:
            'Health and safety information you choose to provide, such as allergies, medical conditions relevant to an emergency, incident reports, and requests for a medical or hardship accommodation.',
        },
        {
          bullet:
            'Payment information. Payments may be processed by a third-party payment processor. We generally receive transaction details and limited payment information, rather than complete payment-card numbers.',
        },
        {
          bullet:
            'Communications and submissions, such as messages, customer-service inquiries, survey responses, feedback, reviews, and information submitted through forms.',
        },
        {
          bullet:
            'Device and usage information, such as IP address, browser and device type, operating system, pages viewed, referring pages, dates and times of visits, and interactions with our website or emails.',
        },
        {
          bullet:
            'Images and recordings, such as photographs or video submitted to us, security-camera footage at the facility, and photographs or recordings taken at events or in common areas, subject to applicable notices, permissions, and opt-outs.',
        },
        {
          bullet:
            'Precise or approximate location information only if enabled by the website, your device, or a service you use.',
        },
        'Please do not submit sensitive information through a general website contact form unless we specifically request it.',

        { style: 'h2', text: '2. How We Collect Information' },
        {
          bullet:
            'Directly from you, including when you create an account, sign an agreement or waiver, make a purchase, join a waitlist, make a reservation, contact us, or visit the facility.',
        },
        {
          bullet:
            'Automatically from your browser or device through cookies, pixels, logs, and similar technologies.',
        },
        {
          bullet:
            'From service providers and business partners, such as website hosts, membership and reservation platforms, payment processors, email and text providers, analytics providers, social-media platforms, and advertising partners.',
        },
        {
          bullet:
            'From another adult who is authorized to provide information about a child or participant.',
        },

        { style: 'h2', text: '3. How We Use Personal Information' },
        {
          bullet:
            'Provide and administer memberships, admissions, reservations, classes, birthday parties, events, food and beverage purchases, and other Services.',
        },
        {
          bullet:
            'Create and maintain accounts; process payments; provide receipts; administer renewals, freezes, cancellations, refunds, and waitlists; and detect or prevent fraudulent transactions.',
        },
        {
          bullet:
            'Confirm waivers, authorized adults, participant eligibility, and compliance with Facility Rules.',
        },
        {
          bullet:
            'Communicate about operations, reservations, purchases, membership status, renewals, closures, safety matters, policy changes, and customer-service requests.',
        },
        {
          bullet:
            'Protect the health, safety, property, and legal rights of Treehouse, guests, employees, and others; respond to incidents and emergencies; and maintain security.',
        },
        {
          bullet:
            'Operate, secure, troubleshoot, analyze, and improve our website, facility, programs, and Services.',
        },
        {
          bullet:
            'Send marketing communications about Treehouse programs, events, and offers, where permitted by law. You may opt out of marketing emails using the unsubscribe link and of marketing texts by replying STOP. We may still send nonmarketing messages concerning your transactions or membership.',
        },
        {
          bullet:
            'Comply with law, enforce our agreements, resolve disputes, and establish or defend legal claims.',
        },
        {
          bullet:
            'Use information for another purpose disclosed when the information is collected or with your consent.',
        },

        { style: 'h2', text: '4. How We Disclose Personal Information' },
        'We may disclose personal information to:',
        {
          bullet:
            'Service providers that perform services for us, including website hosting, account and membership administration, reservations, electronic signatures, payment processing, communications, analytics, information technology, security, professional advice, and records storage.',
        },
        {
          bullet:
            'Business partners when needed to provide a program, promotion, event, or benefit you request.',
        },
        {
          bullet:
            'Government authorities, law enforcement, emergency responders, insurers, attorneys, accountants, and other persons when reasonably necessary to comply with law, protect safety or rights, respond to an emergency, or handle a claim or dispute.',
        },
        {
          bullet:
            'A buyer, successor, lender, or advisor in connection with a merger, financing, reorganization, sale of assets, or similar business transaction.',
        },
        { bullet: 'Other persons at your direction or with your consent.' },
        'We do not sell personal information for money. If Treehouse later uses personal information for targeted advertising or another activity treated as a “sale” or “sharing” under an applicable state privacy law, we will provide any notices and choices required by that law.',

        { style: 'h2', text: '5. Cookies and Analytics' },
        'We and our service providers may use cookies and similar technologies to operate the website, remember preferences, understand website use, measure communications, maintain security, and improve the Services. You can adjust cookie settings through your browser and, if available, through our cookie settings tool. Blocking cookies may cause portions of the website to function incorrectly. Some browsers offer “Do Not Track” signals, but there is no uniform industry standard for responding to them. We will process browser-based opt-out preference signals when required by applicable law.',

        { style: 'h2', text: '6. Payments and Third-Party Services' },
        'Payment, reservation, membership, mapping, social-media, or other third-party services may collect information directly from you under their own privacy policies. Treehouse is not responsible for the privacy practices of third-party services or websites. Review their policies before providing information.',

        { style: 'h2', text: '7. Children’s Privacy' },
        'Treehouse is a children’s indoor play facility, but the website and account, purchasing, membership, reservation, and waiver features are intended for adults. A person under 13 should not submit personal information directly through the website. We may collect information about a child from the child’s parent, legal guardian, or another adult with lawful authority, including information needed to administer a membership, reservation, waiver, safety matter, or program. If we learn that a child under 13 submitted personal information directly without verifiable parental consent, we will take reasonable steps to delete it. Contact us using the information below if you believe this has occurred.',

        { style: 'h2', text: '8. Security and Retention' },
        'We use reasonable administrative, technical, and physical safeguards designed to protect personal information. No website, transmission, or storage system is completely secure. We retain personal information for as long as reasonably necessary for the purposes described in this Policy, including to provide Services, maintain business and waiver records, comply with legal, accounting, insurance, and reporting obligations, and establish or defend legal claims. Retention periods vary based on the type of information and applicable requirements. We may retain deidentified information for lawful business purposes.',

        { style: 'h2', text: '9. Your Choices and Requests' },
        {
          bullet:
            'Update account information through your account, if available, or by contacting us.',
        },
        {
          bullet:
            'Opt out of promotional email by using the unsubscribe link. Opt out of promotional text messages by replying STOP. Message and data rates may apply.',
        },
        {
          bullet:
            'Request access to, correction of, or deletion of personal information. We will consider and respond to requests as required by applicable law and may need to verify your identity. Certain information may be retained where permitted or required by law.',
        },
        {
          bullet:
            'An authorized agent may submit a request where permitted by law, but we may require proof of authority and identity verification.',
        },
        'We will not discriminate against you for exercising a privacy right provided by applicable law.',

        { style: 'h2', text: '10. State Privacy Laws' },
        'Residents of some states may have additional rights if Treehouse meets the applicability thresholds under that state’s law. Those rights may include access, correction, deletion, portability, and the right to opt out of certain sales, targeted advertising, or profiling. Treehouse will provide any supplemental notice and honor applicable rights as required by law. Nothing in this Policy grants a right that does not otherwise apply.',

        { style: 'h2', text: '11. Changes to This Policy' },
        'We may update this Policy from time to time. We will post the updated Policy on the website and revise the Effective Date above. If required by law, we will provide additional notice or obtain consent.',

        { style: 'h2', text: '12. Contact Us' },
        'Questions or privacy requests may be submitted to:',
        'Treehouse LLC',
        '1209 Center Drive',
        'Park City, Utah 84098',
        // The draft wrote this as a markdown autolink. A real mailto is the
        // same intent in a medium that has links.
        ['Email: ', { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' }],
      ),
    },
  ],
};
