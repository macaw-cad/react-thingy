using System;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.App.Api
{
    [Serializable]
    public class ServerRouteException : Exception
    {
        public ServerRouteException() { }
        public ServerRouteException(string message) : base(message) { }
        public ServerRouteException(string message, Exception inner) : base(message, inner) { }
        protected ServerRouteException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}
