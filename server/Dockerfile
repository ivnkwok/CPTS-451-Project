FROM python:3.11.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install git
RUN apt-get update && \
    apt-get install -y git dos2unix && \
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

ENV PYTHONPATH=/code
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Set working directory
WORKDIR /code
RUN chown devcontainer:devcontainer /code

# Copy all server files
COPY . /code/
RUN chown -R devcontainer:devcontainer /code

# Fix line endings and make entrypoint executable
RUN dos2unix /code/entrypoint.sh && \
    chmod +x /code/entrypoint.sh

# Install Python dependencies
RUN pip install -r /code/requirements.txt

# Make sure scripts in venv are executable
RUN chmod +x /venv/bin/*

USER devcontainer

ENTRYPOINT ["/code/entrypoint.sh"]