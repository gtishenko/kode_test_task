import React, { PureComponent } from 'react';

class Cell extends PureComponent {

    render() {
        const { loading, avatarSource, description, afterText, children, after } = this.props;

        if(loading) {
            return <div className="cell-loading">
                <div className="cell-inner">
                    <div className="left-content">
                        <div className="avatar" />
                    </div>
                    <div className="center-content" >
                        <div className="title" />
                        <div className="description" />
                    </div>
                </div>
            </div>;
        } else {
            return <div className="cell">
                <div className="cell-inner">
                    <div className="left-content">
                        <div className="avatar" style={avatarSource ? { backgroundImage: "url(" + avatarSource + ")" } : {}} />
                    </div>
                    <div className="center-content">
                        <div className="title-block">
                            <div className="title">
                                {children}
                            </div>
                            <div className="afterText">
                                {afterText}
                            </div>
                        </div>
                        {description && <div className="description">
                            {description}
                        </div>}
                    </div>
                    {after && <div className="right-content">
                        {after}
                    </div>}
                </div>
            </div>;
        }
    }
}

export default Cell;