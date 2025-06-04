const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Challenge = require('../models/Challenge');
const connectDB = require('../utils/dbConnect');

const sampleChallenges = [
  // Easy Challenges
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: "easy",
    language: "python",
    category: "arrays",
    starterCode: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
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
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
      { input: [[3, 3], 6], expectedOutput: [0, 1] }
    ],
    timeLimit: 5000,
    memoryLimit: 256,
    createdBy: null // Will be set to admin user ID
  },
  {
    title: "Palindrome Check",
    description: `Write a function to check if a given string is a palindrome (reads the same backward as forward).

Example:
Input: "racecar"
Output: true

Input: "hello"
Output: false`,
    difficulty: "easy",
    language: "javascript",
    category: "strings",
    starterCode: `function isPalindrome(s) {
    // Your code here
}`,
    solution: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,
    testCases: [
      { input: ["racecar"], expectedOutput: true },
      { input: ["hello"], expectedOutput: false },
      { input: ["A man a plan a canal Panama"], expectedOutput: true },
      { input: ["race a car"], expectedOutput: false }
    ],
    timeLimit: 3000,
    memoryLimit: 128
  },
  {
    title: "FizzBuzz",
    description: `Write a program that prints the numbers from 1 to n. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

Example:
Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]`,
    difficulty: "easy",
    language: "java",
    category: "algorithms",
    starterCode: `import java.util.*;

public class Solution {
    public List<String> fizzBuzz(int n) {
        // Your code here
    }
}`,
    solution: `import java.util.*;

public class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) {
                result.add("FizzBuzz");
            } else if (i % 3 == 0) {
                result.add("Fizz");
            } else if (i % 5 == 0) {
                result.add("Buzz");
            } else {
                result.add(String.valueOf(i));
            }
        }
        return result;
    }
}`,
    testCases: [
      { input: [3], expectedOutput: ["1", "2", "Fizz"] },
      { input: [5], expectedOutput: ["1", "2", "Fizz", "4", "Buzz"] },
      { input: [15], expectedOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] }
    ],
    timeLimit: 4000,
    memoryLimit: 256
  },

  // Medium Challenges
  {
    title: "Binary Tree Level Order Traversal",
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]`,
    difficulty: "medium",
    language: "python",
    category: "data-structures",
    starterCode: `# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    """
    :type root: TreeNode
    :rtype: List[List[int]]
    """
    # Your code here
    pass`,
    solution: `from collections import deque

def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_nodes = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level_nodes.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_nodes)
    
    return result`,
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expectedOutput: [[3],[9,20],[15,7]] },
      { input: [[1]], expectedOutput: [[1]] },
      { input: [[]], expectedOutput: [] }
    ],
    timeLimit: 6000,
    memoryLimit: 512
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
    difficulty: "medium",
    language: "cpp",
    category: "strings",
    starterCode: `#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your code here
    }
};`,
    solution: `#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> seen;
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < s.length(); right++) {
            while (seen.count(s[right])) {
                seen.erase(s[left]);
                left++;
            }
            seen.insert(s[right]);
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};`,
    testCases: [
      { input: ["abcabcbb"], expectedOutput: 3 },
      { input: ["bbbbb"], expectedOutput: 1 },
      { input: ["pwwkew"], expectedOutput: 3 },
      { input: [""], expectedOutput: 0 }
    ],
    timeLimit: 8000,
    memoryLimit: 512
  },

  // Hard Challenges
  {
    title: "Merge k Sorted Lists",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]`,
    difficulty: "hard",
    language: "python",
    category: "data-structures",
    starterCode: `# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    """
    :type lists: List[ListNode]
    :rtype: ListNode
    """
    # Your code here
    pass`,
    solution: `import heapq

def mergeKLists(lists):
    if not lists:
        return None
    
    heap = []
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next`,
    testCases: [
      { input: [[[1,4,5],[1,3,4],[2,6]]], expectedOutput: [1,1,2,3,4,4,5,6] },
      { input: [[]], expectedOutput: [] },
      { input: [[[]], expectedOutput: [] }
    ],
    timeLimit: 10000,
    memoryLimit: 1024
  },

  // Expert Challenge
  {
    title: "Median of Two Sorted Arrays",
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

Example:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.`,
    difficulty: "expert",
    language: "python",
    category: "algorithms",
    starterCode: `def findMedianSortedArrays(nums1, nums2):
    """
    :type nums1: List[int]
    :type nums2: List[int]
    :rtype: float
    """
    # Your code here
    pass`,
    solution: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    
    while left <= right:
        partition1 = (left + right) // 2
        partition2 = (m + n + 1) // 2 - partition1
        
        max_left1 = float('-inf') if partition1 == 0 else nums1[partition1 - 1]
        min_right1 = float('inf') if partition1 == m else nums1[partition1]
        
        max_left2 = float('-inf') if partition2 == 0 else nums2[partition2 - 1]
        min_right2 = float('inf') if partition2 == n else nums2[partition2]
        
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            if (m + n) % 2 == 0:
                return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0
            else:
                return max(max_left1, max_left2)
        elif max_left1 > min_right2:
            right = partition1 - 1
        else:
            left = partition1 + 1
    
    raise ValueError("Input arrays are not sorted")`,
    testCases: [
      { input: [[1,3], [2]], expectedOutput: 2.0 },
      { input: [[1,2], [3,4]], expectedOutput: 2.5 },
      { input: [[0,0], [0,0]], expectedOutput: 0.0 }
    ],
    timeLimit: 15000,
    memoryLimit: 1024
  }
];

async function seedChallenges() {
  try {
    console.log('🌱 Starting challenge seeding...');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️  Cleared existing challenges');

    // Insert sample challenges
    const insertedChallenges = await Challenge.insertMany(sampleChallenges);
    console.log(`✅ Successfully seeded ${insertedChallenges.length} challenges`);

    // Log summary by difficulty
    const summary = await Challenge.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          languages: { $addToSet: '$language' },
          categories: { $addToSet: '$category' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Seeding Summary:');
    summary.forEach(({ _id, count, languages, categories }) => {
      console.log(`  ${_id.toUpperCase()}: ${count} challenges`);
      console.log(`    Languages: ${languages.join(', ')}`);
      console.log(`    Categories: ${categories.join(', ')}`);
    });

    console.log('\n🎉 Challenge seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedChallenges()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedChallenges, sampleChallenges };
