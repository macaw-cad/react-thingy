using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Web.Core.Extensions;

namespace Web.Core.Mvc
{
    public class ErrorProblemDetailsJsonConverter<T> : JsonConverter<ErrorProblemDetails<T>> where T : IErrorDetails
    {
        private const string UnexpectedJsonEnd = "Unexcepted end when reading JSON.";

        private static readonly JsonEncodedText Type = JsonEncodedText.Encode("type");
        private static readonly JsonEncodedText Title = JsonEncodedText.Encode("title");
        private static readonly JsonEncodedText Status = JsonEncodedText.Encode("status");
        private static readonly JsonEncodedText Detail = JsonEncodedText.Encode("detail");
        private static readonly JsonEncodedText Instance = JsonEncodedText.Encode("instance");
        private static readonly JsonEncodedText ErrorDetails = JsonEncodedText.Encode("errorDetails");

        public override ErrorProblemDetails<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var problemDetails = new ErrorProblemDetails<T>();

            if (reader.TokenType != JsonTokenType.StartObject)
            {
                throw new JsonException(UnexpectedJsonEnd);
            }

            while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
            {
                if (reader.ValueTextEquals(ErrorDetails.EncodedUtf8Bytes))
                {
                    problemDetails.ErrorDetails = JsonSerializer.Deserialize<T>(ref reader, options);
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

        public override void Write(Utf8JsonWriter writer, ErrorProblemDetails<T> value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            WriteProblemDetails(writer, value, options);

            writer.WriteStartObject(ErrorDetails);
            WriteDictionary(writer, ToDictionaryWithType(value.ErrorDetails), options);
            writer.WriteEndObject();

            writer.WriteEndObject();
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

            WriteDictionary(writer, value.Extensions, options);
        }

        private static void WriteDictionary(Utf8JsonWriter writer, IDictionary<string, object> values, JsonSerializerOptions options)
        {
            foreach (var kvp in values)
            {
                writer.WritePropertyName(kvp.Key.ToJsonPropertyName(options));
                JsonSerializer.Serialize(writer, kvp.Value, kvp.Value?.GetType() ?? typeof(object), options);
            }
        }

        private static IDictionary<string, object> ToDictionaryWithType<U>(U errorDetails) where U : IErrorDetails
        {
            var details = new Dictionary<string, object>
            {
                { "type", typeof(U).Name }
            };

            foreach(var prop in errorDetails.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                details.Add(prop.Name, prop.GetValue(errorDetails, null));
            }

            return details;
        }
    }
}
