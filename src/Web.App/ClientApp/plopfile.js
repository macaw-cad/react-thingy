module.exports = function (plop) {
    plop.setGenerator('withComponent', {
        description: 'Generate a component including Redux and with* HOC setup',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Name of component'
        }],
        actions: [{
            type: 'add',
            path: 'src/{{name}}/{{name}}State.ts',
            templateFile: 'plop-templates/withComponent/State.ts'
        }, {
            type: 'add',
            path: 'src/{{name}}/{{name}}Actions.ts',
            templateFile: 'plop-templates/withComponent/Actions.ts'
        }, {
            type: 'add',
            path: 'src/{{name}}/{{name}}Reducer.ts',
            templateFile: 'plop-templates/withComponent/Reducer.ts'
        }, {
            type: 'add',
            path: 'src/{{name}}/with{{name}}.tsx',
            templateFile: 'plop-templates/withComponent/with.tsx'
        }, {
            type: 'add',
            path: 'src/{{name}}/{{name}}.tsx',
            templateFile: 'plop-templates/withComponent/Component.tsx'
        }, {
            type: 'add',
            path: 'src/{{name}}/READDELETEME.md',
            templateFile: 'plop-templates/withComponent/READDELETEME.md'
        }]
    });
};