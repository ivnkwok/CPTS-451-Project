FROM python:3.11.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -g 1000 devcontainer && \
    useradd -m -u 1000 -g devcontainer devcontainer

# Create virtual environment directory and set ownership
RUN python3 -m venv /venv && \
    chown -R devcontainer:devcontainer /venv

# Set environment variables
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PYTHONPATH=/app/server
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Set working directory
WORKDIR /app/server
RUN chown devcontainer:devcontainer /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Make sure scripts in venv are executable
RUN chmod +x /venv/bin/*

# Copy project files
COPY . .

# Set up entrypoint shell script
COPY entrypoint.sh /app/server/entrypoint.sh
RUN chmod +x /app/server/entrypoint.sh

# Create necessary directories
RUN mkdir -p /app/server/backend/static /app/server/backend/media && \
    chown -R devcontainer:devcontainer /app/server/backend/static /app/server/backend/media

USER devcontainer