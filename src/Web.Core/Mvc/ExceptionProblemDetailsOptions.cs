namespace Web.Core.Mvc
{
    public class ExceptionProblemDetailsOptions
    {
        public const string ExceptionProblemDetailsSectionName = "ExceptionProblemDetails";

        public DetailLevel Details { get; set; }
        public int Depth { get; set; }
    }
}
