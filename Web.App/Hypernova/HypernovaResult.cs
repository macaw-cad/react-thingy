using System.Collections.Generic;

namespace Web.App.Hypernova
{
    public class HypernovaResult
    {
        public bool Success { get; }
        public HypernovaError Error { get; }
        public Dictionary<string, HypernovaComponent> Results { get; }
    }
}