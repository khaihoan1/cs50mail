
// THIS IS MAIN REACT FILE TO GENERATE THE SPA.
const MailContext = React.createContext();

// Fetch data the first time
var startingContent;
fetch(`/emails/inbox`)
    .then(response => response.json())
    .then(result => {
        if(result.length === 0){
            startingContent = {error: "Empty mailbox"};
        } else {
            startingContent = result;
        }
    })
    .then(()=>{

 

class Button extends React.Component {
    render() {
        return(
        <LoadMail>
            <MailContext.Consumer>
            {(value)=>  
            <div className={'header'}>
                <span className={'header-left'}>
                    <button onClick={()=>value.composeFunc()} className="btn btn-sm btn-outline-primary" id="compose">Compose</button>
                </span>
                <span className={"header-middle"}>
                    <button onClick={()=>value.func('inbox')} className="btn btn-sm btn-outline-primary" id="huuu">Inbox</button>
                    <button onClick={()=>value.func('sent')} className="btn btn-sm btn-outline-primary">Sent</button>
                    <button onClick={()=>value.func('archive')} className="btn btn-sm btn-outline-primary">Archived</button>
                </span>
                <span className={'header-right'}>
                    <a href="/logout" className="btn btn-sm btn-outline-danger" >Logout</a>
                </span>
            </div>
            }
            </MailContext.Consumer>
        </LoadMail>
        )   
    }
}

class MailForm extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isNewForm : true 
        }
    }

    static getDerivedStateFromProps (props, state) {
        if (state.isNewForm){
            if (props.content !== "COMPOSE FORM"){
                let { content } = props;
                let recipient = content.sender;
                if(content.subject.slice(0,3) === "Re:"){
                    var subject = content.subject;
                } else {
                    var subject = "Re: " + content.subject;
                }
                var body = "\n\n\n" +
                '----------------------------\n' +
                "On " + content.timestamp + " " +
                content.sender + " write \n " + content.body;
                return {
                    recipient: recipient,
                    subject: subject,
                    body: body,
                    hihi: props.hihi,
                };
            } else {
                return {
                    recipient: "",
                    subject: "",
                    body: "",
                    hihi: props.hihi,
                }
            }
        }
        return null;
    }
    componentDidMount(){
        this.setState({
            ...this.state,
            isNewForm: false
        })

    }
    handleChange(event) {
        name = event.target.name;
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    }

    render(){
        let { recipient, subject, body } = this.state;
        let { sendMail } = this.props;
        const user = document.getElementById('userHolder').innerHTML;
        return(
            <div id="compose-view">
                <h3>{this.props.title}</h3>
                <form id="compose-form">
                <div className="form-group">
                From: <input disabled className="form-control" value={user} />
                </div>
                <div className="form-group">
                To: <input
                    id="compose-recipients"
                    className="form-control"
                    onChange={this.handleChange}
                    placeholder="Recipient(s)" 
                    name="recipient" 
                    value={recipient}/>
                </div>
                <div className="form-group">
                <input className="form-control"
                    id="compose-subject"
                    onChange={this.handleChange}
                    placeholder="Subject" 
                    name="subject"
                    value={subject}/>
                </div>
                <textarea
                    className="form-control"
                    id="compose-body"
                    onChange={this.handleChange}
                    placeholder="Body"
                    name="body"
                    value={body}>
                 </textarea>
                <input type="button" value="Send" onClick={()=>sendMail()} className="btn btn-primary"/>
                </form>
            </div>
        )
    }
}

