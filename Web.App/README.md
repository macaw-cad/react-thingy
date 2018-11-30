


  "Hypernova": {
    "ComponentServerUrl": "http://localhost:8080",
    "TimeoutInMilliseconds": 15000,
    "FallbackToClientSideRenderingOnly": false,
    "DisableFileCache": true,
    "ComponentServerBaseUrlOverride": "http://[local-ip]:9999",
    "PagesCacheName": "Pages",
    "AmpPagesCacheName": "AmpPages"
	
	
	
	<add key="Hypernova:ComponentServerUrl" value="http://localhost:8080"/>

    <!-- set to true if issues with Hypernova server and crawlers - NOTE: if SSR failes we always fall back t old site for crawlers -->
    <add key="Hypernova:FallbackToOldSiteForCrawlers" value="false"/>

    <!-- set to true if issues with Hypernova server -->
    <add key="Hypernova:FallbackToClientSideRenderingOnly" value="false"/>
    <!-- set to true if issues with Hypernova server -->

    <!-- set to true to disable hypernova file caching, overwrite in web.release.config to false -->
    <add key="Hypernova:DisableFileCache" value="true" />

    <!-- Use ip number to be accessible from Docker image; use http://[local-ip]:9999 to get the local-ip dynamically -->
    <add key="Hypernova:ComponentServerBaseUrlOverride" value="http://[local-ip]:9999"/>
  </appSettings>