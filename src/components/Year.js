import React, { PureComponent } from 'react';

class Year extends PureComponent {

    componentDidMount() {
        document.body.style.overflow = "hidden";
    }

    componentWillUnmount() {
        document.body.style.overflow = "auto";
    }

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