FROM python:3.11.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install git
RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user (using Debian commands)
RUN groupadd -g 1000 devcontainer && \
    useradd -m -u 1000 -g devcontainer devcontainer

# Create virtual environment directory and set ownership
RUN python3 -m venv /venv && \
    chown -R devcontainer:devcontainer /venv

# Set environment path so virtual environment is used by default
# when running python commands
ENV VIRTUAL_ENV=/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

ENV PYTHONPATH=/code/server
ENV DJANGO_SETTINGS_MODULE=server.settings

# Set working directory
WORKDIR /code/server
RUN chown devcontainer:devcontainer /code

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Make sure scripts in venv are executable
RUN chmod +x /venv/bin/*

# Set up entrypoint shell script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh 

USER devcontainer