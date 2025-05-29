document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCodeEditors();
    setupTryItButtons();
});

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.tutorial-section');
    
    // Initially hide all sections except the first one
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('active');
            section.style.opacity = '1';
        } else {
            section.classList.remove('active');
            section.style.opacity = '0';
        }
    });

    // Setup menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            handleMenuItemClick(item);
        });

        // Setup submenu if present
        const submenu = item.querySelector('.subsection-menu');
        if (submenu) {
            item.classList.add('has-submenu');
            setupSubmenuItems(submenu.querySelectorAll('.subsection-item'), item);
        }
    });
}

function handleMenuItemClick(menuItem) {
    if (menuItem.classList.contains('has-submenu')) {
        toggleSubmenu(menuItem);
    } else {
        const targetId = menuItem.getAttribute('href').substring(1);
        switchToSection(targetId);
        updateActiveStates(menuItem);
    }
}

function toggleSubmenu(menuItem) {
    const wasActive = menuItem.classList.contains('active');
    
    // Close other submenus
    document.querySelectorAll('.menu-item.has-submenu').forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('active');
        }
    });

    // Toggle current submenu
    menuItem.classList.toggle('active');

    // If opening the submenu, switch to its section
    if (!wasActive) {
        const targetId = menuItem.getAttribute('href').substring(1);
        switchToSection(targetId);
    }
}

function setupSubmenuItems(subsectionItems, parentMenuItem) {
    subsectionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update main section
            const parentSectionId = parentMenuItem.getAttribute('href').substring(1);
            switchToSection(parentSectionId);
            
            // Update active states
            updateActiveStates(parentMenuItem);
            updateSubsectionActiveStates(item);
            
            // Scroll to subsection
            const targetId = item.getAttribute('href').substring(1);
            setTimeout(() => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });
}

function switchToSection(sectionId) {
    const sections = document.querySelectorAll('.tutorial-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            // Fade out all sections first
            sections.forEach(s => {
                s.style.opacity = '0';
                s.classList.remove('active');
            });
            
            // Show and fade in target section
            setTimeout(() => {
                section.classList.add('active');
                requestAnimationFrame(() => {
                    section.style.opacity = '1';
                });
            }, 50);
        }
    });
}

function updateActiveStates(activeItem) {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item === activeItem) {
            item.classList.add('active');
        } else if (!item.contains(activeItem) && !activeItem.contains(item)) {
            item.classList.remove('active');
        }
    });
}

function updateSubsectionActiveStates(activeItem) {
    const subsectionMenu = activeItem.closest('.subsection-menu');
    if (subsectionMenu) {
        subsectionMenu.querySelectorAll('.subsection-item').forEach(item => {
            item.classList.toggle('active', item === activeItem);
        });
    }
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
