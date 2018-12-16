# Some links
# https://andrewlock.net/exploring-the-net-core-2-1-docker-files-dotnet-runtime-vs-aspnetcore-runtime-vs-sdk/ 
# https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html
# https://satjinder.com/2018/11/02/how-to-create-a-dotnet-based-spa-and-deploy-it-in-docker/

FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base

# Runtime needs node & supervisor (manages running multiple applications)
RUN apt-get update -yq && apt-get upgrade -yq
RUN apt-get install -yq \
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
RUN mkdir -p /var/log/supervisor
COPY Web.App/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY Web.App/init.sh /usr/local/bin/init.sh
RUN chmod u+x /usr/local/bin/init.sh

WORKDIR /app

FROM microsoft/dotnet:2.1-sdk AS build

# Build needs node
RUN apt-get update -yq && apt-get upgrade -yq
RUN apt-get install -yq \
		curl \
		git \
		nano \
		gnupg \
		gnupg2 \
		gnupg1
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -yq nodejs build-essential
RUN npm install -g npm
RUN node --version

# Build DotNet Core web application
WORKDIR /src
COPY Web.App/Web.App.csproj Web.App/
RUN dotnet restore Web.App/Web.App.csproj
COPY . .

# Wipe node_modules, can contain Windows versions of modules
WORKDIR /src/Web.App/ClientApp
RUN npx rimraf node_modules
RUN npm install

WORKDIR /src/Web.App
RUN dotnet build "Web.App.csproj" -c Release -o /app

FROM build AS publish

WORKDIR /src/Web.App
RUN dotnet publish "Web.App.csproj" -c Release -o /app

FROM base AS final

# Copy the published DotNet Core web app to /app
WORKDIR /app
COPY --from=publish /app .

WORKDIR /app/HypernovaComponentServer
RUN npx rimraf node_modules
RUN npm install

# Copy the required HypernovaComponentServer files to /hypernovacomponentserver
#WORKDIR "/hypernovacomponentserver"

# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
# COPY --from=build /src/Web.App/HypernovaComponentServer/package*.json ./
# RUN npm install --only=production
#
#COPY --from=build /src/Web.App/HypernovaComponentServer/componentserver.js ./
#COPY --from=build /src/Web.App/HypernovaComponentServer/server-bundle.* ./
#COPY --from=build /src/Web.App/HypernovaComponentServer/creationinfo.txt ./
#COPY --from=build /src/Web.App/HypernovaComponentServer/node_modules ./

ENTRYPOINT ["/usr/local/bin/init.sh"]
