// Professional Skills Lab Interactive Logic
const skillTemplates = {
    resume: `John Doe\nEmail: john.doe@email.com\nPhone: (123) 456-7890\n\nObjective:\nTo obtain a challenging position as a Software Developer.\n\nEducation:\nB.Sc. in Computer Science, XYZ University\n\nExperience:\n- Intern at TechCorp (2022)\n- Volunteer at CodeCamp (2021)`,
    'cover-letter': `Dear Hiring Manager,\n\nI am writing to apply for the Software Engineer position at your company. My experience in web development and my passion for technology make me a strong candidate.\n\nThank you for your consideration.\n\nSincerely,\nJohn Doe`,
    email: `Subject: Meeting Reminder\n\nHi Team,\n\nThis is a reminder for our meeting scheduled tomorrow at 10:00 AM.\n\nBest regards,\nJohn`,
    report: `Monthly Report\n\nProject: Website Redesign\nStatus: On Track\n\n- Completed homepage layout\n- Started user authentication module\n- Next: Begin dashboard implementation`,
    linkedin: `Experienced Software Developer with a demonstrated history of working in the tech industry. Skilled in JavaScript, Python, and teamwork. Passionate about building impactful products.`
};

let currentTemplate = '';
let startTime = null;
let timerInterval = null;

const skillSelect = document.getElementById('pro-skill-select');
const templateArea = document.getElementById('template-area');
const proInput = document.getElementById('pro-input');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const errorsSpan = document.getElementById('errors');
const startBtn = document.getElementById('start-pro-skill');

function loadTemplate() {
    const skill = skillSelect.value;
    currentTemplate = skillTemplates[skill];
    templateArea.textContent = currentTemplate;
    proInput.value = '';
    wpmSpan.textContent = '0';
    accuracySpan.textContent = '100';
    errorsSpan.textContent = '0';
    proInput.disabled = true;
    startBtn.disabled = false;
}

skillSelect.addEventListener('change', loadTemplate);

startBtn.addEventListener('click', () => {
    proInput.value = '';
    proInput.disabled = false;
    proInput.focus();
    startBtn.disabled = true;
    startTime = Date.now();
    timerInterval = setInterval(updateStats, 200);
});

proInput.addEventListener('input', () => {
    if (!startTime) return;
    updateStats();
    if (proInput.value === currentTemplate) {
        clearInterval(timerInterval);
        updateStats(true);
        proInput.disabled = true;
        startBtn.disabled = false;
    }
});

function updateStats(finish = false) {
    const input = proInput.value;
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== currentTemplate[i]) errors++;
    }
    errors += Math.max(0, currentTemplate.length - input.length);
    errorsSpan.textContent = errors;
    const correctChars = input.split('').filter((ch, i) => ch === currentTemplate[i]).length;
    const accuracy = input.length ? Math.round((correctChars / input.length) * 100) : 100;
    accuracySpan.textContent = accuracy;
    const elapsed = ((finish ? Date.now() : Date.now()) - startTime) / 1000 / 60;
    const wpm = input.length ? Math.round((input.length / 5) / (elapsed || 1/60)) : 0;
    wpmSpan.textContent = wpm;
}

// Initial load
loadTemplate(); 