import React from 'react';
import { connect } from 'react-redux';
import NavigationBar from '../components/NavigationBar';
import Cell from '../components/Cell';
import axios from 'axios';
import { setData } from '../store/data/actions';
import Placeholder from '../components/Placeholder';
import Button from '../components/Button';
import UFO from '../images/UFO.png';
import notFound from '../images/notFound.png';
import { Link } from 'react-router-dom';
import { tabs } from '../info';

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "all",
            loading: this.props.users.length === 0,
            status: "default",
            error: false
        };

        this.updateStatus = this.updateStatus.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener("online", this.updateStatus);
        window.removeEventListener("offline", this.updateStatus);
    }

    componentDidMount() {
        const { users } = this.props;
        if (users.length === 0) {
            this.getUsers();
        }

        window.addEventListener("online", this.updateStatus);
        window.addEventListener("offline", this.updateStatus);
    }

    updateStatus() {
        if(navigator.onLine && this.state.status === "error") {
            this.setState({
                status: "loading",
                loading: true
            });
            this.getUsers();
        } else if(!navigator.onLine && (this.state.status === "default" || this.state.status === "loading")) {
            this.setState({
                status: "error"
            });
        }
    }

    getUsers() {
        const { setData } = this.props;
        axios.get("https://stoplight.io/mocks/kode-education/trainee-test/25143926/users", {
            headers: {
                "Content-Type": "application/json",
                "Prefer": "code=200, example=success",
                // "Prefer": "code=500, example=error-500",
            },
        })
        .then(data => {
            console.log(data.data);
            setData("users", data.data);
            this.setState({
                loading: false,
                status: "default"
            });
        })
        .catch(error => {
            console.log(error);
            this.setState({
                error: true
            });
        });
    }

    get users() {
        const { users, search } = this.props;
        const searchText = search.toLowerCase().trim();
        return users.items.filter(({ firstName, lastName, userTag, department }) =>
            (this.state.activeTab === "all" || department === this.state.activeTab) &&
            ((firstName + " " + lastName).toLowerCase().indexOf(searchText) > -1 ||
            (lastName + " " + firstName).toLowerCase().indexOf(searchText) > -1 ||
            userTag.toLowerCase().indexOf(searchText) > -1));
    }

    render() {
        const { setData, search } = this.props;

        return <div className="search-page">
            <NavigationBar
                header="Поиск"
                searchPlaceholder="Введи имя, тег, почту..."
                tabs={tabs}
                activeTab={this.state.activeTab}
                onTabChange={(tab) => this.setState({ activeTab: tab })}
                status={this.state.status}
                onSearchChange={(e) => setData("search", e.target.value)}
                searchValue={search}
                disabledInput={this.state.loading || this.state.error}
            />

            {!this.state.error && <>
                {this.state.loading ? [...Array(15)].map(() => <Cell
                    loading={true}
                />)
                :
                <>
                    {this.users.map((item) => <Link onClick={() => {
                            setData("activeUser", item);
                        }} to="/profile">
                        <Cell
                            key={item.id}
                            avatarSource={item.avatarUrl}
                            after={item.userTag}
                            description={tabs.find(tab => tab.key === item.department).title}
                            loading={false}
                        >
                            {item.firstName + " " + item.lastName}
                        </Cell>
                    </Link>)}
                    {this.users.length === 0 && <Placeholder
                        header="Мы никого не нашли"
                        icon={notFound}
                    >
                        Попробуй скорректировать запрос
                    </Placeholder>}
                </>}
            </>}

            {this.state.error && <Placeholder
                header="Какой-то сверхразум все сломал"
                icon={UFO}
                button={<Button onClick={() => {
                    this.getUsers();
                    this.setState({
                        error: false
                    });
                }}>Попробовать снова</Button>}
            >
                Постараемся быстро починить
            </Placeholder>}

        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.data.users,
        search: state.data.search,
    };
};

const mapDispatchToProps = {
    setData
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);