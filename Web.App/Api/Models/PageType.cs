namespace Web.App.Api.Models
{
    public class PageType: Enumeration
    {
        public static PageType CarPage = new PageType(1, "car");
        public static PageType AnimalPage = new PageType(2, "animal");

        private PageType(int id, string name)
            : base(id, name)
        {
        }
    }
}
