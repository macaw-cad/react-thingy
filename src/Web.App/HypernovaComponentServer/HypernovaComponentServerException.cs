using System;

namespace Web.App.HypernovaComponentServer
{
    public class HypernovaComponentServerException : Exception
    {
        public HypernovaComponentServerException()
        {
        }

        public HypernovaComponentServerException(string message)
            : base($"HypernovaComponentServer call failed: {message}")
        {
        }

        public HypernovaComponentServerException(string message, Exception inner)
            : base($"HypernovaComponentServer call failed: {message}", inner)
        {
        }
    }
}