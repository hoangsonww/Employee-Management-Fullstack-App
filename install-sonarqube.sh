#!/bin/bash

set -e

echo "======================================"
echo " SonarQube Installation Started"
echo "======================================"

# Check Docker
if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed."
    echo "Please install Docker first."
    exit 1
fi

echo "Docker found:"
docker --version

# Configure Linux kernel parameters
echo "Configuring Linux kernel parameters..."

sudo sysctl -w vm.max_map_count=524288
sudo sysctl -w fs.file-max=131072

sudo tee /etc/sysctl.d/99-sonarqube.conf > /dev/null <<EOF
vm.max_map_count=524288
fs.file-max=131072
EOF

sudo sysctl --system

# Create SonarQube directories
echo "Creating SonarQube directories..."

sudo mkdir -p /opt/sonarqube/data
sudo mkdir -p /opt/sonarqube/logs
sudo mkdir -p /opt/sonarqube/extensions

sudo chown -R 1000:1000 /opt/sonarqube

# Remove old container if it exists
if sudo docker ps -a --format '{{.Names}}' | grep -q '^sonarqube$'; then
    echo "Existing SonarQube container found."
    sudo docker rm -f sonarqube
fi

# Pull SonarQube image
echo "Pulling SonarQube image..."

sudo docker pull sonarqube:lts-community

# Start SonarQube
echo "Starting SonarQube..."

sudo docker run -d \
    --name sonarqube \
    --restart unless-stopped \
    -p 9000:9000 \
    -v /opt/sonarqube/data:/opt/sonarqube/data \
    -v /opt/sonarqube/logs:/opt/sonarqube/logs \
    -v /opt/sonarqube/extensions:/opt/sonarqube/extensions \
    sonarqube:lts-community

echo ""
echo "======================================"
echo " SonarQube Started Successfully"
echo "======================================"

echo ""
echo "Container Status:"
sudo docker ps --filter name=sonarqube

echo ""
echo "SonarQube URL:"
echo "http://<EC2-PUBLIC-IP>:9000"

echo ""
echo "Default Login:"
echo "Username: admin"
echo "Password: admin"

echo ""
echo "Check logs using:"
echo "docker logs -f sonarqube"

echo ""
echo "Installation completed."
