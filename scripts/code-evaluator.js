// Code evaluation system
class CodeEvaluator {
    constructor() {
        this.testCases = new Map();
        this.workers = new Map();
    }

    // Add test cases for a challenge
    addTestCases(challengeId, testCases) {
        this.testCases.set(challengeId, testCases);
    }

    // Evaluate code against test cases
    async evaluateCode(challengeId, code, language) {
        const testCases = this.testCases.get(challengeId);
        if (!testCases) {
            throw new Error('No test cases found for this challenge');
        }

        const results = [];
        for (const testCase of testCases) {
            try {
                const result = await this.runTestCase(code, testCase, language);
                results.push(result);
            } catch (error) {
                results.push({
                    passed: false,
                    error: error.message,
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: error.message
                });
            }
        }

        return {
            passed: results.every(r => r.passed),
            results: results
        };
    }

    // Run a single test case using a Web Worker
    async runTestCase(code, testCase, language) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('scripts/code-runner.js');
            
            worker.onmessage = (e) => {
                const { result, error } = e.data;
                if (error) {
                    resolve({
                        passed: false,
                        error: error,
                        input: testCase.input,
                        expected: testCase.expected,
                        actual: error
                    });
                } else {
                    resolve({
                        passed: this.compareResults(result, testCase.expected),
                        input: testCase.input,
                        expected: testCase.expected,
                        actual: result
                    });
                }
                worker.terminate();
            };

            worker.onerror = (error) => {
                resolve({
                    passed: false,
                    error: error.message,
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: error.message
                });
                worker.terminate();
            };

            worker.postMessage({
                code: code,
                input: testCase.input,
                language: language
            });
        });
    }

    // Compare actual result with expected result
    compareResults(actual, expected) {
        if (typeof actual === 'object' && typeof expected === 'object') {
            return JSON.stringify(actual) === JSON.stringify(expected);
        }
        return actual === expected;
    }

    // Display evaluation results in the UI
    displayResults(results, container) {
        container.innerHTML = '';
        const summary = document.createElement('div');
        summary.className = 'evaluation-summary';
        summary.innerHTML = `
            <h3>Test Results</h3>
            <p>Status: ${results.passed ? 'All Tests Passed' : 'Some Tests Failed'}</p>
        `;
        container.appendChild(summary);

        results.results.forEach((result, index) => {
            const testCase = document.createElement('div');
            testCase.className = `test-case ${result.passed ? 'passed' : 'failed'}`;
            testCase.innerHTML = `
                <h4>Test Case ${index + 1}</h4>
                <p>Input: ${JSON.stringify(result.input)}</p>
                <p>Expected: ${JSON.stringify(result.expected)}</p>
                <p>Actual: ${JSON.stringify(result.actual)}</p>
                ${result.error ? `<p class="error">Error: ${result.error}</p>` : ''}
            `;
            container.appendChild(testCase);
        });
    }
}

// Export the evaluator
window.CodeEvaluator = CodeEvaluator;
