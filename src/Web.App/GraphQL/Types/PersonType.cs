using GraphQL.Types;
using Web.App.Api.Models;

namespace Web.App.GraphQL.Types
{
    public class PersonType : ObjectGraphType<StarWarsPerson>
    {
        public PersonType()
        {
            Field(t => t.Id);
            Field(t => t.Name);
            Field(t => t.Height);
            Field(t => t.Mass);
            Field(t => t.HairColor);
            Field(t => t.SkinColor);
            Field(t => t.EyeColor);
            Field(t => t.BirthYear);
            Field(t => t.Gender);
            Field(t => t.Homeworld);
            Field(t => t.Films);
            Field(t => t.Species);
            Field(t => t.Vehicles);
            Field(t => t.Starships);
            Field(t => t.Created);
            Field(t => t.Edited);
        }
    }
}
