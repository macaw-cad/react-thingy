using System.Text.Json;

namespace Web.Core.Extensions
{
    public static class JsonExtensions
    {
        public static JsonEncodedText ToJsonPropertyName(this string name, JsonSerializerOptions options)
        {
            if (!string.IsNullOrWhiteSpace(name) && options?.PropertyNamingPolicy == JsonNamingPolicy.CamelCase)
            {
                return JsonEncodedText.Encode($"{name.Substring(0, 1).ToLowerInvariant()}{name.Substring(1)}");
            }

            return JsonEncodedText.Encode(name);
        }
    }
}
