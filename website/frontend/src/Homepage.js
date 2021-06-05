import { Component } from 'react'
import { Button, Dimmer, Loader, Select, Input } from "semantic-ui-react";
import Table from './Table'
import NewEntry from'./NewEntry'

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            users: [],
            containers: [],
            transactions: [],
            loaded: false,
            showTable: "transactions",
        };
    }

    // Fetches the container, user, and transaction data from the database
    async componentDidMount(){
        let response = await fetch("http://192.168.50.237:8000/api/" + 'transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const transactions = await response.json();

        response = await fetch("http://192.168.50.237:8000/api/" + 'users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const users = await response.json();

        response = await fetch("http://192.168.50.237:8000/api/" + 'containers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const containers = await response.json();
        let userIDs = []
        users.forEach(user => {
            let data = {
                key: user.ID,
                value: user.ID,
                text: user.ID
            }
            userIDs.push(data)
        })

        let containerIDs = []
        containers.forEach(container => {
            let data = {
                key: container.ID,
                value: container.ID,
                text: container.ID
            }
            containerIDs.push(data)
        })
        
        this.setState({
            users: users, 
            userIDs: userIDs,
            containers: containers, 
            containerIDs: containerIDs,
            transactions: transactions, 
            loaded: true
        })
    }

    showTable = (type) => {
        this.setState({showTable: type})
    }

    newEntry = () => {
        this.setState({
            showTable: null
        })
        this.state.showTable = null
    }

    render() {
        let {loaded, showTable} = this.state
        console.log(this.state)
        return (
            <div className="homepage">
                {loaded ?
                 <div>
                    <h1>Reusable Container Data</h1>
                    <div className="buttons">
                        <Button style={{width: 140}} color="violet" size="large" onClick={() => this.showTable("transactions")}>Transactions</Button> 
                        <Button style={{width: 140}} color="teal" size="large" onClick={() => this.showTable("users")}>Users</Button>  
                        <Button style={{width: 140}} color="blue" size="large" onClick={() => this.showTable("containers")}>Containers</Button> 
                        <Button style={{width: 140}} color="purple" size="large" onClick={() => this.newEntry()}>New Entry</Button>
                    </div> 
                    {showTable ? <Table data={this.state[showTable]} type={showTable}/> : <NewEntry data={this.state}/> }
                 </div>
                 :
                 <Dimmer active inverted>
                     <Loader inverted>Loading</Loader>
                 </Dimmer>
                }
            </div>
        );
    }
}

export default Homepage;

