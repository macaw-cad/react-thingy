using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Web.Core.Mvc
{
    /// <summary>
    /// A machine-readable format for specifying errors in HTTP API responses based on https://tools.ietf.org/html/rfc7807.
    /// </summary>
    public class ExceptionProblemDetails : ProblemDetails
    {
        public const string TypeKey = "type";
        public const string MessageKey = "message";
        public const string StackTraceKey = "stackTrace";
        public const string ExceptionsKey = "exceptions";

        public ExceptionProblemDetails()
        {
            Title = "One or more exceptions occurred.";
            Status = StatusCodes.Status500InternalServerError;
        }

        /// <summary>
        /// Construct a instance of <see cref="ExceptionProblemDetails"/>.
        /// </summary>
        /// <param name="exception"><see cref="Exception"/></param>
        public ExceptionProblemDetails(Exception exception) : this()
        {
            if (exception is null)
            {
                throw new ArgumentNullException(nameof(exception));
            }

            var exceptionDictionary = ToDictionary(exception);
            if (exceptionDictionary != null)
            {
                Exception = exceptionDictionary;
            }
        }

        /// <summary>
        /// Gets the exceptions associated with this instance of <see cref="ExceptionProblemDetails"/>.
        /// </summary>
        [JsonPropertyName("exception")]
        public IDictionary<string, object> Exception { get; } = new Dictionary<string, object>(StringComparer.Ordinal);

        private static IDictionary<string, object> ToDictionary(Exception exception)
        {
            if (exception == null)
            {
                return null;
            }

            var dictionary = new Dictionary<string, object>
            {
                { TypeKey, exception.GetType().Name },
                { MessageKey, exception.Message },
                { StackTraceKey, exception.StackTrace },
            };

            IList<IDictionary<string, object>> innerDictionaries = new List<IDictionary<string, object>>();

            if (exception is AggregateException aggregateException)
            {
                if (aggregateException.InnerExceptions.Any())
                {
                    foreach (var innerException in aggregateException.InnerExceptions)
                    {
                        var innerDictionary = ToDictionary(innerException);
                        if (innerDictionary != null)
                        {
                            innerDictionaries.Add(innerDictionary);
                        }
                    }
                }
            }
            else
            {
                var innerDictionary = ToDictionary(exception.InnerException);
                if (innerDictionary != null)
                {
                    innerDictionaries.Add(innerDictionary);
                }
            }

            if (innerDictionaries.Any())
            {
                dictionary.Add(ExceptionsKey, innerDictionaries);
            }

            return dictionary;
        }
    }
}
