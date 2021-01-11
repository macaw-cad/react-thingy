using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Web.App.Api.Models
{
    public class StarWarsPerson
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Height { get; set; }
        public string Mass { get; set; }
        [JsonProperty("hair_color")]
        public string HairColor { get; set; }
        [JsonProperty("skin_color")]
        public string SkinColor { get; set; }
        [JsonProperty("eye_color")]
        public string EyeColor { get; set; }
        [JsonProperty("birth_year")]
        public string BirthYear { get; set; }
        public string Gender { get; set; }
        public string Homeworld { get; set; }
        public List<string> Films { get; set; }
        public List<string> Species { get; set; }
        public List<string> Vehicles { get; set; }
        public List<string> Starships { get; set; }
        public DateTime Created { get; set; }
        public DateTime Edited { get; set; }
        public string Url
        {
            set => Id = ExtractId(value);
        }

        private static int ExtractId(string value)
        {
            if (int.TryParse(value.Split('/', StringSplitOptions.RemoveEmptyEntries).Last(), out int result))
            {
                return result;
            }

            return -1;
        }
    }
}
