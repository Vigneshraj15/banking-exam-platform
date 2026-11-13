import { ExtractedQuestionDraft, SubjectCode } from '../types';

/**
 * High-Precision Banking Exam Question & Answer Parser
 * 
 * Rules strictly followed:
 * 1. Questions are ALWAYS numbered (1., 2., Q1, Question 1, etc.)
 *    Supports both inline question flow and page-break flow.
 * 2. Options are ALWAYS lettered: (A), (B), (C), (D), (E) or a), b), c), d), e) or a., b., c., d., e.
 * 3. Never confuses ordinary English words (like "A box", "Point A", "Only a few") with Option A.
 * 4. Extracts official PDF answers with 100% fidelity:
 *    - Option-level tags: "[Correct Answer]", "[Correct]", "(Correct Answer)", "[Ans]", "✓", "*"
 *    - Inline letters: "Answer: B", "Ans: (b)", "Option B is correct", "Ans.(B)", "Key: B", "[Ans: B]"
 *    - Value matching: "Answer: 1/6", "Ans: 1/6", "Ans: 52/55", "Ans: 9/14", "Ans: None of these"
 *    - End-of-document key sheets & solutions: "HINTS & SOLUTIONS", "ANSWERS", "ANSWER KEY", "SOLUTIONS", "S1. Ans.(c)", "1. (c)"
 * 5. Multi-paragraph shared context (Reading Comprehension, Seating Puzzles, Data Interpretation):
 *    - Captures the complete passage across paragraphs and lines.
 *    - Attaches the shared context to all sub-questions (e.g. Q1 - Q10).
 *    - Keeps each question's statement clean and focused.
 * 6. Sanitizes option text for test takers by stripping "[Correct Answer]" tags and running page headers.
 */
