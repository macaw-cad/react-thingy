using System.Collections.Generic;

namespace Web.App.Hypernova
{
    public class HypernovaResult
    {
        public bool Succes;
        public HypernovaError Error;
        public Dictionary<string, HypernovaComponent> Results;


        public class HypernovaError
        {
            public string Name;
            public string Message;
            public string[] Stack;
        }

        public class HypernovaComponent
        {
            public string Name;
            public string Html;
            // ?? meta
            public double? Duration; // in ms
            public int StatusCode;
            public bool Success;
            public HypernovaError Error;
        }
    }
}