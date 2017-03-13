import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




var App = React.createClass({
  getInitialState:function(){
    return {selectedNumbers:[],
    numberOfStars : this.randomNumber(),
    correct: null,
    usedNumbers:[],
    redraws:5,
    doneStatus: null,
    };
  },
  resetGame:function(){
    this.replaceState(this.getInitialState());
  },
  randomNumber:function(){
    return Math.floor(Math.random()*9)+1;
  },
  clickNumber:function(clickedNumber){
    this.setState({selectedNumbers:this.state.selectedNumbers.concat(clickedNumber),correct:null});
  },
  cancelNumber:function(clickedNumber){
    this.state.selectedNumbers.splice(this.state.selectedNumbers.indexOf(clickedNumber),1);
    this.setState({selectedNumbers:this.state.selectedNumbers,correct:null});
  },
  sumOfSelectedNumbers:function(){
    return this.state.selectedNumbers.reduce(function(p,n){
      return p+n;
    });
  },
  checkAnswer:function(){
    var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
    this.setState({correct:correct});
    },
    acceptAnswer:function(){
      var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
      var component = this;
      this.setState({
        selectedNumbers:[],
        usedNumbers: usedNumbers,
        correct: null,
        numberOfStars : this.randomNumber(),
      },function(){
        component.updateDoneStatus();
      });

    },
  getNumbers: function(numbers,answers=false){
    var component = this;
    return numbers.map(function(el){
      if(answers){
        return( <div className = "number selected" onClick={component.cancelNumber.bind(null,el)}>{el}</div>);
      }
      else{
        if(component.state.usedNumbers.indexOf(el)!=-1)
        {
          return (<div className="number used">{el}</div>);
        }
        else if(component.state.selectedNumbers.indexOf(el)!=-1){
          return (<div className="number selected">{el}</div>);
        }
        else{
         return ( <div className="number" onClick={component.clickNumber.bind(null,el)}>{el}</div>);
        }

      }
    });

  },
  redraw: function(){
    if(this.state.redraws >0){
       var component = this;
        this.setState({ numberOfStars : this.randomNumber(),
          correct:null,
          selectedNumbers:[],
          redraws:this.state.redraws-1
        },function(){
        component.updateDoneStatus();
      });

    }
  },
  possibleCombinations:function(numbers,val){
  if(numbers.indexOf(val)!=-1) return true;
  if(numbers.length===0) return false;
  if(numbers[0]>val) return false;

  while(numbers[numbers.length-1]>val){
    numbers.pop();
  }

 for(var i=0;i<numbers.length;i++){

   for(var j=i+1;j<numbers.length;j++){
     var comb2 = numbers[i]+numbers[j];

     if(comb2 === val){
       return true;
     }
     for(var k=j+1;k<numbers.length;k++){
       var comb3 =numbers[i]+numbers[j]+numbers[k];


       if(comb3 ===val){
         return true;
       }
       for(var l = k+1;l<numbers.length;l++){
         var comb4 =numbers[i]+numbers[j]+numbers[k]+numbers[l];

        if(comb4 ===val){
         return true;
        }
       }
     }
   }
 }

  return false;
},
  possibleSolutions:function(){
   var numberOfStars  =this.state.numberOfStars,
        possibleNumbers=[],
        usedNumbers = this.state.usedNumbers;

        for(var i=1;i<=9;i++){
          if(usedNumbers.indexOf(i)==-1){
            possibleNumbers.push(i);
          }
        }
        console.log(possibleNumbers +" "+numberOfStars);
        return this.possibleCombinations(possibleNumbers,numberOfStars);

  },
  updateDoneStatus:function(){

    if(this.state.usedNumbers.length === 9){
      this.setState({doneStatus:'Done. Nice!'});
      return ;
    }
    var possibleSolution = this.possibleSolutions();
    if(this.state.redraws === 0 && !possibleSolution){
      this.setState({doneStatus:"Game Over!"});
    }

  },
  render:function(){
    var bottomFrame = this.state.doneStatus?
    <DoneFrame doneStatus = {this.state.doneStatus} resetGame={this.resetGame}/>:
    <NumbersFrame selectedNumbers={this.state.selectedNumbers}  getNumbers={this.getNumbers}  />;



    return(
        <div id="game">
          <h2>Play Nine</h2>
          <hr/>
          <div className="clearfix">
          <StarsFrame numberOfStars={this.state.numberOfStars}/>
          <ButtonFrame  redraws={this.state.redraws} redraw = {this.redraw} acceptAnswer={this.acceptAnswer} selectedNumbers={this.state.selectedNumbers} checkAnswer={this.checkAnswer} correct={this.state.correct} />

          <AnswerFrame selectedNumbers={this.state.selectedNumbers} getNumbers={this.getNumbers}/>
          </div>
          {bottomFrame}
        </div>

      );
  }

});


var StarsFrame = React.createClass({
  getInitialState:function(){
    return { };
  },
  render:function(){

    var stars = [];

    for(var i=1;i<=this.props.numberOfStars;i++){
      stars.push(<span className="glyphicon glyphicon-star"></span>);
    }
    return(
        <div id="stars-frame">
        <div className="well">
          {stars}
        </div>
        </div>
      );
  }

});

var ButtonFrame = React.createClass({

  render:function(){
    var disabled,button;

    switch(this.props.correct){
      case true:
        button = (
      <button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
      <span className="glyphicon glyphicon-ok"></span>
      </button>
      );
      break;
      case false:
         button = (
      <button className="btn btn-danger btn-lg">
         <span className="glyphicon glyphicon-remove"></span>
      </button>
      );
      break;
      default:
      disabled = (this.props.selectedNumbers.length===0)
      button = (
      <button className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>
      =
      </button>
      );

    }

    return(
        <div id="button-frame">
        {button}
        <br/>
        <br/>
        <button className="btn btn-warning btn-xs" onClick = {this.props.redraw} disabled={this.props.redraws===0}>
          <span className="glyphicon glyphicon-refresh" ></span>
          &nbsp;
          {this.props.redraws}
        </button>
           </div>
      );
  }

});

var AnswerFrame = React.createClass({

  render:function(){
    return(
        <div id="answer-frame">
          <div className="well">
            {this.props.getNumbers(this.props.selectedNumbers,true)}
          </div>
        </div>
      );
  }

});


var NumbersFrame = React.createClass({

  render:function(){
    var numbers=Array(9).fill(0).map((e,i)=>i+1);

    return(
        <div id="numbers-frame">
          <div className="well">
           {this.props.getNumbers(numbers)}
          </div>
        </div>
      );
  }

});

var DoneFrame = React.createClass({
  render:function(){
    return (
        <div className="well text-center" id="done-frame">
        <h2> {this.props.doneStatus}</h2>
        <button className="btn btn-default" onClick={this.props.resetGame}>Play again</button>
        </div>
      );
  }

});

export default App;
