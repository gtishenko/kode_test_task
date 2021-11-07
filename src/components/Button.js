import React, { PureComponent } from 'react';

class Button extends PureComponent {

    render() {
        const { children } = this.props;

        return <div className="button" onClick={() => this.props.onClick && this.props.onClick()}>
            {children}
        </div>;
    }
}

export default Button;