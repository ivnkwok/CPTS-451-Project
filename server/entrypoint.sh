#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! pg_isready -h db -U ${POSTGRES_USER} -d ${POSTGRES_DB}; do
    sleep 1
done

# Run migrations
echo "Running Migrations"
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser"
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py createsuperuser \
        --noinput \
        --username="$DJANGO_SUPERUSER_USERNAME" \
        --email="$DJANGO_SUPERUSER_EMAIL"
    echo "Superuser created successfully"
else
    echo "Environment variables not set properly, could not create superuser"
fi

# Create test users
echo "Creating test users"
python create_test_users.py

# Collect static files
echo "Collecting static files"
python manage.py collectstatic --noinput

echo "Starting server"
exec "$@"