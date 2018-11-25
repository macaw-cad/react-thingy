namespace Web.App
{
    /// <summary>
    /// See https://www.ampproject.org/docs/reference/components/amp-social-share for different settings
    /// </summary>
    public class AmpStoryBookendShareProvider
    {
        public string provider { get; set; }
        public string text { get; set; }
        public string app_id { get; set; }
        public string url { get; set; }
    }
}