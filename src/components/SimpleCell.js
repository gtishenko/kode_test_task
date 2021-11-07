import React, { PureComponent } from 'react';

class SimpleCell extends PureComponent {

    render() {
        const { children, before, after } = this.props;

        return <div className="simple-cell">
            <div className="simple-cell__before">
                {before}
            </div>
            <div className="simple-cell__content">
                {children}
            </div>
            {after && <div className="simple-cell__after">
                {after}
            </div>}
        </div>;
    }
}

export default SimpleCell;