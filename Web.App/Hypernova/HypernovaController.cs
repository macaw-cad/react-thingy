using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Hosting;

namespace Web.App.Hypernova
{
    /// <summary>
    /// Hypernova client.
    /// </summary>
    public class HypernovaController : Controller
    {
        public readonly ILogger<HypernovaController> Logger;
        public readonly IHostingEnvironment Env;
        public readonly IHttpClientFactory HttpClientFactory;
        public readonly IOptions<HypernovaSettings> Options;
        public readonly HypernovaSettings Settings;

        public HypernovaController(ILogger<HypernovaController> logger, IHostingEnvironment env, IHttpClientFactory httpClientFactory, IOptions<HypernovaSettings> options)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Env = env ?? throw new ArgumentNullException(nameof(env));
            HttpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            Options = options;
            Settings = options.Value;
        }

        public string PagesCacheName {
            get
            {
                return Settings.PagesCacheName;
            }
        }
    }
}