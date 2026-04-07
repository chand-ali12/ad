import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { commonStyles } from "@/commonStyles";
import { styles } from "./styles";
import Link from "next/link";
const yourAccountListData = [
  "You must be 18 years or older to use our Digital Properties. Minors under 18 and at least 13 years of age are only permitted to use our Digital Properties through an account owned by a parent or legal guardian with their appropriate permission and under their direct supervision. Children under 13 years are not permitted to create an account or access the Digital Properties. You are responsible for any and all account activity conducted by a minor on your account.",
  "Provide accurate information about yourself. It’s prohibited to use false information or impersonate another person or company through your account.",
  "Choose an appropriate name. If you decide to not have your full name serve as the name associated with your account, you may not use language that is offensive, vulgar, infringes someone’s intellectual property rights, or otherwise violates the Terms.",
  "You're responsible for your account. You’re solely responsible for any activity on your account. If you’re sharing an account with other people, then the person whose financial information is on the account will ultimately be responsible for all activity. If you’re registering as a business entity, you personally guarantee that you have the authority to agree to the Terms on behalf of the business. Your accounts are not transferable.",
  "These Terms don't create any agency, partnership, joint venture, employment, or franchisee relationship between you and us.",
];
const yourContentListData = [
  `You understand and agree that you are solely responsible for Your Content. You represent that you have all necessary rights to Your Content and that you’re not infringing or violating any third party’s rights by posting it`,
  "Rights You Grant Authentic Detective. By posting Your Content, you grant Authentic Detective a non-exclusive, worldwide, royalty-free, irrevocable, sub-licensable, perpetual license to use, display, edit, modify, reproduce, distribute, store, and prepare derivative works of Your Content. This allows us to provide the Digital Properties and to promote Authentic Detective, your Authentic Detective shop, or the Digital Properties in general, in any formats and through any channels, including across any Authentic Detective Digital Properties, our partners, or third-party website or advertising medium. You agree not to assert any moral rights or rights of publicity against us for using Your Content. You also recognize our legitimate interest in using it, in accordance with the scope of this license, to the extent Your Content contains any personal information.",
  `Reporting Unauthorized Content. Authentic Detective is committed to following appropriate legal procedures to remove infringing content from the Digital Properties. Under the Digital Millennium Copyright Act of 1998 and the Copyright, Designs and Patents Act 1988 (the “Copyright Acts”) if you believe in good faith that any content on the Digital Properties infringes your copyright, you may send us a notice requesting that the content be removed. The notice must include: (a) your (or your agent’s) physical or electronic signature; (b) identification of the copyrighted work on our Digital Properties that is claimed to have been infringed (or a representative list if multiple copyrighted works are included in one notification); © identification of the content that is claimed to be infringing or the subject of infringing activity, including information reasonably sufficient to allow us to locate the content on the Digital Properties; (d) your name, address, telephone number and email address (if available); (e) a statement that you have a good faith belief that use of the content in the manner complained of is not authorized by you or your agent or the law; and (f) a statement that the information in the notification is accurate and, under penalty of perjury, that you or your agent is authorized to act on behalf of the copyright owner. If you believe in good faith that a notice of copyright infringement has been wrongly filed against you, you may send us a counter-notice. You may read more information about the Copyright Acts at http://www.loc.gov/copyright. Notices and counter-notices should be sent to support@authenticdetective.com. There can be penalties for false claims under the Copyright Acts. We suggest that you consult your legal advisor before filing a notice or counter-notice. It is our policy to terminate, in appropriate circumstances, the access rights to the Digital Properties of repeat infringers.`,

  `Inappropriate, False, or Misleading Content. You agree that you will not post any content that is abusive, threatening, defamatory, obscene, vulgar, or otherwise offensive or that is false and misleading or uses the Digital Properties in a manner that is fraudulent or deceptive. You agree that you will comply with all applicable laws, rules and regulations, and that you will not Use the Digital Properties for any unlawful purpose; Impersonate any person or entity, whether actual or fictitious, including any employee or representative of our company; Submit (a) any content or information that is unlawful, fraudulent, libelous, defamatory, or otherwise objectionable, or infringes our or any third party’s intellectual property or other rights; (b) any non-public information about companies without authorization; (c) advertisements, solicitations, chain letters, pyramid schemes, surveys, contests, investment opportunities or other unsolicited commercial communication; Submit, or provide links to, any postings containing material that could be considered harmful, obscene, pornographic, sexually explicit, indecent, lewd, violent, abusive, profane, insulting, threatening, harassing, hateful or otherwise objectionable, includes the image or likeness of individuals under 18 years of age, or contains any personal contact information or other personal information identifying any third party; Submit, or provide links to, any postings containing material that harasses, victimizes, degrades, or intimidates an individual or group of individuals on the basis of religion, race, ethnicity, sexual orientation, gender, age, or disability; Harvest or collect information about Digital Properties users; sell anything that violates any laws.`,
  `Abide by sanctions policies. You agree to abide by economic sanctions and trade restrictions, including those implemented by the Office of Foreign Assets Control ("OFAC") of the US Department of the Treasury. These regulations mean that Authentic Detective or anyone using our Digital Properties cannot take part in transactions that involve designated people, places, or items that originate from those places, as determined by agencies like OFAC.`,
];

