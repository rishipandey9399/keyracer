const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

// Sample challenges data
const sampleChallenges = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    language: "python",
    category: "arrays",
    points: 10,
    starterCode: `def two_sum(nums, target):
    """
    Find two numbers in the array that add up to target
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        List of two indices
    """
    # Your code here
    pass`,
    solution: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] }
    ],
    timeLimit: 300000
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    difficulty: "easy",
    language: "python",
    category: "strings",
    points: 10,
    starterCode: `def reverse_string(s):
    """
    Reverse the input string in-place
    
    Args:
        s: List of characters
    
    Returns:
        None (modify in-place)
    """
    # Your code here
    pass`,
    solution: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
    testCases: [
      { input: { s: ['h','e','l','l','o'] }, expectedOutput: ['o','l','l','e','h'] },
      { input: { s: ['H','a','n','n','a','h'] }, expectedOutput: ['h','a','n','n','a','H'] }
    ],
    timeLimit: 180000
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "medium",
    language: "python",
    category: "data-structures",
    points: 30,
    starterCode: `def is_valid(s):
    """
    Check if parentheses are valid
    
    Args:
        s: String containing brackets
    
    Returns:
        Boolean indicating if valid
    """
    # Your code here
    pass`,
    solution: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    testCases: [
      { input: { s: "()" }, expectedOutput: true },
      { input: { s: "()[]{}" }, expectedOutput: true },
      { input: { s: "(]" }, expectedOutput: false },
      { input: { s: "([)]" }, expectedOutput: false }
    ],
    timeLimit: 240000
  },
  {
    title: "Fibonacci Sequence",
    description: "Calculate the nth Fibonacci number using dynamic programming.",
    difficulty: "medium",
    language: "python",
    category: "dynamic-programming",
    points: 30,
    starterCode: `def fibonacci(n):
    """
    Calculate the nth Fibonacci number
    
    Args:
        n: Integer position in sequence
    
    Returns:
        nth Fibonacci number
    """
    # Your code here
    pass`,
    solution: `def fibonacci(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
    testCases: [
      { input: { n: 0 }, expectedOutput: 0 },
      { input: { n: 1 }, expectedOutput: 1 },
      { input: { n: 10 }, expectedOutput: 55 },
      { input: { n: 15 }, expectedOutput: 610 }
    ],
    timeLimit: 300000
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    difficulty: "hard",
    language: "python",
    category: "data-structures",
    points: 50,
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(l1, l2):
    """
    Merge two sorted linked lists
    
    Args:
        l1: First sorted linked list
        l2: Second sorted linked list
    
    Returns:
        Merged sorted linked list
    """
    # Your code here
    pass`,
    solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next`,
    testCases: [
      { input: { l1: [1,2,4], l2: [1,3,4] }, expectedOutput: [1,1,2,3,4,4] },
      { input: { l1: [], l2: [] }, expectedOutput: [] },
      { input: { l1: [], l2: [0] }, expectedOutput: [0] }
    ],
    timeLimit: 360000
  },
  // Java challenges
  {
    title: "Hello World",
    description: "Write a simple Hello World program in Java.",
    difficulty: "easy",
    language: "java",
    category: "basics",
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
    solution: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    testCases: [
      { input: {}, expectedOutput: "Hello World" }
    ],
    timeLimit: 120000
  },
  {
    title: "Array Sum",
    description: "Calculate the sum of all elements in an integer array.",
    difficulty: "easy",
    language: "java",
    category: "arrays",
    points: 10,
    starterCode: `public class Solution {
    public int arraySum(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    solution: `public class Solution {
    public int arraySum(int[] nums) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        return sum;
    }
}`,
    testCases: [
      { input: { nums: [1, 2, 3, 4, 5] }, expectedOutput: 15 },
      { input: { nums: [-1, 0, 1] }, expectedOutput: 0 },
      { input: { nums: [10] }, expectedOutput: 10 }
    ],
    timeLimit: 180000
  },
  // JavaScript challenges
  {
    title: "Palindrome Check",
    description: "Check if a string is a palindrome (reads the same forwards and backwards).",
    difficulty: "easy",
    language: "javascript",
    category: "strings",
    points: 10,
    starterCode: `function isPalindrome(s) {
    // Your code here
    return false;
}`,
    solution: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,
    testCases: [
      { input: { s: "racecar" }, expectedOutput: true },
      { input: { s: "hello" }, expectedOutput: false },
      { input: { s: "A man a plan a canal Panama" }, expectedOutput: true }
    ],
    timeLimit: 240000
  }
];

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/keyracer');
    console.log('Connected to MongoDB');
    
    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');
    
    // Insert sample challenges
    const insertedChallenges = await Challenge.insertMany(sampleChallenges);
    console.log(`Inserted ${insertedChallenges.length} challenges`);
    
    // Display inserted challenges
    insertedChallenges.forEach((challenge, index) => {
      console.log(`${index + 1}. ${challenge.title} (${challenge.difficulty} - ${challenge.language})`);
    });
    
    console.log('Challenge seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedChallenges();
}

module.exports = { seedChallenges, sampleChallenges };
