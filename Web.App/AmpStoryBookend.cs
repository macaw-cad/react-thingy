using System;

namespace Web.App
{
    public class AmpStoryBookend
    {
        public string bookendVersion { get; set; } // "v1.0"
        public Object[] shareProviders { get; set; }
        public AmpStoryBookendComponent[] components { get; set; }
    }
}