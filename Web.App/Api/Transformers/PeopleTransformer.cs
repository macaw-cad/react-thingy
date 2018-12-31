using System.Collections.Generic;
using Web.App.Api.Models;
using Newtonsoft.Json.Linq;

namespace Web.App.Api.Transformers
{
    public class StarWarsTransformer
    {
        public IEnumerable<StarWarsPerson> TransformPeopleToPersons(string input)
        {
            var result = JObject.Parse(input);

            var people = result["results"] as JArray;

            foreach (var person in people)
            {
                yield return new StarWarsPerson
                {
                    Name = (string)person["name"],
                    Weight = (int)person["mass"],
                    HairColor = (string)person["hair_color"]
                };
            }
        }
    }
}