class Row extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isHovered: false
        }
        this.showAccessories = this.showAccessories.bind(this);
        this.hideAccessories = this.hideAccessories.bind(this);
        this.archiveToggle = this.archiveToggle.bind(this);
        this.replyThisRow = this.replyThisRow.bind(this);
        this.animationCall = this.animationCall.bind(this);
    }

    componentDidMount(){

    }

    componentDidUpdate(props, state){
        if (this.state.isHovered === true && this.props.mailbox !== "sent"){
            rowDisappear(props.item.id);
        };
    }
    renderAfterArchiveToggle (item){
        let { renderAfterArchiveToggle } = this.props;
        renderAfterArchiveToggle(item);
    }
    showAccessories (){
        this.setState({
            isHovered: true
        })
    }

    hideAccessories (){
        this.setState({
            isHovered: false
        })
    }

    archiveToggle (ev){
        // if(ev != undefined) {
            console.log(ev);
            ev.stopPropagation();
        //     console.log("ARCHIEVE TOGGLE");
            fetch(`/emails/${this.props.item.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    archived: !this.props.item.archived})
                })
            setTimeout(()=>this.renderAfterArchiveToggle(this.props.item), 1500);
            // .then(
            //     ()=>setTimeout(()=>this.renderAfterArchiveToggle(this.props.item), 3000)
            // )    
        // }
    }
    animationCall (ev){
        ev.stopPropagation();
    }
    replyThisRow (ev){
        ev.stopPropagation();
        console.log(this.props.replyEmailOnRow);
        this.props.replyEmailOnRow(this.props.item);
    }

    render(){
        let { item, viewMail, mailbox } = this.props;
        let background = "unread";
            if (item.read){
                background = "read";
            }
        if (mailbox === "sent"){
            var recips = item.recipients;
            var newrecips = "";
            for (let i=0; i < recips.length; i++){
                newrecips = newrecips + " " + recips[i];
            }
        }
        return(
            <div className={"mail-container " + background}
            onMouseEnter={this.showAccessories}
            onClick={()=>viewMail(item)}
            onMouseLeave={this.hideAccessories}>
                {/* <input type="checkbox"/> */}
                    <div className={'sender'}>{mailbox !=="sent" ? item.sender: newrecips}</div>
                    <div className={'subject'}>{item.subject}</div>
                    <div className={'timestamp'}>{item.timestamp}</div>
                {
                    mailbox !=="sent" && this.state.isHovered && 
                    <div className="accessories">
                        <img src="../static/mail/images/reply.svg"
                        onClick={this.replyThisRow}
                        />
                        <img src=
                        {mailbox === "inbox" ? "../static/mail/images/archive-black-box.svg" :
                        "../static/mail/images/close.svg"}
                        onClick={this.archiveToggle}
                        id={`archiveOnRow${item.id}`}
                        />
                    </div>
                }
            </div>
        )
        
    }
}

class Body extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isHovered: false
        } 
    }

    render(){
        let { content, mailbox, onEmailClick, renderAfterArchiveToggle, replyEmailOnRow } = this.props;
        let title = mailbox.slice(0,1).toUpperCase() + mailbox.slice(1);
        if (content.error){
            return (
            <div>
                <h2>{content.error === "Empty mailbox" ? title : "ERROR"}</h2>
                {content.error}
            </div>
            )
        } else {
            return (
                <div >
                    <h2>{title}</h2>
                    {
                        content.map((item)=> {
                            return (
                            <div key={item.id} className={'divcont'}>
                                <Row item={item} mailbox={mailbox} 
                                renderAfterArchiveToggle={renderAfterArchiveToggle}
                                replyEmailOnRow={replyEmailOnRow}
                                viewMail={onEmailClick}/>
                            </div>
                            )
                        }) 
                    } 
                </div>
            )
        }

    }
}

class EmailDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: this.props.email
        }
    }
    archiveEmail(item) {
        fetch(`/emails/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !item.archived})
        })
        .then(()=>{
            fetch(`/emails/${item.id}`)
            .then(response=>response.json())
            .then(response=>{
                this.setState({
                    email: response
                });
            })
        });
    }
    render(){
        let email = this.state.email;

        return(
            <div className={'email'}>
                <h3>{email.subject}</h3>
                <div className="email-header">
                    <span>From: {email.sender}</span>
                    <span className={'email-header-right'}>
                        <span className={'email-header-timestamp'}>On {email.timestamp}</span>
                        <span>
                            <img src="../static/mail/images/reply.svg"
                            onClick={()=>this.props.replyEmail()}
                            />
                            <img src={!email.archived ? "../static/mail/images/archive-black-box.svg" :
                            "../static/mail/images/close.svg"}
                            onClick={()=>this.archiveEmail(email)}
                            />
                        </span>
                    </span>
                </div>
                <hr></hr>
                <div className={'email-content'}>
                    {email.body}
                </div>
            </div>
        )
    }
}

