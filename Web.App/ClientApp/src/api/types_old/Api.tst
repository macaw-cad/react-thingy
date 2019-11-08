 ${
    // download/install from visual studio extensions/tools:
    // https://marketplace.visualstudio.com/items?itemName=frhagn.Typewriter
    
    // For types assembly references, add .ts class manually.
    // Enable extension methods by adding using Typewriter.Extensions.*
    using Typewriter.Extensions.Types;

    // Uncomment the constructor to change template settings.
    Template(Settings settings)
    {
        settings.IncludeCurrentProject();
        settings.OutputFilenameFactory = file => 
        {
            return $"{ApiName(file.Name.Replace(".cs", ".ts"))}";
        };
    }

    string ApiName(string name) 
    {
        return "Api" + name;
    }

    string ClassTypeName(Class c)
    {
        if (IsApi(c.Namespace))
        {
            return ApiName(c.Name);
        }
        return c.Name;
    }

    string TypeName(Type t)
    {
        var type = t;
        var typeArguments = t.TypeArguments.ToList();

        if (t.IsEnumerable)
        {
            if (t.IsGeneric)
            {
                type = t.TypeArguments.First();
            }       
        }

        var name = type.Name;

        if (IsApi(type.Namespace))
        {
            name = ApiName(type.Name);
        }

        if (t.IsEnumerable)
        {
            // Used to convert IDictionary<string, string> to  { [key: string]: string; }
            if (typeArguments.Count == 2) {
                return t.Name;
            }
            
            return name + "[]";
        }
        return name;
    }

	string Inherit(Class c)
    {
        if (c.BaseClass != null)
        {
            var baseName = " extends " + ClassTypeName(c.BaseClass);

            if (c.BaseClass.IsGeneric)
            {
                return baseName + c.BaseClass.TypeArguments.ToString();
            }

            return baseName;
        }
        
        return  "";
    }

    string TypeImportName(Type t)
    {
        if (t.IsGeneric)
        {
            var index = t.ClassName().IndexOf("<");
            if (index > 0)
            {
                var name = t.ClassName().Substring(0, index);

                if(IsApi(t.Namespace))
                    return ApiName(name);

                return name;
            }
        }

        return ApiName(t.ClassName());
    }

	string Imports(Class c)
    {
        var neededImports = c.Properties
            .Where(p => p.Type.Name != c.Name)
            .Select(p => p.Type)
                .Where(t => !t.IsPrimitive || t.IsEnum)
                // exclude property of type 'T'
                .Where(t => !c.TypeParameters.Where(tp => tp.Name == t.Name).Any())
            .Union(
                c.Properties
                    .Select(p => p.Type)
                    .Where(t => t.IsGeneric)
                    .SelectMany(t => t.TypeArguments)
                    .Where(a => !a.IsPrimitive)
                    )
                .Select(t => "import { " + TypeImportName(t) + " } from './" + TypeImportName(t) + "';")
            .ToList();

        if (c.BaseClass != null) 
        {
            neededImports.Add("import { " + ClassTypeName(c.BaseClass) +" } from './" + ClassTypeName(c.BaseClass) + "';");
        }
        return String.Join("\r\n", neededImports.Distinct());
    }
    
	bool IsOptional(Property p) 
    { 
        if (p.Attributes.Where(a => a.name == "apiOptional").Any()) return true;

        return p.Type.IsNullable;
    }

    string PropertyComputedType(Property p)
    {
        return TypeName(p.Type);
    }

    bool IsApi(string ns) 
    {
       return ns.Equals("Web.App.Api.Models");
    }

    string PropertyName(Property p) {        
        var attribute = p.Attributes.FirstOrDefault(a => a.Name == "JsonProperty");
        if (attribute != null)
        {
            var value = attribute.Value;
            var start = value.IndexOf("\"");
            if (start >= 0)
            {
                value = value.Substring(start + 1);
                var end = value.IndexOf("\"");
                value = value.Substring(0, end);
            }
            return value;
        }
        return p.name;
    }

}$Classes(e => (IsApi(e.Namespace)))[$Imports

export class $ClassTypeName$TypeParameters $Inherit { $Properties[
	public $PropertyName$IsOptional[?][!]: $PropertyComputedType;]
}]
$Enums(e => IsApi(e.Namespace))[export enum Api$Name {
    $Values[
    $Name = $Value][,]
}] 