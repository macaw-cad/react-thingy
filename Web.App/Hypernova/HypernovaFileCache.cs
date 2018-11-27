using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Web.App.Hypernova
{
    public class HypernovaFileCache
    {
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly HypernovaSettings _settings;

        public HypernovaFileCache(ILogger logger, IHostingEnvironment env, IOptions<HypernovaSettings> options)
        {
            _logger = logger;
            _env = env;
            _settings = options.Value;
        }

        public void DeleteCachedItem(Controller controller, string cacheName, string cacheKey)
        {
            var contentRoot = _env.ContentRootPath;
            var cacheFile = System.IO.Path.Combine(contentRoot, $"cache/{cacheName}/{cacheKey}");
            try
            {
                File.Delete(cacheFile);
            }
            catch (Exception ex)
            {

                _logger.LogCritical(ex.ToString());
            }
        }

        public void DeleteCache(Controller controller, string cacheName)
        {
            var contentRoot = _env.ContentRootPath;
            var cacheDirectory = System.IO.Path.Combine(contentRoot, $"cache/{cacheName}");
            try
            {
                if (Directory.Exists(cacheDirectory))
                {
                    Directory.Delete(cacheDirectory, true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex.ToString());
            }
        }

        public ActionResult GetCachedActionResult(Controller controller, string cacheName, string cacheKey)
        {
            if (_settings.DisableFileCache)
            {
                return null;
            }

            var contentRoot = _env.ContentRootPath;
            var cacheFile = System.IO.Path.Combine(contentRoot, $"cache/{cacheName}/{cacheKey}");

            if (FileExistsAndCanBeOpened(cacheFile))
            {
                return new PhysicalFileResult(cacheFile, "text/html; charset=utf-8");
            }
            else
            {
                return null;
            }
        }

        public ActionResult StoreAndGetActionResult(Controller controller, string cacheName, string cacheKey, string contents)
        {
            var contentRoot = _env.ContentRootPath;
            var cacheDirectory = System.IO.Path.Combine(contentRoot, $"cache/{cacheName}");
            var cacheFile = $"{cacheDirectory}/{cacheKey}";

            if (!_settings.DisableFileCache)
            {
                try
                {
                    Directory.CreateDirectory(cacheDirectory); // ensure cache directory exists
                    File.WriteAllText(cacheFile, contents, System.Text.Encoding.UTF8);
                }
                catch (Exception ex)
                {
                    // Ignore exception - other instance could be writing file at same time
                    _logger.LogWarning($"Can't write cache file {cacheFile} - other request writing to cache file? Exception: {ex.ToString()}");
                }
            }

            var result = new ContentResult();
            result.Content = contents;
            // TODO: depricated? result.ContentEncoding = System.Text.Encoding.UTF8;
            result.ContentType = "text/html";
            return result;
        }

        private static bool FileExistsAndCanBeOpened(string path)
        {
            try
            {
                // See https://gist.github.com/pvginkel/56658191c6bf7dac23b3893fa59a35e8
                File.Open(path, FileMode.Open, FileAccess.Read).Dispose();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}