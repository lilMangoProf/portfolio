import React, { Component } from 'react';

import LoanControlPanel from './components/LoanControlPanel';
import InvestmentsControlPanel from './components/InvestmentsControlPanel';
import ExtraPaymentsPanel from './components/ExtraPaymentsPanel';

import Results from './components/Results';

import './App.css';


class App extends Component {


	constructor(props) {
		/*
		let loansArr = [
				{'name':'Undergrad','principal':90000, 'APR':4.58, 'monthlyPayment':400.0, 'id': (new Date().getTime())+'|Undergrad|4.58'},
				{'name':'Grad','principal':8000, 'APR':7.4, 'monthlyPayment':100.0, 'id': (new Date().getTime())+'|Grad|7.4'},
				{'name':'Car Loan','principal':28000, 'APR':4.4, 'monthlyPayment':130.0, 'id': (new Date().getTime())+'|Car Loan|4.4'}
		]
		localStorage.setItem('loans',JSON.stringify(loansArr));
		

		let investmentsArr = [
				{'name':'ROTH Ira','principal':6000, 'APR':7.6, 'monthlyPayment':500.0, 'id': (new Date().getTime())+'|Roth|4.58'},
				{'name':'Savings Account','principal':8000, 'APR':2.0, 'monthlyPayment':100.0, 'id': (new Date().getTime())+'|Savings|7.4'}
		];
		localStorage.setItem('investments',JSON.stringify(investmentsArr));		

		*/

		super(props);				

		let loan = {'principal':90000, 'APR':4.58, 'monthlyPayment':1000.0};
		let investment = {'principal':500, 'APR':7.6, 'monthlyPayment':500.0};

		this.state = {
				loan:loan,
				investment:investment,
				extra:0,
				editMode:'loan',
				payoffChoice:'LOAN'
		};
	}

    getHeader() {
            return(
                    <div className="header-bar">
                        <span className="header-menu">

                           <a href="/portfolio.html" target="_blank">Portfolio</a>
                        </span>
                        <h1 className="header-title">Payoff or Invest</h1>
                </div>
            )
    }

	getLoanFromDB() {
		
		let tmp = JSON.parse(localStorage.getItem("loan")) || {};		
		console.log('@getLoanFromDB');
		console.log(tmp);
		return tmp;
	}

	getInvestmentFromDB() {
		let tmp = JSON.parse(localStorage.getItem("investment")) || {};		
		console.log('@getInvestmentFromDB');
		console.log(tmp);
		return tmp;
	}



	
	/*
	* Handles the modal form for adding and editing a loan or investment.
	* using the 'name' attr on input elem
	*/
	handleDataInputChange(event) {
		//passing the event target by giving the input html a 'name' attr (which matches a key in modalForm obj
		//we'll reference for later
		const target = event.target;
		const type= target.type;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		console.log('@handleDataInputChange . [',name,']=', value);	


		let res = {
			loan:this.state.loan,
			investment:this.state.investment,				
			extra:this.state.extra,
			editMode:this.state.editMode,
			payoffChoice:this.state.payoffChoice
		};

		if (type==='text') {
			if(name==='loan-principal') {
				res.loan.principal = parseInt(value);
			} else if(name === 'loan-apr') {
				res.loan.APR = value;
			} else if (name === 'loan-monthly') {
				res.loan.monthlyPayment = parseInt(value);
			
			} else if (name ==='investment-principal') {
				res.investment.principal = parseInt(value);
			} else if(name === 'investment-apr') {
				res.investment.APR = value;
			} else if (name === 'investment-monthly') {
				res.investment.monthlyPayment = parseInt(value);		
			}
		}		
				
		this.setState(res);  
	}


	//Handles radio selection for debt/invest choice, and text box for extra payments
	handleExtraPaymentInputChange(event){

		const target = event.target;
		const type= target.type;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		console.log('type=',target.type,' |',name, ': ', value);		

		let extra = this.state.extra;
		let payoffChoice = this.state.paymentChoice;

		if (type==='text') {
			extra=parseFloat(value);
		} else if (type==='radio'){
			payoffChoice = (value==='DEBT')?'DEBT':'INVEST';
		}
		let res = {
			loan:this.state.loan,
			investment:this.state.investment,				
			extra:extra,
			editMode:this.state.editMode,
			payoffChoice:payoffChoice
		};
		
		this.setState(res); 
	}

	render() {

		return(
			<div>		
				{this.getHeader()}	
				<div className="row" style={{marginLeft:'0px',marginRight:'0px'}}>
					<div className="col-md-3">
						<ExtraPaymentsPanel 
							loan={this.state.loan}
							investment={this.state.investment}
							extra = {this.state.extra}
							payoffChoice = {this.state.payoffChoice}
							onChange={(evt)=>this.handleExtraPaymentInputChange(evt)}
							/>
						<LoanControlPanel
							loan={this.state.loan} 
							onChange={((evt) => this.handleDataInputChange(evt))}
							/>
						<InvestmentsControlPanel
							investment={this.state.investment} 
							onChange={((evt) => this.handleDataInputChange(evt))}
							/>							
					</div>
					<div className="col-md-9">
						<Results
							loan = {this.state.loan}
							investment = {this.state.investment}
							extra = {this.state.extra}
							payoffChoice = {this.state.payoffChoice}	
							/>
					</div>

				</div>
			</div>	
		)
	}
}


export default App;
