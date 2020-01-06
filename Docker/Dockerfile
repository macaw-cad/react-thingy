# Some links
# https://www.softwaredeveloper.blog/multi-project-dotnet-core-solution-in-docker-image
# https://andrewlock.net/exploring-the-net-core-2-1-docker-files-dotnet-runtime-vs-aspnetcore-runtime-vs-sdk/ 
# https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
# https://satjinder.com/2018/11/02/how-to-create-a-dotnet-based-spa-and-deploy-it-in-docker/
# https://blog.playmoweb.com/speed-up-your-builds-with-docker-cache-bfed14c051bf

# NGINX 1.16 is Debian 9 distribution (see cat /etc/os-release)
FROM nginx:1.16 AS runtime

# Runtime needs:
# - wget to download .NET Core
# - gettext-base for the tool envsubst used to replace environment variables in nginx template file
# - node
# - .NET Core
RUN apt-get update -yq && apt-get upgrade -yq
RUN apt-get install -yq --fix-missing \
		wget \
		dos2unix \
		curl \
		git \
		nano \
		gnupg \
		gnupg2 \
		gnupg1 \
		procps \
		net-tools \
		gettext-base

### Install .NET Core (https://dotnet.microsoft.com/download/linux-package-manager/debian9/runtime-2.2.6)

# Register Microsoft key and feed
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
RUN mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
RUN wget -q https://packages.microsoft.com/config/debian/9/prod.list
RUN mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
RUN chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
RUN chown root:root /etc/apt/sources.list.d/microsoft-prod.list

# Install .NET Core
RUN apt-get install apt-transport-https -yq
RUN apt-get update -yq
RUN apt-get install aspnetcore-runtime-2.2 -yq

# Install NodeJS 12.x
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -yq nodejs

# Enable with ssh 
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
	&& apt-get install -y --no-install-recommends openssh-server \
	&& echo "$SSH_PASSWD" | chpasswd 

# Install PM2
RUN npm install -g pm2

WORKDIR /app

ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE  80 2222

ENTRYPOINT ["/usr/local/bin/init.sh"]

COPY Docker/sshd_config /etc/ssh/sshd_config
RUN dos2unix /etc/ssh/sshd_config

# npm installs are slow, do the runtime installs first for JsonServer and HypernovaComponentServer
COPY src/Web.App/JsonServer/package*.json /app/JsonServer/
WORKDIR /app/JsonServer
RUN npm install

COPY src/Web.App/HypernovaComponentServer/package*.json /app/HypernovaComponentServer/
WORKDIR /app/HypernovaComponentServer
RUN npm install

FROM microsoft/dotnet:2.2-sdk AS sdk

# Build needs node
RUN apt-get update -yq && apt-get upgrade -yq
RUN apt-get install -yq --fix-missing \
		curl \
		git \
		nano \
		gnupg \
		gnupg2 \
		gnupg1
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -yq nodejs build-essential
RUN npm install -g npm
RUN node --version

# npm installs are slow, do those first
COPY src/Web.App/ClientApp/package*.json /src/Web.App/ClientApp/
WORKDIR /src/Web.App/ClientApp
RUN npm install

# === Build DotNet Core web application ===
# copy solution file and csproj files and restore as distinct layers
WORKDIR /src
COPY src/ ./
RUN dotnet restore

WORKDIR /src/Web.App/ClientApp
RUN npm run build:server-bundle:production

WORKDIR /src

# Build and publish all projects, leave result in their folder, e.g. Web.App/bin/Release/netcoreapp2.2
RUN dotnet publish -c Release

# Only keep appsettings.json, delete appsettings.Development.json, appsettings.Production.json, ...
RUN find . -name "appsettings.*.json" -type f -delete

# === Copy the published DotNet Core apps from sdk:/published to runtime:/app
FROM runtime AS final

# npm installs already done for JsonServer and HypernovaComponentServer - just copy content
COPY src/Web.App/JsonServer /app/JsonServer/.
COPY src/Web.App/HypernovaComponentServer /app/HypernovaComponentServer/.

COPY --from=sdk /src/Web.App/bin/Release/netcoreapp2.2/publish /app/Web.App
COPY --from=sdk /src/Web.Api.Versioned/bin/Release/netcoreapp2.2/publish /app/Web.Api.Versioned

# Below only needed for development
RUN apt-get install vim iputils-ping -yq


# COPY Docker/index.html /www/test/index.html

# RUN envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
COPY Docker/mime.types /etc/nginx/mime.types
RUN dos2unix /etc/nginx/mime.types

COPY Docker/init.sh /usr/local/bin/init.sh
RUN dos2unix /usr/local/bin/init.sh
RUN chmod u+x /usr/local/bin/init.sh

COPY Docker/pm2-configuration.yml /usr/local/bin/pm2-configuration.yml
RUN dos2unix /usr/local/bin/pm2-configuration.yml

# NGINX configuration copied last - lots of optimizations expected on this so will change often
COPY Docker/nginx.config /etc/nginx/nginx.conf
RUN dos2unix /etc/nginx/nginx.conf
