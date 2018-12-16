@echo off
cd %~dp0
docker kill "localhypernovacomponentserver"

echo Some IP addresses on the local machine (for Postman testing against component server when baseUrl must be specified by IP):
ipconfig | find "IPv4"

docker run -p 8080:8080 --name "localhypernovacomponentserver" --rm --network bridge -e ComponentServerBundles={"pwa":"./server-bundle.js"} hypernovacomponentserver:1.0.0
popd