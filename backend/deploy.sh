#!/bin/bash

# Exit on error
set -e

# Print commands as they are executed
set -x

echo "Starting deployment process..."

cd /home/sinyoro/Documents/projects/vakaden/backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Make sure we have a database file
echo "Creating database if it doesn't exist..."
touch db.sqlite3

# Apply migrations
echo "Applying database migrations..."
python manage.py migrate

# Create superuser if it doesn't exist
# Note: This will only create the superuser if it doesn't exist
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        'admin',
        'admin@example.com',
        'adminpassword'
    )
END

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Deployment complete!"
