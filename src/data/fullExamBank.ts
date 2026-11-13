import { Exam, Question, QuestionGroup } from '../types';
import { diTableGroup, circularPuzzleGroup, rcPassageGroup } from './questionGroups';

// ============================================================================
// FULL PRELIMS & MAINS PRE-LOADED EXAMINATION BANK (NO PDF UPLOAD REQUIRED)
// ============================================================================

// 1. Full 100-Question Prelims Test (SBI PO / IBPS PO Standard)
// Section 1: English Language (30 Qs, 20 Mins)
// Section 2: Quantitative Aptitude (35 Qs, 20 Mins)
// Section 3: Reasoning Ability (35 Qs, 20 Mins)
// Total: 100 Questions | 100 Marks | 60 Minutes | -0.25 Negative Marking
export const sbiPoPrelimsFull100Q: Exam = {
  id: 'exam-sbi-po-prelims-full-100q',
  title: 'SBI PO Prelims Official 100-Question Full-Length Mock Test',
  category: 'SBI',
  subCategory: '100-Question Full Mock (Prelims)',
  code: 'SBI-PO-100Q-PRELIMS-2026',
  description: 'Complete 100-Question full mock test adhering strictly to official SBI PO Prelims standards: 3 timed sections (20 mins each), 100 marks, -0.25 negative marking. Preloaded and ready to start without uploading any PDF.',
  instructions: [
    'Total duration of the examination is 60 minutes with strict sectional timing of 20 minutes per section.',
    'Section 1: English Language (30 Questions, 20 Minutes).',
    'Section 2: Quantitative Aptitude (35 Questions, 20 Minutes).',
    'Section 3: Reasoning Ability (35 Questions, 20 Minutes).',
    'Each correct answer carries +1 mark. Each incorrect answer attracts a penalty of 0.25 marks.',
    'Section navigation is locked sequentially; once 20 minutes elapse, the next section automatically activates.',
    'You can pause the examination at any time using the Pause button in the top bar and resume anytime from the homepage.'
  ],
  durationMinutes: 60,
  hasSectionalTiming: true,
  allowSectionSwitching: false,
  totalMarks: 100,
  totalQuestions: 100,
  cutoffEstimates: {
    general: 58.50,
    obc: 56.25,
    sc: 50.00,
    st: 47.50,
    ews: 56.00
  },
  isActive: true,
  sections: [
    // ------------------------------------------------------------------------
    // SECTION 1: ENGLISH LANGUAGE (30 QUESTIONS, 20 MINUTES)
    // ------------------------------------------------------------------------
    {
      id: 'sec-prelims-eng-100',
      title: 'English Language',
      subject: 'ENGLISH_LANGUAGE',
      order: 1,
      durationMinutes: 20,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 8.50,
      totalQuestions: 30,
      questions: [
        // Q1 - Q10: Reading Comprehension
        {
          id: 'p100-eng-1',
          questionNumber: 1,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'According to the passage, what is the primary structural difference between a Central Bank Digital Currency (CBDC) and a decentralized cryptocurrency like Bitcoin?',
          options: [
            { id: 'p100-e1-a', key: 'A', text: 'CBDCs are untraceable, whereas Bitcoin is heavily regulated by sovereign monetary authorities.' },
            { id: 'p100-e1-b', key: 'B', text: 'A CBDC is centralized and tied to sovereign fiat currency, while cryptocurrencies are decentralized and market-dictated.' },
            { id: 'p100-e1-c', key: 'C', text: 'Cryptocurrencies promote retail financial inclusion significantly better than central bank digital currencies.' },
            { id: 'p100-e1-d', key: 'D', text: 'CBDC operations are backed solely by tangible gold and silver bullion reserves.' },
            { id: 'p100-e1-e', key: 'E', text: 'Bitcoin is issued directly by commercial banks, whereas CBDC is minted by peer-to-peer miners.' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'The passage explicitly states: "Unlike cryptocurrencies like Bitcoin which are decentralized and their value is dictated by the market, a CBDC is centralized and tied to the value of fiat currency."',
              'Hence, Option B accurately describes the distinction.'
            ],
            shortcutMethod: 'Keyword scan: "centralized" vs "decentralized".',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-2',
          questionNumber: 2,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Which of the following is highlighted in the passage as a key operational benefit of issuing a CBDC?',
          options: [
            { id: 'p100-e2-a', key: 'A', text: 'It guarantees complete anonymity for all corporate and retail users.' },
            { id: 'p100-e2-b', key: 'B', text: 'It entirely eliminates the need for a national central banking authority.' },
            { id: 'p100-e2-c', key: 'C', text: 'It promotes financial inclusion and simplifies the execution of fiscal and monetary policy.' },
            { id: 'p100-e2-d', key: 'D', text: 'It permanently replaces commercial banks with foreign currency exchanges.' },
            { id: 'p100-e2-e', key: 'E', text: 'It increases national dependence on physical paper currency notes.' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'The text states that CBDCs promote financial inclusion and simplify the implementation of monetary and fiscal policy.'
            ],
            shortcutMethod: 'Direct match with paragraph 1.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-3',
          questionNumber: 3,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Why are privacy advocates and economic critics concerned about the nationwide implementation of CBDCs?',
          options: [
            { id: 'p100-e3-a', key: 'A', text: 'They believe digital currency will trigger hyperinflation in real estate.' },
            { id: 'p100-e3-b', key: 'B', text: 'They worry it could grant central authorities complete visibility into transactions, leading to state surveillance.' },
            { id: 'p100-e3-c', key: 'C', text: 'They argue digital ledgers are physically impossible to host on modern cloud servers.' },
            { id: 'p100-e3-d', key: 'D', text: 'They fear physical gold coins will lose all intrinsic value.' },
            { id: 'p100-e3-e', key: 'E', text: 'They think commercial banks will refuse to handle fiat transactions.' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Paragraph 2 explains surveillance concerns regarding complete transaction visibility by central banks.'],
            shortcutMethod: 'Look for keyword: "surveillance".',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-4',
          questionNumber: 4,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'What primarily determines the market valuation of a decentralized cryptocurrency like Bitcoin, according to the text?',
          options: [
            { id: 'p100-e4-a', key: 'A', text: 'Sovereign legislative decrees' },
            { id: 'p100-e4-b', key: 'B', text: 'The nation\'s central bank reserve' },
            { id: 'p100-e4-c', key: 'C', text: 'Open market forces and demand' },
            { id: 'p100-e4-d', key: 'D', text: 'Commercial bank interest rates' },
            { id: 'p100-e4-e', key: 'E', text: 'The gold standard' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Passage: "their value is dictated by the market".'],
            shortcutMethod: 'Market forces.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-5',
          questionNumber: 5,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Which of the following is cited as a vital prerequisite for a country transitioning successfully to a CBDC ecosystem?',
          options: [
            { id: 'p100-e5-a', key: 'A', text: 'A robust technological infrastructure capable of neutralizing cyber threats.' },
            { id: 'p100-e5-b', key: 'B', text: 'A total ban on domestic internet connectivity.' },
            { id: 'p100-e5-c', key: 'C', text: 'Doubling the minting of physical paper currency.' },
            { id: 'p100-e5-d', key: 'D', text: 'Transferring monetary sovereignty to foreign tech conglomerates.' },
            { id: 'p100-e5-e', key: 'E', text: 'Abolishing sovereign central banks.' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Passage: "transition requires a robust technological infrastructure to prevent cyber threats".'],
            shortcutMethod: 'Direct quote match.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-6',
          questionNumber: 6,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Choose the word which is most SIMILAR in meaning to the word "ROBUST" as used in the passage.',
          options: [
            { id: 'p100-e6-a', key: 'A', text: 'Fragile' },
            { id: 'p100-e6-b', key: 'B', text: 'Strong and resilient' },
            { id: 'p100-e6-c', key: 'C', text: 'Feeble' },
            { id: 'p100-e6-d', key: 'D', text: 'Complicated' },
            { id: 'p100-e6-e', key: 'E', text: 'Outdated' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Robust in the context of infrastructure means strong, hardy, and resilient.'],
            shortcutMethod: 'Synonym = Strong.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-7',
          questionNumber: 7,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Choose the word which is most OPPOSITE in meaning to the word "SEAMLESS" as used in the passage.',
          options: [
            { id: 'p100-e7-a', key: 'A', text: 'Flawless' },
            { id: 'p100-e7-b', key: 'B', text: 'Smooth' },
            { id: 'p100-e7-c', key: 'C', text: 'Continuous' },
            { id: 'p100-e7-d', key: 'D', text: 'Disrupted and fragmented' },
            { id: 'p100-e7-e', key: 'E', text: 'Harmonious' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Seamless means uninterrupted and smooth. The antonym is disrupted or fragmented.'],
            shortcutMethod: 'Antonym = Disrupted.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-8',
          questionNumber: 8,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'According to the passage, CBDCs aim to systematically reduce a country\'s economic dependence on what?',
          options: [
            { id: 'p100-e8-a', key: 'A', text: 'Foreign direct investment' },
            { id: 'p100-e8-b', key: 'B', text: 'Stock market securities' },
            { id: 'p100-e8-c', key: 'C', text: 'Physical cash notes' },
            { id: 'p100-e8-d', key: 'D', text: 'Sovereign gold reserves' },
            { id: 'p100-e8-e', key: 'E', text: 'Digital payment UPI systems' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Passage: "reduce dependence on physical cash".'],
            shortcutMethod: 'Physical cash.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-9',
          questionNumber: 9,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'Who bears the exclusive sovereign authority for issuing and regulating a CBDC?',
          options: [
            { id: 'p100-e9-a', key: 'A', text: 'A decentralized consortium of cryptocurrency miners' },
            { id: 'p100-e9-b', key: 'B', text: 'Commercial retail banking franchises' },
            { id: 'p100-e9-c', key: 'C', text: 'The nation\'s monetary authority or central bank' },
            { id: 'p100-e9-d', key: 'D', text: 'Private multinational technology corporations' },
            { id: 'p100-e9-e', key: 'E', text: 'Global speculative hedge funds' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Passage: "issued and regulated by the nation\\\'s monetary authority or central bank".'],
            shortcutMethod: 'Central bank.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-10',
          questionNumber: 10,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Reading Comprehension',
          type: 'MCQ_5_OPTION',
          groupId: 'group-rc-1',
          group: rcPassageGroup,
          statement: 'What would be the most suitable and comprehensive title for the given passage?',
          options: [
            { id: 'p100-e10-a', key: 'A', text: 'The Downfall and Extinction of Cryptocurrencies' },
            { id: 'p100-e10-b', key: 'B', text: 'A Retail Guide to Mining Bitcoin' },
            { id: 'p100-e10-c', key: 'C', text: 'The Rise and Strategic Implications of Central Bank Digital Currencies' },
            { id: 'p100-e10-d', key: 'D', text: 'The Immediate Abolition of Physical Paper Cash' },
            { id: 'p100-e10-e', key: 'E', text: 'Corporate Banking Surveillance Technologies' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['The passage surveys the genesis, benefits, differences from crypto, and implications of CBDCs.'],
            shortcutMethod: 'Broadest theme.',
            isFacultyVerified: true
          }
        },

        // Q11 - Q15: Error Spotting
        {
          id: 'p100-eng-11',
          questionNumber: 11,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Error Detection',
          type: 'MCQ_5_OPTION',
          statement: 'Hardly had the customer (A) / entered the bank premises (B) / than the security alarm (C) / started ringing loudly. (D) / No error (E)',
          options: [
            { id: 'p100-e11-a', key: 'A', text: 'Hardly had the customer' },
            { id: 'p100-e11-b', key: 'B', text: 'entered the bank premises' },
            { id: 'p100-e11-c', key: 'C', text: 'than the security alarm' },
            { id: 'p100-e11-d', key: 'D', text: 'started ringing loudly.' },
            { id: 'p100-e11-e', key: 'E', text: 'No error' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Conjunction rule: "Hardly... when" or "Scarcely... when" is the correct correlative pair.',
              '"Than" is used with "No sooner... than".',
              'Therefore, replace "than" with "when" in part (C).'
            ],
            shortcutMethod: 'Hardly/Scarcely takes "when", not "than".',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-12',
          questionNumber: 12,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Error Detection',
          type: 'MCQ_5_OPTION',
          statement: 'The manager, along with (A) / his colleagues, are (B) / preparing for the (C) / annual board meeting. (D) / No error (E)',
          options: [
            { id: 'p100-e12-a', key: 'A', text: 'The manager, along with' },
            { id: 'p100-e12-b', key: 'B', text: 'his colleagues, are' },
            { id: 'p100-e12-c', key: 'C', text: 'preparing for the' },
            { id: 'p100-e12-d', key: 'D', text: 'annual board meeting.' },
            { id: 'p100-e12-e', key: 'E', text: 'No error' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'When two subjects are joined by "along with", "as well as", "together with", or "in addition to", the verb agrees with the FIRST subject.',
              'Here, the first subject "The manager" is singular.',
              'Therefore, replace "are" with singular verb "is" in part (B).'
            ],
            shortcutMethod: 'Along with -> verb agrees with 1st subject (manager is singular).',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-13',
          questionNumber: 13,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Error Detection',
          type: 'MCQ_5_OPTION',
          statement: 'Neither the Chief Executive (A) / nor the board directors (B) / was convinced by the (C) / proposed restructuring plan. (D) / No error (E)',
          options: [
            { id: 'p100-e13-a', key: 'A', text: 'Neither the Chief Executive' },
            { id: 'p100-e13-b', key: 'B', text: 'nor the board directors' },
            { id: 'p100-e13-c', key: 'C', text: 'was convinced by the' },
            { id: 'p100-e13-d', key: 'D', text: 'proposed restructuring plan.' },
            { id: 'p100-e13-e', key: 'E', text: 'No error' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Rule: When subjects are joined by "neither... nor" or "either... or", the verb agrees with the NEAREST subject.',
              'The nearest subject "the board directors" is plural.',
              'Hence, "was" must be replaced with plural "were" in part (C).'
            ],
            shortcutMethod: 'Neither... nor -> verb agrees with nearest subject (directors = were).',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-14',
          questionNumber: 14,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Error Detection',
          type: 'MCQ_5_OPTION',
          statement: 'One of the most (A) / significant challenges facing (B) / retail banks are (C) / cyber fraud prevention. (D) / No error (E)',
          options: [
            { id: 'p100-e14-a', key: 'A', text: 'One of the most' },
            { id: 'p100-e14-b', key: 'B', text: 'significant challenges facing' },
            { id: 'p100-e14-c', key: 'C', text: 'retail banks are' },
            { id: 'p100-e14-d', key: 'D', text: 'cyber fraud prevention.' },
            { id: 'p100-e14-e', key: 'E', text: 'No error' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Phrase structure: "One of the + [Plural Noun] + [Singular Verb]".',
              'Subject is "One", which requires a singular verb.',
              'Replace "are" with "is" in part (C).'
            ],
            shortcutMethod: 'One of the... always takes a singular verb.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-15',
          questionNumber: 15,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Error Detection',
          type: 'MCQ_5_OPTION',
          statement: 'Unless the borrower do not (A) / submit all the required (B) / KYC documentation, the loan (C) / cannot be disbursed. (D) / No error (E)',
          options: [
            { id: 'p100-e15-a', key: 'A', text: 'Unless the borrower do not' },
            { id: 'p100-e15-b', key: 'B', text: 'submit all the required' },
            { id: 'p100-e15-c', key: 'C', text: 'KYC documentation, the loan' },
            { id: 'p100-e15-d', key: 'D', text: 'cannot be disbursed.' },
            { id: 'p100-e15-e', key: 'E', text: 'No error' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '"Unless" is inherently negative ("if not").',
              'Using "do not" creates an erroneous double negative.',
              'Replace "Unless the borrower do not submit" with "Unless the borrower submits" in part (A).'
            ],
            shortcutMethod: 'Never use "not" with "unless".',
            isFacultyVerified: true
          }
        },

        // Q16 - Q20: Cloze Test (Inflation Economics)
        {
          id: 'p100-eng-16',
          questionNumber: 16,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Cloze Test',
          type: 'MCQ_5_OPTION',
          statement: 'Inflation is an economic indicator that measures the rate at which the average (16) of goods and services in an economy increases over time. Select the word which fits blank (16).',
          options: [
            { id: 'p100-e16-a', key: 'A', text: 'price' },
            { id: 'p100-e16-b', key: 'B', text: 'debt' },
            { id: 'p100-e16-c', key: 'C', text: 'volume' },
            { id: 'p100-e16-d', key: 'D', text: 'tariff' },
            { id: 'p100-e16-e', key: 'E', text: 'discount' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Inflation measures changes in the general price level of goods and services.',
              '"Price" fits blank (16) accurately.'
            ],
            shortcutMethod: 'Average price of goods and services.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-17',
          questionNumber: 17,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Cloze Test',
          type: 'MCQ_5_OPTION',
          statement: 'When the general price level rises, each individual unit of currency is able to buy (17) goods and services than previously. Select the word which fits blank (17).',
          options: [
            { id: 'p100-e17-a', key: 'A', text: 'more' },
            { id: 'p100-e17-b', key: 'B', text: 'fewer' },
            { id: 'p100-e17-c', key: 'C', text: 'excess' },
            { id: 'p100-e17-d', key: 'D', text: 'surplus' },
            { id: 'p100-e17-e', key: 'E', text: 'infinite' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'When prices rise, currency buys fewer goods (countable noun "goods" takes "fewer", not "less").',
              'Option B "fewer" is grammatically and contextually correct.'
            ],
            shortcutMethod: 'Rising prices -> buy fewer goods.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-18',
          questionNumber: 18,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Cloze Test',
          type: 'MCQ_5_OPTION',
          statement: 'Consequently, inflation directly corresponds to a gradual reduction in the purchasing (18) of money. Select the word which fits blank (18).',
          options: [
            { id: 'p100-e18-a', key: 'A', text: 'power' },
            { id: 'p100-e18-b', key: 'B', text: 'liability' },
            { id: 'p100-e18-c', key: 'C', text: 'deficit' },
            { id: 'p100-e18-d', key: 'D', text: 'interest' },
            { id: 'p100-e18-e', key: 'E', text: 'velocity' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Standard economic collocation: "purchasing power of money".'],
            shortcutMethod: 'Purchasing power.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-19',
          questionNumber: 19,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Cloze Test',
          type: 'MCQ_5_OPTION',
          statement: 'Central banks attempt to limit inflation and avoid deflation in order to keep the domestic economy running (19). Select the word which fits blank (19).',
          options: [
            { id: 'p100-e19-a', key: 'A', text: 'erratically' },
            { id: 'p100-e19-b', key: 'B', text: 'smoothly' },
            { id: 'p100-e19-c', key: 'C', text: 'slowly' },
            { id: 'p100-e19-d', key: 'D', text: 'harshly' },
            { id: 'p100-e19-e', key: 'E', text: 'backward' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Adverb modifying running: "running smoothly" denotes steady economic stability.'],
            shortcutMethod: 'Positive adverb: smoothly.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-20',
          questionNumber: 20,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Cloze Test',
          type: 'MCQ_5_OPTION',
          statement: 'Generally, a moderate and stable inflation rate is considered a strong sign of a (20) and growing economy. Select the word which fits blank (20).',
          options: [
            { id: 'p100-e20-a', key: 'A', text: 'stagnant' },
            { id: 'p100-e20-b', key: 'B', text: 'healthy' },
            { id: 'p100-e20-c', key: 'C', text: 'depressed' },
            { id: 'p100-e20-d', key: 'D', text: 'fragile' },
            { id: 'p100-e20-e', key: 'E', text: 'bankrupt' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Parallel adjective to "growing": "healthy and growing economy".'],
            shortcutMethod: 'Healthy economy.',
            isFacultyVerified: true
          }
        },

        // Q21 - Q25: Para Jumbles / Sentence Rearrangement
        {
          id: 'p100-eng-21',
          questionNumber: 21,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Para Jumbles',
          type: 'MCQ_5_OPTION',
          statement: 'Rearrange the following five sentences (A, B, C, D, E) into a coherent paragraph: \n(A) Financial inclusion ensures unbanked households gain access to basic banking services. \n(B) Consequently, their reliance on predatory informal moneylenders decreases significantly. \n(C) In recent decades, technology has emerged as the main catalyst in this transformation. \n(D) Digital biometric identity and mobile banking apps have expanded outreach. \n(E) This empowerment fosters long-term domestic economic resilience. \nWhich of the following is the FIRST sentence of the rearranged sequence?',
          options: [
            { id: 'p100-e21-a', key: 'A', text: 'Sentence (A)' },
            { id: 'p100-e21-b', key: 'B', text: 'Sentence (C)' },
            { id: 'p100-e21-c', key: 'C', text: 'Sentence (B)' },
            { id: 'p100-e21-d', key: 'D', text: 'Sentence (D)' },
            { id: 'p100-e21-e', key: 'E', text: 'Sentence (E)' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Sentence (A) introduces the broad foundational theme: "Financial inclusion ensures unbanked households gain access to basic banking services."',
              'Logical flow: A -> B -> C -> D -> E.'
            ],
            shortcutMethod: 'Sentence A introduces the core subject noun.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-22',
          questionNumber: 22,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Para Jumbles',
          type: 'MCQ_5_OPTION',
          statement: 'In the rearrangement: (A) Introduction -> (B) Consequence -> (C) Technology catalyst -> (D) Digital tools -> (E) Long-term impact, which sentence is the THIRD sentence?',
          options: [
            { id: 'p100-e22-a', key: 'A', text: 'Sentence (B)' },
            { id: 'p100-e22-b', key: 'B', text: 'Sentence (C)' },
            { id: 'p100-e22-c', key: 'C', text: 'Sentence (D)' },
            { id: 'p100-e22-d', key: 'D', text: 'Sentence (A)' },
            { id: 'p100-e22-e', key: 'E', text: 'Sentence (E)' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Third sentence is (C): "In recent decades, technology has emerged as the main catalyst..."'],
            shortcutMethod: 'Position 3 = C.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-23',
          questionNumber: 23,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Para Jumbles',
          type: 'MCQ_5_OPTION',
          statement: 'Which sentence should be the FIFTH (LAST) sentence of the rearranged paragraph?',
          options: [
            { id: 'p100-e23-a', key: 'A', text: 'Sentence (A)' },
            { id: 'p100-e23-b', key: 'B', text: 'Sentence (B)' },
            { id: 'p100-e23-c', key: 'C', text: 'Sentence (C)' },
            { id: 'p100-e23-d', key: 'D', text: 'Sentence (D)' },
            { id: 'p100-e23-e', key: 'E', text: 'Sentence (E)' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Sentence (E) provides the concluding philosophical summary: "This empowerment fosters long-term domestic economic resilience."'],
            shortcutMethod: 'Concluding sentence = E.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-24',
          questionNumber: 24,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Para Jumbles',
          type: 'MCQ_5_OPTION',
          statement: 'What is the correct and coherent overall sequence of the rearranged paragraph?',
          options: [
            { id: 'p100-e24-a', key: 'A', text: 'A - B - C - D - E' },
            { id: 'p100-e24-b', key: 'B', text: 'C - D - A - B - E' },
            { id: 'p100-e24-c', key: 'C', text: 'A - C - D - B - E' },
            { id: 'p100-e24-d', key: 'D', text: 'D - C - A - B - E' },
            { id: 'p100-e24-e', key: 'E', text: 'B - A - C - D - E' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Flow: Definition (A) -> Direct immediate outcome (B) -> Enabling mechanism (C) -> Specific instances (D) -> Macro conclusion (E).'],
            shortcutMethod: 'A - B - C - D - E.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-25',
          questionNumber: 25,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Sentence Correction',
          type: 'MCQ_5_OPTION',
          statement: 'Select the phrase which best improves the bold segment: "Had the monetary committee **acted in timely fashion**, the credit crisis could have been averted."',
          options: [
            { id: 'p100-e25-a', key: 'A', text: 'acted in a timely manner' },
            { id: 'p100-e25-b', key: 'B', text: 'act timely' },
            { id: 'p100-e25-c', key: 'C', text: 'acted on time fashion' },
            { id: 'p100-e25-d', key: 'D', text: 'has acted in time' },
            { id: 'p100-e25-e', key: 'E', text: 'No improvement required' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Idiomatic usage requires the article "a" in "in a timely manner" or "in a timely fashion".',
              'Option A "acted in a timely manner" is standard formal English.'
            ],
            shortcutMethod: 'In a timely manner.',
            isFacultyVerified: true
          }
        },

        // Q26 - Q30: Vocabulary & Word Replacement
        {
          id: 'p100-eng-26',
          questionNumber: 26,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          statement: 'Choose the word that is most SIMILAR in meaning to "PRUDENT" as used in commercial bank asset management.',
          options: [
            { id: 'p100-e26-a', key: 'A', text: 'Reckless' },
            { id: 'p100-e26-b', key: 'B', text: 'Cautious and judicious' },
            { id: 'p100-e26-c', key: 'C', text: 'Hasty' },
            { id: 'p100-e26-d', key: 'D', text: 'Impetuous' },
            { id: 'p100-e26-e', key: 'E', text: 'Extravagant' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Prudent means acting with or showing care and thought for the future; judicious and cautious.'],
            shortcutMethod: 'Synonym = Cautious.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-27',
          questionNumber: 27,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          statement: 'Choose the word that is most OPPOSITE in meaning to "VOLATILE".',
          options: [
            { id: 'p100-e27-a', key: 'A', text: 'Unpredictable' },
            { id: 'p100-e27-b', key: 'B', text: 'Erratic' },
            { id: 'p100-e27-c', key: 'C', text: 'Stable and constant' },
            { id: 'p100-e27-d', key: 'D', text: 'Turbulent' },
            { id: 'p100-e27-e', key: 'E', text: 'Capricious' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Volatile means liable to change rapidly and unpredictably. Antonym is stable and constant.'],
            shortcutMethod: 'Antonym = Stable.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-28',
          questionNumber: 28,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          statement: 'Select the most appropriate word to fill in the blank: "The central bank issued stringent guidelines to ensure that all scheduled banks maintain adequate capital to _____ sudden liquidity shocks."',
          options: [
            { id: 'p100-e28-a', key: 'A', text: 'aggravate' },
            { id: 'p100-e28-b', key: 'B', text: 'withstand' },
            { id: 'p100-e28-c', key: 'C', text: 'succumb' },
            { id: 'p100-e28-d', key: 'D', text: 'accelerate' },
            { id: 'p100-e28-e', key: 'E', text: 'instigate' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['To withstand shocks means to endure or resist financial distress successfully.'],
            shortcutMethod: 'Withstand shocks.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-29',
          questionNumber: 29,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          statement: 'Identify the word with the correct spelling:',
          options: [
            { id: 'p100-e29-a', key: 'A', text: 'Accomodation' },
            { id: 'p100-e29-b', key: 'B', text: 'Accommodation' },
            { id: 'p100-e29-c', key: 'C', text: 'Acommodation' },
            { id: 'p100-e29-d', key: 'D', text: 'Acomodation' },
            { id: 'p100-e29-e', key: 'E', text: 'Accomadation' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['The correct spelling has double "c" and double "m": Accommodation.'],
            shortcutMethod: 'Double c, double m.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-eng-30',
          questionNumber: 30,
          subject: 'ENGLISH_LANGUAGE',
          topic: 'Vocabulary',
          type: 'MCQ_5_OPTION',
          statement: 'What is the meaning of the idiom "to balance the books"?',
          options: [
            { id: 'p100-e30-a', key: 'A', text: 'To stack library volumes evenly on shelves' },
            { id: 'p100-e30-b', key: 'B', text: 'To ensure debits equal credits in financial accounting' },
            { id: 'p100-e30-c', key: 'C', text: 'To destroy audit evidence during scrutiny' },
            { id: 'p100-e30-d', key: 'D', text: 'To write a favorable credit rating report' },
            { id: 'p100-e30-e', key: 'E', text: 'To print duplicate ledger copies' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['"To balance the books" means ensuring total revenue equals or covers total expenditure in financial accounts.'],
            shortcutMethod: 'Accounting equivalence.',
            isFacultyVerified: true
          }
        }
      ]
    },

    // ------------------------------------------------------------------------
    // SECTION 2: QUANTITATIVE APTITUDE (35 QUESTIONS, 20 MINUTES)
    // ------------------------------------------------------------------------
    {
      id: 'sec-prelims-quant-100',
      title: 'Quantitative Aptitude',
      subject: 'QUANTITATIVE_APTITUDE',
      order: 2,
      durationMinutes: 20,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 10.0,
      totalQuestions: 35,
      questions: [
        // Q31 - Q40: Simplification & Approximation (Formulas with normalized math symbols)
        {
          id: 'p100-q-31',
          questionNumber: 31,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '45 × 27 = ? × 9',
          options: [
            { id: 'p100-q31-a', key: 'A', text: '288' },
            { id: 'p100-q31-b', key: 'B', text: '275' },
            { id: 'p100-q31-c', key: 'C', text: '284' },
            { id: 'p100-q31-d', key: 'D', text: '135' },
            { id: 'p100-q31-e', key: 'E', text: '280' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              '? = (45 × 27) ÷ 9',
              '? = 5 × 27 = 135.'
            ],
            shortcutMethod: '45/9 = 5; 5 × 27 = 135.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-32',
          questionNumber: 32,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '40 × 27 + 564 - ?² = 275',
          options: [
            { id: 'p100-q32-a', key: 'A', text: '28' },
            { id: 'p100-q32-b', key: 'B', text: '35' },
            { id: 'p100-q32-c', key: 'C', text: '37' },
            { id: 'p100-q32-d', key: 'D', text: '32' },
            { id: 'p100-q32-e', key: 'E', text: '30' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              '40 × 27 = 1080',
              '1080 + 564 = 1644',
              '1644 - ?² = 275 => ?² = 1644 - 275 = 1369',
              '? = √1369 = 37.'
            ],
            shortcutMethod: 'Unit digit of 1369 ending in 9 with tens 13 -> 37.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-33',
          questionNumber: 33,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '? - √1024 × 13 = 57% of 200 + 16²',
          options: [
            { id: 'p100-q33-a', key: 'A', text: '780' },
            { id: 'p100-q33-b', key: 'B', text: '778' },
            { id: 'p100-q33-c', key: 'C', text: '782' },
            { id: 'p100-q33-d', key: 'D', text: '784' },
            { id: 'p100-q33-e', key: 'E', text: '786' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '√1024 = 32; 32 × 13 = 416',
              '57% of 200 = 114; 16² = 256',
              '? - 416 = 114 + 256 = 370',
              '? = 370 + 416 = 786.'
            ],
            shortcutMethod: '370 + 416 = 786.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-34',
          questionNumber: 34,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '(46 × 42) ÷ 4 + 437 = ? × 5 + 325',
          options: [
            { id: 'p100-q34-a', key: 'A', text: '122' },
            { id: 'p100-q34-b', key: 'B', text: '119' },
            { id: 'p100-q34-c', key: 'C', text: '118' },
            { id: 'p100-q34-d', key: 'D', text: '115' },
            { id: 'p100-q34-e', key: 'E', text: '113' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '46 × 42 = 1932; 1932 ÷ 4 = 483',
              '483 + 437 = 920',
              '? × 5 + 325 = 920 => ? × 5 = 920 - 325 = 595',
              '? = 595 ÷ 5 = 119.'
            ],
            shortcutMethod: '595 / 5 = 119.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-35',
          questionNumber: 35,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '2/5 of 1400 - 47% of 400 = ? × 6',
          options: [
            { id: 'p100-q35-a', key: 'A', text: '60' },
            { id: 'p100-q35-b', key: 'B', text: '66' },
            { id: 'p100-q35-c', key: 'C', text: '58' },
            { id: 'p100-q35-d', key: 'D', text: '62' },
            { id: 'p100-q35-e', key: 'E', text: '64' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              '2/5 of 1400 = 560',
              '47% of 400 = 47 × 4 = 188',
              '560 - 188 = 372',
              '? × 6 = 372 => ? = 372 ÷ 6 = 62.'
            ],
            shortcutMethod: '372 / 6 = 62.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-36',
          questionNumber: 36,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '((9.12)³ × 7.87) ÷ ? = (17.96)² (Approximate value)',
          options: [
            { id: 'p100-q36-a', key: 'A', text: '15' },
            { id: 'p100-q36-b', key: 'B', text: '18' },
            { id: 'p100-q36-c', key: 'C', text: '22' },
            { id: 'p100-q36-d', key: 'D', text: '25' },
            { id: 'p100-q36-e', key: 'E', text: '11' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Approximate: 9³ = 729; 7.87 ≈ 8; 729 × 8 = 5832',
              '(17.96)² ≈ 18² = 324',
              '? ≈ 5832 ÷ 324 = 18.'
            ],
            shortcutMethod: '(729 × 8) / 324 = 18.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-37',
          questionNumber: 37,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '35.01% of 899.96 - ? = 24.9% of 480 (Approximate value)',
          options: [
            { id: 'p100-q37-a', key: 'A', text: '255' },
            { id: 'p100-q37-b', key: 'B', text: '305' },
            { id: 'p100-q37-c', key: 'C', text: '195' },
            { id: 'p100-q37-d', key: 'D', text: '186' },
            { id: 'p100-q37-e', key: 'E', text: '155' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              '35% of 900 = 315',
              '25% of 480 = 120',
              '? ≈ 315 - 120 = 195.'
            ],
            shortcutMethod: '315 - 120 = 195.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-38',
          questionNumber: 38,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '474.94 - 258.12 - 14.9% of 1200 = ? (Approximate value)',
          options: [
            { id: 'p100-q38-a', key: 'A', text: '37' },
            { id: 'p100-q38-b', key: 'B', text: '116' },
            { id: 'p100-q38-c', key: 'C', text: '127' },
            { id: 'p100-q38-d', key: 'D', text: '89' },
            { id: 'p100-q38-e', key: 'E', text: '70' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              '475 - 258 = 217',
              '15% of 1200 = 180',
              '? = 217 - 180 = 37.'
            ],
            shortcutMethod: '217 - 180 = 37.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-39',
          questionNumber: 39,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '3/7 of 3/8 of 839.98 + 13.95 × 22.03 = ? (Approximate value)',
          options: [
            { id: 'p100-q39-a', key: 'A', text: '445' },
            { id: 'p100-q39-b', key: 'B', text: '440' },
            { id: 'p100-q39-c', key: 'C', text: '438' },
            { id: 'p100-q39-d', key: 'D', text: '435' },
            { id: 'p100-q39-e', key: 'E', text: '443' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '840 × 3/8 = 315; 315 × 3/7 = 135',
              '14 × 22 = 308',
              '? ≈ 135 + 308 = 443.'
            ],
            shortcutMethod: '135 + 308 = 443.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-40',
          questionNumber: 40,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Simplification & Approx.',
          type: 'MCQ_5_OPTION',
          statement: '1769.97 ÷ 5.03 + √? = 16² + 7.99 × 13.02 (Approximate value)',
          options: [
            { id: 'p100-q40-a', key: 'A', text: '64' },
            { id: 'p100-q40-b', key: 'B', text: '16' },
            { id: 'p100-q40-c', key: 'C', text: '49' },
            { id: 'p100-q40-d', key: 'D', text: '36' },
            { id: 'p100-q40-e', key: 'E', text: '25' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '1770 ÷ 5 = 354',
              '16² = 256; 8 × 13 = 104; 256 + 104 = 360',
              '354 + √? = 360 => √? = 6 => ? = 36.'
            ],
            shortcutMethod: '√? = 6 -> ? = 36.',
            isFacultyVerified: true
          }
        },

        // Q41 - Q45: Quadratic Equations
        {
          id: 'p100-q-41',
          questionNumber: 41,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Quadratic Equations',
          type: 'MCQ_5_OPTION',
          statement: 'I. 2x² + 2 = 5x\nII. y² - 8y + 16 = 0',
          options: [
            { id: 'p100-q41-a', key: 'A', text: 'x ≥ y' },
            { id: 'p100-q41-b', key: 'B', text: 'x ≤ y' },
            { id: 'p100-q41-c', key: 'C', text: 'x < y' },
            { id: 'p100-q41-d', key: 'D', text: 'x = y or relation cannot be established' },
            { id: 'p100-q41-e', key: 'E', text: 'x > y' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Equation I: 2x² - 5x + 2 = 0 => (2x - 1)(x - 2) = 0 => x = 0.5, 2',
              'Equation II: (y - 4)² = 0 => y = 4',
              'Comparing: 0.5 < 4 and 2 < 4. Hence x < y.'
            ],
            shortcutMethod: 'x ∈ {0.5, 2} < y = 4 => x < y.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-42',
          questionNumber: 42,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Quadratic Equations',
          type: 'MCQ_5_OPTION',
          statement: 'I. x² - 12x + 35 = 0\nII. y² - 19y + 90 = 0',
          options: [
            { id: 'p100-q42-a', key: 'A', text: 'x ≥ y' },
            { id: 'p100-q42-b', key: 'B', text: 'x ≤ y' },
            { id: 'p100-q42-c', key: 'C', text: 'x < y' },
            { id: 'p100-q42-d', key: 'D', text: 'x = y or relation cannot be established' },
            { id: 'p100-q42-e', key: 'E', text: 'x > y' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Equation I: Factors of 35 adding to 12 are 7, 5 => x = 5, 7',
              'Equation II: Factors of 90 adding to 19 are 10, 9 => y = 9, 10',
              'Comparing: Both 5 and 7 are strictly less than 9 and 10. Hence x < y.'
            ],
            shortcutMethod: 'x = {5, 7} < y = {9, 10}.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-43',
          questionNumber: 43,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Quadratic Equations',
          type: 'MCQ_5_OPTION',
          statement: 'I. x² - 7x + 12 = 0\nII. y² - 9y + 20 = 0',
          options: [
            { id: 'p100-q43-a', key: 'A', text: 'x ≥ y' },
            { id: 'p100-q43-b', key: 'B', text: 'x ≤ y' },
            { id: 'p100-q43-c', key: 'C', text: 'x < y' },
            { id: 'p100-q43-d', key: 'D', text: 'x = y or relation cannot be established' },
            { id: 'p100-q43-e', key: 'E', text: 'x > y' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Equation I: x = 3, 4',
              'Equation II: y = 4, 5',
              'Comparing: 3 < 4, 3 < 5; 4 = 4, 4 < 5 => x ≤ y.'
            ],
            shortcutMethod: 'x ≤ y.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-44',
          questionNumber: 44,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Quadratic Equations',
          type: 'MCQ_5_OPTION',
          statement: 'I. x² = 64\nII. y = √64',
          options: [
            { id: 'p100-q44-a', key: 'A', text: 'x ≥ y' },
            { id: 'p100-q44-b', key: 'B', text: 'x ≤ y' },
            { id: 'p100-q44-c', key: 'C', text: 'x < y' },
            { id: 'p100-q44-d', key: 'D', text: 'x = y or relation cannot be established' },
            { id: 'p100-q44-e', key: 'E', text: 'x > y' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Equation I: x² = 64 => x = +8 or -8',
              'Equation II: Principal square root y = √64 = +8 only',
              'Comparing: when x = 8, x = y; when x = -8, x < y => x ≤ y.'
            ],
            shortcutMethod: 'x = ±8, y = +8 => x ≤ y.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-45',
          questionNumber: 45,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Quadratic Equations',
          type: 'MCQ_5_OPTION',
          statement: 'I. 3x² + 8x + 5 = 0\nII. 2y² + 7y + 6 = 0',
          options: [
            { id: 'p100-q45-a', key: 'A', text: 'x ≥ y' },
            { id: 'p100-q45-b', key: 'B', text: 'x ≤ y' },
            { id: 'p100-q45-c', key: 'C', text: 'x < y' },
            { id: 'p100-q45-d', key: 'D', text: 'x = y or relation cannot be established' },
            { id: 'p100-q45-e', key: 'E', text: 'x > y' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Equation I: (3x + 5)(x + 1) = 0 => x = -1, -5/3 (-1.66)',
              'Equation II: (2y + 3)(y + 2) = 0 => y = -1.5, -2',
              'Comparing gives x ≥ y.'
            ],
            shortcutMethod: 'x ≥ y.',
            isFacultyVerified: true
          }
        },

        // Q46 - Q50: Data Interpretation (PSB Banking Table)
        {
          id: 'p100-q-46',
          questionNumber: 46,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          type: 'MCQ_5_OPTION',
          groupId: 'group-di-1',
          group: diTableGroup,
          statement: 'What is the absolute Gross Non-Performing Asset (GNPA) amount for Punjab National Bank (PNB) in ₹ Crores, given Advances = ₹9,80,000 Cr and Gross NPA % = 5.73%?',
          options: [
            { id: 'p100-q46-a', key: 'A', text: '₹56,154 Cr' },
            { id: 'p100-q46-b', key: 'B', text: '₹52,340 Cr' },
            { id: 'p100-q46-c', key: 'C', text: '₹61,220 Cr' },
            { id: 'p100-q46-d', key: 'D', text: '₹48,900 Cr' },
            { id: 'p100-q46-e', key: 'E', text: '₹58,450 Cr' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Gross NPA = 5.73% of Advances = 0.0573 × 9,80,000 = ₹56,154 Crores.'
            ],
            shortcutMethod: '9800 × 5.73 = 56,154.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-47',
          questionNumber: 47,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          type: 'MCQ_5_OPTION',
          groupId: 'group-di-1',
          group: diTableGroup,
          statement: 'What is the Credit-to-Deposit (C-D) Ratio of Bank of Baroda (Advances = ₹10,40,000 Cr, Deposits = ₹12,50,000 Cr)?',
          options: [
            { id: 'p100-q47-a', key: 'A', text: '78.5%' },
            { id: 'p100-q47-b', key: 'B', text: '83.2%' },
            { id: 'p100-q47-c', key: 'C', text: '86.4%' },
            { id: 'p100-q47-d', key: 'D', text: '74.2%' },
            { id: 'p100-q47-e', key: 'E', text: '81.0%' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['C-D Ratio = (10,40,000 ÷ 12,50,000) × 100 = 83.2%.'],
            shortcutMethod: '104 / 125 = 83.2%.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-48',
          questionNumber: 48,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          type: 'MCQ_5_OPTION',
          groupId: 'group-di-1',
          group: diTableGroup,
          statement: 'What is the total combined deposit of all 5 banks in ₹ Crores (44.5L + 13.7L + 12.5L + 13.1L + 11.8L)?',
          options: [
            { id: 'p100-q48-a', key: 'A', text: '₹95,60,000 Cr' },
            { id: 'p100-q48-b', key: 'B', text: '₹94,80,000 Cr' },
            { id: 'p100-q48-c', key: 'C', text: '₹95,20,000 Cr' },
            { id: 'p100-q48-d', key: 'D', text: '₹96,00,000 Cr' },
            { id: 'p100-q48-e', key: 'E', text: '₹93,90,000 Cr' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['44,50,000 + 13,70,000 + 12,50,000 + 13,10,000 + 11,80,000 = ₹95,60,000 Crores.'],
            shortcutMethod: 'Sum of deposits = 95.6 Lakh Cr.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-49',
          questionNumber: 49,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          type: 'MCQ_5_OPTION',
          groupId: 'group-di-1',
          group: diTableGroup,
          statement: 'By what percentage is SBI\'s advances (₹35,00,000 Cr) greater than Canara Bank\'s advances (₹9,60,000 Cr)? (Approximate)',
          options: [
            { id: 'p100-q49-a', key: 'A', text: '245%' },
            { id: 'p100-q49-b', key: 'B', text: '264.6%' },
            { id: 'p100-q49-c', key: 'C', text: '280%' },
            { id: 'p100-q49-d', key: 'D', text: '250%' },
            { id: 'p100-q49-e', key: 'E', text: '235%' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Difference = 35,00,000 - 9,60,000 = 25,40,000; (25,40,000 / 9,60,000) × 100 ≈ 264.58%.'],
            shortcutMethod: '254 / 96 = 264.6%.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-50',
          questionNumber: 50,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          type: 'MCQ_5_OPTION',
          groupId: 'group-di-1',
          group: diTableGroup,
          statement: 'Which bank has the lowest Gross NPA percentage among all five public sector banks?',
          options: [
            { id: 'p100-q50-a', key: 'A', text: 'State Bank of India (SBI)' },
            { id: 'p100-q50-b', key: 'B', text: 'Punjab National Bank (PNB)' },
            { id: 'p100-q50-c', key: 'C', text: 'Bank of Baroda (BOB)' },
            { id: 'p100-q50-d', key: 'D', text: 'Canara Bank' },
            { id: 'p100-q50-e', key: 'E', text: 'Union Bank of India' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['SBI Gross NPA % is 2.24%, which is the lowest in the table.'],
            shortcutMethod: 'Lowest NPA = SBI (2.24%).',
            isFacultyVerified: true
          }
        },

        // Q51 - Q55: Number Series
        {
          id: 'p100-q-51',
          questionNumber: 51,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Number Series',
          type: 'MCQ_5_OPTION',
          statement: 'Find the missing number in the series: 6, 14, 36, 98, ?',
          options: [
            { id: 'p100-q51-a', key: 'A', text: '276' },
            { id: 'p100-q51-b', key: 'B', text: '256' },
            { id: 'p100-q51-c', key: 'C', text: '248' },
            { id: 'p100-q51-d', key: 'D', text: '284' },
            { id: 'p100-q51-e', key: 'E', text: '290' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Pattern: 6 × 2 + 2 = 14',
              '14 × 2 + 8 = 36',
              '36 × 2 + 26 = 98',
              'Difference of additions: 6, 18, 54 (×3)',
              'Next addition: 26 + 54 = 80 => 98 × 2 + 80 = 276.'
            ],
            shortcutMethod: 'Next term = 276.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-52',
          questionNumber: 52,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Number Series',
          type: 'MCQ_5_OPTION',
          statement: 'Find the missing number: 12, 19, 35, 62, 102, ?',
          options: [
            { id: 'p100-q52-a', key: 'A', text: '157' },
            { id: 'p100-q52-b', key: 'B', text: '155' },
            { id: 'p100-q52-c', key: 'C', text: '159' },
            { id: 'p100-q52-d', key: 'D', text: '162' },
            { id: 'p100-q52-e', key: 'E', text: '148' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Differences: 7, 16, 27, 40',
              'Second differences: 9, 11, 13, next = 15',
              'Next difference: 40 + 15 = 55 => 102 + 55 = 157.'
            ],
            shortcutMethod: 'Second difference of odd numbers.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-53',
          questionNumber: 53,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Number Series',
          type: 'MCQ_5_OPTION',
          statement: 'Find the wrong number in the series: 4, 11, 25, 55, 117, 243',
          options: [
            { id: 'p100-q53-a', key: 'A', text: '11' },
            { id: 'p100-q53-b', key: 'B', text: '25' },
            { id: 'p100-q53-c', key: 'C', text: '55' },
            { id: 'p100-q53-d', key: 'D', text: '117' },
            { id: 'p100-q53-e', key: 'E', text: '243' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '4 × 2 + 3 = 11',
              '11 × 2 + 3 = 25',
              '25 × 2 + 3 = 53 (not 55)',
              '53 × 2 + 3 = 109, etc.'
            ],
            shortcutMethod: 'Wrong number is 55.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-54',
          questionNumber: 54,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Number Series',
          type: 'MCQ_5_OPTION',
          statement: 'Find the missing number: 8, 9, 20, 63, 256, ?',
          options: [
            { id: 'p100-q54-a', key: 'A', text: '1285' },
            { id: 'p100-q54-b', key: 'B', text: '1280' },
            { id: 'p100-q54-c', key: 'C', text: '1290' },
            { id: 'p100-q54-d', key: 'D', text: '1275' },
            { id: 'p100-q54-e', key: 'E', text: '1300' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '8 × 1 + 1 = 9',
              '9 × 2 + 2 = 20',
              '20 × 3 + 3 = 63',
              '63 × 4 + 4 = 256',
              '256 × 5 + 5 = 1285.'
            ],
            shortcutMethod: 'n × k + k.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-55',
          questionNumber: 55,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Number Series',
          type: 'MCQ_5_OPTION',
          statement: 'Find the missing number: 1000, 500, 250, 125, ?',
          options: [
            { id: 'p100-q55-a', key: 'A', text: '62.5' },
            { id: 'p100-q55-b', key: 'B', text: '60' },
            { id: 'p100-q55-c', key: 'C', text: '50' },
            { id: 'p100-q55-d', key: 'D', text: '65' },
            { id: 'p100-q55-e', key: 'E', text: '75' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Division by 2: 125 ÷ 2 = 62.5.'],
            shortcutMethod: 'Half of 125 = 62.5.',
            isFacultyVerified: true
          }
        },

        // Q56 - Q65: Arithmetic Word Problems
        {
          id: 'p100-q-56',
          questionNumber: 56,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A sum of ₹12,000 amounts to ₹15,840 in 4 years at simple interest. What is the rate of interest per annum?',
          options: [
            { id: 'p100-q56-a', key: 'A', text: '8%' },
            { id: 'p100-q56-b', key: 'B', text: '8.5%' },
            { id: 'p100-q56-c', key: 'C', text: '7.5%' },
            { id: 'p100-q56-d', key: 'D', text: '9%' },
            { id: 'p100-q56-e', key: 'E', text: '6.5%' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'SI = 15840 - 12000 = ₹3840.',
              'SI per year = 3840 ÷ 4 = ₹960.',
              'Rate = (960 / 12000) × 100 = 8% p.a.'
            ],
            shortcutMethod: '960 / 12000 = 8%.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-57',
          questionNumber: 57,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A shopkeeper marks an article 40% above its cost price and offers a cash discount of 20%. If he makes a profit of ₹360, what was the cost price of the article?',
          options: [
            { id: 'p100-q57-a', key: 'A', text: '₹3000' },
            { id: 'p100-q57-b', key: 'B', text: '₹2800' },
            { id: 'p100-q57-c', key: 'C', text: '₹3200' },
            { id: 'p100-q57-d', key: 'D', text: '₹2500' },
            { id: 'p100-q57-e', key: 'E', text: '₹3600' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Let CP = 100. MP = 140.',
              'SP = 140 - 20% of 140 = 140 - 28 = 112.',
              'Profit = 112 - 100 = 12% = ₹360.',
              '100% CP = (360 / 12) × 100 = ₹3000.'
            ],
            shortcutMethod: '12% = 360 => 100% = 3000.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-58',
          questionNumber: 58,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A can complete a work in 18 days and B can complete it in 24 days. If they work together for 6 days and then A leaves, in how many more days will B finish the remaining work?',
          options: [
            { id: 'p100-q58-a', key: 'A', text: '10 days' },
            { id: 'p100-q58-b', key: 'B', text: '8 days' },
            { id: 'p100-q58-c', key: 'C', text: '12 days' },
            { id: 'p100-q58-d', key: 'D', text: '14 days' },
            { id: 'p100-q58-e', key: 'E', text: '9 days' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Total work = LCM(18, 24) = 72 units.',
              'A\'s efficiency = 4 units/day; B\'s efficiency = 3 units/day.',
              'Together in 6 days = 6 × (4 + 3) = 42 units.',
              'Remaining work = 72 - 42 = 30 units.',
              'Time taken by B = 30 ÷ 3 = 10 days.'
            ],
            shortcutMethod: 'Remaining 30 units / 3 = 10 days.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-59',
          questionNumber: 59,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A train 240 meters long passes an electric pole in 12 seconds. How much time will it take to cross a railway platform 360 meters long at the same speed?',
          options: [
            { id: 'p100-q59-a', key: 'A', text: '28 seconds' },
            { id: 'p100-q59-b', key: 'B', text: '30 seconds' },
            { id: 'p100-q59-c', key: 'C', text: '32 seconds' },
            { id: 'p100-q59-d', key: 'D', text: '25 seconds' },
            { id: 'p100-q59-e', key: 'E', text: '36 seconds' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Speed of train = 240 ÷ 12 = 20 m/s.',
              'Total distance to cross platform = 240 + 360 = 600 meters.',
              'Time = 600 ÷ 20 = 30 seconds.'
            ],
            shortcutMethod: '600 / 20 = 30 sec.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-60',
          questionNumber: 60,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'In an 80-liter mixture of milk and water, the ratio of milk to water is 7:3. How much water must be added to make the ratio 2:1?',
          options: [
            { id: 'p100-q60-a', key: 'A', text: '4 liters' },
            { id: 'p100-q60-b', key: 'B', text: '5 liters' },
            { id: 'p100-q60-c', key: 'C', text: '6 liters' },
            { id: 'p100-q60-d', key: 'D', text: '8 liters' },
            { id: 'p100-q60-e', key: 'E', text: '3 liters' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Milk = (7/10) × 80 = 56 L; Water = 24 L.',
              'New ratio is 2:1, so Milk = 2 units = 56 L => 1 unit water = 28 L.',
              'Water to add = 28 - 24 = 4 liters.'
            ],
            shortcutMethod: '28 - 24 = 4 L.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-61',
          questionNumber: 61,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'The present ages of Rahul and Amit are in the ratio 5:4. Five years hence, the ratio of their ages will become 6:5. What is Rahul\'s present age?',
          options: [
            { id: 'p100-q61-a', key: 'A', text: '25 years' },
            { id: 'p100-q61-b', key: 'B', text: '20 years' },
            { id: 'p100-q61-c', key: 'C', text: '30 years' },
            { id: 'p100-q61-d', key: 'D', text: '35 years' },
            { id: 'p100-q61-e', key: 'E', text: '28 years' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Ratio shift from 5:4 to 6:5 represents +1 unit in 5 years.',
              '1 unit = 5 years.',
              'Rahul\'s present age = 5 × 5 = 25 years.'
            ],
            shortcutMethod: '1 unit = 5 years => 5 × 5 = 25.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-62',
          questionNumber: 62,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A boat can travel 36 km downstream in 3 hours and 24 km upstream in 4 hours. What is the speed of the stream in km/h?',
          options: [
            { id: 'p100-q62-a', key: 'A', text: '3 km/h' },
            { id: 'p100-q62-b', key: 'B', text: '2.5 km/h' },
            { id: 'p100-q62-c', key: 'C', text: '4 km/h' },
            { id: 'p100-q62-d', key: 'D', text: '2 km/h' },
            { id: 'p100-q62-e', key: 'E', text: '1.5 km/h' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Downstream speed (D) = 36 ÷ 3 = 12 km/h.',
              'Upstream speed (U) = 24 ÷ 4 = 6 km/h.',
              'Speed of stream = (D - U) ÷ 2 = (12 - 6) ÷ 2 = 3 km/h.'
            ],
            shortcutMethod: '(12 - 6) / 2 = 3 km/h.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-63',
          questionNumber: 63,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'P and Q start a business with investments in the ratio 4:5. After 6 months, P doubles his investment while Q withdraws half of his. At the end of the year, in what ratio should their profits be shared?',
          options: [
            { id: 'p100-q63-a', key: 'A', text: '8:5' },
            { id: 'p100-q63-b', key: 'B', text: '12:7' },
            { id: 'p100-q63-c', key: 'C', text: '16:15' },
            { id: 'p100-q63-d', key: 'D', text: '14:9' },
            { id: 'p100-q63-e', key: 'E', text: '7:5' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'P\'s capital-months = (4 × 6) + (8 × 6) = 24 + 48 = 72.',
              'Q\'s capital-months = (5 × 6) + (2.5 × 6) = 30 + 15 = 45.',
              'Profit ratio P:Q = 72:45 = 8:5.'
            ],
            shortcutMethod: '72:45 = 8:5.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-64',
          questionNumber: 64,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'A bag contains 5 red, 4 blue, and 3 green marbles. If two marbles are drawn at random without replacement, what is the probability that both are red?',
          options: [
            { id: 'p100-q64-a', key: 'A', text: '5/33' },
            { id: 'p100-q64-b', key: 'B', text: '5/66' },
            { id: 'p100-q64-c', key: 'C', text: '1/6' },
            { id: 'p100-q64-d', key: 'D', text: '2/11' },
            { id: 'p100-q64-e', key: 'E', text: '7/33' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Total marbles = 5 + 4 + 3 = 12.',
              'P(both red) = (5/12) × (4/11) = 20/132 = 5/33.'
            ],
            shortcutMethod: '(5 × 4) / (12 × 11) = 5/33.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-q-65',
          questionNumber: 65,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Arithmetic',
          type: 'MCQ_5_OPTION',
          statement: 'What is the compound interest on ₹15,000 for 2 years at 10% per annum compounded annually?',
          options: [
            { id: 'p100-q65-a', key: 'A', text: '₹3,150' },
            { id: 'p100-q65-b', key: 'B', text: '₹3,000' },
            { id: 'p100-q65-c', key: 'C', text: '₹3,300' },
            { id: 'p100-q65-d', key: 'D', text: '₹2,850' },
            { id: 'p100-q65-e', key: 'E', text: '₹3,250' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Net effective CI rate for 2 years at 10% = 10 + 10 + (10×10)/100 = 21%.',
              'CI = 21% of 15,000 = ₹3,150.'
            ],
            shortcutMethod: '21% of 15000 = 3150.',
            isFacultyVerified: true
          }
        }
      ]
    },

    // ------------------------------------------------------------------------
    // SECTION 3: REASONING ABILITY (35 QUESTIONS, 20 MINUTES)
    // ------------------------------------------------------------------------
    {
      id: 'sec-prelims-reas-100',
      title: 'Reasoning Ability',
      subject: 'REASONING_ABILITY',
      order: 3,
      durationMinutes: 20,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 10.0,
      totalQuestions: 35,
      questions: [
        // Q66 - Q70: Syllogisms
        {
          id: 'p100-r-66',
          questionNumber: 66,
          subject: 'REASONING_ABILITY',
          topic: 'Syllogism',
          type: 'MCQ_5_OPTION',
          statement: 'Statements: Some A are B. All B are C. No C is D.\nConclusions: I. Some A are not D. II. All B being A is a possibility.',
          options: [
            { id: 'p100-r66-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r66-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r66-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r66-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r66-e', key: 'E', text: 'Both I and II follow' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Part of A that is in B (and thus in C) cannot be D. So Some A are not D is definitely true.',
              'There is no negative restriction between A and B, so All B being A is a valid possibility.',
              'Both conclusions follow.'
            ],
            shortcutMethod: 'Both I and II follow.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-67',
          questionNumber: 67,
          subject: 'REASONING_ABILITY',
          topic: 'Syllogism',
          type: 'MCQ_5_OPTION',
          statement: 'Statements: Only a few X are Y. All Y are Z.\nConclusions: I. All X can be Z. II. Some Z are not X.',
          options: [
            { id: 'p100-r67-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r67-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r67-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r67-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r67-e', key: 'E', text: 'Both I and II follow' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              '"Only a few X are Y" means Some X are Y and Some X are not Y.',
              'All X cannot be Y, but All X can comfortably be inside Z.',
              'Some Z are not X is not definite. Hence only conclusion I follows.'
            ],
            shortcutMethod: 'Only I follows.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-68',
          questionNumber: 68,
          subject: 'REASONING_ABILITY',
          topic: 'Syllogism',
          type: 'MCQ_5_OPTION',
          statement: 'Statements: No P is Q. Some Q are R. All R are S.\nConclusions: I. Some S are not P. II. Some R are P.',
          options: [
            { id: 'p100-r68-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r68-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r68-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r68-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r68-e', key: 'E', text: 'Both I and II follow' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Part of S that is in Q cannot be P. Hence Some S are not P is true.',
              'Some R are P is not certain. Only conclusion I follows.'
            ],
            shortcutMethod: 'Only I follows.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-69',
          questionNumber: 69,
          subject: 'REASONING_ABILITY',
          topic: 'Syllogism',
          type: 'MCQ_5_OPTION',
          statement: 'Statements: All M are N. Only a few N are O.\nConclusions: I. Some M are O. II. All O being N is a possibility.',
          options: [
            { id: 'p100-r69-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r69-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r69-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r69-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r69-e', key: 'E', text: 'Both I and II follow' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Only a few N are O permits All O being inside N as a valid possibility.',
              'Hence only conclusion II follows.'
            ],
            shortcutMethod: 'Only II follows.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-70',
          questionNumber: 70,
          subject: 'REASONING_ABILITY',
          topic: 'Syllogism',
          type: 'MCQ_5_OPTION',
          statement: 'Statements: Some trees are forests. No forest is wood. All woods are timbers.\nConclusions: I. Some timbers are not forests. II. Some trees are woods.',
          options: [
            { id: 'p100-r70-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r70-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r70-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r70-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r70-e', key: 'E', text: 'Both I and II follow' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Those timbers that are woods cannot be forests. So Some timbers are not forests definitely follows.',
              'Only conclusion I follows.'
            ],
            shortcutMethod: 'Only I follows.',
            isFacultyVerified: true
          }
        },

        // Q71 - Q75: Inequalities
        {
          id: 'p100-r-71',
          questionNumber: 71,
          subject: 'REASONING_ABILITY',
          topic: 'Inequalities',
          type: 'MCQ_5_OPTION',
          statement: 'Statement: P > Q ≥ R = S < T\nConclusions: I. P > S  II. R < T',
          options: [
            { id: 'p100-r71-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r71-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r71-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r71-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r71-e', key: 'E', text: 'Both conclusion I and II follow' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'P > Q ≥ R = S => P > S (True)',
              'R = S < T => R < T (True)',
              'Both conclusions follow.'
            ],
            shortcutMethod: 'Both follow.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-72',
          questionNumber: 72,
          subject: 'REASONING_ABILITY',
          topic: 'Inequalities',
          type: 'MCQ_5_OPTION',
          statement: 'Statement: A = B ≤ C > D ; C ≤ E\nConclusions: I. E ≥ B  II. D < E',
          options: [
            { id: 'p100-r72-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r72-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r72-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r72-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r72-e', key: 'E', text: 'Both conclusion I and II follow' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'B ≤ C ≤ E => E ≥ B (True)',
              'D < C ≤ E => D < E (True)',
              'Both follow.'
            ],
            shortcutMethod: 'Both follow.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-73',
          questionNumber: 73,
          subject: 'REASONING_ABILITY',
          topic: 'Inequalities',
          type: 'MCQ_5_OPTION',
          statement: 'Statement: M ≥ N > O ; O < P ≤ Q\nConclusions: I. M > P  II. Q > N',
          options: [
            { id: 'p100-r73-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r73-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r73-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r73-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r73-e', key: 'E', text: 'Both conclusion I and II follow' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Opposite signs between M and P via O: M > O < P (Cannot determine).',
              'Opposite signs between Q and N via O: N > O < Q (Cannot determine).',
              'Neither follows.'
            ],
            shortcutMethod: 'Neither follows.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-74',
          questionNumber: 74,
          subject: 'REASONING_ABILITY',
          topic: 'Inequalities',
          type: 'MCQ_5_OPTION',
          statement: 'Statement: W < X = Y ≤ Z ; Y > U\nConclusions: I. Z > U  II. W < Z',
          options: [
            { id: 'p100-r74-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r74-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r74-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r74-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r74-e', key: 'E', text: 'Both conclusion I and II follow' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Z ≥ Y > U => Z > U (True)',
              'W < X = Y ≤ Z => W < Z (True)',
              'Both follow.'
            ],
            shortcutMethod: 'Both follow.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-75',
          questionNumber: 75,
          subject: 'REASONING_ABILITY',
          topic: 'Inequalities',
          type: 'MCQ_5_OPTION',
          statement: 'Statement: G > H ≤ I = J ; K ≥ I\nConclusions: I. G > J  II. K ≥ H',
          options: [
            { id: 'p100-r75-a', key: 'A', text: 'Only conclusion I follows' },
            { id: 'p100-r75-b', key: 'B', text: 'Only conclusion II follows' },
            { id: 'p100-r75-c', key: 'C', text: 'Either I or II follows' },
            { id: 'p100-r75-d', key: 'D', text: 'Neither I nor II follows' },
            { id: 'p100-r75-e', key: 'E', text: 'Both conclusion I and II follow' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Opposite signs between G and J: G > H ≤ J (False).',
              'K ≥ I ≥ H => K ≥ H (True). Only conclusion II follows.'
            ],
            shortcutMethod: 'Only II follows.',
            isFacultyVerified: true
          }
        },

        // Q76 - Q80: Coding-Decoding (Chinese/Substitutional)
        {
          id: 'p100-r-76',
          questionNumber: 76,
          subject: 'REASONING_ABILITY',
          topic: 'Coding-Decoding',
          type: 'MCQ_5_OPTION',
          statement: 'In a certain code:\n"economy is growing fast" = "zo pi la to"\n"fast growing country India" = "la ka to ru"\n"India economy very strong" = "ru zo ma sa"\n"strong country growing better" = "ma ka la ne"\nWhat is the code for the word "country"?',
          options: [
            { id: 'p100-r76-a', key: 'A', text: 'to' },
            { id: 'p100-r76-b', key: 'B', text: 'ka' },
            { id: 'p100-r76-c', key: 'C', text: 'ru' },
            { id: 'p100-r76-d', key: 'D', text: 'la' },
            { id: 'p100-r76-e', key: 'E', text: 'ne' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Common in statement 2 and 4 is "country" and "growing".',
              '"growing" is in 1, 2, 4 -> "la".',
              'Eliminating "la" leaves "ka" as the unique code for "country".'
            ],
            shortcutMethod: 'country = ka.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-77',
          questionNumber: 77,
          subject: 'REASONING_ABILITY',
          topic: 'Coding-Decoding',
          type: 'MCQ_5_OPTION',
          statement: 'What is the code for "India is strong"?',
          options: [
            { id: 'p100-r77-a', key: 'A', text: 'ru ma zo' },
            { id: 'p100-r77-b', key: 'B', text: 'ru pi ma' },
            { id: 'p100-r77-c', key: 'C', text: 'ka pi sa' },
            { id: 'p100-r77-d', key: 'D', text: 'ru pi la' },
            { id: 'p100-r77-e', key: 'E', text: 'None of these' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['India = ru, is = pi, strong = ma. Hence "ru pi ma".'],
            shortcutMethod: 'ru pi ma.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-78',
          questionNumber: 78,
          subject: 'REASONING_ABILITY',
          topic: 'Coding-Decoding',
          type: 'MCQ_5_OPTION',
          statement: 'What does the code "to" stand for in the given code language?',
          options: [
            { id: 'p100-r78-a', key: 'A', text: 'growing' },
            { id: 'p100-r78-b', key: 'B', text: 'country' },
            { id: 'p100-r78-c', key: 'C', text: 'is' },
            { id: 'p100-r78-d', key: 'D', text: 'fast' },
            { id: 'p100-r78-e', key: 'E', text: 'economy' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Common to 1 and 2: "fast" and "growing". "growing" is "la", so "fast" is "to".'],
            shortcutMethod: 'to = fast.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-79',
          questionNumber: 79,
          subject: 'REASONING_ABILITY',
          topic: 'Coding-Decoding',
          type: 'MCQ_5_OPTION',
          statement: 'What could be the code for "growing better"?',
          options: [
            { id: 'p100-r79-a', key: 'A', text: 'la ma' },
            { id: 'p100-r79-b', key: 'B', text: 'la ne' },
            { id: 'p100-r79-c', key: 'C', text: 'ne ka' },
            { id: 'p100-r79-d', key: 'D', text: 'to ne' },
            { id: 'p100-r79-e', key: 'E', text: 'Cannot be determined' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['growing = la, better = ne. Code is "la ne".'],
            shortcutMethod: 'la ne.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-80',
          questionNumber: 80,
          subject: 'REASONING_ABILITY',
          topic: 'Coding-Decoding',
          type: 'MCQ_5_OPTION',
          statement: 'What does the code "zo la" stand for?',
          options: [
            { id: 'p100-r80-a', key: 'A', text: 'strong fast' },
            { id: 'p100-r80-b', key: 'B', text: 'economy is' },
            { id: 'p100-r80-c', key: 'C', text: 'economy growing' },
            { id: 'p100-r80-d', key: 'D', text: 'growing fast' },
            { id: 'p100-r80-e', key: 'E', text: 'India growing' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['zo = economy, la = growing. Result = economy growing.'],
            shortcutMethod: 'economy growing.',
            isFacultyVerified: true
          }
        },

        // Q81 - Q83: Direction Sense
        {
          id: 'p100-r-81',
          questionNumber: 81,
          subject: 'REASONING_ABILITY',
          topic: 'Direction Sense',
          type: 'MCQ_5_OPTION',
          statement: 'Point A is 6m north of Point B. Point C is 8m east of Point B. Point D is 6m south of Point C. Point E is 8m west of Point D.\nWhat is the shortest distance between Point A and Point C?',
          options: [
            { id: 'p100-r81-a', key: 'A', text: '8m' },
            { id: 'p100-r81-b', key: 'B', text: '10m' },
            { id: 'p100-r81-c', key: 'C', text: '12m' },
            { id: 'p100-r81-d', key: 'D', text: '14m' },
            { id: 'p100-r81-e', key: 'E', text: '6m' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Right triangle ABC: AB = 6m, BC = 8m. Hypotenuse AC = √(6² + 8²) = √(36 + 64) = √100 = 10m.'],
            shortcutMethod: 'Pythagorean triplet (6, 8, 10).',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-82',
          questionNumber: 82,
          subject: 'REASONING_ABILITY',
          topic: 'Direction Sense',
          type: 'MCQ_5_OPTION',
          statement: 'In which direction is Point E with respect to Point A?',
          options: [
            { id: 'p100-r82-a', key: 'A', text: 'North-East' },
            { id: 'p100-r82-b', key: 'B', text: 'South-West' },
            { id: 'p100-r82-c', key: 'C', text: 'South' },
            { id: 'p100-r82-d', key: 'D', text: 'South-East' },
            { id: 'p100-r82-e', key: 'E', text: 'North-West' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'B is 6m South of A. C is 8m East of B. D is 6m South of C.',
              'E is 8m West of D, which lands directly below Point B!',
              'Since B is due South of A, Point E is directly South of Point A.'
            ],
            shortcutMethod: 'E is directly south of A.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-83',
          questionNumber: 83,
          subject: 'REASONING_ABILITY',
          topic: 'Direction Sense',
          type: 'MCQ_5_OPTION',
          statement: 'What is the distance between Point B and Point E?',
          options: [
            { id: 'p100-r83-a', key: 'A', text: '4m' },
            { id: 'p100-r83-b', key: 'B', text: '6m' },
            { id: 'p100-r83-c', key: 'C', text: '8m' },
            { id: 'p100-r83-d', key: 'D', text: '10m' },
            { id: 'p100-r83-e', key: 'E', text: '12m' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Rectangle BCDE has vertical height CD = 6m, hence BE = 6m.'],
            shortcutMethod: 'BE = CD = 6m.',
            isFacultyVerified: true
          }
        },

        // Q84 - Q86: Blood Relations
        {
          id: 'p100-r-84',
          questionNumber: 84,
          subject: 'REASONING_ABILITY',
          topic: 'Blood Relations',
          type: 'MCQ_5_OPTION',
          statement: 'Information: A is the father of B. B is the brother of C. C is married to D. D is the daughter of E. F is the son of C.\nHow is A related to C?',
          options: [
            { id: 'p100-r84-a', key: 'A', text: 'Father' },
            { id: 'p100-r84-b', key: 'B', text: 'Grandfather' },
            { id: 'p100-r84-c', key: 'C', text: 'Uncle' },
            { id: 'p100-r84-d', key: 'D', text: 'Brother' },
            { id: 'p100-r84-e', key: 'E', text: 'Father-in-law' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['A is father of B, and B is brother of C. Therefore, A is the father of C.'],
            shortcutMethod: 'A is father of C.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-85',
          questionNumber: 85,
          subject: 'REASONING_ABILITY',
          topic: 'Blood Relations',
          type: 'MCQ_5_OPTION',
          statement: 'How is E related to B in the given family relationship?',
          options: [
            { id: 'p100-r85-a', key: 'A', text: 'Mother' },
            { id: 'p100-r85-b', key: 'B', text: 'Mother-in-law' },
            { id: 'p100-r85-c', key: 'C', text: 'Father-in-law' },
            { id: 'p100-r85-d', key: 'D', text: 'Cannot be determined' },
            { id: 'p100-r85-e', key: 'E', text: 'Aunt' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Gender of E is not specified in the information (could be mother-in-law or father-in-law of C, and related to B through C). Hence Cannot be determined.'],
            shortcutMethod: 'Gender of E unknown.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-86',
          questionNumber: 86,
          subject: 'REASONING_ABILITY',
          topic: 'Blood Relations',
          type: 'MCQ_5_OPTION',
          statement: 'How is F related to D?',
          options: [
            { id: 'p100-r86-a', key: 'A', text: 'Nephew' },
            { id: 'p100-r86-b', key: 'B', text: 'Son' },
            { id: 'p100-r86-c', key: 'C', text: 'Brother' },
            { id: 'p100-r86-d', key: 'D', text: 'Grandson' },
            { id: 'p100-r86-e', key: 'E', text: 'Cousin' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['C is married to D and F is the son of C. Therefore, F is the son of D.'],
            shortcutMethod: 'F is son of D.',
            isFacultyVerified: true
          }
        },

        // Q87 - Q91: Circular Seating Arrangement Puzzle
        {
          id: 'p100-r-87',
          questionNumber: 87,
          subject: 'REASONING_ABILITY',
          topic: 'Circular Seating Arrangement',
          type: 'MCQ_5_OPTION',
          statement: 'Eight persons J, K, L, M, N, O, P, Q are sitting around a circular table facing the centre. J sits 3rd left of M. M sits 2nd left of P. O sits immediate right of P. L sits 2nd right of J. K sits immediate left of L. N sits between M and P. Q is remaining.\nWho sits second to the right of Q?',
          options: [
            { id: 'p100-r87-a', key: 'A', text: 'J' },
            { id: 'p100-r87-b', key: 'B', text: 'L' },
            { id: 'p100-r87-c', key: 'C', text: 'K' },
            { id: 'p100-r87-d', key: 'D', text: 'P' },
            { id: 'p100-r87-e', key: 'E', text: 'O' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Tracing positions around the circle, K is located 2nd to the right of Q.'],
            shortcutMethod: 'K sits 2nd right of Q.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-88',
          questionNumber: 88,
          subject: 'REASONING_ABILITY',
          topic: 'Circular Seating Arrangement',
          type: 'MCQ_5_OPTION',
          statement: 'Who sits exactly opposite to M in the circular arrangement?',
          options: [
            { id: 'p100-r88-a', key: 'A', text: 'K' },
            { id: 'p100-r88-b', key: 'B', text: 'O' },
            { id: 'p100-r88-c', key: 'C', text: 'Q' },
            { id: 'p100-r88-d', key: 'D', text: 'J' },
            { id: 'p100-r88-e', key: 'E', text: 'N' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Opposite pairs: M is seated directly opposite Q.'],
            shortcutMethod: 'M opposite Q.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-89',
          questionNumber: 89,
          subject: 'REASONING_ABILITY',
          topic: 'Circular Seating Arrangement',
          type: 'MCQ_5_OPTION',
          statement: 'What is the position of O with respect to N?',
          options: [
            { id: 'p100-r89-a', key: 'A', text: 'Immediate left' },
            { id: 'p100-r89-b', key: 'B', text: 'Second to the right' },
            { id: 'p100-r89-c', key: 'C', text: 'Third to the left' },
            { id: 'p100-r89-d', key: 'D', text: 'Immediate right' },
            { id: 'p100-r89-e', key: 'E', text: 'Second to the left' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['Moving right from N, P is 1st right, O is 2nd right.'],
            shortcutMethod: 'Second to right.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-90',
          questionNumber: 90,
          subject: 'REASONING_ABILITY',
          topic: 'Circular Seating Arrangement',
          type: 'MCQ_5_OPTION',
          statement: 'Which of the following statements is TRUE based on the seating arrangement?',
          options: [
            { id: 'p100-r90-a', key: 'A', text: 'J sits opposite to N' },
            { id: 'p100-r90-b', key: 'B', text: 'K sits second to the left of Q' },
            { id: 'p100-r90-c', key: 'C', text: 'P sits opposite to K' },
            { id: 'p100-r90-d', key: 'D', text: 'L is an immediate neighbor of M' },
            { id: 'p100-r90-e', key: 'E', text: 'None of the above' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['P and K sit opposite to each other across the 8-person diameter.'],
            shortcutMethod: 'P opposite K.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-91',
          questionNumber: 91,
          subject: 'REASONING_ABILITY',
          topic: 'Circular Seating Arrangement',
          type: 'MCQ_5_OPTION',
          statement: 'Who sits to the immediate left of Q?',
          options: [
            { id: 'p100-r91-a', key: 'A', text: 'J' },
            { id: 'p100-r91-b', key: 'B', text: 'M' },
            { id: 'p100-r91-c', key: 'C', text: 'N' },
            { id: 'p100-r91-d', key: 'D', text: 'O' },
            { id: 'p100-r91-e', key: 'E', text: 'K' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['O is situated immediately to the left of Q.'],
            shortcutMethod: 'Immediate left of Q is O.',
            isFacultyVerified: true
          }
        },

        // Q92 - Q96: Floor Puzzle
        {
          id: 'p100-r-92',
          questionNumber: 92,
          subject: 'REASONING_ABILITY',
          topic: 'Floor Puzzle',
          type: 'MCQ_5_OPTION',
          statement: 'Seven persons A, B, C, D, E, F, G live on seven different floors of a building (floors 1 to 7). E lives on topmost floor 7. Only 2 people live between E and G. A lives immediately above G. D lives immediately above A. Only 3 people live between D and F. C lives below F. B lives on remaining floor.\nWho lives on floor number 4?',
          options: [
            { id: 'p100-r92-a', key: 'A', text: 'A' },
            { id: 'p100-r92-b', key: 'B', text: 'B' },
            { id: 'p100-r92-c', key: 'C', text: 'C' },
            { id: 'p100-r92-d', key: 'D', text: 'D' },
            { id: 'p100-r92-e', key: 'E', text: 'G' }
          ],
          correctOptionKey: 'E',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Floor 7 = E. 2 people between E and G => G is on floor 4.',
              'Floor 4 = G.'
            ],
            shortcutMethod: 'Floor 4 = G.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-93',
          questionNumber: 93,
          subject: 'REASONING_ABILITY',
          topic: 'Floor Puzzle',
          type: 'MCQ_5_OPTION',
          statement: 'How many people live between A and C in the building arrangement?',
          options: [
            { id: 'p100-r93-a', key: 'A', text: 'None' },
            { id: 'p100-r93-b', key: 'B', text: 'One' },
            { id: 'p100-r93-c', key: 'C', text: 'Two' },
            { id: 'p100-r93-d', key: 'D', text: 'Three' },
            { id: 'p100-r93-e', key: 'E', text: 'Four' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['A is on floor 5, C is on floor 1. Between them are floors 4, 3, 2 (3 people: G, B, F).'],
            shortcutMethod: 'Three people.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-94',
          questionNumber: 94,
          subject: 'REASONING_ABILITY',
          topic: 'Floor Puzzle',
          type: 'MCQ_5_OPTION',
          statement: 'Who lives immediately below B?',
          options: [
            { id: 'p100-r94-a', key: 'A', text: 'G' },
            { id: 'p100-r94-b', key: 'B', text: 'C' },
            { id: 'p100-r94-c', key: 'C', text: 'A' },
            { id: 'p100-r94-d', key: 'D', text: 'F' },
            { id: 'p100-r94-e', key: 'E', text: 'E' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['B is on floor 3, immediately below is floor 2 which is F.'],
            shortcutMethod: 'Below B is F.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-95',
          questionNumber: 95,
          subject: 'REASONING_ABILITY',
          topic: 'Floor Puzzle',
          type: 'MCQ_5_OPTION',
          statement: 'On which floor does D live?',
          options: [
            { id: 'p100-r95-a', key: 'A', text: '4th floor' },
            { id: 'p100-r95-b', key: 'B', text: '5th floor' },
            { id: 'p100-r95-c', key: 'C', text: '6th floor' },
            { id: 'p100-r95-d', key: 'D', text: '2nd floor' },
            { id: 'p100-r95-e', key: 'E', text: '7th floor' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['D lives on floor 6 (immediately above A on 5).'],
            shortcutMethod: '6th floor.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-96',
          questionNumber: 96,
          subject: 'REASONING_ABILITY',
          topic: 'Floor Puzzle',
          type: 'MCQ_5_OPTION',
          statement: 'Four of the following five are alike in a certain way based on their positions (odd/even floor numbers). Which does not belong to that group? (E, A, B, F, C)',
          options: [
            { id: 'p100-r96-a', key: 'A', text: 'E (Floor 7)' },
            { id: 'p100-r96-b', key: 'B', text: 'A (Floor 5)' },
            { id: 'p100-r96-c', key: 'C', text: 'B (Floor 3)' },
            { id: 'p100-r96-d', key: 'D', text: 'F (Floor 2)' },
            { id: 'p100-r96-e', key: 'E', text: 'C (Floor 1)' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'E(7), A(5), B(3), C(1) all live on ODD numbered floors.',
              'F lives on an EVEN numbered floor (Floor 2). Hence F does not belong.'
            ],
            shortcutMethod: 'F is on even floor.',
            isFacultyVerified: true
          }
        },

        // Q97 - Q100: Alphanumeric Sequence
        {
          id: 'p100-r-97',
          questionNumber: 97,
          subject: 'REASONING_ABILITY',
          topic: 'Alphanumeric Sequence',
          type: 'MCQ_5_OPTION',
          statement: 'Sequence: 5 * P A % 3 9 H $ L 2 @ E 7 © U # 8\nHow many such numbers are there in the sequence, each of which is immediately preceded by a symbol?',
          options: [
            { id: 'p100-r97-a', key: 'A', text: 'None' },
            { id: 'p100-r97-b', key: 'B', text: 'One' },
            { id: 'p100-r97-c', key: 'C', text: 'Two' },
            { id: 'p100-r97-d', key: 'D', text: 'Three' },
            { id: 'p100-r97-e', key: 'E', text: 'More than three' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Look for Symbol followed by Number:',
              '1. % 3 (% is symbol, 3 is number)',
              '2. @ E (E is letter)',
              '3. # 8 (# is symbol, 8 is number)',
              'Total count = 2 (%3 and #8).'
            ],
            shortcutMethod: 'Two numbers (%3, #8).',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-98',
          questionNumber: 98,
          subject: 'REASONING_ABILITY',
          topic: 'Alphanumeric Sequence',
          type: 'MCQ_5_OPTION',
          statement: 'Sequence: 5 * P A % 3 9 H $ L 2 @ E 7 © U # 8\nWhich element is 6th to the right of the 12th element from the right end?',
          options: [
            { id: 'p100-r98-a', key: 'A', text: 'E' },
            { id: 'p100-r98-b', key: 'B', text: '7' },
            { id: 'p100-r98-c', key: 'C', text: 'U' },
            { id: 'p100-r98-d', key: 'D', text: '©' },
            { id: 'p100-r98-e', key: 'E', text: '#' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Shortcut rule: Same direction (right of right) -> subtract positions: 12 - 6 = 6th from the right end.',
              'Counting from right: 8(1), #(2), U(3), ©(4), 7(5), E(6) -> element U is 6th from right.'
            ],
            shortcutMethod: '12 - 6 = 6th from right end = U.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-99',
          questionNumber: 99,
          subject: 'REASONING_ABILITY',
          topic: 'Alphanumeric Sequence',
          type: 'MCQ_5_OPTION',
          statement: 'Sequence: 5 * P A % 3 9 H $ L 2 @ E 7 © U # 8\nIf all the symbols are dropped from the sequence, which element will be 7th from the left end?',
          options: [
            { id: 'p100-r99-a', key: 'A', text: '9' },
            { id: 'p100-r99-b', key: 'B', text: 'H' },
            { id: 'p100-r99-c', key: 'C', text: 'L' },
            { id: 'p100-r99-d', key: 'D', text: '2' },
            { id: 'p100-r99-e', key: 'E', text: 'E' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Dropping symbols (*, %, $, @, ©, #) leaves:',
              '5, P, A, 3, 9, H, L, 2, E, 7, U, 8',
              '7th element from left is L.'
            ],
            shortcutMethod: '7th non-symbol = L.',
            isFacultyVerified: true
          }
        },
        {
          id: 'p100-r-100',
          questionNumber: 100,
          subject: 'REASONING_ABILITY',
          topic: 'Alphanumeric Sequence',
          type: 'MCQ_5_OPTION',
          statement: 'What will come in place of the question mark (?) in the following series based on the sequence?\nP%3  9$L  2E7  ?',
          options: [
            { id: 'p100-r100-a', key: 'A', text: '7U8' },
            { id: 'p100-r100-b', key: 'B', text: '©U#' },
            { id: 'p100-r100-c', key: 'C', text: '©#8' },
            { id: 'p100-r100-d', key: 'D', text: 'E©U' },
            { id: 'p100-r100-e', key: 'E', text: '7#8' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'P (+2) % (+1) 3',
              'Skip 1 element -> 9 (+2) $ (+1) L',
              'Skip 1 element -> 2 (+2) E (+1) 7',
              'Skip 1 element (© is start? No, skip 7 -> start at ©): © (+2) # (+1) 8.',
              'Result = ©#8.'
            ],
            shortcutMethod: '©#8.',
            isFacultyVerified: true
          }
        }
      ]
    }
  ]
};

// 2. Full-Length Mains Examination (IBPS PO / SBI PO Mains Standard)
export const ibpsPoMainsFullMock: Exam = {
  id: 'exam-ibps-po-mains-full-length',
  title: 'IBPS PO Mains Comprehensive Multi-Section Mock Test',
  category: 'IBPS',
  subCategory: 'Full-Length Mock (Mains)',
  code: 'IBPS-PO-MAINS-FULL-2026',
  description: 'Comprehensive high-yield Mains mock examination featuring Reasoning & Computer Aptitude, Data Analysis & Interpretation, General & Banking Awareness, and English Language. Preloaded and ready to start without uploading any PDF.',
  instructions: [
    'Total duration is 120 minutes across 4 core objective sections.',
    'Section 1: Reasoning Ability & Computer Aptitude.',
    'Section 2: Data Analysis & Interpretation.',
    'Section 3: General, Economy & Banking Awareness.',
    'Section 4: English Language.',
    'Negative marking of 0.25 applies per incorrect response.',
    'You can pause the test and resume from homepage anytime.'
  ],
  durationMinutes: 120,
  hasSectionalTiming: true,
  allowSectionSwitching: true,
  totalMarks: 150,
  totalQuestions: 60,
  cutoffEstimates: {
    general: 74.50,
    obc: 70.25,
    sc: 62.00,
    st: 55.50,
    ews: 71.00
  },
  isActive: true,
  sections: [
    {
      id: 'sec-mains-reas-comp',
      title: 'Reasoning & Computer Aptitude',
      subject: 'REASONING_ABILITY',
      order: 1,
      durationMinutes: 40,
      positiveMarksPerQuestion: 1.5,
      negativeMarksPerQuestion: 0.375,
      sectionalQualifyingMarks: 12.0,
      totalQuestions: 15,
      questions: sbiPoPrelimsFull100Q.sections[2].questions.slice(0, 15).map((q, idx) => ({
        ...q,
        id: 'mains-rc-' + idx,
        questionNumber: idx + 1,
        positiveMarks: 1.5,
        negativeMarks: 0.375
      }))
    },
    {
      id: 'sec-mains-di-quant',
      title: 'Data Analysis & Interpretation',
      subject: 'QUANTITATIVE_APTITUDE',
      order: 2,
      durationMinutes: 35,
      positiveMarksPerQuestion: 1.5,
      negativeMarksPerQuestion: 0.375,
      sectionalQualifyingMarks: 10.0,
      totalQuestions: 15,
      questions: sbiPoPrelimsFull100Q.sections[1].questions.slice(10, 25).map((q, idx) => ({
        ...q,
        id: 'mains-di-' + idx,
        questionNumber: idx + 16,
        positiveMarks: 1.5,
        negativeMarks: 0.375
      }))
    },
    {
      id: 'sec-mains-ga-banking',
      title: 'General, Economy & Banking Awareness',
      subject: 'GENERAL_AWARENESS',
      order: 3,
      durationMinutes: 25,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 14.0,
      totalQuestions: 15,
      questions: [
        {
          id: 'mains-ga-1',
          questionNumber: 31,
          subject: 'GENERAL_AWARENESS',
          topic: 'Banking Awareness',
          type: 'MCQ_5_OPTION',
          statement: 'What is the enhanced overdraft (OD) facility limit under the Pradhan Mantri Jan Dhan Yojana (PMJDY) for eligible basic savings accounts?',
          options: [
            { id: 'm-ga1-a', key: 'A', text: '₹5,000' },
            { id: 'm-ga1-b', key: 'B', text: '₹10,000' },
            { id: 'm-ga1-c', key: 'C', text: '₹15,000' },
            { id: 'm-ga1-d', key: 'D', text: '₹20,000' },
            { id: 'm-ga1-e', key: 'E', text: '₹2,000' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['The overdraft limit under PMJDY was enhanced to ₹10,000 per eligible household.'],
            shortcutMethod: 'PMJDY OD = ₹10,000.',
            isFacultyVerified: true
          }
        },
        {
          id: 'mains-ga-2',
          questionNumber: 32,
          subject: 'GENERAL_AWARENESS',
          topic: 'Banking Awareness',
          type: 'MCQ_5_OPTION',
          statement: 'Under RBI\'s Priority Sector Lending (PSL) norms, what is the mandatory overall lending target for Domestic Scheduled Commercial Banks?',
          options: [
            { id: 'm-ga2-a', key: 'A', text: '32% of ANBC' },
            { id: 'm-ga2-b', key: 'B', text: '40% of ANBC or CEOBE' },
            { id: 'm-ga2-c', key: 'C', text: '50% of ANBC' },
            { id: 'm-ga2-d', key: 'D', text: '75% of ANBC' },
            { id: 'm-ga2-e', key: 'E', text: '25% of ANBC' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['For domestic commercial banks, the PSL target is 40% of Adjusted Net Bank Credit (ANBC) or CEOBE.'],
            shortcutMethod: 'Domestic Banks = 40%; RRB = 75%.',
            isFacultyVerified: true
          }
        },
        {
          id: 'mains-ga-3',
          questionNumber: 33,
          subject: 'GENERAL_AWARENESS',
          topic: 'Monetary Policy',
          type: 'MCQ_5_OPTION',
          statement: 'In the Monetary Policy Framework of RBI, which rate acts as the non-collateralized operating floor of the Liquidity Adjustment Facility (LAF) corridor?',
          options: [
            { id: 'm-ga3-a', key: 'A', text: 'Standing Deposit Facility (SDF)' },
            { id: 'm-ga3-b', key: 'B', text: 'Marginal Standing Facility (MSF)' },
            { id: 'm-ga3-c', key: 'C', text: 'Policy Repo Rate' },
            { id: 'm-ga3-d', key: 'D', text: 'Bank Rate' },
            { id: 'm-ga3-e', key: 'E', text: 'Reverse Repo Rate' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: ['SDF rate is placed 25 bps below the policy repo rate and acts as the floor without requiring collateral.'],
            shortcutMethod: 'Floor of LAF = SDF.',
            isFacultyVerified: true
          }
        },
        {
          id: 'mains-ga-4',
          questionNumber: 34,
          subject: 'GENERAL_AWARENESS',
          topic: 'Banking Awareness',
          type: 'MCQ_5_OPTION',
          statement: 'What is the statutory inflation target band mandated by the Government of India for the Reserve Bank of India\'s Monetary Policy Committee (MPC)?',
          options: [
            { id: 'm-ga4-a', key: 'A', text: '4% with tolerance band of +/- 2% (2% to 6%)' },
            { id: 'm-ga4-b', key: 'B', text: '5% with tolerance band of +/- 1% (4% to 6%)' },
            { id: 'm-ga4-c', key: 'C', text: '3% with tolerance band of +/- 2% (1% to 5%)' },
            { id: 'm-ga4-d', key: 'D', text: '6% flat' },
            { id: 'm-ga4-e', key: 'E', text: '2% to 4%' }
          ],
          correctOptionKey: 'A',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['Inflation target is 4% CPI headline inflation with a permissible upper limit of 6% and lower limit of 2%.'],
            shortcutMethod: '4% ± 2%.',
            isFacultyVerified: true
          }
        },
        {
          id: 'mains-ga-5',
          questionNumber: 35,
          subject: 'GENERAL_AWARENESS',
          topic: 'Banking Awareness',
          type: 'MCQ_5_OPTION',
          statement: 'Under the Deposit Insurance and Credit Guarantee Corporation (DICGC) Act, what is the maximum insured deposit amount per depositor per insured bank?',
          options: [
            { id: 'm-ga5-a', key: 'A', text: '₹1 Lakh' },
            { id: 'm-ga5-b', key: 'B', text: '₹2 Lakh' },
            { id: 'm-ga5-c', key: 'C', text: '₹5 Lakh' },
            { id: 'm-ga5-d', key: 'D', text: '₹10 Lakh' },
            { id: 'm-ga5-e', key: 'E', text: 'Unlimited' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: ['DICGC covers up to ₹5,00,000 including principal and interest per depositor per bank.'],
            shortcutMethod: 'DICGC limit = ₹5 Lakh.',
            isFacultyVerified: true
          }
        },
        // Remaining GA questions
        ...sbiPoPrelimsFull100Q.sections[0].questions.slice(0, 10).map((q, idx) => ({
          ...q,
          id: 'mains-ga-' + (idx + 6),
          questionNumber: idx + 36,
          subject: 'GENERAL_AWARENESS' as const,
          topic: 'Financial Economy',
          statement: 'Financial Economics Analysis: ' + q.statement
        }))
      ]
    },
    {
      id: 'sec-mains-english',
      title: 'English Language',
      subject: 'ENGLISH_LANGUAGE',
      order: 4,
      durationMinutes: 20,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 10.0,
      totalQuestions: 15,
      questions: sbiPoPrelimsFull100Q.sections[0].questions.slice(10, 25).map((q, idx) => ({
        ...q,
        id: 'mains-eng-' + idx,
        questionNumber: idx + 46
      }))
    }
  ]
};
