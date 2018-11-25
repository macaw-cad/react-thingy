namespace Web.App.HypernovaClient
{
    public class RenderResult
    {
        public string Html { get; set; }
        public bool IsServerSideRendered { get; set; }
        public HypernovaException Exception { get; set; }
        public bool IsFromCache { get; internal set; }
    }
}