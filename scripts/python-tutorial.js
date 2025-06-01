document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCodeEditors();
    setupTryItButtons();
    setupEnhancedCodeEditors();
    addEnhancedStyles();
});

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.tutorial-section');
    
    console.log('Setting up navigation with', menuItems.length, 'menu items and', sections.length, 'sections');
    
    // Initially hide all sections except the first one
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('active');
            section.style.display = 'block';
            section.style.opacity = '1';
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
            section.style.opacity = '0';
        }
    });

    // Setup menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                console.log('Menu item clicked:', targetId);
                switchToSection(targetId);
                updateActiveStates(item);
            }
        });
    });

    // Also handle submenu items (subsection navigation)
    const subsectionItems = document.querySelectorAll('.submenu-items a');
    subsectionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const subsectionId = href.substring(1);
                // Find the parent section
                const parentMenuItem = item.closest('.submenu').querySelector('.menu-item');
                if (parentMenuItem) {
                    const parentHref = parentMenuItem.getAttribute('href');
                    if (parentHref && parentHref.startsWith('#')) {
                        const parentSectionId = parentHref.substring(1);
                        switchToSection(parentSectionId);
                        updateActiveStates(parentMenuItem);
                        
                        // Scroll to subsection after section is loaded
                        setTimeout(() => {
                            const subsectionElement = document.getElementById(subsectionId);
                            if (subsectionElement) {
                                subsectionElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100);
                    }
                }
            }
        });
    });
}

function switchToSection(sectionId) {
    console.log('Switching to section:', sectionId);
    const sections = document.querySelectorAll('.tutorial-section');
    console.log('Found sections:', sections.length);
    
    // First, hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
        section.style.opacity = '0';
    });
    
    // Find and show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        console.log('Found target section:', targetSection.id);
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        
        // Smooth fade-in effect
        setTimeout(() => {
            targetSection.style.opacity = '1';
        }, 50);
    } else {
        console.error('Section not found:', sectionId);
    }
}

function updateActiveStates(activeItem) {
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the clicked item
    activeItem.classList.add('active');
    
    console.log('Updated active states, active item:', activeItem.textContent.trim());
}

function setupCodeEditors() {
    const editors = document.querySelectorAll('.code-editor');
    editors.forEach(editor => {
        const runBtn = editor.querySelector('.run-btn');
        const codeInput = editor.querySelector('.code-input');
        const outputContent = editor.querySelector('.output-content');

        if (runBtn && codeInput && outputContent) {
            runBtn.addEventListener('click', () => {
                const code = codeInput.value.trim();
                simulateCodeExecution(code, outputContent);
            });

            codeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = codeInput.selectionStart;
                    codeInput.value = codeInput.value.substring(0, start) + 
                                    '    ' + 
                                    codeInput.value.substring(codeInput.selectionEnd);
                    codeInput.selectionStart = codeInput.selectionEnd = start + 4;
                }
            });
        }
    });
}

