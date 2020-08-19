using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Web.Core.Extensions;

namespace Web.Core.Mvc
{
    public class ExceptionProblemDetailsJsonConverter : JsonConverter<ExceptionProblemDetails>
    {
        private const string UnexpectedJsonEnd = "Unexcepted end when reading JSON.";

        private static readonly JsonEncodedText Type = JsonEncodedText.Encode("type");
        private static readonly JsonEncodedText Title = JsonEncodedText.Encode("title");
        private static readonly JsonEncodedText Status = JsonEncodedText.Encode("status");
        private static readonly JsonEncodedText Detail = JsonEncodedText.Encode("detail");
        private static readonly JsonEncodedText Instance = JsonEncodedText.Encode("instance");
        private static readonly JsonEncodedText Exception = JsonEncodedText.Encode("exception");

        private static readonly JsonEncodedText ExceptionType = JsonEncodedText.Encode(ExceptionProblemDetails.TypeKey);
        private static readonly JsonEncodedText ExceptionMessage = JsonEncodedText.Encode(ExceptionProblemDetails.MessageKey);
        private static readonly JsonEncodedText ExceptionStackTrace = JsonEncodedText.Encode(ExceptionProblemDetails.StackTraceKey);
        private static readonly JsonEncodedText ExceptionExceptions = JsonEncodedText.Encode(ExceptionProblemDetails.ExceptionsKey);

        private readonly ExceptionProblemDetailsOptions _exceptionDetailsOptions;

        public ExceptionProblemDetailsJsonConverter(ExceptionProblemDetailsOptions options)
        {
            _exceptionDetailsOptions = options ?? new ExceptionProblemDetailsOptions();
        }

        public override ExceptionProblemDetails Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var problemDetails = new ExceptionProblemDetails();

            if (reader.TokenType != JsonTokenType.StartObject)
            {
                throw new JsonException(UnexpectedJsonEnd);
            }

            while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
            {
                if (reader.ValueTextEquals(Exception.EncodedUtf8Bytes))
                {
                    var errors = JsonSerializer.Deserialize<Dictionary<string, object[]>>(ref reader, options);
                    foreach (var item in errors)
                    {
                        problemDetails.Exception[item.Key] = item.Value;
                    }
                }
                else
                {
                    ReadValue(ref reader, problemDetails, options);
                }
            }

            if (reader.TokenType != JsonTokenType.EndObject)
            {
                throw new JsonException(UnexpectedJsonEnd);
            }

            return problemDetails;
        }

        public override void Write(Utf8JsonWriter writer, ExceptionProblemDetails value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            WriteProblemDetails(writer, value, options);

            writer.WriteStartObject(Exception);
            WriteException(writer, value.Exception, 0, _exceptionDetailsOptions, options);
            writer.WriteEndObject();

            writer.WriteEndObject();
        }

        private static void WriteException(Utf8JsonWriter writer, IDictionary<string, object> exception, int depth, ExceptionProblemDetailsOptions exceptionDetailsOptions, JsonSerializerOptions jsonOptions)
        {
            foreach (var item in exception)
            {
                if (item.Key.Equals(ExceptionProblemDetails.TypeKey))
                {
                    if (!jsonOptions.IgnoreNullValues || item.Value != null)
                    {
                        writer.WriteString(ExceptionType, (string)item.Value);
                    }
                }
                if (exceptionDetailsOptions.Details >= DetailLevel.Moderate)
                {
                    if (item.Key.Equals(ExceptionProblemDetails.MessageKey))
                    {
                        if (!jsonOptions.IgnoreNullValues || item.Value != null)
                        {
                            writer.WriteString(ExceptionMessage, (string)item.Value);
                        }
                    }

                    if (exceptionDetailsOptions.Details >= DetailLevel.Full)
                    {
                        if (item.Key.Equals(ExceptionProblemDetails.StackTraceKey))
                        {
                            if (!jsonOptions.IgnoreNullValues || item.Value != null)
                            {
                                writer.WriteString(ExceptionStackTrace, (string)item.Value);
                            }
                        }
                    }
                }

                if (item.Key.Equals(ExceptionProblemDetails.ExceptionsKey) && depth < exceptionDetailsOptions.Depth - 1)
                {
                    if (item.Value is IList<IDictionary<string, object>> innerList)
                    {
                        writer.WritePropertyName(ExceptionExceptions);
                        writer.WriteStartArray();
                        foreach (var innerItem in innerList)
                        {
                            writer.WriteStartObject();
                            WriteException(writer, innerItem, depth + 1, exceptionDetailsOptions, jsonOptions);
                            writer.WriteEndObject();
                        }
                        writer.WriteEndArray();
                    }
                }
            }
        }

        private static void ReadValue(ref Utf8JsonReader reader, ProblemDetails value, JsonSerializerOptions options)
        {
            if (TryReadStringProperty(ref reader, Type, out var propertyValue))
            {
                value.Type = propertyValue;
            }
            else if (TryReadStringProperty(ref reader, Title, out propertyValue))
            {
                value.Title = propertyValue;
            }
            else if (TryReadStringProperty(ref reader, Detail, out propertyValue))
            {
                value.Detail = propertyValue;
            }
            else if (TryReadStringProperty(ref reader, Instance, out propertyValue))
            {
                value.Instance = propertyValue;
            }
            else if (reader.ValueTextEquals(Status.EncodedUtf8Bytes))
            {
                reader.Read();
                if (reader.TokenType == JsonTokenType.Null)
                {
                    // Nothing to do here.
                }
                else
                {
                    value.Status = reader.GetInt32();
                }
            }
            else
            {
                var key = reader.GetString();
                reader.Read();
                value.Extensions[key] = JsonSerializer.Deserialize(ref reader, typeof(object), options);
            }
        }

        private static bool TryReadStringProperty(ref Utf8JsonReader reader, JsonEncodedText propertyName, out string value)
        {
            if (!reader.ValueTextEquals(propertyName.EncodedUtf8Bytes))
            {
                value = default;
                return false;
            }

            reader.Read();
            value = reader.GetString();
            return true;
        }

        private static void WriteProblemDetails(Utf8JsonWriter writer, ProblemDetails value, JsonSerializerOptions options)
        {
            if (!options.IgnoreNullValues || value.Type != null)
            {
                writer.WriteString(Type, value.Type);
            }

            if (!options.IgnoreNullValues || value.Title != null)
            {
                writer.WriteString(Title, value.Title);
            }

            if (!options.IgnoreNullValues || value.Status != null)
            {
                writer.WriteNumber(Status, value.Status.Value);
            }

            if (!options.IgnoreNullValues || value.Detail != null)
            {
                writer.WriteString(Detail, value.Detail);
            }

            if (!options.IgnoreNullValues || value.Instance != null)
            {
                writer.WriteString(Instance, value.Instance);
            }

            foreach (var kvp in value.Extensions)
            {
                writer.WritePropertyName(kvp.Key.ToJsonPropertyName(options));
                JsonSerializer.Serialize(writer, kvp.Value, kvp.Value?.GetType() ?? typeof(object), options);
            }
        }
    }
}
