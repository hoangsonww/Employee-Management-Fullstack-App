FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG USERNAME=vscode

# Install base tooling and Java 17 + Maven.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        gnupg2 \
        unzip \
        zip \
        openjdk-17-jdk \
        maven && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x and enable Corepack (for yarn/pnpm handling).
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g npm@latest && \
    corepack enable && \
    rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Ensure the vscode user owns global npm directory to avoid permission issues.
RUN mkdir -p /usr/local/share/npm-global && \
    chown -R "${USERNAME}":"${USERNAME}" /usr/local/share/npm-global

ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH="${NPM_CONFIG_PREFIX}/bin:${PATH}"

USER ${USERNAME}

RUN npm config set prefix "${NPM_CONFIG_PREFIX}"

WORKDIR /workspaces
