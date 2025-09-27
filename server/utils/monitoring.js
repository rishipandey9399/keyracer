const os = require('os');
const ChatSession = require('../models/ChatSession');

class MonitoringService {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.chatSessionCount = 0;
  }

  /**
   * Get system health metrics
   */
  getSystemHealth() {
    const uptime = Date.now() - this.startTime;
    const memUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      uptime: Math.floor(uptime / 1000),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage(),
        loadAvg: os.loadavg()
      },
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount * 100).toFixed(2) : 0
      },
      chatSessions: this.chatSessionCount
    };
  }

  /**
   * Get chat service specific metrics
   */
  async getChatMetrics() {
    try {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

      const metrics = {
        totalSessions: 0,
        activeSessions: 0,
        completedSessions: 0,
        last24hSessions: 0,
        lastHourSessions: 0,
        averageSessionDuration: 0
      };

      if (process.env.NODE_ENV === 'production') {
        // Database queries for production
        const [total, active, completed, recent24h, recentHour] = await Promise.all([
          ChatSession.countDocuments(),
          ChatSession.countDocuments({ isComplete: false, updatedAt: { $gte: lastHour } }),
          ChatSession.countDocuments({ isComplete: true }),
          ChatSession.countDocuments({ createdAt: { $gte: last24h } }),
          ChatSession.countDocuments({ createdAt: { $gte: lastHour } })
        ]);

        metrics.totalSessions = total;
        metrics.activeSessions = active;
        metrics.completedSessions = completed;
        metrics.last24hSessions = recent24h;
        metrics.lastHourSessions = recentHour;

        // Calculate average session duration
        const completedWithDuration = await ChatSession.aggregate([
          { $match: { isComplete: true } },
          { $project: { duration: { $subtract: ['$updatedAt', '$createdAt'] } } },
          { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
        ]);

        if (completedWithDuration.length > 0) {
          metrics.averageSessionDuration = Math.round(completedWithDuration[0].avgDuration / 1000 / 60); // minutes
        }
      }

      return metrics;
    } catch (error) {
      console.error('Error getting chat metrics:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        completedSessions: 0,
        last24hSessions: 0,
        lastHourSessions: 0,
        averageSessionDuration: 0,
        error: 'Failed to fetch metrics'
      };
    }
  }

  /**
   * Increment request counter
   */
  incrementRequests() {
    this.requestCount++;
  }

  /**
   * Increment error counter
   */
  incrementErrors() {
    this.errorCount++;
  }

  /**
   * Increment chat session counter
   */
  incrementChatSessions() {
    this.chatSessionCount++;
  }

  /**
   * Check if system is healthy
   */
  isHealthy() {
    const health = this.getSystemHealth();
    const memoryUsage = (health.memory.used / health.memory.total) * 100;
    const errorRate = parseFloat(health.requests.errorRate);

    return {
      healthy: memoryUsage < 90 && errorRate < 10,
      issues: {
        highMemory: memoryUsage >= 90,
        highErrorRate: errorRate >= 10
      },
      metrics: health
    };
  }

  /**
   * Clean up old sessions (call periodically)
   */
  async cleanupOldSessions() {
    if (process.env.NODE_ENV === 'production') {
      try {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const result = await ChatSession.deleteMany({ 
          createdAt: { $lt: cutoffTime },
          isComplete: true 
        });
        
        if (result.deletedCount > 0) {
          console.log(`Cleaned up ${result.deletedCount} old chat sessions`);
        }
        
        return result.deletedCount;
      } catch (error) {
        console.error('Error cleaning up old sessions:', error);
        return 0;
      }
    }
    return 0;
  }
}

module.exports = new MonitoringService();