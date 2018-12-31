using System;

namespace Web.App.JsonServer
{
    public class JsonServerException : Exception
    {
        public JsonServerException()
        {
        }

        public JsonServerException(string message)
            : base($"JsonServer call failed: {message}")
        {
        }

        public JsonServerException(string message, Exception inner)
            : base($"JsonServer call failed: {message}", inner)
        {
        }
    }
}