import React, { PureComponent } from 'react';

class Placeholder extends PureComponent {

    render() {
        const { children, header, button, icon } = this.props;

        return <div className="placeholder">
            <div className="placeholder__inner">
                <div className="placeholder__icon">
                    <img alt="icon" width={56} src={icon} />
                </div>

                <div className="placeholder__header">
                    {header}
                </div>
                <div className="placeholder__text">
                    {children}
                </div>
                {button}
            </div>
        </div>;
    }
}

export default Placeholder;