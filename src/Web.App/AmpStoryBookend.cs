using System;
using System.Collections.Generic;

namespace Web.App
{
    public class AmpStoryBookend
    {
        public string bookendVersion { get; set; } // "v1.0"
        public IEnumerable<Object> shareProviders { get; set; }
        public IEnumerable<AmpStoryBookendComponent> components { get; set; }
    }
}