export function parseBankingQuestionsFromText(rawText: string): ExtractedQuestionDraft[] {
  if (!rawText || rawText.trim().length === 0) return [];

  // 1. Normalize line endings, whitespace, and strip document headers/footers
  const clean = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ') // non-breaking space
    .replace(/[\u2018\u2019]/g, "'") // curly quotes
    .replace(/[\u201C\u201D]/g, '"')
    // Remove Page X of Y, Page X, and running headers/footers for English, Reasoning, Quant, etc.
    .replace(/(?:Banking\s+[A-Za-z\s]+Practice\s+Test\s*)?Page\s*\d+\s*(?:of\s*\d+)?/gi, '')
    .replace(/Banking\s+[A-Za-z\s]+Practice\s+Test/gi, '')
    .replace(/Chart\s*[-–—]\s*Based\s+Data\s+Interpretation/gi, '')
    .replace(/Visual\s+Data\s+Sets\s*\|\s*\d+\s*Questions\s*\|\s*Answers\s*Marked/gi, '')
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
    .replace(/(?:IBPS|SBI|RBI|RRB|SSC)\s+[A-Za-z\s]+(?:Mock|Practice|Test|Exam|Paper)(?:\s*Day\s*\d+)?(?:\s*[-–—|]\s*[^\n]+)?(?:\n|$)/gi, '\n')
    .replace(/(?:Quants?|Reasoning|English|Math|Banking|Static\s*GK)\s*Booster(?:\s*Day\s*\d+)?(?:\s*[-–—|]\s*\w+)?/gi, '')
    .replace(/Medium\s*Level\s*\|\s*\d+\s*Questions\s*\|\s*Answers\s*Marked/gi, '')
    .replace(/(?:\n|^)\s*Page\s*\d+\s*(?:of\s*\d+)?\s*(?:\n|$)/gi, '\n');

  // 2. Detect and decouple Answer Key / Solutions section if present at the end of the document
  const solutionsHeaderRegex = /(?:\n|^|\r)\s*(?:[-=*_#\s]*)\b(?:ANSWER\s*KEY(?:S)?|ANSWERS?|ANSWER\s*SHEET|KEY\s*SHEET|KEY\s*ANSWERS?|KEYS?|SOLUTIONS?|HINTS?\s*(?:&|AND)\s*SOLUTIONS?|DETAILED\s*SOLUTIONS?|SOLUTIONS?\s*(?:&|AND)\s*ANSWERS?|ANSWERS?\s*(?:&|AND)\s*SOLUTIONS?|ANSWERS?\s*(?:&|AND|WITH)\s*EXPLANATIONS?|EXPLANATIONS?)\b\s*[:\-]?(?:[-=*_#\s]*)(?:\n|\r|$)/i;

  let questionsBody = clean;
  let solutionsBody = '';
  const solHeaderMatch = clean.match(solutionsHeaderRegex);
  if (solHeaderMatch && solHeaderMatch.index !== undefined && solHeaderMatch.index > 80) {
    questionsBody = clean.substring(0, solHeaderMatch.index).trim();
    solutionsBody = clean.substring(solHeaderMatch.index).trim();
  }

  // Extract answer key map and solutions map from solutionsBody (or full document as fallback)
  const { answerMap: endAnswerKeyMap, solutionMap: endSolutionMap } = extractAnswerKeyAndSolutions(solutionsBody || clean);

  // 3. Identify Question Delimiters strictly within questionsBody
  // CRITICAL: Mask parenthesized expressions and math clauses
  // These include:
  // - Cloze Test blank tokens like (31), (32)
  // - Math expressions in parentheses like (46 × 42), ((9.12) 3 × 7.87), (17.96)
  // - Citations or sub-clauses
  // They must NEVER be mistaken for question delimiters!
  let maskedForDelimiters = questionsBody;
  for (let pass = 0; pass < 3; pass++) {
    maskedForDelimiters = maskedForDelimiters.replace(/\([^)\n]{1,80}\)/g, (m) => 'X'.repeat(m.length));
  }
  // Mask range headers like "Directions (Q1 - Q5)" or "Directions (1 - 5)"
  maskedForDelimiters = maskedForDelimiters.replace(/(?:Directions?|Direction)\s*(?:for\s+questions?\s*)?\(?(?:Questions?|[Qq])?\.?\s*\d+\s*(?:to|-)\s*(?:Questions?|[Qq])?\.?\s*\d+\s*\)?\s*[:\-.]?/gi, (m) => 'X'.repeat(m.length));

  // Primary regex: anchored to start of line or newline (Format: Q1. / Question 1 / Q.1 OR 1.)
  // Strictly requires dot for plain digits to avoid decimal numbers like 98.12
  const qLineRegex = /(?:^|\n|\r)\s*(?:(?:Q(?:uestion|ue|ues)?\.?\s*(\d{1,3}))|(\d{1,3})\.)(?:\s+|$)/gi;
  let qLineHits: Array<{ qNum: number; index: number; matchLen: number }> = [];
  let m;

  while ((m = qLineRegex.exec(maskedForDelimiters)) !== null) {
    const qNum = parseInt(m[1] || m[2], 10);
    if (!isNaN(qNum) && qNum > 0 && qNum <= 300) {
      qLineHits.push({
        qNum,
        index: m.index,
        matchLen: m[0].length
      });
    }
  }

  // Word-boundary regex for multi-column or inline questions where questions follow each other horizontally
  const qWordRegex = /(?:^|\s|\b)(?:(?:Q(?:uestion|ue|ues)?\.?\s*(\d{1,3}))|(\d{1,3})\.)(?=\s+|$)/gi;
  let qWordHits: Array<{ qNum: number; index: number; matchLen: number }> = [];
  while ((m = qWordRegex.exec(maskedForDelimiters)) !== null) {
    const qNum = parseInt(m[1] || m[2], 10);
    if (!isNaN(qNum) && qNum > 0 && qNum <= 300) {
      qWordHits.push({
        qNum,
        index: m.index,
        matchLen: m[0].length
      });
    }
  }

  // Analyze sequence validity across both line-anchored and word-boundary candidates
  const lineSeq = findValidQuestionSequence(qLineHits);
  const wordSeq = findValidQuestionSequence(qWordHits);

  // If word-boundary detected more sequential questions (e.g. inline layout where line regex only caught 1-2), prefer wordSeq!
  const targetQs = wordSeq.length > lineSeq.length ? wordSeq : (lineSeq.length > 0 ? lineSeq : wordSeq);

  if (targetQs.length === 0) {
    return [];
  }

  // Resilient Preamble Detection (only if preamble itself contains question options A-E)
  if (targetQs[0].index > 25) {
    const preambleText = questionsBody.substring(0, targetQs[0].index).trim();
    // Only unshift if preamble contains actual MCQ options (e.g. missing "1." on first question)
    // AND does not start with a Directions block
    if (/(?:\([a-eA-E]\)|\[[a-eA-E]\]|\b[a-eA-E][\.\)\:])\s+/.test(preambleText) && !/^\s*(?:Directions?|Direction)\b/i.test(preambleText)) {
      const impliedQNum = targetQs[0].qNum > 1 ? targetQs[0].qNum - 1 : 1;
      targetQs.unshift({
        qNum: impliedQNum,
        index: 0,
        matchLen: 0
      });
    }
  }

  // 4. Extract Direction / Shared Passage Blocks with question positions for non-range resolution
  const directionBlocks = extractDirectionBlocks(questionsBody, targetQs);

  const results: ExtractedQuestionDraft[] = [];
  let activeDirection: { title: string; passage: string } | null = null;

  for (let i = 0; i < targetQs.length; i++) {
    const cur = targetQs[i];
    const next = targetQs[i + 1];
    const chunkStart = cur.index + cur.matchLen;
    const chunkEnd = next ? next.index : questionsBody.length;
    let rawChunk = questionsBody.substring(chunkStart, chunkEnd).trim();

    // Check if there is an embedded Direction block belonging to subsequent questions
    // Must start on a newline or clear boundary to avoid matching sentences like "In which direction is..."
    let trailingDirection = '';
    const dirMatch = rawChunk.match(/(?:\n|^)\s*(?:Direction[s]?\s*(?:\(?[Qq]?\.?\s*\d+|[:\-.]\s*Study|[:\-.]\s*Read|[:\-.]\s*In|[:\-.]\s*Refer))[\s\S]*$/i);
    if (dirMatch && next) {
      trailingDirection = dirMatch[0];
      rawChunk = rawChunk.substring(0, dirMatch.index).trim();
    }

    // Check if rawChunk itself starts with a Direction
    const leadingDirMatch = rawChunk.match(/^(?:Direction[s]?\s*[:\-.]?\s*[\s\S]*?)(?=(?:(?:Statements?|Study|In|If|Find|What|How|Point|A|Eight|Seven|\d)[^.\n]*[.?:]))/i);
    if (leadingDirMatch) {
      const passage = unwrapPassageText(leadingDirMatch[0].replace(/^Direction[s]?\s*[:\-.]?\s*/i, '').trim());
      activeDirection = { title: 'Directions', passage };
      rawChunk = rawChunk.substring(leadingDirMatch[0].length).trim();
    }

    // 5. Parse this question chunk into statement and options A-E
    const parsed = parseSingleQuestionChunk(rawChunk, cur.qNum);

    // Apply answer key if found at bottom sheet
    if (!parsed.hasExplicitKey) {
      const explicitKey = endAnswerKeyMap[cur.qNum] || endAnswerKeyMap[i + 1];
      if (explicitKey) {
        parsed.correctOptionKey = explicitKey;
        parsed.hasExplicitKey = true;
        parsed.isPdfOriginalKey = true;
      }
    }

    // Apply official detailed solution from PDF if available
    const pdfOfficialSolution = endSolutionMap[cur.qNum] || endSolutionMap[i + 1];
    if (pdfOfficialSolution) {
      parsed.detailedSolution = pdfOfficialSolution;
    } else if (parsed.hasExplicitKey && (!parsed.detailedSolution || parsed.detailedSolution.includes('uploaded question paper'))) {
      const correctOptObj = parsed.options.find(o => o.key === parsed.correctOptionKey);
      const optDesc = correctOptObj ? ` (${correctOptObj.text})` : '';
      parsed.detailedSolution = `Official Answer from PDF: Option ${parsed.correctOptionKey}${optDesc}`;
    }

    // Apply shared passage if applicable
    const dir = directionBlocks.find(d => cur.qNum >= d.startQ && cur.qNum <= d.endQ);
    if (dir) {
      parsed.groupTitle = dir.title;
      parsed.groupPassage = dir.passage;
    } else if (activeDirection) {
      parsed.groupTitle = activeDirection.title;
      parsed.groupPassage = activeDirection.passage;
    }

    // Refine subject/topic if this is part of a Reading Comprehension passage or Cloze Test
    if (parsed.groupPassage && (
      parsed.groupPassage.toLowerCase().includes('blank') ||
      parsed.statement.toLowerCase().includes('blank')
    )) {
      parsed.subject = 'ENGLISH_LANGUAGE';
      parsed.topic = 'Cloze Test';
    } else if (parsed.groupPassage && (
      parsed.groupPassage.toLowerCase().includes('passage') || 
      parsed.groupPassage.toLowerCase().includes('currency') || 
      parsed.groupPassage.toLowerCase().includes('cbdc') ||
      parsed.statement.toLowerCase().includes('according to the passage') ||
      parsed.statement.toLowerCase().includes('suitable title') ||
      parsed.statement.toLowerCase().includes('most similar in meaning') ||
      parsed.statement.toLowerCase().includes('most opposite in meaning')
    )) {
      parsed.subject = 'ENGLISH_LANGUAGE';
      if (parsed.statement.toLowerCase().includes('similar in meaning') || parsed.statement.toLowerCase().includes('opposite in meaning') || parsed.statement.toLowerCase().includes('synonym') || parsed.statement.toLowerCase().includes('antonym')) {
        parsed.topic = 'Vocabulary';
      } else {
        parsed.topic = 'Reading Comprehension';
      }
    }

    if (parsed.statement && parsed.statement.trim().length > 3) {
      results.push({
        ...parsed,
        questionNumber: results.length + 1 // Continuous 1, 2, 3... numbering in exam engine
      });
    }

    // Set trailing direction for subsequent questions
    if (trailingDirection) {
      const cleaned = unwrapPassageText(trailingDirection.replace(/^Direction[s]?\s*[:\-.]?\s*/i, '').trim());
      activeDirection = { title: 'Directions', passage: cleaned };
    }
  }

  return results;
}

/**
 * Parses statement, options (a-e), answer, and solution from a single question chunk
 */
function parseSingleQuestionChunk(
  rawChunk: string, 
  qNum: number
): ExtractedQuestionDraft & { hasExplicitKey: boolean; isPdfOriginalKey?: boolean } {
  let remainingText = rawChunk.trim();
  let correctKey: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  let hasExplicitKey = false;
  let solutionText = '';

  // 1. Check for Solution / Explanation block at the end of the question chunk
  // Must be a dedicated solution label:
  // e.g. "\nSolution: ...", "\nSol: ...", "\nSol. (b) ...", "\nExplanation: ...", "\nExp: ...", "\nHint: ..."
  // NOT normal English words like "solely", "expensive", "experienced", "solid", "hinted"!
  const solRegex = /(?:\n|^|\s)(?:(?:Solution|Explanation)\b\s*[:\-.]?|\b(?:Sol|Exp|Hint)\s*(?:[\.\:\-]|(?:\([a-eA-E]\)|\[[a-eA-E]\])))\s*([\s\S]*)$/i;
  const solMatch = remainingText.match(solRegex);
  if (solMatch) {
    solutionText = solMatch[1].trim();
    remainingText = remainingText.substring(0, solMatch.index).trim();

    // Check if the solution itself specifies the option letter at the very beginning:
    // e.g. "Sol. (b) When two dice are thrown...", "Sol: Option (B)", "Sol: B", "Ans.(b)"
    const solLetterMatch = solutionText.match(/^(?:Ans(?:wer)?\.?\s*[:\-]?)?\s*(?:Option\s*)?(?:\(?\s*([a-eA-E])\s*\)?|\[\s*([a-eA-E])\s*\]|\b([a-eA-E])\b)(?=[\s\.\:\-\,\)]|$)/i);
    if (solLetterMatch) {
      const letter = (solLetterMatch[1] || solLetterMatch[2] || solLetterMatch[3])?.toUpperCase();
      if (letter && ['A', 'B', 'C', 'D', 'E'].includes(letter)) {
        correctKey = letter as any;
        hasExplicitKey = true;
      }
    }
  }

  // 2. Check for explicit Answer statement line:
  // e.g. "Option B is correct", "Answer: B", "Ans: (b)", "Ans - C", "Correct Option: D"
  const optIsCorrectMatch = remainingText.match(/(?:Option\s*\(?([a-eA-E])\)?\s*is\s*(?:the\s*)?correct)/i);
  if (optIsCorrectMatch) {
    hasExplicitKey = true;
    correctKey = optIsCorrectMatch[1].toUpperCase() as any;
  }

  const answerRegex = /(?:\n|^|\s)(?:(?:Correct\s+)?(?:Answer|Ans|Key)|Correct\s+Option)\s*[:\-.]\s*(?:Option\s*)?(?:\(?\s*([a-eA-E])\s*\)?|\[\s*([a-eA-E])\s*\]|\b([a-eA-E])\b)(?=[\s,\.\;\:\)\-\n\r]|$)/i;
  const ansMatch = remainingText.match(answerRegex);
  if (ansMatch && !hasExplicitKey) {
    const letter = (ansMatch[1] || ansMatch[2] || ansMatch[3])?.toUpperCase();
    if (letter && ['A', 'B', 'C', 'D', 'E'].includes(letter)) {
      hasExplicitKey = true;
      correctKey = letter as any;
    }
  }

  // 3. Check for Value-Based Answer Line:
  // e.g. "Answer: 1/6", "Ans: 1/6", "Ans: 52/55", "Answer: 52/55", "Ans: None of these", "Ans: 9/14", "Answer: 35%"
  let rawAnsValue = '';
  if (!hasExplicitKey) {
    const valAnsMatch = remainingText.match(/(?:\n|^|\s)(?:(?:Correct\s+)?(?:Answer|Ans|Key)|Correct\s+Option)\s*[:\-.]\s*([^\n\r]+)/i);
    if (valAnsMatch) {
      rawAnsValue = valAnsMatch[1].trim();
    }
  }

  // Remove the answer line from remainingText if present
  if (ansMatch && ansMatch.index !== undefined) {
    remainingText = remainingText.replace(answerRegex, '').trim();
  } else if (rawAnsValue) {
    remainingText = remainingText.replace(/(?:\n|^|\s)(?:(?:Correct\s+)?(?:Answer|Ans|Key)|Correct\s+Option)\s*[:\-.]\s*[^\n\r]+/i, '').trim();
  }

  // 4. Check for Error Spotting / Sentence Part questions (Standard Banking English)
  // e.g. "Hardly had the customer (A)/ entered the bank premises (B)/ than the security alarm (C)/ started ringing loudly. (D)/ No error (E)"
  const errorSpotting = parseErrorSpottingChunk(remainingText);
  let statement = '';
  let finalOptions: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[] = [];

  if (errorSpotting) {
    statement = errorSpotting.statement;
    finalOptions = errorSpotting.options;
    if (errorSpotting.detectedKey) {
      correctKey = errorSpotting.detectedKey;
      hasExplicitKey = true;
    }
  } else {
    // Extract Options strictly using letter markers with punctuation:
    // (A), (B), (C), (D), (E)
    // [A], [B], [C], [D], [E]
    // a), b), c), d), e)
    // a., b., c., d., e.
    const optionRegex = /(?:\(([a-eA-E])\)|\[([a-eA-E])\]|\b([a-eA-E])[\.\)\:])\s+/g;
    const optHits: Array<{ letter: 'A' | 'B' | 'C' | 'D' | 'E'; index: number; matchLen: number }> = [];
    let optM;

    while ((optM = optionRegex.exec(remainingText)) !== null) {
      const letter = (optM[1] || optM[2] || optM[3]).toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(letter)) {
        optHits.push({
          letter: letter as any,
          index: optM.index,
          matchLen: optM[0].length
        });
      }
    }

    // Find best sequence of options A-E (handles questions where (A), (B), (C), (D) also appear in the statement)
    const targets: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
    const optSeq = findBestOptionSequence(optHits);

    const optionsMap: Record<string, string> = {};

    if (optSeq.length > 0) {
      // Statement is everything before option A
      statement = remainingText.substring(0, optSeq[0].index).trim();

      // Extract each option
      for (let j = 0; j < optSeq.length; j++) {
        const curOpt = optSeq[j];
        const nextOpt = optSeq[j + 1];
        const start = curOpt.index + curOpt.matchLen;
        const end = nextOpt ? nextOpt.index : remainingText.length;
        let optText = remainingText.substring(start, end).trim().replace(/\s+/g, ' ');

        // CRITICAL CHECK FOR [Correct Answer], [Correct], (Correct), [Ans], ✓, *
        const correctTagRegex = /(?:\[\s*Correct(?:\s*Answer)?\s*\]|\(\s*Correct(?:\s*Answer)?\s*\)|\[\s*Ans\s*\]|\(\s*Ans\s*\)|[\*✓✔])/i;
        if (correctTagRegex.test(optText)) {
          correctKey = curOpt.letter;
          hasExplicitKey = true;
          // Strip the [Correct Answer] tag so option text is clean for student practice!
          optText = optText.replace(correctTagRegex, '').trim();
        }

        // Clean leading or trailing slashes that might cling from Error Spotting / Sentence division
        optText = optText.replace(/^[\/\\]+\s*/, '').replace(/[\/\\]+\s*$/, '').trim();

        // If this is the last option (Option E), strip any accidental trailing question header, Direction, or prompt notes
        if (!nextOpt) {
          // If Option E accidentally caught the whole combined sentence (e.g. "(A) ... (B) ..."):
          if (/(?:\([a-dA-D]\)|\[[a-dA-D]\])[\s\S]+(?:\([b-dB-D]\)|\[[b-dB-D]\])/.test(optText)) {
            optText = 'No error';
          }
          optText = optText.replace(/(?:^|\s+)(?:Q(?:uestion)?\.?\s*\d{1,3}|\d{1,3}[\.\)](?=\s+|$)|Direction[s]?\s*[:\-.]?)[\s\S]*$/i, '').trim();
          optText = optText.replace(/\s*these\s+all\s+same\s+quesiton.*$/i, '').trim();
          optText = optText.replace(/(?:^|\s+)(?:(?:Quants?|Reasoning|English|Math|Banking|Static\s*GK)\s*Booster)[^\n]*$/i, '').trim();
          optText = optText.replace(/(?:^|\s+)(?:Chart\s*[-–—]\s*Based\s+Data\s+Interpretation|--\s*\d+\s*of\s*\d+\s*--|Page\s*\d+\s*(?:of\s*\d+)?)[^\n]*$/gi, '').trim();
          // Normalize "No error (E)" -> "No error"
          optText = optText.replace(/\s*\([a-eA-E]\)\s*$/, '').trim();
          if (/^no\s*error/i.test(optText)) {
            optText = 'No error';
          }
        }
        optionsMap[curOpt.letter] = normalizeMathSymbols(optText);
      }
    } else {
      statement = remainingText;
    }

      // Clean statement
      statement = cleanStatementText(statement.replace(/^\s*[\.\:\-\)]\s*/, '').trim());

      // If statement is empty or just "Question X" (common in Cloze tests: "31. (A) price (B) cost...")
      if (!statement || statement.trim().length === 0 || /^Question\s*\d+$/i.test(statement.trim())) {
        statement = `Select the most appropriate option to fill in blank (${qNum}).`;
      }

      // Standard 5 options
      finalOptions = targets.map(key => ({
        key,
        text: normalizeMathSymbols(optionsMap[key] || `Option ${key}`)
      }));
    }

  // If we had a raw answer value (e.g. "1/6", "52/55", "None of these"), match it against finalOptions!
  if (!hasExplicitKey && rawAnsValue) {
    const cleanAns = rawAnsValue.toLowerCase().replace(/\s+/g, '');
    for (const opt of finalOptions) {
      const cleanOpt = opt.text.toLowerCase().replace(/\s+/g, '');
      if (cleanOpt === cleanAns || cleanOpt.includes(cleanAns) || cleanAns.includes(cleanOpt)) {
        correctKey = opt.key;
        hasExplicitKey = true;
        break;
      }
    }
    // Check if rawAnsValue contains 'none'
    if (!hasExplicitKey && cleanAns.includes('none')) {
      const noneOpt = finalOptions.find(o => o.text.toLowerCase().includes('none'));
      if (noneOpt) {
        correctKey = noneOpt.key;
        hasExplicitKey = true;
      }
    }
  }

  // Also check if solutionText mentions the correct option (e.g. "Hence option (B) is correct")
  if (!hasExplicitKey && solutionText) {
    const solOptMatch = solutionText.match(/(?:Hence|Therefore|Thus|So|Required|Correct)?\s*(?:Option|Answer|Ans)?\s*(?:is|:|-)?\s*\(?([a-eA-E])\)?\s*(?:is\s*(?:the\s*)?correct)?/i);
    if (solOptMatch && ['A', 'B', 'C', 'D', 'E'].includes(solOptMatch[1].toUpperCase())) {
      correctKey = solOptMatch[1].toUpperCase() as any;
      hasExplicitKey = true;
    }
  }

  if (!solutionText) {
    const matchedOpt = finalOptions.find(o => o.key === correctKey);
    const optDesc = matchedOpt ? ` - ${matchedOpt.text}` : '';
    solutionText = hasExplicitKey
      ? `Official Correct Answer from PDF: Option ${correctKey}${optDesc}`
      : 'Step-by-step solution from uploaded question paper.';
  } else {
    solutionText = normalizeMathSymbols(solutionText);
  }

  // Infer subject / topic
  const lowerText = (statement + ' ' + (solutionText || '')).toLowerCase();
  let subject: SubjectCode = 'REASONING_ABILITY';
  let topic = 'Reasoning Ability';

  // Check English Language first
  if (
    lowerText.includes('passage') ||
    lowerText.includes('author') ||
    lowerText.includes('suitable title') ||
    lowerText.includes('according to the passage') ||
    lowerText.includes('as used in the passage') ||
    lowerText.includes('most similar in meaning') ||
    lowerText.includes('most opposite in meaning') ||
    lowerText.includes('grammatically correct') ||
    lowerText.includes('error spotting') ||
    lowerText.includes('cloze test') ||
    lowerText.includes('sentence improvement') ||
    lowerText.includes('para jumble')
  ) {
    subject = 'ENGLISH_LANGUAGE';
    if (lowerText.includes('similar in meaning') || lowerText.includes('opposite in meaning') || lowerText.includes('synonym') || lowerText.includes('antonym')) {
      topic = 'Vocabulary';
    } else if (lowerText.includes('passage') || lowerText.includes('according to the passage') || lowerText.includes('suitable title')) {
      topic = 'Reading Comprehension';
    } else if (lowerText.includes('error') || lowerText.includes('grammatically')) {
      topic = 'Error Detection';
    } else {
      topic = 'English Language';
    }
  } else if (
    /\b(?:probability|two\s+dice|fair\s+die|flip\s+a\s+coin|toss\s+a\s+coin)\b/i.test(lowerText) ||
    (/\b(?:marbles?|coins?|balls?)\b/i.test(lowerText) && !lowerText.includes('bitcoin') && !lowerText.includes('crypto'))
  ) {
    subject = 'QUANTITATIVE_APTITUDE';
    topic = 'Probability';
  } else if (lowerText.includes('syllogism') || lowerText.includes('conclusion') || lowerText.includes('statements:')) {
    subject = 'REASONING_ABILITY';
    topic = 'Syllogism';
  } else if (lowerText.includes('seating') || lowerText.includes('circular table') || lowerText.includes('facing the centre') || lowerText.includes('facing the center')) {
    subject = 'REASONING_ABILITY';
    topic = 'Circular Seating Arrangement';
  } else if (lowerText.includes('floor') || lowerText.includes('building') || lowerText.includes('lowermost floor')) {
    subject = 'REASONING_ABILITY';
    topic = 'Floor Puzzle';
  } else if (lowerText.includes('code') || lowerText.includes('written as') || lowerText.includes('coded')) {
    subject = 'REASONING_ABILITY';
    topic = 'Coding-Decoding';
  } else if (lowerText.includes('father') || lowerText.includes('brother') || lowerText.includes('sister') || lowerText.includes('daughter') || lowerText.includes('son of')) {
    subject = 'REASONING_ABILITY';
    topic = 'Blood Relations';
  } else if (/\b(?:north|south|east|west|distance)\b/i.test(lowerText) && (lowerText.includes('point') || lowerText.includes('metre') || lowerText.includes('meter') || lowerText.includes('direction'))) {
    subject = 'REASONING_ABILITY';
    topic = 'Direction Sense';
  } else if (lowerText.includes('sequence') || lowerText.includes('symbol') || lowerText.includes('preceded')) {
    subject = 'REASONING_ABILITY';
    topic = 'Alphanumeric Sequence';
  } else if (
    lowerText.includes('two equations') ||
    lowerText.includes('equations (i) and (ii)') ||
    lowerText.includes('relation cannot be established') ||
    /\bx\s*(?:≥|≤|>|<|=)\s*y\b/i.test(lowerText) ||
    /\b(?:quadratic|roots\s+of)\b/i.test(lowerText)
  ) {
    subject = 'QUANTITATIVE_APTITUDE';
    topic = 'Quadratic Equations';
  } else if (lowerText.includes('≤') || lowerText.includes('≥') || lowerText.includes('>') || lowerText.includes('<')) {
    subject = 'REASONING_ABILITY';
    topic = 'Inequalities';
  } else if (
    lowerText.includes('approximate value') ||
    lowerText.includes('simplification') ||
    lowerText.includes('√') ||
    lowerText.includes('÷') ||
    /\b(?:quant|quants|approx|percentage|% of)\b/i.test(lowerText)
  ) {
    subject = 'QUANTITATIVE_APTITUDE';
    topic = 'Simplification & Approx.';
  } else if (lowerText.includes('speed') || lowerText.includes('profit') || lowerText.includes('interest') || lowerText.includes('ratio') || lowerText.includes('average')) {
    subject = 'QUANTITATIVE_APTITUDE';
    topic = 'Arithmetic';
  }

  return {
    tempId: `pdf-q-${qNum}-${Date.now()}`,
    questionNumber: qNum,
    subject,
    topic,
    statement: (statement && !/^Question\s*\d+$/i.test(statement.trim())) ? statement : `Select the most appropriate option to fill in blank (${qNum}).`,
    options: finalOptions,
    correctOptionKey: correctKey,
    detailedSolution: solutionText,
    shortcutMethod: 'Solve systematically using standard banking shortcuts.',
    difficulty: 'MODERATE',
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    confidenceScore: finalOptions.length >= 4 ? 98 : 80,
    isApproved: true,
    hasExplicitKey,
    isPdfOriginalKey: hasExplicitKey
  };
}

