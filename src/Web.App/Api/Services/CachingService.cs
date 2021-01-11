using System;
using Microsoft.Extensions.Caching.Memory;
using Web.Core.Extensions;

namespace Web.App.Api.Services
{
    public interface ICachingService
    {
        void SetCacheItem(string key, string etag, string data);
        CacheItem GetCacheItem(string key);
    }

    public class CachingService : ICachingService
    {
        private const int CacheDurationInMinutes = 60;

        private readonly IMemoryCache _memoryCache;

        public CachingService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public void SetCacheItem(string key, string etag, string data)
        {
            var hashedKey = key.Hash();
            var item = new CacheItem
            {
                Data = data,
                Etag = etag,
                HashedKey = hashedKey
            };

            _memoryCache.Set(hashedKey, item, TimeSpan.FromMinutes(CacheDurationInMinutes));
        }

        public CacheItem GetCacheItem(string key)
        {
            var hashedKey = key.Hash();
            if (!_memoryCache.TryGetValue(hashedKey, out CacheItem item))
            {
                return null;
            }

            return item;
        }
    }

    public class CacheItem
    {
        public string HashedKey { get; set; }
        public string Etag { get; set; }
        public string Data { get; set; }
    }
}
