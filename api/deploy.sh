#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
gunicorn vakden.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-file -
