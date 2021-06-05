import { Component } from 'react'
import { Button, Dimmer, Loader, Select, Input } from "semantic-ui-react";

class NewEntry extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            returnUser: null,
            checkoutUser: null,
            returnContainer: null,
            checkoutContainer: null,

            availableContainers: [],
            userContainers: [],
        };
    }

    handleOnChange = (data, type, transaction) => {
        if (transaction === "return") {
            if (type === "user") {
                this.state.returnUser = data.value
                this.getUserContainers(data.value)
            }
            if (type === "container") {
                this.state.returnContainer = data.value
            }
        }
        else {
            if (type === "user") {
                this.state.checkoutUser = data.value
                this.getAvailableContainers()
            }
            if (type === "container") {
                this.state.checkoutContainer = data.value
            }
        }
        this.setState({})
     }

    getUserContainers = async (userID) => {
        let data = { userID }

        let response = await fetch("http://192.168.50.237:8000/api/" + 'user-containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
        })

        const user_containers = await response.json();
        let res = []
        user_containers.forEach(container => {
            let data = {
                key: container.container,
                value: container.container,
                text: container.container
            }
            res.push(data)
        })

        this.setState({ userContainers: res })
    }

    getAvailableContainers = () => {
        let allContainers = this.props.data.containers

        let res = []
        allContainers.forEach(container => {
            if (container.checkedOut === '0') {
                let data = {
                    key: container.ID,
                    value: container.ID,
                    text: container.ID
                }
                res.push(data)
            }
        })
        
        this.setState({availableContainers: res})
    }

    addUser = async () => {
        let { firstName, lastName, userID } = this.state
        if (firstName && lastName && userID) {
            let data = { firstName, lastName, userID }
            await fetch("http://192.168.50.237:8000/api/" + 'add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(data)
            })
            window.location.reload()
        }
    }

    addContainer = async () => {
        let { containerID } = this.state
        if ( containerID ) {
            let data = { containerID }
            await fetch("http://192.168.50.237:8000/api/" + 'add-container', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(data)
            })
            window.location.reload()
        }
    }

    checkoutContainer = async () => {
        let { checkoutContainer, checkoutUser } = this.state
        let data = { checkoutContainer, checkoutUser }
        await fetch("http://192.168.50.237:8000/api/" + 'checkout-container', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
        })
        window.location.reload()
    }

    returnContainer = async () => {
        let { returnContainer, returnUser } = this.state
        let data = { returnContainer, returnUser }
        await fetch("http://192.168.50.237:8000/api/" + 'return-container', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
        })
        window.location.reload()
    }

    handleChange = (e, key) => {
        this.setState({[key]: e.target.value})
    }
    
    render() {
        console.log(this.props.data)
        console.log(this.state)
        let {userIDs} = this.props.data
        let { firstName, lastName, userID, containerID, availableContainers, userContainers } = this.state
        let { returnContainer, returnUser, checkoutContainer, checkoutUser } = this.state

        let addContainerDisabled = true
        let addUserDisabled = true
        let returnDisabled = true
        let checkoutDisabled = true

        if (firstName && lastName && userID) {
            addUserDisabled = false
        }
        if (containerID) {
            addContainerDisabled = false
        }
        if (returnContainer && returnUser) {
            returnDisabled = false
        }
        if (checkoutContainer && checkoutUser) {
            checkoutDisabled = false
        }

        return (
            <div className="new-entry-page">
                <div className="add-entry-row">
                    <h5>New Transaction</h5>
                    <div className="transaction-row">
                        <Select
                            placeholder="User"
                            options={userIDs}
                            style={{margin: "0px 5px"}}
                            onChange={(e, data) => this.handleOnChange(data, "user", "return")}
                        />
                        <Select
                            placeholder="Container"
                            options={userContainers}
                            style={{margin: "0px 5px"}}
                            onChange={(e, data) => this.handleOnChange(data, "container", "return")}
                            disabled={this.state.returnUser === null}
                        />
                        <Button 
                            style={{margin: "0px 5px", width: 180}}
                            disabled={returnDisabled}
                            onClick={this.returnContainer}>
                            Return Container
                        </Button>
                    </div>
                    <div className="transaction-row">
                        <Select
                            placeholder="User"
                            options={userIDs}
                            style={{margin: "0px 5px"}}
                            onChange={(e, data) => this.handleOnChange(data, "user", "checkout")}
                        />
                        <Select
                            placeholder="Container"
                            options={availableContainers}
                            style={{margin: "0px 5px"}}
                            onChange={(e, data) => this.handleOnChange(data, "container", "checkout")}
                            disabled={this.state.checkoutUser === null}
                            
                        />
                        <Button 
                            style={{margin: "0px 5px", width: 180}}
                            disabled={checkoutDisabled}
                            onClick={this.checkoutContainer}>
                            Checkout Container
                        </Button>
                    </div>
                </div>
                <div className="add-entry-row">
                    <h5>New User</h5>
                    <Input
                        placeholder="First Name"
                        style={{padding: "0px 5px"}}
                        onChange={e => this.handleChange(e, "firstName")}
                    />
                    <Input
                        placeholder="Last Name"
                        style={{padding: "0px 5px"}}
                        onChange={e => this.handleChange(e, "lastName")}
                    />
                    <Input
                        placeholder="User ID"
                        style={{padding: "0px 5px"}}
                        onChange={e => this.handleChange(e, "userID")}
                    />
                    <Button 
                        style={{margin: "0px 5px"}} 
                        onClick={this.addUser}
                        disabled={addUserDisabled}> 
                        Add user
                    </Button>
                </div>
                <div className="add-entry-row">
                    <h5>New Container</h5>
                    <Input
                        placeholder="Container ID"
                        style={{padding: "0px 5px"}}
                        onChange={e => this.handleChange(e, "containerID")}
                    />
                    <Button 
                        style={{margin: "0px 5px"}} 
                        onClick={this.addContainer}
                        disabled={addContainerDisabled}> 
                        Add Container
                    </Button>
                </div>
            </div>
        );
    }
}

export default NewEntry;

