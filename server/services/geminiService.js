const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  /**
   * Generate content with retry logic
   * @param {string} prompt - The prompt to send
   * @param {number} retryCount - Current retry attempt
   * @returns {Promise<string>} Generated content
   */
  async generateWithRetry(prompt, retryCount = 0) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
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

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a personalized career roadmap based on user profile
   * @param {Object} userProfile - User's career profile
   * @returns {Promise<string>} Generated roadmap
   */
  async generateCareerRoadmap(userProfile) {
    try {
      const { name, year, collegeTier, skills, careerGoal } = userProfile;
      
      const prompt = `Create a personalized career roadmap for ${name}:

Profile:
- Academic Year: ${year}
- College Tier: ${collegeTier}
- Current Skills: ${skills}
- Career Goal: ${careerGoal}

Provide a comprehensive roadmap with:
1. Immediate next steps (next 3 months)
2. Short-term goals (6-12 months)
3. Long-term objectives (1-3 years)
4. Skill development recommendations
5. Project suggestions
6. Learning resources
7. Industry-specific advice

Format: Clear, actionable, with specific timelines. Keep it encouraging and practical. Limit to 1500 words.`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error generating career roadmap:', error.message);
      console.error('Full error:', error);
      
      // Always throw error to let conversation service handle it
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Generate a follow-up response based on user question
   * @param {string} question - User's follow-up question
   * @param {Object} userProfile - User's career profile for context
   * @returns {Promise<string>} Generated response
   */
  async generateFollowUpResponse(question, userProfile) {
    try {
      const prompt = `Based on this profile:
- Name: ${userProfile.name}
- Year: ${userProfile.year}
- College: ${userProfile.collegeTier}
- Skills: ${userProfile.skills}
- Goal: ${userProfile.careerGoal}

Question: "${question}"

Provide a helpful, specific, actionable response relevant to their career goals. Keep it concise (under 300 words).`;

      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error('Error generating follow-up response:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Fallback roadmap for when AI service fails
   * @param {Object} userProfile - User's career profile
   * @returns {string} Basic roadmap
   */
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

This is a general roadmap. For more personalized advice, please try again when our AI service is available!`;
  }
}

module.exports = new GeminiService();