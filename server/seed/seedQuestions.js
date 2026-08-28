export const aptitudeQuestionsData = [
  {
    category: 'Quantitative',
    subcategory: 'Time and Work',
    difficulty: 'Easy',
    question: 'A can complete a project in 12 days and B can do it in 18 days. If they work together, in how many days will the project be completed?',
    options: ['6.5 days', '7.2 days', '8.0 days', '9.0 days'],
    correctOptionIndex: 1,
    explanation: 'Work done by A in 1 day = 1/12. B in 1 day = 1/18. Combined = (1/12) + (1/18) = 5/36. Total days = 36/5 = 7.2 days.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Speed and Distance',
    difficulty: 'Medium',
    question: 'A train 180 meters long is traveling at 54 km/h. How many seconds will it take to cross an electric pole?',
    options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
    correctOptionIndex: 1,
    explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = 180 / 15 = 12 seconds.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Profit and Loss',
    difficulty: 'Easy',
    question: 'An article bought for ₹450 is sold at a profit of 20%. What is its selling price?',
    options: ['₹520', '₹540', '₹550', '₹560'],
    correctOptionIndex: 1,
    explanation: 'Profit = 20% of 450 = ₹90. Selling Price = 450 + 90 = ₹540.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Percentages',
    difficulty: 'Medium',
    question: 'If the price of sugar increases by 25%, by what percentage must a family reduce sugar consumption to keep expenditure unchanged?',
    options: ['15%', '20%', '25%', '30%'],
    correctOptionIndex: 1,
    explanation: 'Reduction % = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 20%.'
  },
  {
    category: 'Logical',
    subcategory: 'Number Series',
    difficulty: 'Easy',
    question: 'Look at this series: 2, 6, 12, 20, 30, ... What number should come next?',
    options: ['40', '42', '44', '48'],
    correctOptionIndex: 1,
    explanation: 'Differences between terms: 4, 6, 8, 10, 12. Next term = 30 + 12 = 42.'
  },
  {
    category: 'Logical',
    subcategory: 'Blood Relations',
    difficulty: 'Medium',
    question: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?',
    options: ['Father', 'Uncle', 'Grandfather', 'Brother'],
    correctOptionIndex: 1,
    explanation: 'Daughter\'s father = Deepak. Father of Deepak = Deepak\'s father. Brother of Deepak\'s father = Deepak\'s Uncle.'
  },
  {
    category: 'Verbal',
    subcategory: 'Synonyms',
    difficulty: 'Easy',
    question: 'Choose the word that is most nearly similar in meaning to PRAGMATIC:',
    options: ['Theoretical', 'Practical', 'Arrogant', 'Pessimistic'],
    correctOptionIndex: 1,
    explanation: 'Pragmatic means practical, sensible, and realistic.'
  },
  {
    category: 'Verbal',
    subcategory: 'Sentence Correction',
    difficulty: 'Medium',
    question: 'Identify the grammatically correct sentence:',
    options: [
      'Neither the manager nor the employees was aware of the delay.',
      'Neither the manager nor the employees were aware of the delay.',
      'Neither the manager or the employees was aware of the delay.',
      'Neither the manager nor the employees are been aware of the delay.'
    ],
    correctOptionIndex: 1,
    explanation: 'Verb agrees with the nearer subject "employees" (plural), so "were aware" is correct.'
  },
  {
    category: 'Data Interpretation',
    subcategory: 'Percentages & Growth',
    difficulty: 'Medium',
    question: 'Company revenue grew from $40M in 2023 to $52M in 2024. What is the percentage increase in revenue?',
    options: ['25%', '30%', '35%', '40%'],
    correctOptionIndex: 1,
    explanation: 'Growth % = [(52 - 40) / 40] * 100 = (12/40) * 100 = 30%.'
  },
  {
    category: 'Data Interpretation',
    subcategory: 'Pie Charts',
    difficulty: 'Easy',
    question: 'In a college budget pie chart, Tuition accounts for 108 degrees out of 360 degrees. What percentage of the budget is Tuition?',
    options: ['25%', '28%', '30%', '33.3%'],
    correctOptionIndex: 2,
    explanation: 'Percentage = (108 / 360) * 100 = 30%.'
  }
];

export const codingQuestionsData = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    inputFormat: 'nums = [2,7,11,15], target = 9',
    outputFormat: '[0, 1]',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9' }],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' }
    ],
    solutionApproach: 'Use Hash Map for O(N) single-pass lookup.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stacks',
    description: 'Given a string s containing just the characters ( ), { }, [ ], determine if the input string is valid.',
    inputFormat: 's = "()[]{}"',
    outputFormat: 'true',
    examples: [{ input: 's = "()"', output: 'true', explanation: 'Valid matching pairs' }],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (stack.pop() !== pairs[c]) return false;\n  }\n  return stack.length === 0;\n}`
    },
    testCases: [{ input: '"()[]{}"', expectedOutput: 'true' }],
    solutionApproach: 'Stack-based matching of open and close delimiters.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    title: 'Maximum Subarray (Kadane)',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    inputFormat: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    outputFormat: '6',
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  let cur = nums[0], max = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    max = Math.max(max, cur);\n  }\n  return max;\n}`
    },
    testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }],
    solutionApproach: 'Kadanes algorithm computes max ending at current index in O(N).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  }
];

export const technicalQuestionsData = [
  {
    category: 'JavaScript',
    difficulty: 'Medium',
    question: 'Explain Event Loop, Microtask queue, and Macrotask queue in JavaScript.',
    answer: 'JavaScript is single-threaded. Async events are dispatched to Web APIs. Microtasks (Promises, queueMicrotask) take highest execution priority and drain completely before Macrotasks (setTimeout, setInterval, I/O) are run by the Event Loop.',
    codeSnippet: 'console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); // 1, 3, 2',
    frequentlyAskedBy: ['Google', 'Microsoft', 'Amazon']
  },
  {
    category: 'React',
    difficulty: 'Medium',
    question: 'What is the Virtual DOM and how does React reconciliation work?',
    answer: 'Virtual DOM is an in-memory lightweight representation of the real DOM. React diffs the old and new VDOM trees and computes the minimal set of DOM operations required.',
    frequentlyAskedBy: ['Meta', 'Uber', 'Zomato']
  },
  {
    category: 'DBMS',
    difficulty: 'Hard',
    question: 'Explain Database Indexing and how B+ Trees optimize read operations.',
    answer: 'Indexes maintain sorted key pointers allowing logarithmic O(log N) tree traversal instead of O(N) full table scans.',
    frequentlyAskedBy: ['Oracle', 'Google', 'Microsoft']
  }
];

export const hrQuestionsData = [
  {
    question: 'Tell me about yourself and your key technical achievements.',
    category: 'Personal Background',
    sampleAnswer: 'I am a final-year Computer Science student passionate about distributed systems and full-stack software development. I have built full-stack applications with MERN stack, solved 250+ DSA questions, and completed an engineering internship.',
    tips: ['Keep it under 90 seconds', 'Highlight relevant technical projects and metrics']
  },
  {
    question: 'Describe a challenging technical obstacle you faced in a project and how you solved it.',
    category: 'Behavioral & Problem Solving',
    sampleAnswer: 'In my placement preparation portal, high mock quiz traffic created API latency spikes. I analyzed queries, added composite MongoDB indexes, and cached test questions, reducing latency by 85%.',
    tips: ['Use STAR framework (Situation, Task, Action, Result)', 'Quantify impact with concrete percentages']
  }
];