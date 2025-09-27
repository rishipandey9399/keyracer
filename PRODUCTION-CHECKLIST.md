# 🚀 Production Deployment Checklist - KeyRacer AI Career Chatbot

## ✅ Pre-Deployment Checklist

### 🔧 Environment Setup
- [ ] Node.js v14+ installed on production server
- [ ] MongoDB Atlas or production MongoDB instance configured
- [ ] SSL certificates obtained and configured
- [ ] Domain name configured and DNS pointing to server
- [ ] Firewall configured (ports 80, 443, 22 only)

### 🔐 Security Configuration
- [ ] `.env.production` file created with production values
- [ ] Strong `SESSION_SECRET` and `JWT_SECRET` generated
- [ ] `GEMINI_API_KEY` configured and tested
- [ ] MongoDB connection secured with authentication
- [ ] CORS origins restricted to production domain
- [ ] Rate limiting configured appropriately

### 📊 Monitoring & Logging
- [ ] Log directory created with proper permissions
- [ ] PM2 or systemd service configured
- [ ] Health check endpoints tested
- [ ] Error tracking system set up (optional)
- [ ] Backup strategy implemented

## 🚀 Deployment Steps

### 1. Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y
```

### 2. Application Deployment
```bash
# Clone or upload your application
git clone <your-repo> keyracer
cd keyracer

# Run production deployment script
./deploy-production.sh

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration
```bash
# Copy nginx configuration
sudo cp nginx.conf.template /etc/nginx/sites-available/keyracer
# Edit the file to replace YOUR_DOMAIN with actual domain
sudo nano /etc/nginx/sites-available/keyracer

# Enable the site
sudo ln -s /etc/nginx/sites-available/keyracer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Setup (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔍 Post-Deployment Verification

### Health Checks
- [ ] Application starts without errors: `pm2 status`
- [ ] Health endpoint responds: `curl https://yourdomain.com/api/health`
- [ ] Chat service works: `curl https://yourdomain.com/api/chat/health`
- [ ] SSL certificate valid: Check in browser
- [ ] All pages load correctly

### Performance Tests
- [ ] Load time under 3 seconds
- [ ] Chat widget loads and functions
- [ ] AI responses generate successfully
- [ ] Mobile responsiveness verified
- [ ] Rate limiting works correctly

### Security Tests
- [ ] HTTPS redirect works
- [ ] Security headers present
- [ ] No sensitive data in client-side code
- [ ] API endpoints properly secured
- [ ] Database connection secured

## 📊 Monitoring Commands

### Application Monitoring
```bash
# Check PM2 status
pm2 status
pm2 logs keyracer-production

# Check system resources
htop
df -h
free -m

# Check nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/keyracer_access.log
```

### Health Monitoring
```bash
# Application health
curl https://yourdomain.com/api/health

# Chat service health
curl https://yourdomain.com/api/chat/health

# System monitoring endpoint
curl https://yourdomain.com/api/monitoring
```

## 🔧 Maintenance Tasks

### Daily
- [ ] Check application logs for errors
- [ ] Monitor system resources (CPU, memory, disk)
- [ ] Verify health check endpoints

### Weekly
- [ ] Review chat usage metrics
- [ ] Check for security updates
- [ ] Backup database
- [ ] Review error logs

### Monthly
- [ ] Update dependencies: `npm audit fix`
- [ ] Review and rotate logs
- [ ] Performance optimization review
- [ ] Security audit

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs keyracer-production

# Check environment variables
cat .env

# Test database connection
node -e "require('./server/utils/dbConnect')()"
```

#### High Memory Usage
```bash
# Restart application
pm2 restart keyracer-production

# Check for memory leaks
pm2 monit

# Adjust PM2 memory limit
pm2 delete keyracer-production
pm2 start ecosystem.config.js --env production
```

#### Chat Service Not Working
```bash
# Test Gemini API
curl https://yourdomain.com/api/chat/health

# Check API key
echo $GEMINI_API_KEY

# Review chat logs
pm2 logs keyracer-production | grep -i chat
```

#### SSL Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

## 📈 Performance Optimization

### Application Level
- Enable gzip compression in nginx
- Implement Redis caching for sessions
- Optimize database queries
- Use CDN for static assets

### Server Level
- Configure swap file if needed
- Optimize nginx worker processes
- Set up log rotation
- Monitor and tune MongoDB

### Monitoring Tools
- Set up Prometheus + Grafana (optional)
- Configure log aggregation (ELK stack)
- Implement uptime monitoring
- Set up alerting for critical issues

## 🔄 Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Automated backup script
echo "0 2 * * * /path/to/backup-script.sh" | crontab -
```

### Application Backup
```bash
# Code backup
tar -czf keyracer-backup-$(date +%Y%m%d).tar.gz /path/to/keyracer

# Environment backup
cp .env .env.backup.$(date +%Y%m%d)
```

## 📞 Support Contacts

- **Technical Issues**: Check GitHub issues
- **Security Concerns**: security@yourdomain.com
- **Performance Issues**: Monitor logs and metrics
- **Emergency**: Follow incident response plan

---

## 🎉 Production Launch Complete!

Your KeyRacer AI Career Chatbot is now production-ready with:

✅ **Security**: Rate limiting, HTTPS, input validation  
✅ **Performance**: Clustering, caching, optimization  
✅ **Monitoring**: Health checks, logging, metrics  
✅ **Reliability**: Error handling, graceful shutdown  
✅ **Scalability**: Database persistence, load balancing ready  

**Access Points:**
- 🌐 **Main Site**: https://yourdomain.com
- 🤖 **AI Career Chat**: https://yourdomain.com/career-guidance-demo.html
- 📊 **Health Check**: https://yourdomain.com/api/health

**Next Steps:**
1. Monitor application performance
2. Gather user feedback
3. Plan feature enhancements
4. Scale as needed

🚀 **Happy launching!**