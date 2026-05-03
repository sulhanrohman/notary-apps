# Deployment Guide (Ubuntu 22.04)

This guide outlines the steps to deploy the Multi-Tenant SaaS application using Nginx, PM2, and PostgreSQL.

## 1. Prerequisites
Update your system and install necessary dependencies:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx
```

## 2. PostgreSQL Setup
Login to PostgreSQL and create the database:
```bash
sudo -i -u postgres
psql
CREATE DATABASE multisaas;
CREATE USER saas_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE multisaas TO saas_user;
\q
exit
```

## 3. Application Setup
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd <repo-dir>
npm install
cp .env.example .env
# Edit .env with your production values
nano .env
```

Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

Build the application:
```bash
npm run build
```

## 4. PM2 Process Manager
Install PM2 globally and start the application:
```bash
sudo npm install -g pm2
pm2 start dist/main.js --name "saas-backend"
pm2 save
pm2 startup
```

## 5. Nginx Configuration
Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/multisaas
```

**Configuration Content:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/multisaas/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/multisaas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Maintenance Commands
- **View logs:** `pm2 logs saas-backend`
- **Restart app:** `pm2 restart saas-backend`
- **Check status:** `pm2 status`