const yourUseDigital = [
  "You are responsible for paying all fees that you owe to Authentic Detective. Except as set forth below, you are also solely responsible for collecting and/or paying any applicable taxes for any purchases or sales you make through our Digital Properties.",
  "To the maximum extent legally permitted, you cannot link to or seek to extract data from the Digital Properties or reutilize any part of the Digital Properties for any commercial purpose or use our trademarks in a way that suggests that you or your business has any endorsement from or affiliation to us, or in any other way, without our prior written permission (at our sole discretion). No act of downloading or copying from, or otherwise using, the Digital Properties, even with our permission, will transfer any title, interest or right in or to any Digital Property to you. Authentic Detective hereby expressly reserve all rights not expressly granted in and to the Digital Properties.",
  "You agree not to crawl, scrape, or spider any page of the Digital Properties or to reverse engineer or attempt to obtain the source code of the Digital Properties. You agree not to interfere with or try to disrupt our Digital Properties, for example by distributing a virus or other harmful computer code.",
  `Follow Our Trademark Policy. The name "Authentic Detective" and the other Authentic Detective marks, phrases, logos, and designs that we use in connection with our Digital Properties (the Authentic Detective Trademarks), are trademarks, service marks, or trade dress of Authentic Detective in the US and other countries.`,
];

