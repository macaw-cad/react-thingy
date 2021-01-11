using System;
using System.Security.Cryptography;
using System.Text;

namespace Web.Core.Extensions
{
    public static class StringExtensions
    {
#pragma warning disable S4790
        public static string Hash(this string input)
        {
            const string valueToReplace = "-";
            const string replaceValue = "";

            using (var algorithm = new SHA512Managed())
            {
                var hashedBytes = algorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

                return BitConverter.ToString(hashedBytes).Replace(valueToReplace, replaceValue).ToLower();
            }
        }
    }
}
