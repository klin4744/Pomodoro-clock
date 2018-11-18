class App extends React.Component{
  state = {
    breakLength: 5,
    sessionLength: 25,
    secLeft: 0,
    minLeft: 25,
    time: 1500,
    btn: "fa fa-play",
    timer: null,
    currentState: "Session"
  }
processInc = (e) => {
  if(this.state.btn === "fa fa-pause"){
    return;
  }
  const current = e.currentTarget.id;
  let valueToInc;
  let whatToChange;
  if(current === "session-increment" && this.state.sessionLength < 60 ){
    valueToInc = this.state.sessionLength ;
    valueToInc++;
    this.setState({
    sessionLength : valueToInc,
    minLeft: valueToInc,
    time: this.state.time + 60
  })
  }else if(current === "break-increment" && this.state.breakLength < 60 ){
    valueToInc = this.state.breakLength ;
    valueToInc++;
    this.setState({
    breakLength : valueToInc
  })
  }
  e.preventDefault;

}
timeToSeconds= () => {
  let mins = Number(this.state.minLeft) * 60;
  let seconds = Number(this.state.secLeft);
  let totalTime = mins + seconds  
  return totalTime;
}
processDec = (e) => {
    if(this.state.btn === "fa fa-pause"){
    return;
  }
 const current = e.currentTarget.id;
  let valueToInc;
  let whatToChange;
  if(current === "session-decrement" && this.state.sessionLength > 1 ){
    valueToInc = this.state.sessionLength ;
    valueToInc--;
    this.setState({
    sessionLength : valueToInc,
    minLeft: valueToInc,
    time: this.state.time - 60
  })
  }else if(current === "break-decrement" && this.state.breakLength > 1 ){
    valueToInc = this.state.breakLength ;
    valueToInc--;
    this.setState({
    breakLength : valueToInc
  })
  }
  e.preventDefault;
};

startStop = (e) => {
  let btn;
  if(this.state.btn === "fa fa-play"){
    btn = "fa fa-pause";
    let intervalId = setInterval(this.timerDown, 1000)
    this.setState({ intervalId: intervalId })
    console.log(this.state.time)
  }else if(this.state.btn === "fa fa-pause"){
    clearInterval(this.state.intervalId)
    btn="fa fa-play"
  }
  this.setState({
    btn
  })
  e.preventDefault;
};
timerDown = () =>{
  if(this.state.time > 0){
    let time = this.state.time - 1;
    let seconds = time % 60;
    let min = Math.floor(time/60);
    this.setState({
      time: time,
      secLeft: seconds,
      minLeft: min
    })}else if(this.state.time === 0 && this.state.currentState === "Session"){
     document.getElementById("beep").play()
    this.setState({
      currentState: "Break",
      time: this.state.time + this.state.breakLength * 60 + 1
    })
  }else if(this.state.time === 0 && this.state.currentState === "Break"){
    document.getElementById("beep").play()
    this.setState({
      currentState: "Session",
      time: this.state.time + this.state.sessionLength * 60 + 1
    })
  }
}
  
reset = (e) => {
  clearInterval(this.state.intervalId)
  this.setState({
    breakLength: 5,
    sessionLength: 25,
    secLeft: 0,
    minLeft: 25,
    time: 1500,
    btn: "fa fa-play",
    timer: null,
    currentState: "Session"
  })
  document.getElementById("beep").pause();
  document.getElementById("beep").currentTime = 0;
  e.preventDefault;
}
  render(){
    return(
      <div className="container my-auto text-center p-5">
        <h1 className="display-3" >Pomodoro Clock</h1>
        <small>A project by Kevin Lin</small>
        <div className="row pt-3">
          <div className="col-md-6">
            <ButtonSetters length={this.state.breakLength} id="break-label" title="Break Length" incrementID="break-increment" decrementID="break-decrement" lengthID="break-length" processInc={this.processInc} processDec={this.processDec} />
          </div>
           <div className="col-md-6">
            <ButtonSetters length={this.state.sessionLength} id="session-label" title="Session Length" incrementID="session-increment" decrementID="session-decrement" lengthID="session-length" processInc={this.processInc} processDec={this.processDec}/>
          </div>
      <div className="col-md-12">
             <Timer currentState={this.state.currentState} startStop={this.startStop} secLeft={this.state.secLeft} minLeft={this.state.minLeft} currentBtn={this.state.btn} reset={this.reset}/>
           </div>
        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
           />
        </div>
      </div>
    )
  }
}
class ButtonSetters extends App{
  render(){
    return(
      <div className=" p-2">
        <div>
          <h1 className="display-4" id={this.props.id}>{this.props.title}</h1>
         <hr />
        </div>
        <div>
          <h1 className="display-4" id={this.props.lengthID}>{this.props.length}</h1>
           <button onClick={this.props.processInc} id={this.props.incrementID} className="btn-lg btn mr-2 btn-dark"><i className="fa fa-arrow-up"></i></button>
           <button onClick={this.props.processDec} id={this.props.decrementID} className="btn-lg btn ml-2 btn-secondary"><i className="fa fa-arrow-down"></i></button>
        </div>
      </div>
    )
  }
}
class Timer extends App {
  render(){
    return(
      <div >
          <h1 id="timer-label" className="display-4">{this.props.currentState}</h1>
          <hr />
          <h1 id="time-left" className="display-4">
            {`${fixStrings(this.props.minLeft)}:${fixStrings(this.props.secLeft)}`}
          </h1>
           <button onClick={this.props.startStop} id="start_stop" className="btn-lg btn mr-2 btn-dark"><i className={this.props.currentBtn}></i></button>
           <button onClick={this.props.reset} id="reset" className="btn-lg btn ml-2 btn-secondary"><i className="fa fa-refresh"></i></button>
      </div>
    )
  }
}
const fixStrings = (time) => {
  if(time <10 ){
    return `0${time}`
  }else{
    return `${time}`
  }
}
let interval;
ReactDOM.render(<App />, document.getElementById("body"))