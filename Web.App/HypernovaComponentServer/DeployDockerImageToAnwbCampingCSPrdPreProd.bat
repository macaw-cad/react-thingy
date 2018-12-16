::Component server Docker image locally available as "hypernovacomponentserver:1.0.0". Push it to the
:: Azure container registry as "anwbcontainersregistry.azurecr.io/camping-componentserver:1.0.0".
:: When the Docker image is pushed to the Azure registry it is automatically deployed to 
:: the site "https://anwb-campingcs-prd-pre-prod.azurewebsites.net".
@echo off

echo PUBLISH TO anwbcontainersregistry.azurecr.io/camping-componentserver:1.0.0
pushd %~dp0
docker tag hypernovacomponentserver:1.0.0 anwbcontainersregistry.azurecr.io/camping-componentserver:1.0.0
docker login anwbcontainersregistry.azurecr.io --username anwbcontainersregistry --password Dchp4D3yF=YqriU7hrVwnwNUhPhWpKuM
docker push anwbcontainersregistry.azurecr.io/camping-componentserver:1.0.0
popd
