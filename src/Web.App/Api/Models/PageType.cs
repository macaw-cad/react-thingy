namespace Web.App.Api.Models
{
    public class PageType: EnumByEnumeration
    {
        public static PageType CarPage { get; } = new PageType(1, "car");
        public static PageType AnimalPage { get; } = new PageType(2, "animal");

        private PageType(int id, string name)
            : base(id, name)
        {
        }
    }
}
