import { QuestionGroup } from '../types';

// Shared Group 1: Data Interpretation Table
export const diTableGroup: QuestionGroup = {
  id: 'group-di-1',
  title: 'Data Interpretation: Performance of 5 Public Sector Banks (FY 2023-24)',
  type: 'DATA_INTERPRETATION',
  content: `Directions (Q. 1 - 5): Study the following table carefully and answer the questions given below. The table shows the Total Deposits (in ₹ Crores), Total Advances (in ₹ Crores), and Gross NPA Percentage (%) across five major Indian public sector banks in FY 2023-24.`,
  tableData: [
    { Bank: 'State Bank of India (SBI)', Deposits: 4450000, Advances: 3500000, 'Gross NPA %': '2.24%' },
    { Bank: 'Punjab National Bank (PNB)', Deposits: 1370000, Advances: 980000, 'Gross NPA %': '5.73%' },
    { Bank: 'Bank of Baroda (BOB)', Deposits: 1250000, Advances: 1040000, 'Gross NPA %': '2.92%' },
    { Bank: 'Canara Bank', Deposits: 1310000, Advances: 960000, 'Gross NPA %': '4.23%' },
    { Bank: 'Union Bank of India', Deposits: 1180000, Advances: 890000, 'Gross NPA %': '4.83%' }
  ]
};

// Shared Group 2: Circular Seating Arrangement
export const circularPuzzleGroup: QuestionGroup = {
  id: 'group-puzzle-1',
  title: 'Reasoning Puzzle: Circular Seating Arrangement (In & Out Facing)',
  type: 'SEATING_ARRANGEMENT',
  content: `Directions (Q. 6 - 10): Study the following information carefully to answer the given questions:
Eight banking officials—P, Q, R, S, T, U, V, and W—are sitting around a circular table facing the centre and outside, but not necessarily in the same order. 
1. Exactly four of them face the centre while four face outside the centre.
2. P sits third to the right of W, who faces the centre.
3. Only two persons sit between P and S.
4. R sits second to the left of S. S and R face opposite directions to each other.
5. U sits second to the right of Q. Q is an immediate neighbour of neither P nor S.
6. T sits third to the right of V. Both T and V face the same direction.
7. Immediate neighbours of P face opposite directions (if one faces centre, other faces outside).
8. W is not an immediate neighbour of Q.`
};

// Shared Group 3: Reading Comprehension
export const rcPassageGroup: QuestionGroup = {
  id: 'group-rc-1',
  title: 'Reading Comprehension: Central Bank Digital Currency (CBDC) in India',
  type: 'PASSAGE',
  content: `Directions (Q. 11 - 15): Read the following passage carefully and answer the questions that follow.
The Reserve Bank of India’s pilot rollout of the Central Bank Digital Currency (CBDC), dubbed the Digital Rupee (e₹), marks a pivotal inflection point in the modernization of India’s sovereign payment architecture. Unlike commercial cryptocurrency assets characterized by severe speculative volatility, the e-Rupee represents a direct sovereign liability of the central bank, mirroring physical currency notes in digital token form. Financial economists highlight that e-Rupee deployment provides a dual advantage: drastically mitigating the gargantuan costs associated with physical currency management—such as high-security printing, armored logistics, sorting, and disposal—while simultaneously bridging the last-mile accessibility gap in remote hinterlands through proposed offline functionality. 

However, widespread proliferation of CBDC is not devoid of systemic friction. Banking regulators maintain vigilance over potential 'disintermediation risk', wherein panic-driven retail depositors might swiftly convert commercial bank savings accounts into risk-free central bank tokens during periods of acute economic uncertainty, thereby exacerbating bank liquidity shocks. To forestall this vulnerability, the central bank has deliberately mandated a non-interest-bearing architectural model for retail e₹ holdings, reaffirming that the digital rupee serves fundamentally as a frictionless medium of exchange rather than a yielding store of value.`
};
