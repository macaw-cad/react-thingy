using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Web.App.Api.Models
{
    /// <summary>
    /// Enumeration base class as described in <see cref="https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/enumeration-classes-over-enum-types"/>
    /// </summary>
    public abstract class EnumByEnumeration : IComparable
    {
        public string Name { get; private set; }

        public int Id { get; private set; }

        protected EnumByEnumeration(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public override string ToString() => Name;

        public static IEnumerable<T> GetAll<T>() where T : EnumByEnumeration
        {
            var fields = typeof(T).GetFields(BindingFlags.Public |
                                             BindingFlags.Static |
                                             BindingFlags.DeclaredOnly);

            return fields.Select(f => f.GetValue(null)).Cast<T>();
        }

        public override bool Equals(object obj)
        {
            var otherValue = obj as EnumByEnumeration;

            if (otherValue == null)
                return false;

            var typeMatches = GetType().Equals(obj.GetType());
            var valueMatches = Id.Equals(otherValue.Id);

            return typeMatches && valueMatches;
        }

        public int CompareTo(object other)
        {
            if (other is null)
            {
                throw new ArgumentNullException(nameof(other));
            }

            return Id.CompareTo(((EnumByEnumeration)other).Id);
        }

        public override int GetHashCode()
        {
            return Name.GetHashCode(System.StringComparison.InvariantCulture);
        }

        public static bool operator ==(EnumByEnumeration left, EnumByEnumeration right)
        {
            if (ReferenceEquals(left, null))
            {
                return ReferenceEquals(right, null);
            }

            return left.Equals(right);
        }

        public static bool operator !=(EnumByEnumeration left, EnumByEnumeration right)
        {
            return !(left == right);
        }

        public static bool operator <(EnumByEnumeration left, EnumByEnumeration right)
        {
            return ReferenceEquals(left, null) ? !ReferenceEquals(right, null) : left.CompareTo(right) < 0;
        }

        public static bool operator <=(EnumByEnumeration left, EnumByEnumeration right)
        {
            return ReferenceEquals(left, null) || left.CompareTo(right) <= 0;
        }

        public static bool operator >(EnumByEnumeration left, EnumByEnumeration right)
        {
            return !ReferenceEquals(left, null) && left.CompareTo(right) > 0;
        }

        public static bool operator >=(EnumByEnumeration left, EnumByEnumeration right)
        {
            return ReferenceEquals(left, null) ? ReferenceEquals(right, null) : left.CompareTo(right) >= 0;
        }
    }
}
