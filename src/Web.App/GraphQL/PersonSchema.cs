using GraphQL.Types;
using Web.App.GraphQL.Queries;

namespace Web.App.GraphQL
{
    public class PersonSchema : Schema
    {
        public PersonSchema(PersonQuery query)
        {
            Query = query;
        }
    }
}
