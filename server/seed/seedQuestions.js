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
    category: 'Quantitative',
    subcategory: 'Simple Interest',
    difficulty: 'Easy',
    question: 'A sum of ₹10,000 is invested at 8% per annum simple interest. What is the interest earned after 3 years?',
    options: ['₹2,400', '₹2,500', '₹2,600', '₹2,800'],
    correctOptionIndex: 0,
    explanation: 'SI = (P * R * T) / 100 = (10000 * 8 * 3) / 100 = ₹2,400.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Compound Interest',
    difficulty: 'Medium',
    question: 'What will be the compound interest on ₹25,000 at the rate of 10% per annum for 2 years?',
    options: ['₹5,000', '₹5,250', '₹5,500', '₹6,000'],
    correctOptionIndex: 1,
    explanation: 'Amount = 25000 * (1 + 10/100)^2 = 25000 * 1.21 = ₹30,250. CI = Amount - Principal = 30250 - 25000 = ₹5,250.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Ratio and Proportion',
    difficulty: 'Easy',
    question: 'Two numbers are in the ratio 3:5. If 9 is subtracted from each, the ratio becomes 12:23. What is the smaller number?',
    options: ['27', '33', '49', '55'],
    correctOptionIndex: 1,
    explanation: 'Let numbers be 3x and 5x. (3x - 9)/(5x - 9) = 12/23 => 23(3x - 9) = 12(5x - 9) => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number = 3x = 33.'
  },
  {
    category: 'Quantitative',
    subcategory: 'Probability',
    difficulty: 'Medium',
    question: 'Three unbiased coins are tossed. What is the probability of getting at least two heads?',
    options: ['1/8', '3/8', '1/2', '5/8'],
    correctOptionIndex: 2,
    explanation: 'Total outcomes = 2^3 = 8. Favorable outcomes (at least 2 heads): {HHH, HHT, HTH, THH} = 4. Probability = 4/8 = 1/2.'
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
    category: 'Logical',
    subcategory: 'Syllogisms',
    difficulty: 'Medium',
    question: 'Statements: All mangoes are golden-colored. No golden-colored things are cheap. Conclusions: I. All mangoes are cheap. II. Golden-colored mangoes are not cheap.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctOptionIndex: 1,
    explanation: 'Since all mangoes are golden-colored and no golden-colored is cheap, it follows that no mango is cheap. Conclusion II follows directly.'
  },
  {
    category: 'Logical',
    subcategory: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'If CODES is written as DPEFT in a certain code language, how will SYSTEM be written in that language?',
    options: ['TZTUDN', 'TZTUFN', 'TZUVEN', 'TUTVFN'],
    correctOptionIndex: 1,
    explanation: 'Each letter is shifted by +1: S->T, Y->Z, S->T, T->U, E->F, M->N. So the coded word is TZTUFN.'
  },
  {
    category: 'Logical',
    subcategory: 'Clocks',
    difficulty: 'Hard',
    question: 'At what angle are the hands of a clock inclined at 15 minutes past 5?',
    options: ['58.5 degrees', '67.5 degrees', '72.5 degrees', '75 degrees'],
    correctOptionIndex: 1,
    explanation: 'Angle = |(30 * H) - (5.5 * M)| = |(30 * 5) - (5.5 * 15)| = |150 - 82.5| = 67.5 degrees.'
  },
  {
    category: 'Logical',
    subcategory: 'Directions',
    difficulty: 'Easy',
    question: 'A man walks 5 km East, turns right and walks 4 km, then turns left and walks 5 km. Which direction is he facing now?',
    options: ['North', 'South', 'East', 'West'],
    correctOptionIndex: 2,
    explanation: 'He starts facing East. Turns right (now facing South). Turns left (now facing East again). He is facing East.'
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
    category: 'Verbal',
    subcategory: 'Antonyms',
    difficulty: 'Easy',
    question: 'Choose the word that is most opposite in meaning to EPHEMERAL:',
    options: ['Transient', 'Eternal', 'Weak', 'Artistic'],
    correctOptionIndex: 1,
    explanation: 'Ephemeral means short-lived or transient. The opposite is eternal (long-lasting/permanent).'
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
  },
  {
    category: 'Data Interpretation',
    subcategory: 'Tables',
    difficulty: 'Medium',
    question: 'In a table showing monthly cell phone sales: Jan=120, Feb=150, Mar=180. What is the average monthly growth rate in sales over this period?',
    options: ['20%', '22.5%', '25%', '30%'],
    correctOptionIndex: 1,
    explanation: 'Growth Jan to Feb = (30/120)*100 = 25%. Feb to Mar = (30/150)*100 = 20%. Average growth = (25% + 20%)/2 = 22.5%.'
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
      javascript: `function isValid(s) {\n  const stack = [];\n  const pairs = { \')\': \'(\', \'}\': \'{\', \']\': \'[\' };\n  for (const c of s) {\n    if (c === \'(\' || c === \'{\' || c === \'[\') stack.push(c);\n    else if (stack.pop() !== pairs[c]) return false;\n  }\n  return stack.length === 0;\n}`
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
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    inputFormat: 's = ["h","e","l","l","o"]',
    outputFormat: '["o","l","l","e","h"]',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    constraints: ['1 <= s.length <= 10^5'],
    starterCode: {
      javascript: `function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    const temp = s[left];\n    s[left] = s[right];\n    s[right] = temp;\n    left++;\n    right--;\n  }\n  return s;\n}`
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' }
    ],
    solutionApproach: 'Use two-pointer swap approach for O(1) extra space.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    category: 'Trees',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    inputFormat: 'root = [4,2,7,1,3,6,9]',
    outputFormat: '[4,7,2,9,6,3,1]',
    examples: [{ input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }],
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
    starterCode: {
      javascript: `function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}`
    },
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' }
    ],
    solutionApproach: 'Pre-order traversal swaps subtrees recursively.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)'
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    inputFormat: 'n = 3',
    outputFormat: '3',
    examples: [{ input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, 2+1.' }],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let first = 1, second = 2;\n  for (let i = 3; i <= n; i++) {\n    const third = first + second;\n    first = second;\n    second = third;\n  }\n  return second;\n}`
    },
    testCases: [
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' }
    ],
    solutionApproach: 'Compute Fibonacci sequence iteratively in O(N) time and O(1) space.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    title: 'Merge Sorted Array',
    slug: 'merge-sorted-array',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.',
    inputFormat: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
    outputFormat: '[1,2,2,3,5,6]',
    examples: [{ input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' }],
    constraints: ['nums1.length == m + n', '0 <= m, n <= 200'],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {\n  let i = m - 1, j = n - 1, k = m + n - 1;\n  while (j >= 0) {\n    if (i >= 0 && nums1[i] > nums2[j]) {\n      nums1[k] = nums1[i];\n      i--;\n    } else {\n      nums1[k] = nums2[j];\n      j--;\n    }\n    k--;\n  }\n  return nums1;\n}`
    },
    testCases: [{ input: '[1,2,3,0,0,0], 3, [2,5,6], 3', expectedOutput: '[1,2,2,3,5,6]' }],
    solutionApproach: 'Three-pointer traverse backwards to save auxiliary space.',
    timeComplexity: 'O(M + N)',
    spaceComplexity: 'O(1)'
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    difficulty: 'Medium',
    category: 'Stacks',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    inputFormat: 'head = [3,2,0,-4], pos = 1',
    outputFormat: 'true',
    examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle where tail connects to second node.' }],
    constraints: ['Number of nodes is in range [0, 10^4].'],
    starterCode: {
      javascript: `function hasCycle(head) {\n  if (!head || !head.next) return false;\n  let slow = head, fast = head.next;\n  while (slow !== fast) {\n    if (!fast || !fast.next) return false;\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return true;\n}`
    },
    testCases: [{ input: '[3,2,0,-4], 1', expectedOutput: 'true' }],
    solutionApproach: 'Floyds cycle-finding algorithm (tortoise and hare).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Strings',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 's = "abcabcbb"',
    outputFormat: '3',
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, left = 0;\n  const seen = new Set();\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[left]);\n      left++;\n    }\n    seen.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`
    },
    testCases: [{ input: '"abcabcbb"', expectedOutput: '3' }],
    solutionApproach: 'Sliding window using a Set for unique characters lookup.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(M, N))'
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    inputFormat: 'nums = [-1,0,3,5,9,12], target = 9',
    outputFormat: '4',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' }],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4'],
    starterCode: {
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`
    },
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' }
    ],
    solutionApproach: 'Logarithmic lookup halving search search space iteratively.',
    timeComplexity: 'O(log N)',
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
  },
  {
    category: 'System Design',
    difficulty: 'Medium',
    question: 'Compare REST APIs vs GraphQL APIs. When should you use which?',
    answer: 'REST exposes resources via dedicated URI endpoints (GET, POST, etc.) and can lead to over/under-fetching. GraphQL offers a single endpoint where clients request specific fields via query schemas, ideal for bandwidth-constrained clients or rapid client iterations.',
    frequentlyAskedBy: ['GitHub', 'Meta', 'Netflix']
  },
  {
    category: 'SQL & Databases',
    difficulty: 'Easy',
    question: 'Explain the difference between INNER JOIN, LEFT JOIN, and FULL JOIN.',
    answer: 'INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (nulls otherwise). FULL JOIN returns all rows from both tables, filling nulls for unmatched keys.',
    frequentlyAskedBy: ['Amazon', 'Walmart', 'Oracle']
  },
  {
    category: 'DBMS',
    difficulty: 'Medium',
    question: 'Explain the ACID properties in databases.',
    answer: 'Atomicity (all or nothing), Consistency (preserves integrity), Isolation (concurrent execution matches sequential), and Durability (transactions persist even on crashes).',
    frequentlyAskedBy: ['Goldman Sachs', 'J.P. Morgan', 'Microsoft']
  },
  {
    category: 'Networks',
    difficulty: 'Medium',
    question: 'What is the difference between TCP and UDP protocols?',
    answer: 'TCP is connection-oriented, reliable (performs handshakes, retries, flow control), and orders packets (used in HTTP, SSH). UDP is connectionless, fast, has lower overhead, but does not guarantee packet delivery (used in video calls, gaming).',
    frequentlyAskedBy: ['Cisco', 'Google', 'Amazon']
  },
  {
    category: 'Web Technology',
    difficulty: 'Medium',
    question: 'What happens behind the scenes when you type a URL into a web browser?',
    answer: 'DNS lookup resolves domain to IP address -> TCP handshake -> SSL/TLS handshake for HTTPS -> HTTP request sent -> Server processes and returns HTML response -> Browser renders DOM/CSSOM and executes JavaScript.',
    frequentlyAskedBy: ['Google', 'Cloudflare', 'Yahoo']
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
  },
  {
    question: 'Why should we hire you over other candidates?',
    category: 'Behavioral & Fit',
    sampleAnswer: 'Beyond solid DSA skills, I have full-stack product building experience (handling deployment, authentication, and compilers). I am self-driven, learn quickly, and can contribute to production codebases with minimal hand-holding.',
    tips: ['Align your core strengths with the company values', 'Focus on adaptability and quick onboarding capability']
  },
  {
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Aspirations',
    sampleAnswer: 'I want to mature into a Senior Systems Architect, taking complete ownership of large-scale service design and mentoring junior developers, while staying closely aligned with emerging cloud technologies.',
    tips: ['Show enthusiasm for long-term growth', 'Do not mention immediate plans of higher studies or changing fields']
  },
  {
    question: 'Tell me about a time you had a conflict with a team member in a project. How did you resolve it?',
    category: 'Conflict Resolution',
    sampleAnswer: 'During a hackathon, a peer insisted on building a complex caching service despite tight deadlines. I set up a brief sync, drew a timeline comparing simplified vs custom cache approaches, and we mutually agreed to prioritize the MVP first.',
    tips: ['Do not speak negatively about the peer', 'Focus on objective compromise and team-first decisions']
  }
];