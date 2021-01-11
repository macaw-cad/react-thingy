using System.Collections.Generic;
using Newtonsoft.Json;

namespace Web.App.Api.Models
{
    public class StarWarsPersons
    {
        public int Count { get; set; }
        [JsonProperty("next")]
        public string NextUrl { get; set; }
        [JsonProperty("previous")]
        public object PreviousUrl { get; set; }
        [JsonProperty("results")]
        public List<StarWarsPerson> Items { get; set; }
    }
}