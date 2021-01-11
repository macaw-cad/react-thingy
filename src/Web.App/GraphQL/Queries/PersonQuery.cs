using GraphQL.Types;
using Web.App.Api.Repository;
using Web.App.GraphQL.Types;

namespace Web.App.GraphQL.Queries
{
    public class PersonQuery : ObjectGraphType<object>
    {
        public PersonQuery(IStarWarsRepository starWarsRepository)
        {
            Name = "Query";
            Field<ListGraphType<PersonType>>(
                "persons",
                resolve: context => starWarsRepository.GetStarWarsPeopleAsync(1)
            );
        }
    }
}