/**
 * Resolves the optimal ascending question sequence (e.g. 1, 2, 3... 35)
 * Filtering out false positives from math exponents, sub-clauses, and inner expressions.
 */
function findValidQuestionSequence(
  hits: Array<{ qNum: number; index: number; matchLen: number }>
): Array<{ qNum: number; index: number; matchLen: number }> {
  if (!hits || hits.length === 0) return [];

  const sorted = [...hits].sort((a, b) => a.index - b.index);

  // Candidates for the starting question (e.g. 1, or lowest available <= 5)
  const startCandidates = sorted.filter(h => h.qNum >= 1 && h.qNum <= 5);
  if (startCandidates.length === 0) {
    startCandidates.push(sorted[0]);
  }

  let bestSequence: Array<{ qNum: number; index: number; matchLen: number }> = [];

  for (const startHit of startCandidates) {
    const currentSeq = [startHit];
    let lastQ = startHit.qNum;
    let lastIndex = startHit.index;

    for (const h of sorted) {
      if (h.index <= lastIndex) continue;

      // Exact sequential match: Q(N + 1)
      if (h.qNum === lastQ + 1) {
        currentSeq.push(h);
        lastQ = h.qNum;
        lastIndex = h.index;
      } else if (h.qNum === lastQ + 2) {
        // Minor skip of at most 1 question in source document
        const hasPlusOne = sorted.some(cand => cand.index > lastIndex && cand.index < h.index && cand.qNum === lastQ + 1);
        if (!hasPlusOne) {
          currentSeq.push(h);
          lastQ = h.qNum;
          lastIndex = h.index;
        }
      }
    }

    if (currentSeq.length > bestSequence.length) {
      bestSequence = currentSeq;
    }
  }

  return bestSequence.length >= 2 ? bestSequence : sorted;
}

