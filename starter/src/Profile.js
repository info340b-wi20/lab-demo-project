import React, { Component } from 'react';
import { Form, FormGroup, Input, Label , Button} from 'reactstrap';
import firebase from 'firebase/app';

class Profile extends Component {

    state = {
        profession: "",
        age: 0,
        bio: "",
        interests: "",
        isUpdate: false
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let { bio, age, interests, profession } = this.state;
        let profileInfo = {
            bio: bio,
            age: age,
            interests: interests.split(",").map((interest) => interest.trim()).filter((interest) => interest !== ""),
            profession: profession
        }
        let dbRef = firebase.database().ref("/users").child(this.props.user.uid);
        dbRef.set(profileInfo)
        .then(() => {
            this.setState({
                isUpdate: false
            })
        });
    }

    toEditMode = () => {
        let { age, profession, bio, interests } = this.props.userData;
        this.setState({ 
            isUpdate: true,
            age: age,
            profession: profession,
            bio: bio,
            interests: interests.join(", ")
        })
    }

    render() {
        let user = this.props.user;
        let userData = this.props.userData;
        return (
            <div>
                <h1>Profile</h1>
                <div className="box">
                    <div className="person card"><img width="100%" src={user.photoURL} alt={user.displayName}
                        className="card-img-top" />
                        <div className="card-body">
                            <div className="card-title">{user.displayName} {userData && userData.age}</div>
                            {(userData && !this.state.isUpdate) ?
                                <div>
                                    <Button onClick={this.toEditMode} style={{ margin: "1em" }}>Update</Button>
                                    <div className="card-subtitle">{userData.profession}</div>
                                    <p className="card-text">{userData.bio}</p>
                                    <div>
                                        <h3>Interests</h3>
                                        <ul>
                                            {userData.interests.map((interest) => {
                                                return <li key={interest}>{interest}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                :
                                <div>
                                    <h2>Update your profile</h2>
                                    <Form>
                                        <FormGroup>
                                            <Label for="age">Age</Label>
                                            <Input type="number" name="age" value={this.state.age} onChange={this.handleChange} id="age" placeholder="Your age" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="prof">Profession</Label>
                                            <Input type="text" name="profession" value={this.state.profession} onChange={this.handleChange} id="prof" placeholder="Your profession" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="bio">Bio</Label>
                                            <Input type="textarea" name="bio" value={this.state.bio} onChange={this.handleChange} id="bio" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="interest">Interests</Label>
                                            <Input type="text" name="interests" value={this.state.interests} onChange={this.handleChange} id="interests" placeholder="Enter your interests with a comma separating them" />
                                        </FormGroup>
                                        <Button onClick={this.handleSubmit}>{this.state.isUpdate ? "Update" : "Submit"}</Button>
                                    </Form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Profile;
