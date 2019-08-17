# Some links
# https://andrewlock.net/exploring-the-net-core-2-1-docker-files-dotnet-runtime-vs-aspnetcore-runtime-vs-sdk/ 
# https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
# https://satjinder.com/2018/11/02/how-to-create-a-dotnet-based-spa-and-deploy-it-in-docker/
# https://blog.playmoweb.com/speed-up-your-builds-with-docker-cache-bfed14c051bf

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime

# Runtime needs node & supervisor (supervisor manages running multiple applications)
RUN apt-get update -yq && apt-get upgrade -yq
RUN apt-get install -yq --fix-missing \
		dos2unix \
		curl \
		git \
		nano \
		gnupg \
		gnupg2 \
		gnupg1 \
		procps \
		net-tools \
		supervisor
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

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80 2222

ENTRYPOINT ["/usr/local/bin/init.sh"]

COPY Docker/sshd_config /etc/ssh/sshd_config
RUN dos2unix /etc/ssh/sshd_config

COPY Docker/init.sh /usr/local/bin/init.sh
RUN dos2unix /usr/local/bin/init.sh
RUN chmod u+x /usr/local/bin/init.sh

COPY Docker/pm2-configuration.yml /usr/local/bin/pm2-configuration.yml
RUN dos2unix /usr/local/bin/pm2-configuration.yml

# npm installs are slow, do the runtime installs first for JsonServer and HypernovaComponentServer
COPY Web.App/JsonServer/package*.json /app/JsonServer/
WORKDIR /app/JsonServer
RUN npm install

COPY Web.App/HypernovaComponentServer/package*.json /app/HypernovaComponentServer/
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
COPY Web.App/ClientApp/package*.json /src/Web.App/ClientApp/
WORKDIR /src/Web.App/ClientApp
RUN npm install

# === Build DotNet Core web application ===
# copy csproj and restore as distinct layers
WORKDIR /src
COPY *.sln .
COPY Web.App/Web.App.csproj ./Web.App/
RUN dotnet restore
COPY Web.App/. ./Web.App/

WORKDIR /src/Web.App/ClientApp
RUN npm run build:server-bundle:production

WORKDIR /src/Web.App
RUN dotnet publish -c Release -o out

# === Copy the published DotNet Core web app from sdk:/published to runtime:/app
FROM runtime AS final

COPY --from=sdk /src/Web.App/out /app/