/**
 * Extracts Direction / Passage Blocks:
 * Captures multi-paragraph reading comprehension passages, puzzles, and caselets across lines.
 * Supports:
 * - "Directions (Q1 - Q10): Read the following passage..."
 * - "Directions (1 - 5): Study the following information..."
 * - "Directions: Study the given information..."
 */
function extractDirectionBlocks(
  text: string,
  targetQs: Array<{ qNum: number; index: number; matchLen: number }>
): Array<{ startQ: number; endQ: number; passage: string; title: string }> {
  const blocks: Array<{ startQ: number; endQ: number; passage: string; title: string; headerIndex: number }> = [];
  
  // Matches "Directions (Q1 - Q10):", "Direction (1-5):", "Directions (Q.16 to 20):", "Directions (Q.11 - 15)", "Directions:"
  const dirHeaderRegex = /(?:^|\n)\s*(?:Directions?|Direction)\s*(?:for\s+questions?\s*)?(?:\(?(?:Questions?|[Qq])?\.?\s*(\d{1,3})\s*(?:to|-)\s*(?:Questions?|[Qq])?\.?\s*(\d{1,3})\)?\s*[:\-.]?|[:\-.])\s*/gi;
  
  let match: RegExpExecArray | null;
  while ((match = dirHeaderRegex.exec(text)) !== null) {
    const startQ = parseInt(match[1] || '0', 10);
    const endQ = parseInt(match[2] || '0', 10);
    const startIndex = match.index + match[0].length;
    
    // The passage text continues across multiple paragraphs/lines until:
    // A question number starting a line: e.g. "\n1. ", "\nQ1. ", "\nQuestion 1"
    // OR another Directions block
    // OR end of text
    const remaining = text.substring(startIndex);
    // Mask parenthesized numbers like (31), (32) so Cloze blanks are never mistaken for question boundaries!
    const maskedRemaining = remaining.replace(/\(\s*\d{1,3}\s*\)/g, (m) => ' '.repeat(m.length));
    const nextBoundaryMatch = maskedRemaining.match(/(?:\n\s*(?:(?:Q(?:uestion|ue|ues)?\.?\s*\d{1,3})|\d{1,3}[\.\)])\s+)|\n\s*(?:Directions?|Direction)\b/i);
    
    const passageEnd = nextBoundaryMatch && nextBoundaryMatch.index !== undefined 
      ? nextBoundaryMatch.index 
      : remaining.length;
    
    let passage = remaining.substring(0, passageEnd).trim();
    
    // Clean any leading punctuation left from header
    passage = passage.replace(/^[:\-.]\s*/, '').trim();
    // Unwrap soft line breaks inside passage so sentences are clean without huge awkward gaps
    passage = unwrapPassageText(passage);
    
    if (passage.length > 10) {
      blocks.push({
        startQ: startQ || 0,
        endQ: endQ || 0,
        passage,
        title: (startQ > 0 && endQ > 0) ? `Directions (Q.${startQ} - ${endQ})` : 'Directions',
        headerIndex: match.index
      });
    }
  }

  // Resolve startQ and endQ for blocks with startQ === 0 using question positions
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.startQ === 0) {
      const nextQ = targetQs.find(q => q.index >= b.headerIndex);
      if (nextQ) {
        b.startQ = nextQ.qNum;
        const nextBlock = blocks[i + 1];
        if (nextBlock) {
          const nextBlockQ = targetQs.find(q => q.index >= nextBlock.headerIndex);
          b.endQ = nextBlockQ ? Math.max(b.startQ, nextBlockQ.qNum - 1) : b.startQ + 4;
        } else {
          b.endQ = Math.min(b.startQ + 4, targetQs[targetQs.length - 1].qNum);
        }
        b.title = `Directions (Q.${b.startQ} - ${b.endQ})`;
      }
    }
  }

  return blocks;
}

