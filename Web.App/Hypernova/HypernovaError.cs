using System.Collections.Generic;

namespace Web.App.Hypernova
{
    public class HypernovaError
    {
        public string Name { get; set; }
        public string Message { get; set; }
        public IEnumerable<string> Stack { get; set; }
    }
}