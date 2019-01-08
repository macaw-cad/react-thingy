import React from 'react';
import { with{{name}}, With{{name}}Props } from './with{{name}}';
import { ComponentStatus } from '../ui/componentStatus/ComponentStatus';
import { VehicleCard } from '../Card/VehicleCard';

type {{name}}AllProps = With{{name}}Props;

class {{name}} extends React.Component<{{name}}AllProps> {
    public render(): JSX.Element { 
        const { {{camelCase name}}: { data, loading } } = this.props;
        return (
            <div>
                <ComponentStatus loading={[loading]} data={[data]} />
                {data && 
                    <>
                        {data.map(({{camelCase name}}, index) => (
                            <div key={index}>
                                Row of {{name}}
                            </div>
                        ))}
                    </>
                }
            </div>
        );
    }
}

export default with{{name}}({{name}});