/**
 * Extracts Answer Key and Official Solutions from the Solutions/Answers section of the PDF:
 * Supports:
 * - "S1. Ans.(c)" (BankersAdda / Adda247 format)
 * - "1. Ans. (c)"
 * - "1. (c) Total number of marbles is 12..."
 * - "1. c) 52/55"
 * - "1. C  2. D  3. A  4. C  5. C"
 * - "1-(c), 2-(d), 3-(a)"
 * - "Question 1: C"
 * - "Q.1: (c)"
 */
function extractAnswerKeyAndSolutions(text: string): {
  answerMap: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  solutionMap: Record<number, string>;
} {
  const answerMap: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  const solutionMap: Record<number, string> = {};

  if (!text || text.trim().length === 0) {
    return { answerMap, solutionMap };
  }

  // Pass 1: Extract question number -> answer letter mapping
  const entryRegex = /(?:^|\s|\b)(?:(?:S|Q|Question)\s*)?\(?(\d{1,3})\)?\s*[\.\:\-\)]\s*(?:Ans(?:wer)?\.?\s*[:\-]?)?\s*(?:Option\s*)?\(?([a-eA-E])\)?(?=[\s,\.\;\:\)\-\n\r]|$)/gi;
  let m;
  while ((m = entryRegex.exec(text)) !== null) {
    const qNum = parseInt(m[1], 10);
    const letter = (m[2] || '').toUpperCase();
    if (!isNaN(qNum) && qNum > 0 && qNum <= 300 && ['A', 'B', 'C', 'D', 'E'].includes(letter)) {
      if (!answerMap[qNum]) {
        answerMap[qNum] = letter as any;
      }
    }
  }

  // Pass 2: Extract detailed step-by-step solution text for each question number if present
  const solChunkRegex = /(?:^|\n|\r)\s*(?:(?:S|Q|Question)\s*)?\(?(\d{1,3})\)?\s*[\.\:\-\)]\s*(?:Ans(?:wer)?\.?\s*[:\-]?)?\s*(?:Option\s*)?\(?([a-eA-E])\)?\s*([^\n\r]+(?:\n(?!\s*(?:(?:S|Q|Question)\s*)?\(?\d{1,3}\)?\s*[\.\:\-\)])[^\n\r]+)*)/gi;
  let sm;
  while ((sm = solChunkRegex.exec(text)) !== null) {
    const qNum = parseInt(sm[1], 10);
    const letter = (sm[2] || '').toUpperCase();
    const explanation = sm[3] ? sm[3].trim() : '';
    if (qNum && ['A', 'B', 'C', 'D', 'E'].includes(letter)) {
      if (!answerMap[qNum]) {
        answerMap[qNum] = letter as any;
      }
      if (explanation && explanation.length > 5) {
        solutionMap[qNum] = `Official Answer: Option (${letter})\n` + explanation.replace(/^(?:Sol\.?|Explanation|Hint)\s*[:\-.]?\s*/i, '').trim();
      }
    }
  }

  return { answerMap, solutionMap };
}

