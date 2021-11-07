import React, { PureComponent } from 'react';

class Year extends PureComponent {

    render() {
        const { children } = this.props;

        return <div className="year">
            <hr />
            <div className="text">
                {children}
            </div>
            <hr />
        </div>;
    }
}

export default Year;