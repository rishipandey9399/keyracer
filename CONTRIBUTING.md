# 🤝 Contributing to Key Racer

Thank you for your interest in contributing to Key Racer! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and professional in all interactions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- MongoDB (v4.4+ or MongoDB Atlas)
- Git
- Text editor (VS Code recommended)

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/key-racer.git
   cd key-racer
   ```

## 🛠️ Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   ```bash
   ./check-coderacer.sh
   ```

## 🔄 Contribution Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clear, concise code
   - Follow our coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### JavaScript Style Guide
- Use ES6+ features where appropriate
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await instead of callbacks

### File Structure
```
├── client/              # Frontend files
│   ├── assets/         # Static assets
│   ├── scripts/        # JavaScript files
│   └── styles/         # CSS files
├── server/             # Backend files
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
└── tests/              # Test files
```

### Naming Conventions
- **Files**: kebab-case (`user-profile.js`)
- **Variables/Functions**: camelCase (`getUserProfile`)
- **Classes**: PascalCase (`UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

## 🧪 Testing Guidelines

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "user authentication"

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for all new functions
- Include integration tests for API endpoints
- Test both success and error scenarios
- Use descriptive test names

### Test Example
```javascript
describe('User Authentication', () => {
  it('should successfully register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'securePassword123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
      
    expect(response.body.message).toBe('User registered successfully');
  });
});
```

## 🔍 Pull Request Process

### Before Submitting
- [ ] Code follows our style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Environment variables are properly documented

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process
1. Automated checks must pass
2. At least one code review required
3. No merge conflicts
4. Tests must pass
5. Documentation must be updated

## 🐛 Issue Reporting

### Bug Reports
Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots or error logs

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 12.0]
- Node.js: [e.g. 16.14.0]
- Browser: [e.g. Chrome 98]
```

## ✨ Feature Requests

### Before Submitting
- Check if feature already exists
- Search existing feature requests
- Consider if it fits the project scope

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 🏷️ Commit Message Guidelines

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add Google OAuth integration
fix(ui): resolve mobile responsive issues
docs(readme): update installation instructions
test(api): add user registration tests
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations
- [ ] Test coverage improvements
- [ ] Documentation updates
- [ ] Accessibility enhancements

### Feature Ideas
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Real-time multiplayer typing races
- [ ] Advanced analytics dashboard
- [ ] Custom challenge creator
- [ ] Social sharing features

### Good First Issues
Look for issues labeled `good first issue` or `beginner friendly` in our GitHub issues.

## 💬 Getting Help

- 📖 Check our [Wiki](https://github.com/yourusername/key-racer/wiki)
- 💬 Join our [Discord Community](https://discord.gg/keyracer)
- 🐛 Open an [Issue](https://github.com/yourusername/key-racer/issues)
- 📧 Email us at contribute@keyracer.in

## 🙏 Recognition

All contributors will be recognized in our:
- README.md contributors section
- Release notes
- Hall of Fame page
- Annual contributor spotlight

Thank you for contributing to Key Racer! 🎉