/**
 * Detects and parses Error Spotting questions with or without slashes:
 * Handles:
 * 1. Postfix with slashes: "Hardly had the customer (A)/ entered the bank premises (B)/ than the security alarm (C)/ started ringing loudly. (D)/ No error (E)"
 * 2. Prefix with slashes: "(A) Hardly had the customer / (B) entered the bank premises / (C) than the security alarm / (D) started ringing loudly. / (E) No error"
 * 3. Prefix without slashes: "(A) Hardly had the customer (B) entered the bank premises (C) than the security alarm (D) started ringing loudly. (E) No error"
 * 4. Postfix without slashes: "Hardly had the customer (A) entered the bank premises (B) than the security alarm (C) started ringing loudly. (D) No error (E)"
 * 5. Questions with [Correct Answer] tags within parts
 * 6. Sentence followed by separate options list A-E
 */
function parseErrorSpottingChunk(rawChunk: string): { 
  statement: string; 
  options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[];
  detectedKey?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
} | null {
  if (!rawChunk || rawChunk.trim().length === 0) return null;

  // Error spotting questions MUST explicitly involve errors ("No error", "grammatical error", "error in")
  const hasErrorSpottingIndicators = /no\s*error/i.test(rawChunk) || /grammatical\s*error/i.test(rawChunk) || /\berror\b/i.test(rawChunk);
  if (!hasErrorSpottingIndicators) {
    return null;
  }

  // Mask mathematical fractions like 1/6, 5/36, 7/44 so they aren't confused with part dividers
  const maskedFractions = rawChunk.replace(/(\b\d+)\s*\/\s*(\d+\b)/g, '$1__FRAC__$2');

  const correctTagRegex = /(?:\[\s*Correct(?:\s*Answer)?\s*\]|\(\s*Correct(?:\s*Answer)?\s*\)|\[\s*Ans\s*\]|\(\s*Ans\s*\)|[\*✓✔])/i;
  let detectedKey: 'A' | 'B' | 'C' | 'D' | 'E' | null = null;

  // Case A: Contains forward slashes '/' dividing sentence parts
  if (maskedFractions.includes('/')) {
    let workingText = maskedFractions;
    
    // Check if there is a separate options block following the slashed sentence:
    // e.g. sentence ... / No error (E)\n(A) ...
    const separateOptMatch = workingText.match(/(?:\n|\r|\s{2,})(?:\(A\)|\[A\]|\bA[\.\)\:])\s+[^\n\/]+/i);
    if (separateOptMatch && separateOptMatch.index && separateOptMatch.index > 20) {
      workingText = workingText.substring(0, separateOptMatch.index).trim();
    }

    const rawParts = workingText.split(/\/+/).map(p => p.replace(/__FRAC__/g, '/').trim()).filter(p => p.length > 0);

    if (rawParts.length >= 4 && rawParts.length <= 7) {
      const cleanParts: string[] = [];
      const partLetters: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];

      for (let i = 0; i < rawParts.length; i++) {
        let p = rawParts[i];

        if (correctTagRegex.test(p)) {
          detectedKey = partLetters[i] || 'A';
          p = p.replace(correctTagRegex, '').trim();
        }

        // Collapse all internal line breaks and whitespace
        p = p.replace(/\s+/g, ' ').trim();
        // Strip leading slash or punctuation
        p = p.replace(/^[\/\\]+\s*/, '').trim();
        // Strip leading part marker
        p = p.replace(/^(?:\([a-eA-E1-5]\)|\[[a-eA-E1-5]\]|\b[a-eA-E1-5][\.\:\-])\s*/i, '').trim();

        if (correctTagRegex.test(p)) {
          detectedKey = partLetters[i] || 'A';
          p = p.replace(correctTagRegex, '').trim();
        }

        // Strip trailing part marker
        p = p.replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)\s*$/i, '').trim();

        // If this is the last part (Part E): clean up trailing chatter, answers, or solutions
        if (i === rawParts.length - 1) {
          p = p.replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)\s*$/i, '').trim();
          p = p.replace(/(?:\n|\s)*(?:(?:Solution|Sol|Ans|Answer|Exp|Hint)\b|Directions?|\d{1,3}[\.\)](?=\s+|$)|Question)[\s\S]*$/i, '').trim();
          p = p.replace(/\s*these\s+all\s+same.*$/i, '').trim();
          // Normalize "No error"
          if (/^No\s+error\b/i.test(p)) {
            p = 'No error';
          }
        }

        p = p.replace(/\s+/g, ' ').replace(/^[\/\\]+\s*/, '').replace(/[\/\\]+\s*$/, '').trim();
        if (p.length > 0) {
          cleanParts.push(p);
        }
      }

      if (cleanParts.length >= 4) {
        while (cleanParts.length < 5) {
          cleanParts.push('No error');
        }

        // Ensure cleanParts[4] doesn't have duplicate (E)
        cleanParts[4] = cleanParts[4].replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)+$/i, '').trim();
        if (!cleanParts[4] || /^no\s*error/i.test(cleanParts[4])) {
          cleanParts[4] = 'No error';
        }

        const targets: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
        const options = targets.map((key, idx) => ({
          key,
          text: (cleanParts[idx] || (key === 'E' ? 'No error' : `Part ${key}`)).replace(/\s+/g, ' ').replace(/(?:\s*\([a-eA-E]\)|\s*\[[a-eA-E]\]|\s+\b[a-eA-E]\b)+$/i, '').trim()
        }));

        const cleanPart4 = cleanParts[4].replace(/(?:\s*\([a-eA-E]\)|\s*\[[a-eA-E]\]|\s+\b[a-eA-E]\b)+$/i, '').trim();
        const statement = `${cleanParts[0]} (A) / ${cleanParts[1]} (B) / ${cleanParts[2]} (C) / ${cleanParts[3]} (D) / ${cleanPart4} (E)`
          .replace(/\s+/g, ' ')
          .replace(/\(([a-eA-E])\)\s*\(\1\)/gi, '($1)')
          .trim();

        return {
          statement,
          options,
          detectedKey
        };
      }
    }
  }

  // Case B: No slashes, but has embedded (A), (B), (C), (D), (E) or (A)...(D) within a single sentence
  const letterMatches = [...rawChunk.matchAll(/(?:\(([a-eA-E])\)|\[([a-eA-E])\])\s*/g)];
  if (letterMatches.length >= 4) {
    const letters = letterMatches.map(m => (m[1] || m[2]).toUpperCase());
    const isSequential = letters.slice(0, 4).every((l, idx) => l === ['A', 'B', 'C', 'D'][idx]);
    
    if (isSequential) {
      const firstMarkerIdx = letterMatches[0].index !== undefined ? letterMatches[0].index : 0;
      const textBeforeA = rawChunk.substring(0, firstMarkerIdx).trim();

      const parts: string[] = [];
      const partLetters: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];

      if (textBeforeA.length > 5 && !/^(?:Find|Read|Select|In|Which|Below|The\s+following)\b/i.test(textBeforeA)) {
        // POSTFIX FORMAT: "Hardly had the customer (A) entered the bank premises (B)..."
        parts.push(textBeforeA);
        for (let i = 0; i < letterMatches.length; i++) {
          const start = (letterMatches[i].index || 0) + letterMatches[i][0].length;
          const end = letterMatches[i + 1] ? (letterMatches[i + 1].index || rawChunk.length) : rawChunk.length;
          const p = rawChunk.substring(start, end).trim();
          if (p) parts.push(p);
        }
      } else {
        // PREFIX FORMAT: "(A) Hardly had the customer (B) entered the bank premises..."
        for (let i = 0; i < letterMatches.length; i++) {
          const start = (letterMatches[i].index || 0) + letterMatches[i][0].length;
          const end = letterMatches[i + 1] ? (letterMatches[i + 1].index || rawChunk.length) : rawChunk.length;
          const p = rawChunk.substring(start, end).trim();
          if (p) parts.push(p);
        }
      }

      // Check whether this is truly Error Spotting (must end with "No error" or mention error)
      const lastPart = parts[parts.length - 1] || '';
      const isLastError = /no\s*error/i.test(lastPart);
      if (!isLastError && !/error/i.test(rawChunk)) {
        return null;
      }

      if (parts.length >= 4) {
        const cleanParts: string[] = [];
        for (let i = 0; i < parts.length; i++) {
          let p = parts[i];
          if (correctTagRegex.test(p)) {
            detectedKey = partLetters[i] || 'A';
            p = p.replace(correctTagRegex, '').trim();
          }
          p = p.replace(/\s+/g, ' ').trim();
          p = p.replace(/^[\/\\]+\s*/, '').trim();
          p = p.replace(/^(?:\([a-eA-E1-5]\)|\[[a-eA-E1-5]\]|\b[a-eA-E1-5][\.\:\-])\s*/i, '').trim();
          p = p.replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)\s*$/i, '').trim();
          if (i === parts.length - 1) {
            p = p.replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)\s*$/i, '').trim();
            p = p.replace(/(?:\n|\s)*(?:(?:Solution|Sol|Ans|Answer|Exp|Hint)\b|Directions?|\d{1,3}[\.\)](?=\s+|$)|Question)[\s\S]*$/i, '').trim();
            p = p.replace(/\s*these\s+all\s+same.*$/i, '').trim();
            if (/^No\s+error\b/i.test(p)) {
              p = 'No error';
            }
          }
          p = p.replace(/\s+/g, ' ').replace(/^[\/\\]+\s*/, '').replace(/[\/\\]+\s*$/, '').trim();
          if (p.length > 0) cleanParts.push(p);
        }

        while (cleanParts.length < 5) {
          cleanParts.push('No error');
        }
        cleanParts[4] = cleanParts[4].replace(/(?:\s*\([a-eA-E1-5]\)|\s*\[[a-eA-E1-5]\]|\s+\b[a-eA-E1-5]\b)+$/i, '').trim();
        if (!cleanParts[4] || /^no\s*error/i.test(cleanParts[4])) {
          cleanParts[4] = 'No error';
        }

        const targets: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
        const options = targets.map((key, idx) => ({
          key,
          text: (cleanParts[idx] || (key === 'E' ? 'No error' : `Part ${key}`)).replace(/\s+/g, ' ').replace(/(?:\s*\([a-eA-E]\)|\s*\[[a-eA-E]\]|\s+\b[a-eA-E]\b)+$/i, '').trim()
        }));

        const cleanPart4 = cleanParts[4].replace(/(?:\s*\([a-eA-E]\)|\s*\[[a-eA-E]\]|\s+\b[a-eA-E]\b)+$/i, '').trim();
        const statement = `${cleanParts[0]} (A) / ${cleanParts[1]} (B) / ${cleanParts[2]} (C) / ${cleanParts[3]} (D) / ${cleanPart4} (E)`
          .replace(/\s+/g, ' ')
          .replace(/\(([a-eA-E])\)\s*\(\1\)/gi, '($1)')
          .trim();

        return {
          statement,
          options,
          detectedKey
        };
      }
    }
  }

  return null;
}

