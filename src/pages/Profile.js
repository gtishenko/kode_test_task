import React from 'react';
import backButton from '../images/back.svg';
import birthday from '../images/birthday.svg';
import phone from '../images/phone.svg';
import UFO from '../images/UFO.png';
import SimpleCell from '../components/SimpleCell';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { tabs } from '../info';
import Placeholder from '../components/Placeholder';
import Button from '../components/Button';

const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    declOfNum(n, text_forms) {
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 === 1) { return text_forms[0]; }
        return text_forms[2];
    }

    getAge(date) {
        let today = new Date();
        let birthDate = date;
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    render() {
        const { activeUser } = this.props;
        console.log(activeUser);
        let birthdayString = null, age = null;
        if(activeUser) {
            let birthday = activeUser.birthday;
            age = this.getAge(birthday);
            age += this.declOfNum(age, [" год", " года", " лет"]);

            birthdayString = birthday.getDate() + " " + months[birthday.getMonth()] + " " + birthday.getFullYear();
        }

        return <div className="profile">
            <Link to="/">
                <img src={backButton} className="back-button" alt="back button" />
            </Link>
            
            {activeUser ? <>
                <div className="header">
                    <div className="center-content">
                        <div style={{ backgroundImage: "url(" + activeUser.avatarUrl + ")" }} className="avatar" />
                        <div className="title-block">
                            <div className="title">
                                {activeUser.firstName + " " + activeUser.lastName}
                            </div>
                            <div className="after">
                                {activeUser.userTag}
                            </div>
                        </div>
                        <div className="description">
                            {tabs.find(tab => tab.key === activeUser.department).title}
                        </div>
                    </div>
                </div>

                {birthdayString && <SimpleCell
                    before={<img alt="birthday icon" src={birthday} width={24} />}
                    after={age}
                >
                    {birthdayString}
                </SimpleCell>}

                <a href={"tel:+" + activeUser.phone}>
                    <SimpleCell
                        before={<img alt="phone" src={phone} width={24} />}
                    >
                        {activeUser.phone}
                    </SimpleCell>
                </a>
            </> : <Placeholder
                header="Вы не выбрали пользователя"
                icon={UFO}
                button={<Link to="/"><Button>Назад</Button></Link>}
            >
                Нажмите на любого пользователя на главной странице
            </Placeholder>}
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        activeUser: state.data.activeUser,
    };
};

export default connect(mapStateToProps, null)(Profile);