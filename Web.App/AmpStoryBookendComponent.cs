using System.Collections.Generic;

namespace Web.App
{
    public class AmpStoryBookendComponent
    {
        public string type { get; set; }
        public string title { get; set; }
        public IEnumerable<string> text { get; set; }
        public string url { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public IEnumerable<AmpStoryBookendCtaLink> links { get; set; }
    }
}