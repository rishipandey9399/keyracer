/**
 * Code Executor Service
 * Handles code execution using the Piston API
 */

class CodeExecutor {
    constructor() {
        this.API_URL = 'https://emkc.org/api/v2/piston/';
        this.runtimeVersions = {
            'python': '3.10'
        };
    }

    /**
     * Execute code and return the result
     * @param {string} code - The code to execute
     * @param {string} language - The programming language
     * @param {string} input - Optional input for the program
     * @returns {Promise<{output: string, error: string}>}
     */
    _wrapCodeWithTestHarness(code, input) {
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
    }

    async execute(code, language, input = '') {
        try {
            // Format input based on type and wrap code if needed
            let formattedInput = '';
            let wrappedCode = code;
            
            if (Array.isArray(input)) {
                formattedInput = input.join(' ');
                wrappedCode = this._wrapCodeWithTestHarness(code, formattedInput);
            } else if (typeof input === 'object' && input !== null) {
                formattedInput = JSON.stringify(input);
                wrappedCode = this._wrapCodeWithTestHarness(code, formattedInput);
            } else if (input) {
                formattedInput = input;
                wrappedCode = this._wrapCodeWithTestHarness(code, formattedInput);
            }

            // First, validate the language runtime
            const runtimeResponse = await fetch('https://emkc.org/api/v2/piston/runtimes');
            if (!runtimeResponse.ok) {
                throw new Error('Failed to fetch runtime information');
            }

            const runtimes = await runtimeResponse.json();
            const languageRuntime = runtimes.find(r => r.language === language);
            if (!languageRuntime) {
                throw new Error(`Language ${language} is not supported`);
            }

            // Execute the code
            const response = await fetch(this.API_URL + 'execute', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    language: language,
                    version: this.runtimeVersions[language] || languageRuntime.version,
                    files: [{
                        name: 'main.py',
                        content: code
                    }],
                    stdin: input,
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
