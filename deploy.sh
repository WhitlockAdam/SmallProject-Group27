# Define the GitHub repository URL
REPO_URL=https://github.com/WhitlockAdam/SmallProject-Group27.git

# Navigate to your project directory
cd $PROJECT_DIR

# Pull the latest code from GitHub
git pull origin main

# If you're using Composer for PHP dependencies, uncomment the following line
# composer install

# Restart your web server (if necessary)
# For Apache:
systemctl restart apache2
