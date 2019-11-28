using System.Collections.Generic;

namespace Web.App.Hypernova
{
    public class HypernovaResult
    {
        public bool Success { get; set; }
        public HypernovaError Error { get; set; }
        public Dictionary<string, HypernovaComponent> Results { get; set;  }


        public class HypernovaError
        {
            public string Name { get; set; }
            public string Message { get; set; }
            public IEnumerable<string> Stack { get; set; }
        }

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
}