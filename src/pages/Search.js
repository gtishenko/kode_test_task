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
import Alert from '../components/Alert';
import Year from '../components/Year';

const months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
];

let oldSort = 0;

let nowDate = new Date();

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "all",
            loading: this.props.users.length === 0,
            status: "default",
            error: false,
            sortSettingsOpened: false
        };

        this.updateStatus = this.updateStatus.bind(this);
    }

    componentWillUnmount() {
        const { setData } = this.props;
        window.removeEventListener("online", this.updateStatus);
        window.removeEventListener("offline", this.updateStatus);
        setData("scrollPosition", window.scrollY);
    }

    componentDidMount() {
        const { users, scrollPosition } = this.props;
        window.scrollTo(0, scrollPosition);
        if (users.length === 0) {
            this.getUsers();
        }

        if(!navigator.onLine) {
            this.setState({
                status: "error"
            });
        }

        window.addEventListener("online", this.updateStatus);
        window.addEventListener("offline", this.updateStatus);
    }

    updateStatus() {
        if (navigator.onLine && this.state.status === "error") {
            this.setState({
                status: "loading",
                loading: true
            });
            this.getUsers();
        } else if (!navigator.onLine && (this.state.status === "default" || this.state.status === "loading")) {
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
            let users = data.data.items;

            for (let i = 0; i < users.length; i++) {
                try {
                    users[i].birthday = new Date(users[i].birthday);
                } catch (error) {
                    console.log(error);
                    users[i].birthday = null;
                }
            }

            setData("users", users);
            this.sortUsers();
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
        const { users, search, sort } = this.props;
        const searchText = search.toLowerCase().trim();
        if (sort === 0) { //if sort by alphabet
            return users
            .filter(({ firstName, lastName, userTag, department }) =>
                (this.state.activeTab === "all" || department === this.state.activeTab) &&
                ((firstName + " " + lastName).toLowerCase().indexOf(searchText) > -1 ||
                (lastName + " " + firstName).toLowerCase().indexOf(searchText) > -1 ||
                userTag.toLowerCase().indexOf(searchText) > -1));
        } else {// if sort by birthday
            return users
            .filter(({ firstName, lastName, userTag, department }) =>
                (this.state.activeTab === "all" || department === this.state.activeTab) &&
                ((firstName + " " + lastName).toLowerCase().indexOf(searchText) > -1 ||
                    (lastName + " " + firstName).toLowerCase().indexOf(searchText) > -1 ||
                    userTag.toLowerCase().indexOf(searchText) > -1));
        }
    }

    sortUsers() {
        const { setData, users, sort } = this.props;
        let sortedUsers;
        if(sort === 0) {
            sortedUsers = users.sort(function (a, b) {
                if (a.firstName < b.firstName) { return -1; }
                if (a.firstName > b.firstName) { return 1; }
                return 0;
            });
        } else if(sort === 1) {
            for (let i = 0; i < users.length; i++) {
                let user = JSON.parse(JSON.stringify(users[i])); //unlink
                let upcomingBirthday = new Date(user.birthday);

                if(upcomingBirthday.getMonth() < nowDate.getMonth()) upcomingBirthday.setYear(nowDate.getFullYear()+1);
                else if(upcomingBirthday.getMonth() === nowDate.getMonth() && upcomingBirthday.getDate() <= nowDate.getDate()) upcomingBirthday.setYear(nowDate.getFullYear()+1);
                else if(upcomingBirthday.getMonth() === nowDate.getMonth() && upcomingBirthday.getDate() > nowDate.getDate()) upcomingBirthday.setYear(nowDate.getFullYear());
                else if(upcomingBirthday.getMonth() > nowDate.getMonth()) upcomingBirthday.setYear(nowDate.getFullYear());

                users[i].upcomingBirthday = upcomingBirthday;
            }

            sortedUsers = users.sort(function(a, b){
                let firstDifference = a.upcomingBirthday - nowDate;
                let secondDifference = b.upcomingBirthday - nowDate;

                return firstDifference - secondDifference;
            });

            for (let i = 0; i < sortedUsers.length; i++) {
                if(sortedUsers[i].upcomingBirthday.getFullYear() === nowDate.getFullYear()+1) {
                    console.log(sortedUsers[i]);
                    sortedUsers[i].nextYear = true;
                    break;
                }
            }

            console.log(sortedUsers);
        }
        setData("users", sortedUsers);
    }

    render() {
        const { setData, search, sort } = this.props;
        if(sort !== oldSort) {
            oldSort = sort;
            this.sortUsers();
        }
        let yearLine = false;

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
                onClickSort={() => this.setState({ sortSettingsOpened: true })}
            />

            {!this.state.error && <>
                {this.state.loading ? [...Array(15)].map(() => <Cell
                    loading={true}
                />)
                :
                <>
                    {this.users.map((item) => {
                        let line = false;
                        if(sort === 1 && !yearLine && item.upcomingBirthday && item.upcomingBirthday.getFullYear() !== nowDate.getFullYear()) {
                            yearLine = true;
                            line = true;
                        }
                        return (<>
                            {line && <Year>{nowDate.getFullYear()+1}</Year>}
                            <Link onClick={() => {
                                setData("activeUser", item);
                            }} to="/profile">
                                <Cell
                                    key={item.id}
                                    avatarSource={item.avatarUrl}
                                    afterText={item.userTag}
                                    description={tabs.find(tab => tab.key === item.department).title}
                                    loading={false}
                                    after={sort === 1 && item.birthday.getDate() + " " + months[item.birthday.getMonth()]}
                                >
                                    {item.firstName + " " + item.lastName}
                                </Cell>
                            </Link>
                        </>)
                    })}
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

            {this.state.sortSettingsOpened && <Alert onClose={() => this.setState({ sortSettingsOpened: false })} closeButtonSide="right" header="Сортировка">
                <div onClick={() => {
                    setData("sort", 0);
                    this.setState({
                        sortSettingsOpened: false
                    });
                }} className="sort-radio-item">
                    <input type="radio" id="alphabet" name="sort" value={0} checked={sort === 0} />
                    <label>По алфавиту</label>
                </div>

                <div onClick={() => {
                    setData("sort", 1);
                    this.setState({
                        sortSettingsOpened: false
                    });
                }} className="sort-radio-item">
                    <input type="radio" id="birthday" name="sort" value={1} checked={sort === 1} />
                    <label>По дню рождения</label>
                </div>
            </Alert>}

        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.data.users,
        search: state.data.search,
        sort: state.data.sort,
        scrollPosition: state.data.scrollPosition,
    };
};

const mapDispatchToProps = {
    setData
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);