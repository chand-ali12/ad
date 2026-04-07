/**
 * Authentication Company Insurance Policy – Complete Terms & Agreement
 * Used on the add-on terms page (`/add-on-terms`) and shared with the Authentication form flow.
 */
export const INSURANCE_POLICY_SECTIONS = [
  {
    title: '1. Coverage Terms',
    content: [
      { type: 'bullet', text: 'Basic Brands: $10 cost per item', bold: true },
      { type: 'para', text: 'Maximum payout of $400 based on the item\'s purchase cost' },
      { type: 'bullet', text: 'Premium Brands (Chanel and Hermes): $20 cost per item', bold: true },
      { type: 'para', text: 'Maximum payout of $1,000 based on the item\'s purchase cost' },
    ],
  },
  {
    title: '2. Claim Review Process',
    content: [
      { type: 'sub', text: 'Requirements:' },
      { type: 'para', text: 'To qualify for a claim review, the Policyholder must obtain contradicting certificates from two (2) reputable companies confirming an authentication error.' },
      { type: 'sub', text: 'Admission of Mistake:' },
      { type: 'para', text: 'Upon receipt of these certificates, the Authentication Company acknowledges the error in authentication.' },
      { type: 'sub', text: 'Timeframe for Claims:' },
      { type: 'bullet', text: 'Claims must be filed within forty-five (45) calendar days of the original certificate being issued' },
      { type: 'bullet', text: 'Claims must also be filed within forty-eight (48) hours of receiving the contradicting certificates from the two reputable companies' },
    ],
  },
  {
    title: '3. Basis of Payout and Valuation',
    content: [
      { type: 'sub', text: 'Purpose and Scope:' },
      { type: 'para', text: 'This Section establishes the basis upon which all payout amounts are determined, including the documentation required to support a claim and the limitations applicable to such payouts. All valuations and determinations made under this Section shall be conducted at the sole discretion of the Authentication Company (Authentic Detective) in accordance with these Terms and Conditions.' },
      { type: 'sub', text: 'Valuation Standard:' },
      { type: 'para', text: 'All payouts shall be calculated solely on the basis of the item\'s original purchase price as documented by the Policyholder, and not on the item\'s resale value, estimated market value, or any subsequent appreciation or depreciation.' },
      { type: 'sub', text: 'Required Documentation:' },
      { type: 'para', text: 'To qualify for a payout, the Policyholder must provide a detailed, itemized receipt or equivalent proof of purchase clearly indicating:' },
      { type: 'bullet', text: 'Original purchase date; and' },
      { type: 'bullet', text: 'Date of sale (if applicable).' },
      { type: 'para', text: 'Even where proof of purchase is provided, Authentic Detective reserves the right, in its sole and reasonable discretion, to review the claimed purchase price and adjust the payout value downward if Authentic Detective determines that the documented price materially exceeds fair market value, was inflated, or is otherwise inconsistent with typical industry pricing. Such adjusted valuation shall be final and binding.' },
      { type: 'sub', text: 'Absence of Proof of Purchase:' },
      { type: 'para', text: 'In the absence of satisfactory proof of purchase, Authentic Detective reserves the exclusive right to assign a value to the item at its sole discretion. Such valuation may be substantially lower than the prevailing market value and shall be deemed final and binding. Where adequate documentation or credible evidence of purchase cannot be provided, Authentic Detective further reserves the right to deny any payout in full. No appeal or reconsideration shall be available in such cases, and the Company shall bear no further liability to the Policyholder.' },
      { type: 'sub', text: 'Limitation of Liability:' },
      { type: 'para', text: 'Notwithstanding any other provision contained herein, the total liability of Authentic Detective for any single claim—regardless of the nature, cause, or number of items involved—shall not exceed Four Hundred U.S. Dollars for basic brands (USD $400), and One Thousand Dollars for Chanel and Hermes (USD $1000) or the item\'s original purchase price, whichever is lower. This limitation applies irrespective of any alleged consequential, incidental, indirect, or special damages, including but not limited to loss of profit, goodwill, or resale value. The Policyholder acknowledges and agrees that this payout limit constitutes the maximum aggregate liability of Authentic Detective under this Policy for each claim.' },
    ],
  },
  {
    title: '4. Payout Review',
    content: [
      { type: 'sub', text: 'Dispute Team Review:' },
      { type: 'para', text: 'All payout determinations are subject to review by the Authentication Company\'s dispute resolution team.' },
      { type: 'sub', text: 'Suspicious Activity Challenges:' },
      { type: 'para', text: 'The dispute team may withhold, reduce, or deny payout if fraudulent or suspicious activity is suspected or identified.' },
      { type: 'sub', text: 'Right to Termination:' },
      { type: 'para', text: 'The Authentication Company may, at its sole discretion and without prior notice, suspend or permanently terminate this policy, including any active claims, if fraudulent, deceptive, or otherwise suspicious activity is determined or reasonably suspected. In such event, all premiums or fees already paid shall be deemed non-refundable.' },
    ],
  },
  {
    title: '5. Limitation of Liability',
    content: [
      { type: 'para', text: 'The Authentication Company\'s liability under this Agreement is strictly limited to the maximum payout amounts specified herein ($400 for basic brands and $1,000 for premium brands). Under no circumstances shall the Authentication Company be liable for indirect, incidental, consequential, or punitive damages, including but not limited to lost profits, diminution in value, or reputational harm.' },
    ],
  },
  {
    title: '6. Arbitration Agreement',
    content: [
      { type: 'para', text: 'Any dispute, claim, or controversy arising out of or relating to this Agreement, including its formation, interpretation, breach, or termination, shall be resolved exclusively by binding arbitration administered by the American Arbitration Association (AAA) (or a similar neutral arbitration body if AAA is unavailable) in accordance with its Commercial Arbitration Rules.' },
      { type: 'para', text: 'The arbitration shall take place in [Insert Jurisdiction/State], and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.' },
      { type: 'para', text: 'The parties waive any right to bring or participate in a class, collective, or representative action against the other.' },
      { type: 'para', text: 'Each party shall bear its own costs and attorney\'s fees unless otherwise required by applicable law.' },
    ],
  },
  {
    title: '7. Governing Law',
    content: [
      { type: 'para', text: 'This Agreement shall be governed by and construed in accordance with the laws of the state in which the Authentication Company is headquartered, without regard to its conflict of law provisions.' },
    ],
  },
  {
    title: '8. Entire Agreement',
    content: [
      { type: 'para', text: 'This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements, representations, or understandings relating to the subject matter herein.' },
    ],
  },
  {
    title: '9. Amendments',
    content: [
      { type: 'para', text: 'This Agreement may be amended only in writing and signed by both parties.' },
    ],
  },
];
