namespace Web.App.Hypernova
{
    public class SpaSsrResult
    {
        public string Html { get; set; }
        public bool IsServerSideRendered { get; set; }
        public HypernovaException Exception { get; set; }
        public bool IsFromCache { get; internal set; }
    }
}