const disputesListData = [
  "Governing Law. The Terms are governed by the laws of the State of New Jersey, without regard to its conflict of laws rules, and the laws of the United States of America. These laws will apply no matter where in the world you live, but if you live outside of the United States, you may be entitled to the protection of the mandatory consumer protection provisions of your local consumer protection law.",
  `Arbitration. You and Authentic Detective agree that any dispute or claim arising from or relating to the Terms shall be finally settled by final and binding arbitration, using the English language, administered by the American Arbitration Association (the “AAA”) under its Consumer Arbitration Rules (the "AAA Rules") then in effect (those rules are deemed to be incorporated by reference into this section, and as of the date of these Terms you can find the AAA Rules here), unless otherwise required by law. Arbitration, including threshold questions of arbitrability of the dispute, will be handled by a sole arbitrator in accordance with those rules. Judgment on the arbitration award may be entered in any court that has jurisdiction.`,
  `Any arbitration or mediation under the Terms will take place on an individual basis. You understand that by agreeing to the Terms, you and Authentic Detective are each waiving the right to trial by jury or to participate in a class action lawsuit. Class arbitrations shall only be available if requested by either party under its Class Action Arbitration Rules and approved by the arbitration entity. Notwithstanding the foregoing, each party shall have the right to bring an action in a court of proper jurisdiction for injunctive or other equitable or conservatory relief, pending a final decision by the arbitrator or mediator. You may instead assert your claim in “small claims” court, but only if your claim qualifies, your claim remains in such court, and your claim remains on an individual, non-representative, and non-class basis.
`,

  `Costs of Arbitration. Payment for any and all reasonable AAA filing, administrative, and arbitrator fees will be in accordance with the Consumer Arbitration Rules. The parties will pay their share of arbitration costs.
`,

  `Forum. Any legal action against Authentic Detective related to our Digital Properties must be filed and take place in the State of New Jersey, USA. For all actions under the AAA Rules, the proceedings may be filed where your residence is, or in New Jersey, and any in-person hearings will be conducted at a location which is reasonably convenient to both parties taking into account their ability to travel and other pertinent circumstances. For any actions not subject to arbitration or mediation, you and Authentic Detective agree to submit to the personal jurisdiction of a state or federal court located in the State of New Jersey.
`,

  `Authentic Detective is not responsible for any authentications that are proven to be false. We are not responsible for any losses due to the result of any issued authentication certificate. We are not liable for any losses with chargebacks, credit card companies, PayPal, or the like. Authentic Detective is not responsible for any human error in terms of authentication.
`,
  `
Authentic Detective is not affiliated with any brands that are authenticated. The opinions rendered at Authentic Detective are based on years of experience. Although our certificate of authenticity will greatly help your chances with third party disputes, they may have guidelines of their own and we can not guarantee a particular outcome. Authentic Detective is not required to explain any results provided. Clients, users, customers, businesses, and end users may not make Authentic Detective liable for any mistakes regarding authentication. No refunds will be owed under any circumstance unless discussed and agreed with Authentic Detective.

`,
];

