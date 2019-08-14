# Some links
# https://andrewlock.net/exploring-the-net-core-2-1-docker-files-dotnet-runtime-vs-aspnetcore-runtime-vs-sdk/ 
# https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
# https://satjinder.com/2018/11/02/how-to-create-a-dotnet-based-spa-and-deploy-it-in-docker/

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
COPY Docker/sshd_config /etc/ssh/sshd_config
RUN dos2unix /etc/ssh/sshd_config

RUN mkdir -p /var/log/supervisor
COPY Docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN dos2unix /etc/supervisor/conf.d/supervisord.conf
COPY Docker/init.sh /usr/local/bin/init.sh
RUN dos2unix /usr/local/bin/init.sh

RUN chmod u+x /usr/local/bin/init.sh

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

# === Build DotNet Core web application ===
# copy csproj and restore as distinct layers
WORKDIR /src
COPY *.sln .
COPY Web.App/Web.App.csproj ./Web.App/
RUN dotnet restore
COPY Web.App/. ./Web.App/

WORKDIR /src/Web.App/ClientApp
RUN npm install
RUN npm run build:server-bundle:production

WORKDIR /src/Web.App
RUN dotnet publish -c Release -o out

# === Copy the published DotNet Core web app from sdk:/published to runtime:/app
FROM runtime AS final

WORKDIR /app
COPY --from=sdk /src/Web.App/out ./

WORKDIR /app/HypernovaComponentServer
RUN npx rimraf node_modules
RUN npm install

WORKDIR /app/JsonServer
RUN npx rimraf node_modules
RUN npm install

WORKDIR /app

EXPOSE 80 2222
ENTRYPOINT ["/usr/local/bin/init.sh"]