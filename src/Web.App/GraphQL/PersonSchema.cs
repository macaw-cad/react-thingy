using GraphQL.Types;
using Web.App.GraphQL.Queries;

namespace Web.App.GraphQL
{
    public class StarWarsPersonSchema : Schema
    {
        public StarWarsPersonSchema(PersonQuery query)
        {
            Query = query;
        }
    }
}
