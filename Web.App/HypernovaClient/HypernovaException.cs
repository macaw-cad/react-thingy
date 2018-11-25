using System;

namespace Web.App.HypernovaClient
{
    public class HypernovaException : Exception
    {
        public HypernovaException()
        {
        }

        public HypernovaException(string message)
            : base($"Hypernova server-side rendering failed: {message}")
        {
        }

        public HypernovaException(string message, Exception inner)
            : base($"Hypernova server-side rendering failed: {message}", inner)
        {
        }
    }
}