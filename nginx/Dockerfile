# Base image for nginx
FROM nginx:1.27-alpine

# Remove the default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Basic health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O - http://localhost/nginx-health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
