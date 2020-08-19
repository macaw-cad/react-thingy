using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Web.Core.Configuration
{
    public interface IConfigurationValidator
    {
        IEnumerable<string> Validate();
        Task<IEnumerable<string>> ValidateAsync();
        IEnumerable<string> GetAllSettings();
    }

    public class ConfigurationValidator: IConfigurationValidator
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ConfigurationValidator> _logger;

        private readonly Regex keyVaultSecretRegex = new Regex(@"\$\(.*\)", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);

        private const string notReplacedConfigurationPlaceholder = "{{";

        public ConfigurationValidator(IConfiguration configuration, ILogger<ConfigurationValidator> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public IEnumerable<string> Validate()
        {
            var errors = GetErrors();
            if (errors.Any())
            {
                _logger.LogError($"Invalid application configuration: {String.Join(Environment.NewLine, errors)}");
            }

            return errors;
        }

        public Task<IEnumerable<string>> ValidateAsync()
        {
            return Task.FromResult(Validate());
        }

        private IEnumerable<string> GetErrors()
        {
            var errorsList = new List<string>();

            var configurationSections = _configuration.AsEnumerable();
            foreach(var section in configurationSections)
            {
                var key = section.Key;
                var value = section.Value;

                if (value == null)
                {
                    continue;
                }

                if (value.StartsWith(notReplacedConfigurationPlaceholder, StringComparison.Ordinal))
                {
                    errorsList.Add($"Not replaced configuration setting: Configuration key: '{key}', value: '{value}'");
                }

                var match = keyVaultSecretRegex.Match(value);
                if (match.Success)
                {
                    var secretName = match.Captures[0].Value;
                    errorsList.Add($"Not replaced keyvault secret '{secretName}': Configuration key: '{key}', value: '{value}'");
                }
            }

            return errorsList;
        }

        public IEnumerable<string> GetAllSettings()
        {
            var list = new List<string>();

            var configurationSections = _configuration.AsEnumerable();
            foreach (var section in configurationSections)
            {
                var key = section.Key;
                var value = section.Value;

                if (value == null)
                {
                    continue;
                }

                list.Add($"{key} = {value}");
            }

            return list;
        }
    }
}
