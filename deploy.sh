#!/bin/bash

# Go to your project directory
cd /var/www/cop4331.com

# Pull the latest code from GitHub
git pull origin main

# Restart your web server (if necessary)
systemctl restart apache2
