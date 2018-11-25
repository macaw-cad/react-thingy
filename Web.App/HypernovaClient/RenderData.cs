using Newtonsoft.Json.Linq;

namespace Web.App.HypernovaClient
{
    public class MetaData
    {
        public string Name { get; set; }
        public string Content { get; set; }
    }
    public class RenderData
    {
        public string Title { get; set; }
        public string CanonicalUrl { get; set; }
        public MetaData[] MetaData { get; set; }
        public string[] EndOfBodyScripts { get; set; }
        public JObject JsonSchema { get; set; }

    }
}