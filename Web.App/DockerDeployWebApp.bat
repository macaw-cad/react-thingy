::Component server Docker image locally available as "hypernovacomponentserver:1.0.0". Push it to the
:: Azure container registry as "anwbcontainersregistry.azurecr.io/webapp:latest".
:: When the Docker image is pushed to the Azure registry it is automatically deployed to 
:: the site "https://anwb-campingcs-prd-pre-prod.azurewebsites.net".
@echo off

echo PUBLISH TO maartenl.azurecr.io/webapp:latest
pushd %~dp0
docker tag webapp:latest maartenl.azurecr.io/webapp:latest
docker login maartenl.azurecr.io --username maartenl --password 5WKgCbBGjLYT4Ro3pq/be5pl3gfeKV05
docker push maartenl.azurecr.io/webapp:latest
popd
