#!/bin/bash

# Go to your project directory
cd ..
cd var
cd www
cd 4331cop.com

# Pull the latest code from GitHub
git pull origin main

# Restart your web server (if necessary)
systemctl restart apache2
