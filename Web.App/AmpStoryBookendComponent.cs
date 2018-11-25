namespace Web.App
{
    public class AmpStoryBookendComponent
    {
        public string type { get; set; }
        public string title { get; set; }
        public string[] text { get; set; }
        public string url { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public AmpStoryBookendCtaLink[] links { get; set; }
    }
}