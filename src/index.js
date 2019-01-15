import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";



class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {greeting: '0', numvalue: 0, enemyBonus: 0, playerBonus: 0, dice: 6, numberOfPropabilities: 1};
    }

    generatePropabilities()
    {
        let n = this.state.numberOfPropabilities;
        let prevProb = 1.0;
        let probs = [];
        for(let i = 0; i < n; i++)
        {
            let newProbs = calculatePropability(prevProb, this.state.enemyBonus, this.state.playerBonus, this.state.dice);
            console.log(newProbs);
            prevProb = newProbs.tieProb;
            probs.push(<Probability tieProb={newProbs.tieProb} winProb={newProbs.winProb} loseProb={newProbs.loseProb} count={i}/>);
        }
        return probs;
    }

    updateInputs(inputName, newValue){
        let temp = Object.assign({}, this.state);
        temp[inputName] = newValue;
        this.setState(temp);
    }

    increment()
    {
        let newValue = this.state.numvalue+1;
        let newGreeting = String(newValue);
        this.setState({numvalue: newValue, greeting: newGreeting});
    }

    render(){
        return(
            <div>
                <div style={{float: 'left'}}>Player Bonus: </div>
                <div><NumberInput onChangeCallback={(value)=>this.updateInputs('playerBonus', value)}/></div>
                <div style={{float: 'left'}}>Enemy Bonus: </div>
                <div><NumberInput onChangeCallback={(value)=>this.updateInputs('enemyBonus', value)}/></div>
                <div style={{float: 'left'}}>Dice: </div>
                <div><NumberInput initialValue={6} onChangeCallback={(value)=>this.updateInputs('dice', value)}/></div>
                <AddProbabilityButton onClickCallback={(value)=>this.updateInputs('numberOfPropabilities', value)}/>
                {this.generatePropabilities()}
            </div>
        );
    }
}


class NumberInput extends React.Component
{
    constructor(props)
    {
        super(props);
        let valueToSet = props.initialValue === undefined ? 0 : props.initialValue;
        this.state = {inputText: String(valueToSet), numericValue: valueToSet};
    }

    eventHandler(event)
    {
        let numericText = event.target.value;
        let iterable = numericText.split("");
        iterable = iterable.filter((el)=>"0123456789".includes(el));
        numericText = iterable.join("");
        let newValue = Number(numericText);
        this.setState({inputText: numericText, numericValue: newValue});

        if(this.props.onChangeCallback !== undefined)
        {
            this.props.onChangeCallback(newValue);
        }
    }

    render()
    {
        return(
            <input type="number" value={this.state.inputText} onChange={(event)=>this.eventHandler(event)}></input>
        );
    }
}

class AddProbabilityButton extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {numericValue: 1};
    }

    increaseValue()
    {
        let newValue = this.state.numericValue + 1;
        this.setState({numericValue: newValue});

        if(this.props.onClickCallback !== undefined)
        {
            this.props.onClickCallback(newValue);
        }
    }

    decraseValue()
    {
        let newValue = Math.max(this.state.numericValue - 1, 0);
        this.setState({numericValue: newValue});

        if(this.props.onClickCallback !== undefined)
        {
            this.props.onClickCallback(newValue);
        }
    }

    render()
    {
        return(
            <div>
                <button text="increase" onClick={()=>this.increaseValue()}>INCREASE</button>
                <button text="decrase" onClick={()=>this.decraseValue()}>DECRASE</button>
            </div>
        );
    }
}

function calculatePropability(previousEventProb, enemyBonus, playerBonus, dice)
{
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    let total = 0;

    for(let i = 0; i < dice; i++)
    {
        for(let j = 0; j<dice; j++)
        {
            if(i+playerBonus > j+enemyBonus)
            {
                winCount++;
            }else if(i+playerBonus == j+enemyBonus)
            {
                tieCount++;
            }else{
                loseCount++;
            }
            total++;
        }
    }

    let winProb = (winCount/total)*previousEventProb;
    let tieProb = (tieCount/total)*previousEventProb;
    let loseProb = (loseCount/total)*previousEventProb;

    return {winProb: winProb, tieProb: tieProb, loseProb: loseProb};
}

class Probability extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        let winProb = String((this.props.winProb*100).toFixed(2));
        let loseProb = String((this.props.loseProb*100).toFixed(2));
        let tieProb = String((this.props.tieProb*100).toFixed(2));
        let tieNumber = String(this.props.count);
        return(
            <div className="probability_box">
                <div className='new_line_div'>Consecutive ties: {tieNumber}</div>
                <div className='new_line_div'>Probability of winning: </div>
                <div className='content_div'>{winProb}{"%"}</div>
                <div className='new_line_div'>Probability of losing: </div>
                <div className='content_div'>{loseProb}{"%"}</div>
                <div className='new_line_div'>Probability of tie: </div>
                <div className='content_div'>{tieProb}{"%"}</div>
            </div>
        );
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);