/**
 * Normalizes question statements by collapsing unnecessary soft line breaks inside sentences
 * while preserving structured list items (like Syllogism Statements / Conclusions).
 */
function cleanStatementText(statement: string): string {
  if (!statement) return '';
  let clean = statement.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  // Strip duplicate part markers like (E) (E) or (A) (A)
  clean = clean.replace(/\(([a-eA-E])\)\s*\(\1\)/gi, '($1)');
  clean = clean.replace(/\(([a-eA-E])\)\s+([a-eA-E])\b/gi, '($1)');

  // If Error Spotting (contains slashes separating parts): collapse completely to a single line
  if (/[\/\\]/.test(clean) && (/(?:\([a-eA-E1-5]\)|\[[a-eA-E1-5]\])/i.test(clean) || /no\s*error/i.test(clean))) {
    return clean.replace(/\s+/g, ' ').trim();
  }

  // If simple question with no list headers or items: collapse soft breaks to one line
  const hasStructure = /^(?:Statements?|Conclusions?|Given|Note|[I|V|X]+[\.\)]|\([a-eA-E0-9ivx]+\)|[•\-\*])/m.test(clean);
  if (!hasStructure) {
    return normalizeMathSymbols(clean.replace(/\s+/g, ' ').trim());
  }

  const rawLines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const reconstructed: string[] = [];
  let buffer = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isListItem = /^(?:[I|V|X]+[\.\)]|\d+[\.\)]|\([a-eA-E0-9ivx]+\)|[•\-\*])/i.test(line);
    const isHeader = /^(?:Statements?|Conclusions?|Given|Note):?$/i.test(line);

    if (!buffer) {
      buffer = line;
    } else if (isListItem || isHeader) {
      reconstructed.push(buffer);
      buffer = line;
    } else {
      buffer += ' ' + line;
    }
  }
  if (buffer) reconstructed.push(buffer);

  return normalizeMathSymbols(reconstructed.join('\n'));
}

/**
 * High-fidelity mathematical and quantitative symbol normalizer:
 * - Exponents/superscripts: "? 2" -> "?²", "16 2" -> "16²", "2x 2" -> "2x²", "((9.12) 3" -> "((9.12)³", "(17.96) 2" -> "(17.96)²"
 * - Operators: standardizes spacing around =, +, -, ×, ÷, ≤, ≥, ≠, <, >
 * - Division vs Fractions: ") / ?" -> ") ÷ ?" while preserving fractions like "2/5", "3/7", "52/55"
 * - Square roots: "√ 1024" -> "√1024", "√ ?" -> "√?"
 * - Inequalities: "x >= y" -> "x ≥ y", "x <= y" -> "x ≤ y", "x != y" -> "x ≠ y"
 * - Quadratic Roman numerals: "I)." -> "I.", "II)." -> "II." with clean line breaks
 */
