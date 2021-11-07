import React, { PureComponent } from 'react';
import close from '../images/close.svg';

class Alert extends PureComponent {

    componentDidMount() {
        document.body.style.overflow = "hidden";
    }

    componentWillUnmount() {
        document.body.style.overflow = "";
    }

    render() {
        const { children, header, closeButtonSide } = this.props;

        return <div className="alert" onClick={(e) => {
            if(e.target.className === "alert" && this.props.onClose) {
                 this.props.onClose();
            }
        }}>
            <div className="alert__background">
                <div className="alert__header">
                    <div onClick={() => this.props.onClose && this.props.onClose()} style={closeButtonSide === "left" ? {} : { opacity: 0 }} className="alert__close_button">
                        <img alt="close" src={close} />
                    </div>
                    <div className="alert__title">
                        {header}
                    </div>
                    <div onClick={() => this.props.onClose && this.props.onClose()} style={closeButtonSide === "right" ? {} : { opacity: 0 }} className="alert__close_button">
                        <img alt="close" src={close} />
                    </div>
                </div>
                {children}
            </div>
        </div>;
    }
}

export default Alert;