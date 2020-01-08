import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select, number } from '@storybook/addon-knobs';
import { ToastContent } from './ToastContent';
import IconSprite from '../icons/Sprite';
import { ToastContainer, toast } from 'react-toastify';

const toastPositions = [
    'top-right',
    'top-center',
    'top-left',
    'bottom-right',
    'bottom-center',
    'bottom-left'
];

const toastType = [
    'default',
    'success',
    'info',
    'warning',
    'error'
];

type TriggerToastProps = {
    title: string;
    options: any;
};

const TriggerToast: React.SFC<TriggerToastProps> = ({ title, options, children }) => (
    <button className="a-btn a-btn--primary" onClick={() => toast(<ToastContent type={options.type}>{title}</ToastContent>, options)}>{children}</button>
);

storiesOf('Toast', module)
    .addDecorator(withKnobs)
    .add('Default', () => {
        return (
            <div>
                <TriggerToast title={text('Text', 'Hello I am toast')} options={{
                    position: select('Position', toastPositions, 'bottom-right'),
                    type: select('Type', toastType, 'default'),
                    autoClose: number('Close delay', 5000)
                }}>Trigger toast!</TriggerToast>

                <ToastContainer
                    position={toast.POSITION.BOTTOM_RIGHT}
                    toastClassName="a-toast"
                    closeButton={<IconSprite name="close" />}
                />
            </div>
        );
    });