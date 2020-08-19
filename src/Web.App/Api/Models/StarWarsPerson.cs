using System.Text.Json.Serialization;

namespace Web.App.Api.Models
{
    public class StarWarsPerson
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("mass")]
        public int Weight { get; set; }

        [JsonPropertyName("hair_color")]
        public string HairColor { get; set; }
    }
}
