using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Web.Core.Mvc
{
    public class ErrorProblemDetailsJsonConverterFactory : JsonConverterFactory
    {
        public override bool CanConvert(Type typeToConvert)
        {
            if (!typeToConvert.IsGenericType)
            {
                return false;
            }

            var type = typeToConvert;
            if (!type.IsGenericTypeDefinition)
            {
                type = type.GetGenericTypeDefinition();
            }

            return type == typeof(ErrorProblemDetails<>);
        }

        public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            var keyType = typeToConvert.GenericTypeArguments[0];
            var converterType = typeof(ErrorProblemDetailsJsonConverter<>).MakeGenericType(keyType);

            return (JsonConverter)Activator.CreateInstance(converterType);
        }
    }
}
