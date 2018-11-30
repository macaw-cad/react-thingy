using Newtonsoft.Json.Linq;

namespace Web.App.Hypernova
{
    public class SpaSsrData
    {
        public string Title { get; set; }
        public string CanonicalUrl { get; set; }
        public SpaSsrMetaData[] MetaData { get; set; }
        public string[] EndOfBodyScripts { get; set; }
        public JObject JsonSchema { get; set; }

    }
}