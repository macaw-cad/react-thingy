namespace Web.App.Hypernova
{
    public class HypernovaComponent
    {
        public string Name { get; set; }
        public string Html { get; set; }
        public dynamic Meta { get; set; }
        public double? Duration { get; set; } // in ms
        public int StatusCode { get; set; }
        public bool Success { get; set; }
        public HypernovaError Error { get; set; }
    }
}