class LoadMail extends React.Component {
    constructor(props){
        super(props);        
        this.state = {
            content: startingContent,
            viewMode: 'mailbox',
            mailbox: 'inbox'
        }

        this.getMailbox = this.getMailbox.bind(this);
        this.showComposeForm = this.showComposeForm.bind(this);
        this.onEmailClick = this.onEmailClick.bind(this);
        this.replyEmail = this.replyEmail.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.renderAfterArchiveToggle = this.renderAfterArchiveToggle.bind(this);
        this.replyEmailOnRow = this.replyEmailOnRow.bind(this);
    }

    sendMail(){
        var data = document.querySelector("#compose-form");
        var body = JSON.stringify({
            recipients: data['compose-recipients'].value,
            subject: data['compose-subject'].value,
            body: data['compose-body'].value
        });
        // Send data to API
        fetch('/emails', {
            method: 'POST',
            body: body
        })
        .then(response => response.json())
        .then(result => {
            // Success
            if (result.message) {
            this.getMailbox('sent');
            } else {
            // Error
            this.setState({
                ...this.state,
                content: result,
                viewMode: "mailbox",
                mailbox: "inbox"
            })
            }
        })
    }
    replyEmailOnRow(item){
        this.setState({
            viewMode: 'mailform',
            content: item
        })
    }
    replyEmail() {
        this.setState({
            viewMode: 'mailform'
        });
    }
    showComposeForm(){
            this.setState({
                viewMode: 'newmailform',
                content: 'COMPOSE FORM'
            });
        }
    onEmailClick(item){
            fetch(`/emails/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({read: true})
            })
            this.setState({
                viewMode: 'email',
                content: item
            })
    }
    renderAfterArchiveToggle (item){
        if (this.state.content.length === 1){
            this.setState({
                content: {error: "Empty mailbox"}
            });
        } else {
            let index = this.state.content.indexOf(item);
            this.setState({
                content: [
                    ...this.state.content.slice(0,index),
                    ...this.state.content.slice(index+1)
                ]
            });
        }
    }
    getMailbox(mailbox){
        var a =  fetch(`/emails/${mailbox}`)
            .then(response => response.json())
            .then(result => {
                if(result.length === 0){
                    this.setState({
                        content: {error: "Empty mailbox"},
                        viewMode: 'mailbox',
                        mailbox: mailbox
                    });
                } else {
                    this.setState({
                        content: result,
                        viewMode: 'mailbox',
                        mailbox: mailbox
                    });
                } 
        })
    }

    render(){
        // console.log(this.getMailbox);
        const { content,mailbox } = this.state;
        if (this.state.viewMode === "mailform"){
            return (
                <MailContext.Provider value={{
                    func: this.getMailbox,
                    content: this.state.content,
                    composeFunc: this.showComposeForm
                 }}> 
                    {this.props.children}
                    <hr></hr>
                    <MailForm content={content} title={"REPLY"} sendMail={this.sendMail}/>
                </MailContext.Provider>
            )
        } else if (this.state.viewMode === "mailbox") {
            return(
                <div>
                <MailContext.Provider value={{
                    func: this.getMailbox,
                    content: this.state.content,
                    composeFunc: this.showComposeForm
                     }}>
                    {this.props.children}
                    <hr></hr>
                    <Body content={content} mailbox={mailbox} replyEmailOnRow={this.replyEmailOnRow}
                    renderAfterArchiveToggle={this.renderAfterArchiveToggle}
                    onEmailClick={this.onEmailClick}/>
                </MailContext.Provider>
                </div>
            )
        } else if (this.state.viewMode === "newmailform") {
            return(
                <div>
                <MailContext.Provider value={{
                    func: this.getMailbox,
                    content: this.state.content,
                    composeFunc: this.showComposeForm
                 }}> 
                    {this.props.children}
                    <hr></hr>
                    <MailForm content={content} title={"NEW EMAIL"} sendMail={this.sendMail}/>
                </MailContext.Provider>
                </div>
            )
        } else {
            return(
                <div>
                <MailContext.Provider value={{
                    func: this.getMailbox,
                    // content: this.state.content,
                    composeFunc: this.showComposeForm
                     }}>
                    {this.props.children}
                    <hr></hr>
                     <EmailDetail email={content} replyEmail={this.replyEmail} archiveEmail={this.archiveEmail}/>
                </MailContext.Provider>
                </div>
            )
        }   
    }
}

    
    

ReactDOM.render(
    <Button/>, document.getElementById('hoan')
);
    

})