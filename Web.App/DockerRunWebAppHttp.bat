docker run -dt -e "ASPNETCORE_ENVIRONMENT=Production" -e "ASPNETCORE_URLS=http://+:80" -p 80:80 -p 443:443 -p 8080:8080 webapp:latest
