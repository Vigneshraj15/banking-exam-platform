import { Exam, Question, QuestionGroup } from '../types';
import { barGraphVisualDataUrl, pieChartVisualDataUrl, lineGraphVisualDataUrl } from './diVisualAssets';

// Shared Group 1: Bar Graph Group
export const barGraphGroup: QuestionGroup = {
  id: 'group-visual-bar-1',
  title: 'Directions (Q1 - Q5): Study the following Bar Graph carefully and answer the questions.',
  type: 'DATA_INTERPRETATION',
  content: 'The bar graph below shows the total number of units (in thousands) of two different products, Product A and Product B, sold by a company over five consecutive years (2018 - 2022).',
  imageUrl: barGraphVisualDataUrl,
  imageCaption: 'Figure 1: Units Sold (in Thousands) of Product A & B (2018 - 2022)'
};

// Shared Group 2: Pie Chart Group
export const pieChartGroup: QuestionGroup = {
  id: 'group-visual-pie-1',
  title: 'Directions (Q6 - Q10): Study the following Pie Chart carefully and answer the questions given below.',
  type: 'DATA_INTERPRETATION',
  content: 'The pie chart shows the percentage distribution of 5,000 students enrolled in five different academic courses (Engineering, Medical, Commerce, Arts, and Law) at a university.',
  imageUrl: pieChartVisualDataUrl,
  imageCaption: 'Figure 2: Percentage Distribution of 5,000 Students Across Academic Courses'
};

// Shared Group 3: Line Graph Group
export const lineGraphGroup: QuestionGroup = {
  id: 'group-visual-line-1',
  title: 'Directions (Q11 - Q15): Study the following Line Graph carefully and answer the questions.',
  type: 'DATA_INTERPRETATION',
  content: 'The line graph displays the Income and Expenditure (in Lakh Rupees) of a corporate firm over a period of five years (2018 - 2022).\nNote: Profit = Income - Expenditure',
  imageUrl: lineGraphVisualDataUrl,
  imageCaption: 'Figure 3: Corporate Income and Expenditure in Lakh Rupees (2018 - 2022)'
};

