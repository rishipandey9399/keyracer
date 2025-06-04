#!/usr/bin/env python3
import json

# Complete challenges data with all 30 challenges
challenges_data = {
    "challenges": [
        {
            "_id": 1,
            "title": "Hello, World!",
            "description": "Write a program that prints \"Hello, World!\" to the console.",
            "examples": {
                "output": "Hello, World!"
            },
            "notes": [
                "The output must match exactly, including capitalization and punctuation",
                "Make sure to include the exclamation mark",
                "There should be no extra spaces or new lines"
            ],
            "testCases": [
                {
                    "input": "",
                    "expectedOutput": "Hello, World!"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Basics"
        },
        {
            "_id": 2,
            "title": "Even or Odd",
            "description": "Write a program that checks if a number is even or odd. Take user input and print 'Even' or 'Odd'.",
            "examples": {
                "output": "Enter a number: 4\\nEven"
            },
            "notes": [
                "Use the modulo operator (%) to check if a number is divisible by 2",
                "Print 'Even' for even numbers, 'Odd' for odd numbers",
                "Handle user input properly"
            ],
            "testCases": [
                {
                    "input": "4",
                    "expectedOutput": "Even"
                },
                {
                    "input": "7",
                    "expectedOutput": "Odd"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Basics"
        },
        {
            "_id": 3,
            "title": "Sum of First N Numbers",
            "description": "Input a number n and calculate the sum from 1 to n using a loop.",
            "examples": {
                "output": "Enter n: 5\\nSum: 15"
            },
            "notes": [
                "Use a for loop or while loop to calculate the sum",
                "Sum of 1 to n = 1 + 2 + 3 + ... + n",
                "For n=5: 1+2+3+4+5 = 15"
            ],
            "testCases": [
                {
                    "input": "5",
                    "expectedOutput": "15"
                },
                {
                    "input": "10",
                    "expectedOutput": "55"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Loops"
        },
        {
            "_id": 4,
            "title": "Factorial using Loop",
            "description": "Write a function to calculate the factorial of a number using a loop.",
            "examples": {
                "output": "Enter number: 5\\nFactorial: 120"
            },
            "notes": [
                "Factorial of n = n × (n-1) × (n-2) × ... × 1",
                "Factorial of 0 and 1 is 1",
                "Use a loop to calculate, not recursion"
            ],
            "testCases": [
                {
                    "input": "5",
                    "expectedOutput": "120"
                },
                {
                    "input": "0",
                    "expectedOutput": "1"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Functions"
        },
        {
            "_id": 5,
            "title": "Reverse a Number",
            "description": "Write a program to reverse the digits of a number.",
            "examples": {
                "output": "Enter number: 12345\\nReversed: 54321"
            },
            "notes": [
                "Extract digits from right to left",
                "Build the reversed number digit by digit",
                "Handle negative numbers appropriately"
            ],
            "testCases": [
                {
                    "input": "12345",
                    "expectedOutput": "54321"
                },
                {
                    "input": "100",
                    "expectedOutput": "1"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Numbers"
        },
        {
            "_id": 6,
            "title": "Check Palindrome Number",
            "description": "Verify if a number is a palindrome (reads the same forwards and backwards).",
            "examples": {
                "output": "Enter number: 121\\nPalindrome: True"
            },
            "notes": [
                "A palindrome number reads the same forwards and backwards",
                "Examples: 121, 1331, 12321",
                "Return True or False"
            ],
            "testCases": [
                {
                    "input": "121",
                    "expectedOutput": "True"
                },
                {
                    "input": "123",
                    "expectedOutput": "False"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Numbers"
        },
        {
            "_id": 7,
            "title": "Fibonacci Sequence",
            "description": "Print the first n numbers in the Fibonacci sequence.",
            "examples": {
                "output": "Enter n: 7\\n0 1 1 2 3 5 8"
            },
            "notes": [
                "Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, ...",
                "Each number is the sum of the two preceding ones",
                "Start with 0 and 1"
            ],
            "testCases": [
                {
                    "input": "5",
                    "expectedOutput": "0 1 1 2 3"
                },
                {
                    "input": "1",
                    "expectedOutput": "0"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Sequences"
        },
        {
            "_id": 8,
            "title": "Find Maximum of Three",
            "description": "Find the maximum among three user-input numbers.",
            "examples": {
                "output": "Enter three numbers: 10 25 15\\nMaximum: 25"
            },
            "notes": [
                "Compare all three numbers",
                "Handle cases where numbers might be equal",
                "Use if-else statements or built-in max() function"
            ],
            "testCases": [
                {
                    "input": "10 25 15",
                    "expectedOutput": "25"
                },
                {
                    "input": "5 5 5",
                    "expectedOutput": "5"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Comparisons"
        },
        {
            "_id": 9,
            "title": "Check for Prime",
            "description": "Determine whether a number is prime.",
            "examples": {
                "output": "Enter number: 17\\nPrime: True"
            },
            "notes": [
                "A prime number is only divisible by 1 and itself",
                "Numbers less than 2 are not prime",
                "Check divisibility up to square root of the number for efficiency"
            ],
            "testCases": [
                {
                    "input": "17",
                    "expectedOutput": "True"
                },
                {
                    "input": "15",
                    "expectedOutput": "False"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Numbers"
        },
        {
            "_id": 10,
            "title": "Count Digits in Number",
            "description": "Count the number of digits in a given number.",
            "examples": {
                "output": "Enter number: 12345\\nDigits: 5"
            },
            "notes": [
                "Count how many digits are in the number",
                "Handle negative numbers (ignore the minus sign)",
                "Zero has 1 digit"
            ],
            "testCases": [
                {
                    "input": "12345",
                    "expectedOutput": "5"
                },
                {
                    "input": "0",
                    "expectedOutput": "1"
                }
            ],
            "difficulty": "Beginner",
            "points": 10,
            "category": "Numbers"
        },
        {
            "_id": 11,
            "title": "Armstrong Number",
            "description": "Check if a number is an Armstrong number (e.g., 153 = 1³ + 5³ + 3³).",
            "examples": {
                "output": "Enter number: 153\\nArmstrong: True"
            },
            "notes": [
                "An Armstrong number equals the sum of its digits raised to the power of number of digits",
                "153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153",
                "Other examples: 9474 = 9⁴ + 4⁴ + 7⁴ + 4⁴"
            ],
            "testCases": [
                {
                    "input": "153",
                    "expectedOutput": "True"
                },
                {
                    "input": "123",
                    "expectedOutput": "False"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Numbers"
        },
        {
            "_id": 12,
            "title": "Print Triangle Pattern",
            "description": "Print a triangle pattern using asterisks.",
            "examples": {
                "output": "*\\n* *\\n* * *"
            },
            "notes": [
                "Print n rows of asterisks",
                "Row i should have i asterisks",
                "Separate asterisks with spaces"
            ],
            "testCases": [
                {
                    "input": "3",
                    "expectedOutput": "*\\n* *\\n* * *"
                },
                {
                    "input": "1",
                    "expectedOutput": "*"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Patterns"
        },
        {
            "_id": 13,
            "title": "Sum of Digits",
            "description": "Find the sum of all digits in a number.",
            "examples": {
                "output": "Enter number: 12345\\nSum of digits: 15"
            },
            "notes": [
                "Add up all individual digits in the number",
                "For 12345: 1 + 2 + 3 + 4 + 5 = 15",
                "Handle negative numbers by ignoring the sign"
            ],
            "testCases": [
                {
                    "input": "12345",
                    "expectedOutput": "15"
                },
                {
                    "input": "999",
                    "expectedOutput": "27"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Numbers"
        },
        {
            "_id": 14,
            "title": "Swap Two Variables Without Temp",
            "description": "Swap two numbers without using a third variable.",
            "examples": {
                "output": "Before: a=5, b=10\\nAfter: a=10, b=5"
            },
            "notes": [
                "Use arithmetic operations or XOR to swap",
                "Methods: a=a+b; b=a-b; a=a-b",
                "Or: a=a^b; b=a^b; a=a^b"
            ],
            "testCases": [
                {
                    "input": "5 10",
                    "expectedOutput": "10 5"
                },
                {
                    "input": "1 2",
                    "expectedOutput": "2 1"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Variables"
        },
        {
            "_id": 15,
            "title": "Leap Year Checker",
            "description": "Check if a year is a leap year.",
            "examples": {
                "output": "Enter year: 2024\\nLeap year: True"
            },
            "notes": [
                "Leap year rules: divisible by 4",
                "Exception: if divisible by 100, it's not a leap year",
                "Exception to exception: if divisible by 400, it is a leap year"
            ],
            "testCases": [
                {
                    "input": "2024",
                    "expectedOutput": "True"
                },
                {
                    "input": "1900",
                    "expectedOutput": "False"
                },
                {
                    "input": "2000",
                    "expectedOutput": "True"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Logic"
        },
        {
            "_id": 16,
            "title": "GCD and LCM Finder",
            "description": "Calculate the GCD (Greatest Common Divisor) and LCM (Least Common Multiple) of two numbers.",
            "examples": {
                "output": "Enter two numbers: 12 18\\nGCD: 6\\nLCM: 36"
            },
            "notes": [
                "GCD is the largest number that divides both numbers",
                "LCM is the smallest number that both numbers divide",
                "LCM(a,b) = (a*b) / GCD(a,b)"
            ],
            "testCases": [
                {
                    "input": "12 18",
                    "expectedOutput": "GCD: 6\\nLCM: 36"
                },
                {
                    "input": "7 13",
                    "expectedOutput": "GCD: 1\\nLCM: 91"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Math"
        },
        {
            "_id": 17,
            "title": "Binary to Decimal Conversion",
            "description": "Convert a binary number string to its decimal form.",
            "examples": {
                "output": "Enter binary: 1010\\nDecimal: 10"
            },
            "notes": [
                "Binary uses base 2 (only 0s and 1s)",
                "Each position represents a power of 2",
                "1010 = 1×8 + 0×4 + 1×2 + 0×1 = 10"
            ],
            "testCases": [
                {
                    "input": "1010",
                    "expectedOutput": "10"
                },
                {
                    "input": "1111",
                    "expectedOutput": "15"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Conversion"
        },
        {
            "_id": 18,
            "title": "Vowel or Consonant",
            "description": "Check whether a character is a vowel or consonant.",
            "examples": {
                "output": "Enter character: a\\nVowel"
            },
            "notes": [
                "Vowels are: a, e, i, o, u (and sometimes y)",
                "Check both uppercase and lowercase",
                "Handle invalid input (non-alphabetic characters)"
            ],
            "testCases": [
                {
                    "input": "a",
                    "expectedOutput": "Vowel"
                },
                {
                    "input": "b",
                    "expectedOutput": "Consonant"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Strings"
        },
        {
            "_id": 19,
            "title": "Count Words in a Sentence",
            "description": "Input a sentence and count the number of words.",
            "examples": {
                "output": "Enter sentence: Hello world Python\\nWords: 3"
            },
            "notes": [
                "Words are separated by spaces",
                "Handle multiple spaces between words",
                "Ignore leading and trailing spaces"
            ],
            "testCases": [
                {
                    "input": "Hello world Python",
                    "expectedOutput": "3"
                },
                {
                    "input": "  One   two  ",
                    "expectedOutput": "2"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Strings"
        },
        {
            "_id": 20,
            "title": "Reverse a List",
            "description": "Reverse a list without using the reverse() function.",
            "examples": {
                "output": "Original: [1, 2, 3, 4, 5]\\nReversed: [5, 4, 3, 2, 1]"
            },
            "notes": [
                "Don't use built-in reverse() method",
                "Use slicing [::-1] or manual swapping",
                "Work with any type of list elements"
            ],
            "testCases": [
                {
                    "input": "[1, 2, 3, 4, 5]",
                    "expectedOutput": "[5, 4, 3, 2, 1]"
                },
                {
                    "input": "['a', 'b', 'c']",
                    "expectedOutput": "['c', 'b', 'a']"
                }
            ],
            "difficulty": "Intermediate",
            "points": 30,
            "category": "Lists"
        },
        {
            "_id": 21,
            "title": "Find Duplicates in a List",
            "description": "Detect and print duplicate values in a list.",
            "examples": {
                "output": "List: [1, 2, 3, 2, 4, 1]\\nDuplicates: [1, 2]"
            },
            "notes": [
                "Find elements that appear more than once",
                "Return unique duplicates (don't repeat the same duplicate)",
                "Preserve the order of first occurrence"
            ],
            "testCases": [
                {
                    "input": "[1, 2, 3, 2, 4, 1]",
                    "expectedOutput": "[1, 2]"
                },
                {
                    "input": "[1, 2, 3, 4]",
                    "expectedOutput": "[]"
                }
            ],
            "difficulty": "Advanced",
            "points": 50,
            "category": "Lists"
        },
        {
            "_id": 22,
            "title": "String Palindrome Checker",
            "description": "Check whether a string is a palindrome (ignoring case and spaces).",
            "examples": {
                "output": "Enter string: A man a plan a canal Panama\\nPalindrome: True"
            },
            "notes": [
                "Ignore case, spaces, and punctuation",
                "A palindrome reads the same forwards and backwards",
                "Examples: 'racecar', 'A man a plan a canal Panama'"
            ],
            "testCases": [
                {
                    "input": "racecar",
                    "expectedOutput": "True"
                },
                {
                    "input": "hello",
                    "expectedOutput": "False"
                }
            ],
            "difficulty": "Advanced",
            "points": 50,
            "category": "Strings"
        },
        {
            "_id": 23,
            "title": "Matrix Multiplication",
            "description": "Multiply two 2D matrices (lists of lists).",
            "examples": {
                "output": "Matrix A: [[1,2],[3,4]]\\nMatrix B: [[5,6],[7,8]]\\nResult: [[19,22],[43,50]]"
            },
            "notes": [
                "Number of columns in A must equal number of rows in B",
                "Result[i][j] = sum of A[i][k] * B[k][j] for all k",
                "Handle matrix dimension validation"
            ],
            "testCases": [
                {
                    "input": "[[1,2],[3,4]] [[5,6],[7,8]]",
                    "expectedOutput": "[[19,22],[43,50]]"
                }
            ],
            "difficulty": "Advanced",
            "points": 50,
            "category": "Matrix"
        },
        {
            "_id": 24,
            "title": "Sort a List (Bubble/Selection Sort)",
            "description": "Sort a list using bubble sort or selection sort algorithm.",
            "examples": {
                "output": "Original: [64, 34, 25, 12, 22, 11, 90]\\nSorted: [11, 12, 22, 25, 34, 64, 90]"
            },
            "notes": [
                "Implement bubble sort or selection sort manually",
                "Don't use built-in sort() or sorted()",
                "Show the step-by-step sorting process"
            ],
            "testCases": [
                {
                    "input": "[64, 34, 25, 12, 22, 11, 90]",
                    "expectedOutput": "[11, 12, 22, 25, 34, 64, 90]"
                },
                {
                    "input": "[5, 2, 8, 1, 9]",
                    "expectedOutput": "[1, 2, 5, 8, 9]"
                }
            ],
            "difficulty": "Advanced",
            "points": 50,
            "category": "Sorting"
        },
        {
            "_id": 25,
            "title": "Check for Anagram",
            "description": "Determine whether two strings are anagrams of each other.",
            "examples": {
                "output": "String 1: listen\\nString 2: silent\\nAnagram: True"
            },
            "notes": [
                "Anagrams contain the same characters in different order",
                "Ignore case and spaces",
                "Examples: 'listen' & 'silent', 'evil' & 'vile'"
            ],
            "testCases": [
                {
                    "input": "listen silent",
                    "expectedOutput": "True"
                },
                {
                    "input": "hello world",
                    "expectedOutput": "False"
                }
            ],
            "difficulty": "Advanced",
            "points": 50,
            "category": "Strings"
        },
        {
            "_id": 26,
            "title": "Validate Sudoku Board",
            "description": "Check if a 9x9 Sudoku board is valid according to Sudoku rules.",
            "examples": {
                "output": "Sudoku board validation: Valid"
            },
            "notes": [
                "Each row must contain digits 1-9 without repetition",
                "Each column must contain digits 1-9 without repetition",
                "Each 3x3 box must contain digits 1-9 without repetition"
            ],
            "testCases": [
                {
                    "input": "valid_sudoku_board",
                    "expectedOutput": "Valid"
                }
            ],
            "difficulty": "Expert",
            "points": 100,
            "category": "Algorithms"
        },
        {
            "_id": 27,
            "title": "Implement LRU Cache",
            "description": "Implement a Least Recently Used (LRU) Cache using OrderedDict or custom logic.",
            "examples": {
                "output": "LRU Cache operations: get(1)->1, put(2,2), get(1)->1"
            },
            "notes": [
                "Fixed capacity cache that removes least recently used items",
                "Implement get(key) and put(key, value) operations",
                "Both operations should be O(1) time complexity"
            ],
            "testCases": [
                {
                    "input": "capacity=2, operations=['put(1,1)', 'put(2,2)', 'get(1)', 'put(3,3)', 'get(2)']",
                    "expectedOutput": "[None, None, 1, None, -1]"
                }
            ],
            "difficulty": "Expert",
            "points": 100,
            "category": "Data Structures"
        },
        {
            "_id": 28,
            "title": "Basic Multithreading",
            "description": "Create a program using threading module to run two tasks in parallel.",
            "examples": {
                "output": "Thread 1: Task 1 completed\\nThread 2: Task 2 completed"
            },
            "notes": [
                "Use Python's threading module",
                "Create two threads that run different functions",
                "Demonstrate concurrent execution"
            ],
            "testCases": [
                {
                    "input": "two_parallel_tasks",
                    "expectedOutput": "Both tasks completed"
                }
            ],
            "difficulty": "Expert",
            "points": 100,
            "category": "Threading"
        },
        {
            "_id": 29,
            "title": "Custom Exception Class",
            "description": "Define and use your own custom exception class.",
            "examples": {
                "output": "Custom exception raised and handled successfully"
            },
            "notes": [
                "Create a custom exception class inheriting from Exception",
                "Implement custom error messages",
                "Demonstrate proper exception handling"
            ],
            "testCases": [
                {
                    "input": "custom_exception_demo",
                    "expectedOutput": "Custom exception handled"
                }
            ],
            "difficulty": "Expert",
            "points": 100,
            "category": "Exception Handling"
        },
        {
            "_id": 30,
            "title": "Library Management System (OOP)",
            "description": "Build a mini library system using classes with functions to add, search, and delete books.",
            "examples": {
                "output": "Library system: Book added, searched, and deleted successfully"
            },
            "notes": [
                "Use Object-Oriented Programming principles",
                "Create classes for Book and Library",
                "Implement methods: add_book(), search_book(), delete_book()"
            ],
            "testCases": [
                {
                    "input": "library_operations",
                    "expectedOutput": "All operations completed successfully"
                }
            ],
            "difficulty": "Expert",
            "points": 100,
            "category": "Object-Oriented Programming"
        }
    ]
}

# Write the complete challenges data
with open('./scripts/challenges.json', 'w') as f:
    json.dump(challenges_data, f, indent=4)

print("Successfully created comprehensive challenges.json with all 30 Python challenges!")
print(f"Total challenges: {len(challenges_data['challenges'])}")

# Print summary by difficulty
difficulties = {}
for challenge in challenges_data['challenges']:
    diff = challenge['difficulty']
    if diff not in difficulties:
        difficulties[diff] = 0
    difficulties[diff] += 1

print("\\nChallenges by difficulty:")
for diff, count in difficulties.items():
    print(f"  {diff}: {count} challenges")
