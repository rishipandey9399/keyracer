const GeminiService = class {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.isConfigured = !!this.apiKey;

    // AI Agent personality and context
    this.agentPersonality = {
      name: 'KeyRacer Career AI',
      role: 'Intelligent Career Guidance Agent',
      traits: ['helpful', 'encouraging', 'knowledgeable', 'practical', 'supportive'],
      expertise: ['career planning', 'skill development', 'interview preparation', 'industry insights']
    };

    if (!this.isConfigured) {
      console.warn('GEMINI_API_KEY is not configured. AI features will use fallback responses.');
    }
  }

  async generateWithRetry(prompt, retryCount = 0) {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from AI');
      }

      return text;
    } catch (error) {
      console.error(`Gemini API error (attempt ${retryCount + 1}):`, error.message);

      if (retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.generateWithRetry(prompt, retryCount + 1);
      }

      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateCareerRoadmap(userProfile) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const { name, year, collegeTier, skills, careerGoal } = userProfile;

      const prompt = `You are ${this.agentPersonality.name}, an ${this.agentPersonality.role} with expertise in ${this.agentPersonality.expertise.join(', ')}.

Create a personalized career roadmap for ${name}:

Profile Analysis:
- Academic Year: ${year}
- College Tier: ${collegeTier}
- Current Skills: ${skills}
- Career Goal: ${careerGoal}

As an intelligent career agent, provide:

🎯 **IMMEDIATE ACTION PLAN** (Next 3 months):
- Specific, actionable steps
- Skill-building priorities
- Portfolio development

📈 **SHORT-TERM STRATEGY** (6-12 months):
- Learning milestones
- Project recommendations
- Networking opportunities

🚀 **LONG-TERM VISION** (1-3 years):
- Career progression path
- Leadership development
- Specialization options

💡 **AI AGENT RECOMMENDATIONS**:
- Industry insights and trends
- Personalized learning resources
- Success metrics and tracking

🤖 **Available Commands**: Mention that they can ask for "skill gap analysis", "project ideas", "interview prep", or "industry trends" for specialized help.

Be encouraging, specific, and actionable. Use emojis and clear formatting. Limit to 1500 words.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error generating career roadmap:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async generateFollowUpResponse(question, userProfile) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const intent = this.detectIntent(question);
      const prompt = `You are ${this.agentPersonality.name}, an ${this.agentPersonality.role}.

User Profile:
- Name: ${userProfile.name}
- Year: ${userProfile.year}
- College: ${userProfile.collegeTier}
- Skills: ${userProfile.skills}
- Goal: ${userProfile.careerGoal}

Question: "${question}"
Detected Intent: ${intent}

As an intelligent career agent with ${this.agentPersonality.traits.join(', ')} personality:

1. **Direct Answer**: Address their specific question
2. **Smart Insights**: Provide AI-powered analysis
3. **Action Steps**: Give 2-3 specific next steps
4. **Resources**: Suggest relevant tools/platforms
5. **Follow-up**: Offer related assistance

Be conversational, use emojis appropriately, and maintain an encouraging tone. If they ask about specialized topics, mention available commands like "skill gap analysis", "project ideas", "interview prep", or "industry trends". Keep under 400 words.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error generating follow-up response:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async assessSkillGap(userProfile, targetRole) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const prompt = `As an AI Career Agent, analyze the skill gap for:

Current Profile:
- Skills: ${userProfile.skills}
- Year: ${userProfile.year}
- Goal: ${targetRole || userProfile.careerGoal}

Provide:
1. **Current Strengths**: What skills they already have
2. **Skill Gaps**: What's missing for their target role
3. **Learning Priority**: Which skills to focus on first
4. **Timeline**: Realistic learning schedule
5. **Resources**: Specific courses, books, or platforms

Format as a structured assessment. Keep it actionable and encouraging.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error assessing skill gap:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async generateProjectIdeas(userProfile, difficulty = 'intermediate') {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const prompt = `As an AI Career Agent, suggest ${difficulty} level projects for:

Profile:
- Skills: ${userProfile.skills}
- Goal: ${userProfile.careerGoal}
- Level: ${userProfile.year}

Provide 3-5 project ideas with:
1. **Project Name & Description**
2. **Technologies Used**
3. **Key Learning Outcomes**
4. **Estimated Timeline**
5. **Portfolio Impact**

Focus on projects that will strengthen their resume for ${userProfile.careerGoal}. Make them practical and achievable.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error generating project ideas:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async prepareInterview(userProfile, company = null) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const companyContext = company ? `for ${company}` : `for ${userProfile.careerGoal} roles`;
      const prompt = `As an AI Career Agent, help prepare for interviews ${companyContext}:

Profile:
- Skills: ${userProfile.skills}
- Goal: ${userProfile.careerGoal}
- Experience Level: ${userProfile.year}

Provide:
1. **Common Interview Questions** (5-7 questions)
2. **Technical Topics** to review
3. **STAR Method Examples** using their background
4. **Questions to Ask Interviewer**
5. **Preparation Timeline** (1-2 weeks)

Make it specific to their skill level and career goal. Include confidence-building tips.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error preparing interview guide:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async analyzeTrends(field) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    try {
      const prompt = `As an AI Career Agent, analyze current trends in ${field}:

Provide:
1. **Emerging Technologies** in this field
2. **In-Demand Skills** for 2024-2025
3. **Market Outlook** and job prospects
4. **Salary Trends** by experience level
5. **Career Paths** and specializations
6. **Learning Recommendations** to stay current

Focus on actionable insights for someone entering or advancing in ${field}. Keep it current and practical.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error analyzing trends:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  getFallbackRoadmap(userProfile) {
    return `Hi ${userProfile.name}! Here's a basic career roadmap for ${userProfile.careerGoal}:

🎯 IMMEDIATE STEPS (Next 3 months):
• Strengthen your ${userProfile.skills} skills through practice projects
• Build a portfolio showcasing your work
• Update your LinkedIn profile and resume
• Start networking in your field

📈 SHORT-TERM GOALS (6-12 months):
• Complete relevant online courses or certifications
• Apply for internships or entry-level positions
• Join professional communities and attend events
• Work on 2-3 significant projects

🚀 LONG-TERM OBJECTIVES (1-3 years):
• Gain practical experience in your chosen field
• Develop leadership and communication skills
• Build a strong professional network
• Consider specialization areas within ${userProfile.careerGoal}

💡 RECOMMENDATIONS:
• Focus on continuous learning
• Seek mentorship opportunities
• Stay updated with industry trends
• Practice problem-solving regularly

🤖 **AI Agent Commands Available:**
Type these commands for specialized help:
• "skill gap analysis" - Assess your skill gaps
• "project ideas" - Get project recommendations
• "interview prep" - Prepare for interviews
• "industry trends" - Learn about market trends

This is a general roadmap. For more personalized advice, please try again when our AI service is available!`;
  }

  getFallbackResponse(command, userProfile) {
    const responses = {
      'skill-gap': `Here's a basic skill gap analysis for ${userProfile.careerGoal}:\n\n**Your Strengths:** ${userProfile.skills}\n\n**Common Requirements:**\n• Technical skills specific to your field\n• Problem-solving abilities\n• Communication skills\n• Project management\n\n**Next Steps:**\n• Research job descriptions in your target field\n• Identify the most in-demand skills\n• Create a learning plan\n• Build projects to demonstrate skills`,

      'projects': `Project ideas for ${userProfile.careerGoal}:\n\n1. **Personal Portfolio Website**\n   - Showcase your skills and projects\n   - Learn web development basics\n\n2. **Skill-Specific Project**\n   - Build something related to ${userProfile.skills}\n   - Document your process\n\n3. **Open Source Contribution**\n   - Find projects on GitHub\n   - Start with documentation or small fixes\n\n4. **Problem-Solving Project**\n   - Identify a real-world problem\n   - Create a solution using your skills`,

      'interview': `Interview preparation for ${userProfile.careerGoal}:\n\n**Common Questions:**\n• Tell me about yourself\n• Why are you interested in this role?\n• Describe a challenging project\n• What are your strengths/weaknesses?\n\n**Technical Preparation:**\n• Review fundamentals in ${userProfile.skills}\n• Practice coding problems\n• Prepare project explanations\n\n**Questions to Ask:**\n• What does a typical day look like?\n• What are the growth opportunities?\n• What challenges is the team facing?`,

      'trends': `Current trends in ${userProfile.careerGoal}:\n\n**Growing Areas:**\n• AI and Machine Learning integration\n• Cloud computing and DevOps\n• Cybersecurity awareness\n• Remote work capabilities\n\n**In-Demand Skills:**\n• Problem-solving and critical thinking\n• Collaboration and communication\n• Adaptability to new technologies\n• Continuous learning mindset\n\n**Recommendations:**\n• Stay updated with industry news\n• Follow thought leaders in your field\n• Join professional communities\n• Attend webinars and conferences`
    };

    return responses[command] || "I'm currently experiencing technical difficulties. Please try again later.";
  }

  getFallbackFollowUpResponse(question, userProfile) {
    const intent = this.detectIntent(question);

    const responses = {
      'skill-gap': `Regarding skill gaps for your ${userProfile.careerGoal} journey:\n\n**Your Current Skills:** ${userProfile.skills}\n\n**Recommended Focus Areas:**\n• Core technical skills for ${userProfile.careerGoal}\n• Soft skills like communication and teamwork\n• Industry-specific tools and frameworks\n\n**Action Steps:**\n1. Assess job descriptions for your target role\n2. Identify 2-3 key skills to develop first\n3. Set up a learning schedule\n4. Practice through projects\n\nTry asking "skill gap analysis" for a detailed assessment!`,

      'projects': `For project ideas to build your ${userProfile.careerGoal} portfolio:\n\n**Quick Wins:**\n• Personal website showcasing your ${userProfile.skills}\n• Small utility tool using your skills\n• Tutorial or documentation project\n\n**Medium Projects:**\n• Full-stack application\n• Data analysis project\n• Open source contribution\n\n**Advanced Projects:**\n• Complex system with multiple technologies\n• Team collaboration project\n• Real-world problem solution\n\nStart with something that interests you and aligns with your skills. Ask "project ideas" for specific recommendations!`,

      'interview': `Preparing for ${userProfile.careerGoal} interviews:\n\n**Key Areas to Focus:**\n• Technical questions in ${userProfile.skills}\n• Behavioral questions (STAR method)\n• System design (if applicable)\n• Your projects and experience\n\n**Preparation Tips:**\n• Practice coding problems daily\n• Review your resume projects\n• Prepare stories for common questions\n• Research the company\n\nMock interviews and recording yourself can help a lot. Try "interview prep" for detailed guidance!`,

      'trends': `Current trends in ${userProfile.careerGoal}:\n\n**Hot Skills:**\n• AI/ML integration\n• Cloud technologies\n• DevOps practices\n• Cybersecurity fundamentals\n\n**Industry Changes:**\n• Remote work normalization\n• Focus on automation\n• Data-driven decision making\n• Continuous learning culture\n\n**Your Next Steps:**\n• Stay updated with industry news\n• Learn trending technologies\n• Network with professionals\n• Consider certifications\n\nAsk "industry trends" for more specific insights!`,

      'learning': `Learning resources for ${userProfile.careerGoal}:\n\n**Free Resources:**\n• Online tutorials and documentation\n• YouTube channels and blogs\n• Open source projects\n• Community forums\n\n**Structured Learning:**\n• Online courses (Coursera, Udemy, edX)\n• Books and documentation\n• Bootcamps and certifications\n• University courses\n\n**Practical Learning:**\n• Build personal projects\n• Contribute to open source\n• Join coding communities\n• Attend meetups and conferences\n\nFocus on consistent practice and application!`,

      'salary': `Salary expectations for ${userProfile.careerGoal}:\n\n**Entry Level:** Typically $50K-$80K depending on location and company\n**Mid Level:** $80K-$120K with 2-4 years experience\n**Senior Level:** $120K+ with specialized skills\n\n**Factors Affecting Salary:**\n• Location (cost of living)\n• Company size and industry\n• Your specific skills and experience\n• Negotiation skills\n\nResearch Glassdoor and Levels.fyi for accurate data in your area.`,

      'networking': `Networking tips for ${userProfile.careerGoal}:\n\n**Online Networking:**\n• LinkedIn profile optimization\n• Join professional groups\n• Participate in discussions\n• Connect with alumni\n\n**Offline Networking:**\n• Attend industry meetups\n• Join local tech communities\n• Attend conferences\n• Informational interviews\n\n**Tips:**\n• Be genuine in conversations\n• Offer help before asking\n• Follow up on connections\n• Share your knowledge\n\nConsistency is key in building your network!`,

      'resume': `Resume tips for ${userProfile.careerGoal}:\n\n**Structure:**\n• Contact information\n• Professional summary\n• Skills section\n• Experience/Projects\n• Education\n\n**Key Tips:**\n• Quantify achievements\n• Use action verbs\n• Tailor to each job\n• Keep it concise (1 page)\n• Highlight relevant projects\n\n**For ${userProfile.year} students:**\n• Focus on projects and skills\n• Include coursework and GPA if strong\n• Add personal projects\n• Highlight internships\n\nGet feedback from mentors!`,

      'general': `That's a great question about your ${userProfile.careerGoal} journey! Based on your profile:\n\n**Your Background:**\n- Year: ${userProfile.year}\n- College: ${userProfile.collegeTier}\n- Skills: ${userProfile.skills}\n\nI'm here to help with career guidance, skill development, and industry insights. Feel free to ask about:\n• Specific technologies or skills\n• Career progression steps\n• Interview preparation\n• Industry trends\n• Project ideas\n\nWhat specific aspect would you like to explore more?`
    };

    return responses[intent] || responses['general'];
  }

  detectIntent(message) {
    const intents = {
      'skill-gap': ['skill gap', 'skills needed', 'what skills', 'skill analysis', 'missing skills'],
      'projects': ['project ideas', 'project suggestions', 'what projects', 'build projects', 'portfolio projects'],
      'interview': ['interview prep', 'interview questions', 'interview help', 'job interview', 'interview tips'],
      'trends': ['industry trends', 'market trends', 'future of', 'job market', 'career outlook'],
      'salary': ['salary', 'compensation', 'pay scale', 'earnings', 'income'],
      'learning': ['learn', 'courses', 'resources', 'study', 'education'],
      'networking': ['networking', 'connections', 'professional network', 'meet people'],
      'resume': ['resume', 'cv', 'curriculum vitae', 'resume help', 'resume tips']
    };

    const lowerMessage = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }
};

module.exports = new GeminiService();
