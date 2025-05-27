// Web Worker for running code safely
self.onmessage = function(e) {
    const { code, input, language } = e.data;
    
    try {
        let result;
        switch (language) {
            case 'javascript':
                result = evaluateJavaScript(code, input);
                break;
            case 'python':
                result = evaluatePython(code, input);
                break;
            default:
                throw new Error(`Language ${language} not supported`);
        }
        self.postMessage({ result });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};

function evaluateJavaScript(code, input) {
    // Create a safe evaluation context
    const sandbox = {
        input: input,
        console: {
            log: function(val) {
                sandbox.output = val;
            }
        },
        output: undefined
    };

    const safeFunctionBody = `
        "use strict";
        ${code};
        return output;
    `;

    // Create and run the function in the sandbox
    const evaluator = new Function('sandbox', safeFunctionBody);
    return evaluator(sandbox);
}

function evaluatePython(code, input) {
    // This is a placeholder. In a real implementation,
    // you would need to use a Python runtime like Pyodide
    // or make an API call to a backend server
    throw new Error('Python evaluation requires backend support');
}
