import React from 'react'; 
import ReactDom from 'react-dom'; 
import { Row, Col, Card, Button, Select, Tag} from 'antd';
import fire from "./fire.js";
import "./UserList.css";


const Option = Select.Option

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [], 
            clicked: false, 
        }
    }

    handleClick = e => {
        this.setState({
            clicked: !this.state.clicked,
        })
    }

    handleSelect = (userID, value) => {
        let hopperRef = fire.database().ref(`/users/${userID}`);
        hopperRef.update({
            status: value, 
        }); 
      };

    removeItem(userID) {
        const userRef = fire.database().ref(`/users/${userID}`);
        userRef.remove();
    }

    handleCreate = (userID) => {
        let approvalRef = fire.database().ref(`/users/${userID}`);
        approvalRef.update({
            approved: true, 
        })
    }

    componentDidMount(){
        let usersRef = fire.database().ref('users');
        usersRef.on('value', (snapshot) => {
            let users = snapshot.val();
            let allUsers = []; 
            for (let user in users) {
                allUsers.push({
                  id: user, 
                  name: users[user].fullname, 
                  email: users[user].email, 
                  username: users[user].username,
                  approved: users[user].approved, 
                }); 
            }
            this.setState({
                allUsers: allUsers
              });
        });
    }

    render() {
        const isClicked = this.state.clicked; 
        return (
            <div className="userProfs">
                 <Row gutter={16}>
                 <Col span={8}>
                 <h1 className="userHeader"> User Profiles </h1> 
                     {isClicked ? <Button size="medium" onClick={this.handleClick}>Done</Button> : <Button size="medium" onClick={this.handleClick}>Edit</Button>} 
                     <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <div>
                        <h2> Users to Approve </h2> 
                        {this.state.allUsers.map((user) => {
                            if (user.approved == false) {
                                return (
                                <div>
                                <Card className="userCards" 
                                      title={<h1 className="cardTitle">{user.fullname} </h1>} 
                                      bordered={false} 
                                      style={{ marginTop: 8 }}
                                      extra={<img width="100px" height="100px" alt="example" src={user.profilepic}/>} >
                                    <p>Username: {user.username}</p>
                                    <p>Email: {user.email}</p>
                                    {isClicked ?  <div> <Button size="medium" onClick={() => this.removeItem(user.id)}>Remove User</Button> <Button size="medium" onClick={() => this.handleCreate(user.id)}> Approve New User </Button> 
                                        <br/> 
                                        <Select placeholder="Status" style={{ width: "60%" }} onChange={value => this.handleSelect(user.id, value)}>
                                            <Option value="intern">Intern</Option>
                                            <Option value="alumni">Alumni</Option>
                                            <Option value="administrator">Administrator</Option>
                                        </Select> 
                                    </div>: null}
                                </Card>
                                </div>
                                );
                            }
                        })}
                        </div>
                        <div>
                        <h2> Approved Users </h2> 
                        {this.state.allUsers.map((user) => {
                            let skills = [];
                            let curSkills = user.skills;
                                if(curSkills) {
                                    Object.keys(curSkills).forEach((key) => {
                                        let skill = curSkills[key].skill;
                                        skills.push(skill)
                                        console.log(skill)
                                        
                                    });
                                };
                            if (user.approved == true) {
                                return (
                                <div style={{ background: '#ECECEC', padding: '30px'}}>
                                <Card className="userCards"
                                      title={<h1 className="cardTitle">{user.fullname} </h1>} 
                                      bordered={false} 
                                      style={{ marginTop: 8 }}
                                      extra={<img width="100px" height="100px" alt="example" src={user.profilepic}/>} >
                                    <p>Username: {user.username}</p>
                                    <p>Email: {user.email}</p>
                                    {isClicked ?  <div> <Button size="medium" onClick={() => this.removeItem(user.id)}>Remove User</Button>
                                        <br/> 
                                        <Select placeholder="Status" style={{ width: "60%" }} onChange={value => this.handleSelect(user.id, value)}>
                                            <Option value="intern">Intern</Option>
                                            <Option value="alumni">Alumni</Option>
                                            <Option value="administrator">Administrator</Option>
                                        </Select> 
                                    </div>: null}
                                    Skills: {skills.map(skill => {
                                        let theSkill = skill;
                                        return (
                                        <Tag> {theSkill} </Tag>
                                        )
                                    })}
                                </Card>
                                </div>
                                );
                            }
                        })}
                        </div>
                     </div> 
                 </Col> 
                 </Row> 
             </div> 
         ); 
    }
}