function setupTryItButtons() {
    document.querySelectorAll('.try-it-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeDemo = btn.closest('.code-demo');
            if (codeDemo) {
                const code = codeDemo.querySelector('code').textContent.trim();
                const editor = codeDemo.closest('.tutorial-section')
                                    .querySelector('.code-editor');
                
                if (editor) {
                    const codeInput = editor.querySelector('.code-input');
                    if (codeInput) {
                        codeInput.value = code;
                        codeInput.focus();
                        editor.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}

function simulateCodeExecution(code, outputElement) {
    try {
        if (code.includes('print(')) {
            const matches = code.match(/print\((.*?)\)/g);
            if (matches) {
                const output = matches
                    .map(m => {
                        const content = m.substring(6, m.length - 1).trim();
                        return content.replace(/['"]/g, '');
                    })
                    .join('\n');
                outputElement.innerHTML = `<pre>${output}</pre>`;
                return;
            }
        }
        outputElement.innerHTML = '<pre>Code executed successfully!</pre>';
    } catch (error) {
        outputElement.innerHTML = `<pre class="error">Error: ${error.message}</pre>`;
    }
}

// Enhanced Practice Editor with Advanced Visual Effects
class EnhancedCodeEditor {
    constructor(textarea, preview, runButton, outputContent) {
        this.textarea = textarea;
        this.preview = preview;
        this.runButton = runButton;
        this.outputContent = outputContent;
        this.practiceSection = textarea.closest('.practice-section');
        
        if (!this.textarea || !this.preview) {
            console.warn('EnhancedCodeEditor: Invalid elements provided');
            return;
        }
        
        this.init();
    }

    init() {
        // Enhanced event listeners with visual feedback
        this.textarea.addEventListener('input', () => {
            this.updateHighlighting();
            this.addTypingEffects();
        });
        
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.textarea.addEventListener('scroll', () => this.syncScroll());
        
        // Focus/blur effects for enhanced interactivity
        this.textarea.addEventListener('focus', () => this.handleFocus());
        this.textarea.addEventListener('blur', () => this.handleBlur());
        
        // Enhanced run button functionality
        if (this.runButton) {
            this.runButton.addEventListener('click', () => this.runCode());
        }
        
        // Initial setup
        this.updateHighlighting();
        // Removed setupDefaultCode() - editors now start empty
    }

    handleFocus() {
        this.practiceSection?.classList.add('active');
        this.textarea.parentElement?.classList.add('editor-focused');
        
        // Add subtle glow animation
        if (this.outputContent) {
            this.outputContent.classList.remove('typing');
        }
    }

    handleBlur() {
        this.practiceSection?.classList.remove('active');
        this.textarea.parentElement?.classList.remove('editor-focused');
    }

    addTypingEffects() {
        // Add visual feedback while typing
        const editorContainer = this.textarea.closest('.editor-container');
        if (editorContainer) {
            editorContainer.style.transform = 'scale(1.002)';
            setTimeout(() => {
                editorContainer.style.transform = 'scale(1)';
            }, 100);
        }
    }

    runCode() {
        if (!this.outputContent || !this.runButton) return;
        
        const code = this.textarea.value.trim();
        if (!code) {
            this.showOutput('Please write some Python code first!', 'info');
            return;
        }

        // Enhanced run button animation with section effects
        this.runButton.disabled = true;
        this.runButton.innerHTML = '⚡ Running...';
        this.runButton.classList.add('running');
        this.practiceSection?.classList.add('executing');
        
        // Add typing effect to output
        this.outputContent.classList.add('typing');
        this.outputContent.innerHTML = '';
        
        // Simulate code execution with enhanced visual feedback
        setTimeout(() => {
            try {
                const result = this.simulatePythonExecution(code);
                this.showOutput(result.output, result.type);
            } catch (error) {
                this.showOutput(`Error: ${error.message}`, 'error');
            }
            
            // Reset run button and section state
            this.runButton.disabled = false;
            this.runButton.innerHTML = '▶ Run';
            this.runButton.classList.remove('running');
            this.practiceSection?.classList.remove('executing');
            this.outputContent.classList.remove('typing');
            
            // Add completion celebration effect
            this.addCompletionEffect();
        }, 1200);
    }

    addCompletionEffect() {
        // Add a subtle completion animation
        const editorContainer = this.textarea.closest('.editor-container');
        if (editorContainer) {
            editorContainer.style.animation = 'codeCompletionPulse 0.6s ease-out';
            setTimeout(() => {
                editorContainer.style.animation = '';
            }, 600);
        }
    }

    simulatePythonExecution(code) {
        // Enhanced Python code simulation with better pattern matching
        const lines = code.split('\n').filter(line => line.trim());
        let output = '';
        let hasError = false;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip comments and empty lines
            if (trimmedLine.startsWith('#') || !trimmedLine) continue;
            
            // Enhanced print statement handling
            const printMatch = trimmedLine.match(/print\s*\(\s*([^)]+)\s*\)/);
            if (printMatch) {
                let content = printMatch[1];
                
                // Handle string literals
                if (content.match(/^["'].*["']$/)) {
                    content = content.slice(1, -1);
                } else if (content.includes('+')) {
                    // Simple string concatenation
                    content = content.replace(/["']/g, '').replace(/\s*\+\s*/g, '');
                }
                
                output += content + '\n';
                continue;
            }
            
            // Enhanced variable assignments with calculations
            const varMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
            if (varMatch) {
                const varName = varMatch[1];
                const value = varMatch[2];
                
                // Handle simple arithmetic
                if (/^\d+\s*[+\-*/]\s*\d+$/.test(value)) {
                    try {
                        const result = eval(value);
                        output += `${varName} = ${result}\n`;
                    } catch {
                        output += `${varName} assigned\n`;
                    }
                } else {
                    output += `${varName} assigned\n`;
                }
                continue;
            }
            
            // Enhanced loop detection
            if (trimmedLine.includes('for') || trimmedLine.includes('while')) {
                output += 'Loop executed\n';
                continue;
            }
            
            // Enhanced conditional detection
            if (trimmedLine.includes('if') || trimmedLine.includes('elif') || trimmedLine.includes('else')) {
                output += 'Condition evaluated\n';
                continue;
            }
            
            // Function definitions
            if (trimmedLine.startsWith('def ')) {
                const funcMatch = trimmedLine.match(/def\s+(\w+)/);
                if (funcMatch) {
                    output += `Function '${funcMatch[1]}' defined\n`;
                }
                continue;
            }
            
            // Default execution message
            output += 'Code executed successfully\n';
        }

        if (!output) {
            output = 'Code executed (no output)';
        }

        return {
            output: output.trim(),
            type: hasError ? 'error' : 'success'
        };
    }

    showOutput(text, type = 'success') {
        if (!this.outputContent) return;
        
        this.outputContent.className = `output-content ${type}`;
        
        // Enhanced typewriter effect
        let i = 0;
        this.outputContent.innerHTML = '';
        
        const typeWriter = () => {
            if (i < text.length) {
                this.outputContent.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            } else {
                // Add completion effect
                this.outputContent.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.outputContent.style.transform = 'scale(1)';
                }, 200);
            }
        };
        
        typeWriter();
    }

    updateHighlighting() {
        const code = this.textarea.value;
        this.preview.innerHTML = this.highlightPython(code);
        this.syncScroll();
    }

    syncScroll() {
        this.preview.scrollTop = this.textarea.scrollTop;
        this.preview.scrollLeft = this.textarea.scrollLeft;
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            this.insertTab();
        } else if (e.key === 'Enter') {
            this.handleEnter(e);
        } else if (e.ctrlKey && e.key === 'Enter') {
            // Ctrl+Enter to run code
            e.preventDefault();
            this.runCode();
        }
    }

    insertTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const text = this.textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);

        this.textarea.value = before + '    ' + after;
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
        this.updateHighlighting();
    }

    handleEnter(e) {
        const start = this.textarea.selectionStart;
        const text = this.textarea.value;
        const lines = text.substring(0, start).split('\n');
        const currentLine = lines[lines.length - 1];
        
        const indent = currentLine.match(/^(\s*)/)[1];
        let newIndent = indent;
        
        if (currentLine.trim().endsWith(':')) {
            newIndent += '    ';
        }

        setTimeout(() => {
            const newStart = this.textarea.selectionStart;
            const newText = this.textarea.value;
            const beforeCursor = newText.substring(0, newStart);
            const afterCursor = newText.substring(newStart);
            
            this.textarea.value = beforeCursor + newIndent + afterCursor;
            this.textarea.selectionStart = this.textarea.selectionEnd = newStart + newIndent.length;
            this.updateHighlighting();
        }, 0);
    }

    highlightPython(code) {
        if (!code.trim()) return code;
        
        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Enhanced syntax highlighting with better patterns
        highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
        highlighted = highlighted.replace(/("""[\s\S]*?""")/g, '<span class="string">$1</span>');
        highlighted = highlighted.replace(/('''[\s\S]*?''')/g, '<span class="string">$1</span>');
        highlighted = highlighted.replace(/"(?:[^"\\]|\\.)*"/g, '<span class="string">$&</span>');
        highlighted = highlighted.replace(/'(?:[^'\\]|\\.)*'/g, '<span class="string">$&</span>');
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
        
        const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 
                         'with', 'import', 'from', 'as', 'return', 'yield', 'break', 'continue', 'pass', 
                         'lambda', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None', 'self'];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
        });
        
        const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 
                         'type', 'input', 'open', 'abs', 'all', 'any', 'enumerate', 'zip', 'map', 'filter'];
        
        builtins.forEach(builtin => {
            const regex = new RegExp(`\\b(${builtin})(?=\\s*\\()`, 'g');
            highlighted = highlighted.replace(regex, '<span class="builtin">$1</span>');
        });
        
        highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, 
            '<span class="function">$1</span>');
        
        return highlighted;
    }
}

// Enhanced initialization with better error handling
function setupEnhancedCodeEditors() {
    document.querySelectorAll('.practice-section').forEach((section, index) => {
        const textarea = section.querySelector('.code-input');
        const preview = section.querySelector('.code-preview');
        const runButton = section.querySelector('.run-btn');
        const outputContent = section.querySelector('.output-content');
        
        if (textarea && preview) {
            new EnhancedCodeEditor(textarea, preview, runButton, outputContent);
        }
    });
}

// Add enhanced CSS classes for visual effects
function addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .editor-focused {
            box-shadow: 0 0 30px rgba(0, 194, 255, 0.3) !important;
        }
        
        .run-btn.running {
            background: linear-gradient(135deg, #ff6b35 0%, #f093fb 100%) !important;
            animation: runningPulse 1s ease-in-out infinite !important;
        }
        
        @keyframes runningPulse {
            0%, 100% { transform: scale(1) translateY(-2px); }
            50% { transform: scale(1.05) translateY(-3px); }
        }
        
        .output-content.info {
            border-left-color: #00c2ff;
            background: linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%);
        }
    `;
    document.head.appendChild(style);
}
