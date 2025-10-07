/**
 * Code Executor Service
 * Handles code execution using the Piston API
 */

class CodeExecutor {
    constructor() {
        this.API_URL = 'https://emkc.org/api/v2/piston/';
        this.runtimeVersions = {
            'python': '3.10',
            'java': '15.0.2',
            'javascript': '18.15.0',
            'c': '10.2.0',
            'cpp': '10.2.0'
        };
        this.fileExtensions = {
            'python': '.py',
            'java': '.java',
            'javascript': '.js',
            'c': '.c',
            'cpp': '.cpp'
        };
        this.mainFileNames = {
            'python': 'main.py',
            'java': 'Main.java',
            'javascript': 'main.js',
            'c': 'main.c',
            'cpp': 'main.cpp'
        };
    }

    /**
     * Map internal language names to Piston API language names
     */
    _mapLanguageForPiston(language) {
        const languageMap = {
            'cpp': 'c++',
            'javascript': 'node'
        };
        return languageMap[language] || language;
    }

    /**
     * Wrap code with test harness based on language
     * @param {string} code - The code to wrap
     * @param {string} language - The programming language
     * @param {string} input - The input for the test
     * @returns {string} - The wrapped code
     */
    _wrapCodeWithTestHarness(code, language, input) {
        if (language === 'python') {
            // Check if the code contains a function definition
            if (code.includes('def ')) {
                // Extract the function name from the code
                const funcMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
                if (funcMatch) {
                    const functionName = funcMatch[1];
                    // Add test code that calls the function with the input
                    return `${code}\n\n# Test code\nresult = ${functionName}(${input})\nprint(result)`;
                }
            }
            return code;
        } else if (language === 'javascript') {
            // For JavaScript, just return the code as-is
            return code;
        } else if (language === 'c') {
            // For C, wrap in main function if not already present
            if (!code.includes('int main') && !code.includes('void main')) {
                return `#include <stdio.h>\n\nint main() {\n    ${code}\n    return 0;\n}`;
            }
            return code;
        } else if (language === 'cpp') {
            // For C++, wrap in main function if not already present
            if (!code.includes('int main') && !code.includes('void main')) {
                return `#include <iostream>\nusing namespace std;\n\nint main() {\n    ${code}\n    return 0;\n}`;
            }
            return code;
        } else if (language === 'java') {
            // For Java, wrap the method in a Main class if it's not already wrapped
            if (!code.includes('class ') && !code.includes('public class ')) {
                // Check if the code contains a method definition
                if (code.includes('public static')) {
                    // Extract the method name and parameters
                    const methodMatch = code.match(/public\s+static\s+\w+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/);
                    if (methodMatch) {
                        const methodName = methodMatch[1];
                        // Wrap in a Main class and add test code
                        return `public class Main {
    ${code}
    
    public static void main(String[] args) {
        // Test code
        System.out.println(${methodName}(${input}));
    }
}`;
                    }
                }
                // If no method found, assume it's a complete main method
                return `public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`;
            }
            return code;
        }
        return code;
    }

    async execute(code, language, input = '') {
        try {
            // Format input based on type and wrap code if needed
            let formattedInput = '';
            let wrappedCode = code;
            
            if (Array.isArray(input)) {
                formattedInput = input.join(' ');
                wrappedCode = this._wrapCodeWithTestHarness(code, language, formattedInput);
            } else if (typeof input === 'object' && input !== null) {
                formattedInput = JSON.stringify(input);
                wrappedCode = this._wrapCodeWithTestHarness(code, language, formattedInput);
            } else if (input) {
                // Replace \n with actual newlines for stdin
                formattedInput = input.replace(/\\n/g, '\n');
                wrappedCode = this._wrapCodeWithTestHarness(code, language, formattedInput);
            } else {
                // For code without specific input, still wrap it properly
                wrappedCode = this._wrapCodeWithTestHarness(code, language, '');
            }

            // Map language for Piston API
            const pistonLanguage = this._mapLanguageForPiston(language);

            // First, validate the language runtime
            const runtimeResponse = await fetch('https://emkc.org/api/v2/piston/runtimes');
            if (!runtimeResponse.ok) {
                throw new Error('Failed to fetch runtime information');
            }

            const runtimes = await runtimeResponse.json();
            const languageRuntime = runtimes.find(r => r.language === pistonLanguage);
            if (!languageRuntime) {
                throw new Error(`Language ${pistonLanguage} is not supported`);
            }

            // Get the appropriate filename based on language
            const fileName = this.mainFileNames[language] || 'main.txt';

            // Execute the code
            const response = await fetch(this.API_URL + 'execute', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    language: pistonLanguage,
                    version: this.runtimeVersions[language] || languageRuntime.version,
                    files: [{
                        name: fileName,
                        content: wrappedCode
                    }],
                    stdin: formattedInput,
                    args: [],
                    compile_timeout: 10000,
                    run_timeout: 3000,
                    compile_memory_limit: -1,
                    run_memory_limit: -1
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error (${response.status}): ${errorText}`);
            }

            const result = await response.json();
            
            // Check for compile errors
            if (result.compile && result.compile.stderr) {
                return {
                    output: '',
                    error: `Compilation Error: ${result.compile.stderr}`
                };
            }

            // Check for runtime output
            if (result.run) {
                return {
                    output: result.run.stdout || '',
                    error: result.run.stderr || ''
                };
            }

            return {
                output: '',
                error: 'No output received from the code execution'
            };
        } catch (error) {
            console.error('Code execution error:', error);
            return {
                output: '',
                error: `Error: ${error.message}. Please try again in a moment.`
            };
        }
    }

    /**
     * Run test cases for a challenge
     * @param {string} code - The code to test
     * @param {string} language - The programming language
     * @param {Array} testCases - Array of test cases
     * @returns {Promise<{passed: boolean, output: string}>}
     */
    async runTests(code, language, testCases) {
        let allPassed = true;
        let output = '';

        for (const test of testCases) {
            const result = await this.execute(code, language, test.input);
            
            if (result.error) {
                return {
                    passed: false,
                    output: `Test failed:\nError: ${result.error}`
                };
            }

            if (result.output.trim() !== test.expectedOutput.trim()) {
                allPassed = false;
                output += `Test failed:\nInput: ${test.input}\nExpected: ${test.expectedOutput}\nGot: ${result.output}\n\n`;
            }
        }

        return {
            passed: allPassed,
            output: allPassed ? '🎉 All tests passed!' : output
        };
    }
}