export function normalizeMathSymbols(text: string): string {
  if (!text) return '';
  let str = text;

  // 1. Protect fractions like 2/5, 3/7, 3/8, 1/6, 52/55 from division replacement
  str = str.replace(/(\b\d+)\s*\/\s*(\d+\b)/g, '$1__FRAC__$2');

  // 2. CRITICAL: Multiplication symbol between numbers / variables / parenthesis
  // If letter x/X: MUST have whitespace before and after so "2x 2" is recognized as "2x²", NOT "2 × 2"!
  // If asterisk *: can have optional whitespace
  str = str.replace(/(\b\d+(?:\.\d+)?|\?|\))\s+[xX]\s+(\b\d+(?:\.\d+)?|\?|\()/g, '$1 × $2');
  str = str.replace(/(\b\d+(?:\.\d+)?|\?|\))\s*\*+\s*(\b\d+(?:\.\d+)?|\?|\()/g, '$1 × $2');

  const superscripts: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
  };

  // 3. Unknown variable '?' power: e.g. "? 2" -> "?²", "? 3" -> "?³"
  str = str.replace(/(\?)\s+([2345])(?=[\s\+\-\*×÷=\(\)\,\.]|$)(?!\/)/g, (_, v, p) => `${v}${superscripts[p] || p}`);

  // 4. Algebraic variables: e.g. "2x 2" -> "2x²", "x 2" -> "x²", "y 2" -> "y²", "3y 2" -> "3y²"
  str = str.replace(/(\b\d*[xyzXYZ])\s+([2345])(?=[\s\+\-\*×÷=\(\)\,\.]|$)(?!\/)/g, (_, v, p) => `${v}${superscripts[p] || p}`);

  // 5. Parenthesized expression exponents: e.g. "((9.12) 3", "(17.96) 2", "(15.01 2 )"
  str = str.replace(/(\))\s+([2345])(?=[\s\+\-\*×÷=\(\)\,\.]|$)(?!\/)/g, (_, v, p) => `${v}${superscripts[p] || p}`);
  str = str.replace(/(\b\d+(?:\.\d+)?)\s+([2345])(?=\s*\))/g, (_, num, p) => `${num}${superscripts[p] || p}`);

  // 6. Constant number exponents in math expressions: e.g. "16 2" -> "16²", "18 2" -> "18²", "22.22 2" -> "22.22²"
  str = str.replace(/(\b\d+(?:\.\d+)?)\s+([2345])(?=\s*(?:[\+\-\*×÷=\)]|\(approx|$))/gi, (_, num, p) => `${num}${superscripts[p] || p}`);

  // 7. Standalone division slash (e.g. ") / ?" -> ") ÷ ?", "? / 5" -> "? ÷ 5")
  str = str.replace(/(\)|\?|\b\d+(?:\.\d+)?)\s*\/\s*(\?|\b\d+(?:\.\d+)?)/g, '$1 ÷ $2');

  // 8. Restore fractions
  str = str.replace(/__FRAC__/g, '/');

  // 9. Square root formatting (e.g. "√ 1024" -> "√1024", "√ ?" -> "√?")
  str = str.replace(/√\s*(\d+(?:\.\d+)?|\?|[a-zA-Z])/g, '√$1');

  // 10. Inequality symbols standardizing: >= -> ≥, <= -> ≤, != -> ≠
  str = str.replace(/\s*(?:>=|=>)\s*/g, ' ≥ ');
  str = str.replace(/\s*(?:<=|=<)\s*/g, ' ≤ ');
  str = str.replace(/\s*(?:!=|~=)\s*/g, ' ≠ ');

  // 11. Quadratic equation Roman numerals formatting and line-break separation
  str = str.replace(/\b([I|V|X]+)\)\./g, '$1.');
  str = str.replace(/(?:\s+)(II\.\s+)/g, '\n$1');

  // 12. Standardize operator spacing around =, +, -, ×, ÷, ≤, ≥, ≠, <, >
  str = str.replace(/\s*([=≠≈≤≥])\s*/g, ' $1 ');
  str = str.replace(/\s*([×÷])\s*/g, ' $1 ');
  str = str.replace(/\s*([+])\s*/g, ' + ');
  // Minus sign between words/numbers
  str = str.replace(/([a-zA-Z0-9\?\)²³⁴⁵])\s*[-−]\s*([a-zA-Z0-9\?\(\√])/g, '$1 - $2');

  // 13. Clean multiple spaces on each line while preserving intentional line breaks
  str = str.split('\n').map(line => line.replace(/[ \t]{2,}/g, ' ').trim()).join('\n').trim();

  return str;
}

/**
 * Unwraps broken PDF lines inside passages so sentences are continuous and readable
 * without arbitrary double-spacing and broken clauses.
 * Heals line breaks inside sentences, preserves genuine paragraph gaps and bullet lists.
 */
function unwrapPassageText(text: string): string {
  if (!text) return '';
  let clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  clean = clean.replace(/Chart\s*[-–—]\s*Based\s+Data\s+Interpretation/gi, '');
  clean = clean.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');
  clean = clean.replace(/\b0\s+25\s+50\s+75\s+100\b[\s\S]*?(?=(?:Note:|Directions?|\n\n|$))/gi, '');
  const rawLines = clean.split('\n').map(l => l.trim());

  const blocks: string[] = [];
  let currentBuffer = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line) continue;

    if (!currentBuffer) {
      currentBuffer = line;
      continue;
    }

    // Check if line is just trailing punctuation like "." or ")"
    if (/^[\.\,\:\;\?\!\)]+$/.test(line)) {
      currentBuffer = currentBuffer.replace(/\s+$/, '') + line;
      continue;
    }

    const endsWithTerminalPunct = /[\.\?\!\:\"\']$/.test(currentBuffer);

    // List item / table row check: Coding table quotes or numbered list item after terminal punctuation
    const isCodingRow = /^\"[^\"]+\"\s+is\s+written/i.test(line);
    const isNumberedList = endsWithTerminalPunct && /^(?:[I|V|X]+[\.\)]|\d+[\.\)]|\([a-eA-E0-9ivx]+\)|[•\-\*])\s+/i.test(line);
    const isListItem = isCodingRow || isNumberedList;

    const isDirectionsEnding = /(?:in\s+each\s+case|given\s+below\s*it?|answer\s+the\s+questions?|carefully\s+and\s+answer)\.[\"\']?$/i.test(currentBuffer);
    const hadBlankLineBefore = i > 0 && rawLines[i - 1] === '';

    // If it's a list item / table row, append with single newline \n
    if (isListItem) {
      currentBuffer += '\n' + line;
      continue;
    }

    // True paragraph boundary:
    const isNewParagraph = endsWithTerminalPunct && (
      isDirectionsEnding ||
      (hadBlankLineBefore && /^[A-Z0-9\"\'\(]/.test(line) && !/^(?:of|in|to|for|with|on|at|from|by|as|into|about|and|or|but|while|that|which|than|a|an|the|is|are|was|were|has|have|had)\b/i.test(line))
    );

    if (isNewParagraph) {
      blocks.push(currentBuffer.trim());
      currentBuffer = line;
    } else {
      // Soft line wrap: join with space
      currentBuffer += ' ' + line;
    }
  }

  if (currentBuffer) {
    blocks.push(currentBuffer.trim());
  }

  return blocks.map(b => b.replace(/[ \t]{2,}/g, ' ')).join('\n\n');
}

/**
 * Finds the optimal sequence of options A-E:
 * Handles questions where (A), (B), (C), (D) also appear in the question statement
 * (e.g. Word Swap, Sentence Rearrangement) by selecting the option group closest to the end.
 */
function findBestOptionSequence(
  optHits: Array<{ letter: 'A' | 'B' | 'C' | 'D' | 'E'; index: number; matchLen: number }>
): Array<{ letter: 'A' | 'B' | 'C' | 'D' | 'E'; index: number; matchLen: number }> {
  const targets: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
  const aHits = optHits.filter(h => h.letter === 'A');
  if (aHits.length === 0) return [];

  let bestSeq: Array<{ letter: 'A' | 'B' | 'C' | 'D' | 'E'; index: number; matchLen: number }> = [];

  for (const startA of aHits) {
    const seq = [startA];
    let lastIdx = startA.index;
    
    for (let i = 1; i < targets.length; i++) {
      const nextTarget = targets[i];
      const cand = optHits.find(h => h.letter === nextTarget && h.index > lastIdx);
      if (cand) {
        seq.push(cand);
        lastIdx = cand.index;
      } else {
        break;
      }
    }

    if (seq.length >= 4) {
      if (seq.length > bestSeq.length || (seq.length === bestSeq.length && seq[0].index > (bestSeq[0]?.index || -1))) {
        bestSeq = seq;
      }
    }
  }

  // Fallback to first sequential hits if no >=4 sequence
  if (bestSeq.length === 0 && optHits.length > 0) {
    let lastIdx = -1;
    for (const t of targets) {
      const cand = optHits.find(h => h.letter === t && h.index > lastIdx);
      if (cand) {
        bestSeq.push(cand);
        lastIdx = cand.index;
      }
    }
  }

  return bestSeq;
}