export const visualDiMockExam: Exam = {
  id: 'exam-chart-based-di-15q',
  title: 'Chart-Based Data Interpretation (Visual Data Sets)',
  category: 'BANKING_GOVT',
  subCategory: 'Data Interpretation Special',
  code: 'DI-VISUAL-MOCK-01',
  description: '15 High-Yield Visual Data Interpretation Questions across Bar Graph, Pie Chart, and Line Graph datasets with authentic high-resolution diagrams and instant step-by-step solutions.',
  instructions: [
    'Total duration of this specialized visual DI paper is 20 minutes.',
    'There are 15 questions based on 3 graphical datasets: Bar Graph (Q1-Q5), Pie Chart (Q6-Q10), Line Graph (Q11-Q15).',
    'Each correct answer awards +1 mark. Each incorrect answer deducts 0.25 marks.',
    'Click on any chart image to open the full-screen zoom lightbox view.',
    'You can navigate questions freely using the Question Palette on the right.'
  ],
  durationMinutes: 20,
  hasSectionalTiming: false,
  allowSectionSwitching: true,
  totalMarks: 15,
  totalQuestions: 15,
  cutoffEstimates: {
    general: 10.5,
    obc: 9.75,
    sc: 8.5,
    st: 7.75,
    ews: 10.0
  },
  isActive: true,
  sections: [
    {
      id: 'sec-visual-di',
      title: 'Visual Data Interpretation',
      subject: 'QUANTITATIVE_APTITUDE',
      order: 1,
      durationMinutes: 20,
      positiveMarksPerQuestion: 1.0,
      negativeMarksPerQuestion: 0.25,
      sectionalQualifyingMarks: 6.0,
      totalQuestions: 15,
      questions: [
        // Q1 (Bar Graph)
        {
          id: 'vdi-q1',
          questionNumber: 1,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Bar Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the average number of units of Product A sold over the five given years?',
          groupId: 'group-visual-bar-1',
          group: barGraphGroup,
          options: [
            { id: 'vdi-1-a', key: 'A', text: '50,000' },
            { id: 'vdi-1-b', key: 'B', text: '55,000' },
            { id: 'vdi-1-c', key: 'C', text: '60,000' },
            { id: 'vdi-1-d', key: 'D', text: '65,000' },
            { id: 'vdi-1-e', key: 'E', text: '70,000' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'From the Bar Graph, sales of Product A (in thousands):',
              '2018: 40, 2019: 50, 2020: 60, 2021: 70, 2022: 80',
              'Total units of Product A = 40 + 50 + 60 + 70 + 80 = 300 thousand.',
              'Average units = 300 / 5 = 60 thousand = 60,000.'
            ],
            shortcutMethod: 'Consecutive arithmetic progression with common difference 10: middle term = 60 thousand = 60,000.',
            isFacultyVerified: true
          }
        },
        // Q2 (Bar Graph)
        {
          id: 'vdi-q2',
          questionNumber: 2,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Bar Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the respective ratio of the units of Product B sold in 2019 to the units of Product A sold in 2021?',
          groupId: 'group-visual-bar-1',
          group: barGraphGroup,
          options: [
            { id: 'vdi-2-a', key: 'A', text: '7 : 9' },
            { id: 'vdi-2-b', key: 'B', text: '9 : 14' },
            { id: 'vdi-2-c', key: 'C', text: '14 : 9' },
            { id: 'vdi-2-d', key: 'D', text: '11 : 13' },
            { id: 'vdi-2-e', key: 'E', text: '9 : 11' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Units of Product B sold in 2019 = 45 thousand.',
              'Units of Product A sold in 2021 = 70 thousand.',
              'Respective Ratio = 45 : 70 = 9 : 14.'
            ],
            shortcutMethod: 'Direct ratio: 45 / 70 = 9 / 14.',
            isFacultyVerified: true
          }
        },
        // Q3 (Bar Graph)
        {
          id: 'vdi-q3',
          questionNumber: 3,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Bar Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the difference between the total units of Product A sold and the total units of Product B sold over all five years?',
          groupId: 'group-visual-bar-1',
          group: barGraphGroup,
          options: [
            { id: 'vdi-3-a', key: 'A', text: '10,000' },
            { id: 'vdi-3-b', key: 'B', text: '15,000' },
            { id: 'vdi-3-c', key: 'C', text: '20,000' },
            { id: 'vdi-3-d', key: 'D', text: '25,000' },
            { id: 'vdi-3-e', key: 'E', text: '30,000' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Total units of Product A = 40 + 50 + 60 + 70 + 80 = 300 thousand.',
              'Total units of Product B = 30 + 45 + 65 + 55 + 90 = 285 thousand.',
              'Difference = 300 - 285 = 15 thousand = 15,000.'
            ],
            shortcutMethod: 'Sum of differences: (40-30) + (50-45) + (60-65) + (70-55) + (80-90) = 10 + 5 - 5 + 15 - 10 = 15 thousand.',
            isFacultyVerified: true
          }
        },
        // Q4 (Bar Graph)
        {
          id: 'vdi-q4',
          questionNumber: 4,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Bar Graph',
          type: 'MCQ_5_OPTION',
          statement: 'The number of units of Product B sold in 2022 is what percent of the number of units of Product A sold in 2018?',
          groupId: 'group-visual-bar-1',
          group: barGraphGroup,
          options: [
            { id: 'vdi-4-a', key: 'A', text: '150%' },
            { id: 'vdi-4-b', key: 'B', text: '180%' },
            { id: 'vdi-4-c', key: 'C', text: '200%' },
            { id: 'vdi-4-d', key: 'D', text: '225%' },
            { id: 'vdi-4-e', key: 'E', text: '250%' }
          ],
          correctOptionKey: 'D',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Units of Product B sold in 2022 = 90 thousand.',
              'Units of Product A sold in 2018 = 40 thousand.',
              'Required Percentage = (90 / 40) × 100 = 2.25 × 100 = 225%.'
            ],
            shortcutMethod: '90 / 40 = 9 / 4 = 2.25 -> 225%.',
            isFacultyVerified: true
          }
        },
        // Q5 (Bar Graph)
        {
          id: 'vdi-q5',
          questionNumber: 5,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Bar Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the percentage increase in the sales of Product A from the year 2018 to 2019?',
          groupId: 'group-visual-bar-1',
          group: barGraphGroup,
          options: [
            { id: 'vdi-5-a', key: 'A', text: '15%' },
            { id: 'vdi-5-b', key: 'B', text: '20%' },
            { id: 'vdi-5-c', key: 'C', text: '25%' },
            { id: 'vdi-5-d', key: 'D', text: '30%' },
            { id: 'vdi-5-e', key: 'E', text: '40%' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Sales of Product A in 2018 = 40 thousand.',
              'Sales of Product A in 2019 = 50 thousand.',
              'Increase = 50 - 40 = 10 thousand.',
              'Percentage Increase = (10 / 40) × 100 = 25%.'
            ],
            shortcutMethod: '10 / 40 = 1 / 4 = 25%.',
            isFacultyVerified: true
          }
        },
        // Q6 (Pie Chart)
        {
          id: 'vdi-q6',
          questionNumber: 6,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Pie Chart',
          type: 'MCQ_5_OPTION',
          statement: 'What is the total number of students enrolled in Engineering and Law combined?',
          groupId: 'group-visual-pie-1',
          group: pieChartGroup,
          options: [
            { id: 'vdi-6-a', key: 'A', text: '1,500' },
            { id: 'vdi-6-b', key: 'B', text: '1,800' },
            { id: 'vdi-6-c', key: 'C', text: '2,000' },
            { id: 'vdi-6-d', key: 'D', text: '2,200' },
            { id: 'vdi-6-e', key: 'E', text: '2,500' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Total students = 5,000.',
              'Percentage in Engineering = 30%.',
              'Percentage in Law = 10%.',
              'Combined Percentage = 30% + 10% = 40%.',
              'Total students = 40% of 5,000 = 0.40 × 5,000 = 2,000.'
            ],
            shortcutMethod: '(30 + 10)% = 40% of 5000 = 2000.',
            isFacultyVerified: true
          }
        },
        // Q7 (Pie Chart)
        {
          id: 'vdi-q7',
          questionNumber: 7,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Pie Chart',
          type: 'MCQ_5_OPTION',
          statement: 'What is the respective ratio of the number of students enrolled in Medical to the number of students enrolled in Commerce?',
          groupId: 'group-visual-pie-1',
          group: pieChartGroup,
          options: [
            { id: 'vdi-7-a', key: 'A', text: '5 : 4' },
            { id: 'vdi-7-b', key: 'B', text: '4 : 5' },
            { id: 'vdi-7-c', key: 'C', text: '3 : 4' },
            { id: 'vdi-7-d', key: 'D', text: '2 : 3' },
            { id: 'vdi-7-e', key: 'E', text: '5 : 6' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Percentage in Medical = 20%.',
              'Percentage in Commerce = 25%.',
              'Since total base is the same, Ratio = 20% : 25% = 20 : 25 = 4 : 5.'
            ],
            shortcutMethod: 'Direct ratio of percentages: 20 : 25 = 4 : 5.',
            isFacultyVerified: true
          }
        },
        // Q8 (Pie Chart)
        {
          id: 'vdi-q8',
          questionNumber: 8,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Pie Chart',
          type: 'MCQ_5_OPTION',
          statement: 'What is the difference between the number of students enrolled in Engineering and those enrolled in Arts?',
          groupId: 'group-visual-pie-1',
          group: pieChartGroup,
          options: [
            { id: 'vdi-8-a', key: 'A', text: '500' },
            { id: 'vdi-8-b', key: 'B', text: '650' },
            { id: 'vdi-8-c', key: 'C', text: '750' },
            { id: 'vdi-8-d', key: 'D', text: '800' },
            { id: 'vdi-8-e', key: 'E', text: '950' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Percentage in Engineering = 30%.',
              'Percentage in Arts = 15%.',
              'Difference in percentage = 30% - 15% = 15%.',
              'Difference in number = 15% of 5,000 = 0.15 × 5,000 = 750.'
            ],
            shortcutMethod: '(30 - 15)% of 5000 = 15% of 5000 = 750.',
            isFacultyVerified: true
          }
        },
        // Q9 (Pie Chart)
        {
          id: 'vdi-q9',
          questionNumber: 9,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Pie Chart',
          type: 'MCQ_5_OPTION',
          statement: 'The number of students in the Arts course is what percent of the number of students in the Commerce course?',
          groupId: 'group-visual-pie-1',
          group: pieChartGroup,
          options: [
            { id: 'vdi-9-a', key: 'A', text: '40%' },
            { id: 'vdi-9-b', key: 'B', text: '50%' },
            { id: 'vdi-9-c', key: 'C', text: '60%' },
            { id: 'vdi-9-d', key: 'D', text: '75%' },
            { id: 'vdi-9-e', key: 'E', text: '80%' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Arts percentage = 15%.',
              'Commerce percentage = 25%.',
              'Required Percentage = (15 / 25) × 100 = (3 / 5) × 100 = 60%.'
            ],
            shortcutMethod: '15 / 25 = 3 / 5 = 60%.',
            isFacultyVerified: true
          }
        },
        // Q10 (Pie Chart)
        {
          id: 'vdi-q10',
          questionNumber: 10,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Pie Chart',
          type: 'MCQ_5_OPTION',
          statement: 'If 20% of the students in the Medical course are girls, how many boys are enrolled in the Medical course?',
          groupId: 'group-visual-pie-1',
          group: pieChartGroup,
          options: [
            { id: 'vdi-10-a', key: 'A', text: '600' },
            { id: 'vdi-10-b', key: 'B', text: '700' },
            { id: 'vdi-10-c', key: 'C', text: '800' },
            { id: 'vdi-10-d', key: 'D', text: '900' },
            { id: 'vdi-10-e', key: 'E', text: '1,000' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Total students in Medical = 20% of 5,000 = 1,000 students.',
              'Percentage of boys = 100% - 20% = 80%.',
              'Number of boys = 80% of 1,000 = 0.80 × 1,000 = 800.'
            ],
            shortcutMethod: 'Medical = 1000. Boys = 80% of 1000 = 800.',
            isFacultyVerified: true
          }
        },
        // Q11 (Line Graph)
        {
          id: 'vdi-q11',
          questionNumber: 11,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Line Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the total profit earned by the firm over the five given years? (In Lakhs)',
          groupId: 'group-visual-line-1',
          group: lineGraphGroup,
          options: [
            { id: 'vdi-11-a', key: 'A', text: '35' },
            { id: 'vdi-11-b', key: 'B', text: '40' },
            { id: 'vdi-11-c', key: 'C', text: '45' },
            { id: 'vdi-11-d', key: 'D', text: '50' },
            { id: 'vdi-11-e', key: 'E', text: '55' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'Formula: Profit = Income - Expenditure.',
              '2018 Profit: 50 - 40 = 10 Lakhs',
              '2019 Profit: 60 - 55 = 5 Lakhs',
              '2020 Profit: 75 - 60 = 15 Lakhs',
              '2021 Profit: 70 - 65 = 5 Lakhs',
              '2022 Profit: 90 - 80 = 10 Lakhs',
              'Total Profit = 10 + 5 + 15 + 5 + 10 = 45 Lakhs.'
            ],
            shortcutMethod: 'Sum of profits: 10 + 5 + 15 + 5 + 10 = 45 Lakhs.',
            isFacultyVerified: true
          }
        },
        // Q12 (Line Graph)
        {
          id: 'vdi-q12',
          questionNumber: 12,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Line Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the average Income of the firm over the period of five years? (In Lakhs)',
          groupId: 'group-visual-line-1',
          group: lineGraphGroup,
          options: [
            { id: 'vdi-12-a', key: 'A', text: '65' },
            { id: 'vdi-12-b', key: 'B', text: '67' },
            { id: 'vdi-12-c', key: 'C', text: '69' },
            { id: 'vdi-12-d', key: 'D', text: '71' },
            { id: 'vdi-12-e', key: 'E', text: '75' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Incomes (in Lakhs):',
              '2018: 50, 2019: 60, 2020: 75, 2021: 70, 2022: 90',
              'Total Income = 50 + 60 + 75 + 70 + 90 = 345 Lakhs.',
              'Average Income = 345 / 5 = 69 Lakhs.'
            ],
            shortcutMethod: '345 / 5 = 69 Lakhs.',
            isFacultyVerified: true
          }
        },
        // Q13 (Line Graph)
        {
          id: 'vdi-q13',
          questionNumber: 13,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Line Graph',
          type: 'MCQ_5_OPTION',
          statement: 'The Profit Percentage of the firm in 2020 was:\n(Profit % = (Profit / Expenditure) × 100)',
          groupId: 'group-visual-line-1',
          group: lineGraphGroup,
          options: [
            { id: 'vdi-13-a', key: 'A', text: '20%' },
            { id: 'vdi-13-b', key: 'B', text: '25%' },
            { id: 'vdi-13-c', key: 'C', text: '30%' },
            { id: 'vdi-13-d', key: 'D', text: '33.33%' },
            { id: 'vdi-13-e', key: 'E', text: '15%' }
          ],
          correctOptionKey: 'B',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'MODERATE',
          solution: {
            stepByStep: [
              'In 2020: Income = 75 Lakhs, Expenditure = 60 Lakhs.',
              'Profit = 75 - 60 = 15 Lakhs.',
              'Profit Percentage = (Profit / Expenditure) × 100',
              'Profit % = (15 / 60) × 100 = (1 / 4) × 100 = 25%.'
            ],
            shortcutMethod: '15 / 60 = 1 / 4 = 25%.',
            isFacultyVerified: true
          }
        },
        // Q14 (Line Graph)
        {
          id: 'vdi-q14',
          questionNumber: 14,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Line Graph',
          type: 'MCQ_5_OPTION',
          statement: 'What is the respective ratio of the Income in 2018 to the Expenditure in 2022?',
          groupId: 'group-visual-line-1',
          group: lineGraphGroup,
          options: [
            { id: 'vdi-14-a', key: 'A', text: '3 : 5' },
            { id: 'vdi-14-b', key: 'B', text: '4 : 7' },
            { id: 'vdi-14-c', key: 'C', text: '5 : 8' },
            { id: 'vdi-14-d', key: 'D', text: '5 : 7' },
            { id: 'vdi-14-e', key: 'E', text: '7 : 8' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Income in 2018 = 50 Lakhs.',
              'Expenditure in 2022 = 80 Lakhs.',
              'Respective Ratio = 50 : 80 = 5 : 8.'
            ],
            shortcutMethod: '50 / 80 = 5 : 8.',
            isFacultyVerified: true
          }
        },
        // Q15 (Line Graph)
        {
          id: 'vdi-q15',
          questionNumber: 15,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Data Interpretation',
          subtopic: 'Line Graph',
          type: 'MCQ_5_OPTION',
          statement: 'In which year did the firm record the maximum profit?',
          groupId: 'group-visual-line-1',
          group: lineGraphGroup,
          options: [
            { id: 'vdi-15-a', key: 'A', text: '2018' },
            { id: 'vdi-15-b', key: 'B', text: '2019' },
            { id: 'vdi-15-c', key: 'C', text: '2020' },
            { id: 'vdi-15-d', key: 'D', text: '2021' },
            { id: 'vdi-15-e', key: 'E', text: '2022' }
          ],
          correctOptionKey: 'C',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          difficulty: 'EASY',
          solution: {
            stepByStep: [
              'Calculate profit for each year (Income - Expenditure):',
              '2018: 50 - 40 = 10 Lakhs',
              '2019: 60 - 55 = 5 Lakhs',
              '2020: 75 - 60 = 15 Lakhs (Maximum)',
              '2021: 70 - 65 = 5 Lakhs',
              '2022: 90 - 80 = 10 Lakhs',
              'The maximum profit was 15 Lakhs in the year 2020.'
            ],
            shortcutMethod: 'Widest vertical gap between blue solid line and red dashed line is at 2020 (gap = 15).',
            isFacultyVerified: true
          }
        }
      ]
    }
  ]
};