const TermsOfService = () => {
  return (
    <Box
      sx={{
        paddingRight: {
          xs: "15px",
          sm: "15px",
          md: "15px",
          lg: "10px",
        },
        paddingLeft: {
          xs: "15px",
          sm: "15px",
          md: "15px",
          lg: "8px",
        },
      }}
    >
      <Typography
        sx={{
          ...commonStyles.commonHeadingStyles,
          textAlign: "center",
          mt: {
            xs: "23%",
            sm: "15%",
            md: "10%",
            lg: "8%",
          },
        }}
      >
        Terms of Use
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
          mt: 4,
        }}
      >
        1. About us and these terms
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`These Website Terms of Use (together with the Additional Terms set forth herein, “Terms”) set forth the terms and conditions applicable to and governing your, the user, member or customer (“you” or “your” being interpreted accordingly) access to and use of the website (“Site”) and applications designed for download and use on mobile, tablet, smart watch and other personal devices, and all Content (as defined herein) incorporated into and presented through such websites and applications (collectively, “Digital Properties”) made available by Authentic Detective LLC (“Authentic Detective”, “we”, “us” and “our” being interpreted accordingly). By using the Digital Properties, and the features and Digital Properties made available through the Digital Properties, you are acknowledging that you have read, understand and agreed to these Terms and expressly agree that they form a binding contract between you and Authentic Detective LLC. The Digital Properties are not targeted at children under the age of 13, and they are not permitted to use the Digital Properties. We strongly encourage all parents and guardians to monitor the Internet use by their children. If you use the Digital Properties, you affirm you are at least 13 years old.`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Please note that Section 11, Disputes with Authentic Detective LLC, contains an arbitration clause and class action waiver. By agreeing to the Terms, you agree to resolve all disputes through binding individual arbitration, which means that you waive any right to have those disputes decided by a judge or jury, and that you waive your right to participate in class actions, class arbitrations, or representative actions. *`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        2. Those Other Documents We Mentioned
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Our Digital Properties connect people around the world, online and
        offline, to sell and buy goods from each other. Here’s a guide to help
        you understand the specific rules that are relevant for you, depending
        on how you use the Digital Properties:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        If you use any of our Digital Properties, you agree to these Terms and
        our <Link href={"/privacy-policy"}>Privacy Policy.</Link>
      </Typography>
      {/* Section 1 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        3. Privacy Policy
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Our Privacy Policy details how your information is used when you use our
        Digital Properties. By using our Digital Properties, you're also
        agreeing that we can process your information in the ways set out in the
        Privacy Policy.`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Both we and sellers process members’ personal information (for example, buyer name, email address, and delivery address) and are therefore considered separate and independent data controllers of buyers’ personal information under EU law. That means that each party is responsible for the personal information it processes in providing the Digital Properties. For example, if a seller accidentally discloses a buyer’s name and email address when fulfilling another buyer’s order, the seller, not us, will be responsible for that unauthorized disclosure.`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Both we and sellers process members’ personal information (for example, buyer name, email address, and delivery address) and are therefore considered separate and independent data controllers of buyers’ personal information under EU law. That means that each party is responsible for the personal information it processes in providing the Digital Properties. For example, if a seller accidentally discloses a buyer’s name and email address when fulfilling another buyer’s order, the seller, not us, will be responsible for that unauthorized disclosure.`}
      </Typography>
      {/* Section 4 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        4. Your Account
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` You’ll need to create an account with us to use some of our Digital
        Properties. Here are a few rules about accounts created with us:`}
      </Typography>
      {yourAccountListData.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      {/* Section 5 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        5. Your Content
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Content that you post using our Digital Properties is your content
        (“Your Content”) and we have no claim to it. Your Content includes, but
        is not limited to, anything you post using our Digital Properties (like
        shop names, profile pictures, listing photos, listing descriptions,
        reviews, comments, videos, usernames, etc.).
      </Typography>
      {yourContentListData.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      {/* Section 6 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        6. Your Use of Our Digital Properties
      </Typography>
      <List
        sx={{
          listStyleType: "none",
          counterReset: "custom-counter",
          pt: 1,
          pb: 1,
        }}
      >
        {yourUseDigital.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              display: "list-item",
              counterIncrement: "custom-counter",
              ...commonStyles.commonTextStyles,

              "&::before": {
                content: "counter(custom-counter, upper-alpha) '. '",
                fontWeight: "bold",
                marginRight: "8px",
              },
            }}
          >
            {item}
          </ListItem>
        ))}
      </List>
      {/* Section 7 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        7. Termination
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`TERMINATION BY YOU. YOU MAY TERMINATE YOUR ACCOUNT WITH AUTHENTIC
        DETECTIVE AT ANY TIME FROM YOUR ACCOUNT SETTINGS. TERMINATING YOUR
        ACCOUNT WILL NOT AFFECT THE AVAILABILITY OF SOME OF YOUR CONTENT THAT
        YOU POSTED THROUGH THE DIGITAL PROPERTIES PRIOR TO TERMINATION. YOU’LL
        STILL HAVE TO PAY ANY OUTSTANDING BILLS.`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Termination By Authentic Detective. We may terminate or suspend your account (and any accounts Authentic Detective determines are related to your account) and your access to the Digital Properties should we have reason to believe you, Your Content, or your use of the Digital Properties violate our Terms. If we do so, it’s important to understand that you don’t have a contractual or legal right to continue to use our Digital Properties, for example, to sell or buy on our websites or mobile apps. Generally, Authentic Detective will notify you that your account has been terminated or suspended, unless you’ve repeatedly violated our Terms or we have legal or regulatory reasons preventing us from notifying you.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`If you or Authentic Detective terminate your account, you may lose any information associated with your account, including Your Content.



`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`We May Discontinue the Digital Properties Authentic Detective reserves the right to change, suspend, or discontinue any of the Digital Properties for you, any or all users, at any time, for any reason, including those laid out in Authentic Detective’s policies under these Terms of Use. We will not be liable to you for the effect that any changes to the Digital Properties may have on you, including your income or your ability to generate revenue through the Digital Properties.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Survival. The Terms will remain in effect even after your access to the Service is terminated, or your use of the Service ends.

`}
      </Typography>
      {/* Section 8 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        8. Warranties and Limitation of Liability
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`You understand that Authentic Detective does not manufacture, store, or inspect any of the items sold through our Digital Properties. We provide the venue; the items in our marketplaces are produced, listed, and sold directly by independent sellers, so Authentic Detective can't and does not make any warranties about their quality, safety, or even their legality. Any legal claim related to an item you purchase must be brought directly against the seller of the item. You release Authentic Detective from any claims related to items sold through our Digital Properties, including for defective items, misrepresentations by sellers, or items that caused physical injury (like product liability claims).`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`You may come across materials that you find offensive or inappropriate while using our Digital Properties. We make no representations concerning any content posted by users through the Digital Properties. Authentic Detective is not responsible for the accuracy, copyright compliance, legality, or decency of content posted by users that you accessed through the Digital Properties. You release us from all liability relating to that content.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`You can use the Digital Properties to interact with other individuals, either online or in person. However, you understand that we do not screen users of our Digital Properties, and you release us from all liability relating to your interactions with other users.



`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`
Our Digital Properties may contain links to third-party websites or Digital Properties that we don’t own or control (for example, links to Facebook, Twitter and Pinterest). You may also need to use a third party’s product or service in order to use some of our Digital Properties (like a compatible mobile device to use our mobile apps). When you access these third-party Digital Properties, you do so at your own risk. The third parties may require you to accept their own terms of use. Authentic Detective is not a party to those agreements; they are solely between you and the third party.




`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`
WARRANTIES. YOU UNDERSTAND THAT OUR DIGITAL PROPERTIES ARE PROVIDED “AS IS” AND WITHOUT ANY KIND OF WARRANTY (EXPRESS OR IMPLIED). WE ARE EXPRESSLY DISCLAIMING ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE, AS WELL AS ANY WARRANTIES IMPLIED BY A COURSE OF PERFORMANCE, COURSE OF DEALING, OR USAGE OF TRADE.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`
WE DO NOT GUARANTEE THAT: (I) THE DIGITAL PROPERTIES WILL BE SECURE OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION; (II) ANY DEFECTS OR ERRORS WILL BE CORRECTED; (III) THE DIGITAL PROPERTIES WILL BE FREE OF VIRUSES OR OTHER HARMFUL MATERIALS; OR (IV) THE RESULTS OF USING THE DIGITAL PROPERTIES WILL MEET YOUR EXPECTATIONS. YOU USE THE DIGITAL PROPERTIES SOLELY AT YOUR OWN RISK. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`


LIABILITY LIMITS. TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER Authentic Detective, NOR OUR EMPLOYEES OR DIRECTORS SHALL BE LIABLE TO YOU FOR ANY LOST PROFITS OR REVENUES, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE DIGITAL PROPERTIES OR THESE TERMS. IN NO EVENT SHALL Authentic Detective AGGREGATE LIABILITY FOR ANY DAMAGES EXCEED THE GREATER OF ONE HUNDRED ($100) US DOLLARS (USD) OR THE AMOUNT YOU PAID Authentic Detective IN THE PAST TWELVE MONTHS. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.

`}
      </Typography>
      {/* Section 9 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        9. Indemnification
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`You agree to defend Authentic Detective (including any of our employees, agent, directors, officers, or shareholders) and hold us harmless from any legal claim or demand (including reasonable lawyer’s fees) that arises from your actions, your use (or misuse) of our Digital Properties, your breach of the Terms, or you or your account’s infringement of someone else’s rights.

`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`We reserve the right to handle our legal defense however we see fit, even if you are indemnifying us, in which case you agree to cooperate with us so we can execute our strategy.
`}
      </Typography>
      {/* Section 10 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        10. Disputes with Other Users
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` If you find yourself in a dispute with another user of Authentic Detective Digital Properties or a third party, we encourage you to contact the other party and try to resolve the dispute

`}
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        11. Disputes with Authentic Detective
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` The following rules will govern any legal dispute involving our Digital Properties:

`}
      </Typography>
      <List
        sx={{
          listStyleType: "none",
          counterReset: "custom-counter",
          // pl: { xs: 2, sm: 2 },
          pt: 1,
          pb: 1,
        }}
      >
        {disputesListData.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              display: "list-item",
              counterIncrement: "custom-counter",
              ...commonStyles.commonTextStyles,

              "&::before": {
                content: "counter(custom-counter, upper-alpha) '. '",
                fontWeight: "bold",
                marginRight: "8px",
              },
            }}
          >
            {item}
          </ListItem>
        ))}
      </List>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        12. Changes to the Terms
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` We may update these Terms from time to time. If we believe that the changes are material, we’ll definitely let you know by posting the changes through the Digital Properties and/or sending you an email or message about the changes. That way you can decide whether you want to continue using the Digital Properties. Changes will be effective upon the posting of the changes unless otherwise specified. You are responsible for reviewing and becoming familiar with any changes. Your use of the Digital Properties following the changes constitutes your acceptance of the updated Terms.

`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        13. Miscellaneous
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` The Terms, including all of the policies that make up the Terms, supersede any other agreement between you and Authentic Detective regarding the Digital Properties. If any part of the Terms is found to be unenforceable, that part will be limited to the minimum extent necessary so that the Terms will otherwise remain in full force and effect. Our failure to enforce any part of the Terms is not a waiver of our right to later enforce that or any other part of the Terms. We may assign any of our rights and obligations under the Terms.

`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Authentic Detective will not be responsible and will not pay any compensation where we are preventing or delayed from performing our obligations due to an event beyond our reasonable control, including but not limited to flood, earthquake, mechanical breakdown, epidemic, pandemic, IT failure, fire, adverse weather conditions, acts of terrorism, gas, water or other utilities.

`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` We may transfer this agreement to someone else: We may transfer our rights and obligations under these terms to another organization. We will always tell you in writing if this happens and we will ensure that the transfer will not affect your rights under the contract.


`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Even if we delay in enforcing this contract, we can still enforce it later: If we do not insist immediately that you do anything you are required to do under these terms, or if we delay in taking steps against you in respect of your breaking this contract, that will not mean that you do not have to do those things and it will not prevent us taking steps against you at a later date. For example, if you miss a payment and we do not chase you but we continue to provide the products, we can still require you to make the payment at a later date.

`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Authentic Detective is not responsible for misinformation provided to users. Although we aim to be accurate, Authentic Detective is not liable for incorrectly authenticated items, disputes, claims, or chargebacks that may arise from our services.

`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` You represent and warrant that (1) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a “terrorist supporting” country; and (2) you are not listed on any U.S. Government list of prohibited or restricted parties.

`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        14. Subscription Terms
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          whiteSpace: "pre-line",
          ...commonStyles.commonTextStyles,
        }}
      >
        {`By purchasing a subscription, you agree to the following terms:

Refund and Cancellation Policy

1. All subscriptions are non-refundable.
2. Subscriptions cannot be credited towards other services or products.
⁠3. Credits for subscriptions do not roll over. Leftover credits can not be applied to the next month, and can not be applied to any other service provided by Authentic Detective.

Scope of Subscription

Our subscription service does not include access to premium brands such as:

·	Chanel
·	Hermès
·	Tiffany & Co.

Additionally, subscriptions do not cover:

·	Valuations
·	Jewelry authentication

General Terms

The terms and conditions governing subscriptions are identical to those outlined in our Terms of Use for single authentications.

By subscribing, you acknowledge that you have read, understood, and agree to these terms.

Governing Law

These Subscription Terms shall be governed by and construed in accordance with the laws of [State/Country], without giving effect to any principles of conflicts of law.

Changes

We reserve the right to modify, edit, or change these terms at any time without prior notice.
`}
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        15. Contact Information
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` If you have any questions about the Terms, please email us at `}

        <a
          href="mailto:support@authenticdetective.com"
          style={{ color: "blue" }}
        >
          support@authenticdetective.com
        </a>
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` *In some countries you may have additional rights and/or the preceding may not apply to you.`}
      </Typography>
    </Box>
  );
};

export default TermsOfService;
