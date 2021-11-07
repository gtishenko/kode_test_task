import React, { PureComponent } from 'react';
import sort from '../images/sort.svg';
import search from '../images/search.svg';

class NavigationBar extends PureComponent {

    render() {
        const { header, searchValue, searchPlaceholder, tabs, activeTab, status, disabledInput } = this.props;
        
        let subheader = "";
        if(status === "error") subheader = "Не могу обновить данные. Проверь соединение с интернетом.";
        else if(status === "loading") subheader = "Секундочку, гружусь...";

        return <div className="navigation-bar">
            
            {status === "default" ? <>
                <h1>{header}</h1>
                <div className="input-box">
                    <img className="search" src={search} alt="search" />
                    <input disabled={disabledInput} onChange={this.props.onSearchChange} placeholder={searchPlaceholder} value={searchValue} />
                    <img className="sort" src={sort} alt="sort" onClick={() => this.props.onClickSort && this.props.onClickSort()} />
                </div>
            </> : <div className={status + " background"}>
                <h1>{header}</h1>
                <div className="description">
                    {subheader}
                </div>
            </div>}

            <div className="tabs">
                {tabs.map((item) => <div className={item.key === activeTab ? "tab-item active" : "tab-item"} onClick={() => this.props.onTabChange(item.key)}>
                    {item.title}
                </div>)}
            </div>
        </div>;
    }
}

export default NavigationBar;