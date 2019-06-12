import React from 'react';

import LaymanSummary from './LaymanSummary';
import '../css/Summary.css';



class Summary extends React.Component {
	
	constructor(props) {

		super(props);				

		this.state = {
			maxMonths:this.calculateLongestRunningDebtMonths(this.props.loan)
		};
	}

	/*
	* Sum all the monthly compound interest paid  on a single loan.
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateLoanAccruedInterest(loan) {

		let totalPaidInterest = 0.0;

  		let APR = parseFloat(loan.APR) / 100.0;
		let principal = parseFloat(loan.principal);
		let monthlyPayment = parseFloat(loan.monthlyPayment);

		//Add extra monthly payment towards paying off loans
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//NOTE this adds extra payments towards EACH individual loan!!
		if(this.props.payoffChoice === 'DEBT' && this.props.extra >0) {
			monthlyPayment = monthlyPayment +	this.props.extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)


  		for (let i=0; i < numPayments; i++){

    		let accrued = principal * (1+ APR / 12.0);

    		let interestAccrued = accrued - principal;
		
			//add to accumulated interest 
    		totalPaidInterest = totalPaidInterest + interestAccrued			
    		//setup for net iteration
    		//apply payment for next iteration
    		principal = accrued - monthlyPayment;
  		}


		return totalPaidInterest;
	}




	/*
	* Get the longest running debt amount so we can get a CAP on the invest growth to compare to
	* return integer
	*/
	calculateLongestRunningDebtMonths(loan) {

		let APR = loan.APR / 100.0;
  		let principal = loan.principal;
  		let monthlyPayment = parseFloat(loan.monthlyPayment);
  		
		//Add extra monthly payment towards loan
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//NOTE this adds extra payments towards EACH individual loan!!
		if(this.props.payoffChoice === 'DEBT' && this.props.extra >0) {
			monthlyPayment = monthlyPayment + this.props.extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)

		return numPayments;
	}

	/*
	* Sum all the monthly compound interest earned  on a single investment.
	* Compounding till the longest running debt is finished.
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateInvestmentAccruedInterest(investment) {
		
		let totalInvestInterest = 0.0;
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths(this.props.loan);//this.state.maxMonths;

  		let APR = parseFloat(investment.APR) / 100.0;
		let principal = parseFloat(investment.principal);
		let monthlyPayment = parseFloat(investment.monthlyPayment);

		//Add extra monthly payment towards investment
		//TODO handle logic else where for roll over and to apply toward NEXT highest investment. 
		//NOTE this adds extra payments towards EACH individual investment!!
		if(this.props.payoffChoice === 'INVEST' && this.props.extra >0) {
			monthlyPayment = monthlyPayment + this.props.extra;
		}

		//calculate monthly compounded interest for eacch investment, 
		//compounding till the longest running debt is finished
		for (let j=0; j < MAX_MONTHS; j++){
			let accrued = principal * (1+ APR / 12.0);
			
			let interestAccrued = accrued - principal;			
			
			//add to accumulated interest 
			totalInvestInterest = totalInvestInterest + interestAccrued;	

			//continue calcing through the investment, adding the monthly contribution
			principal = accrued + monthlyPayment;
		}

		return totalInvestInterest;
	}


	render() {


		let display = {display:'none'};
		let hidden = {visibility:'hidden'};

		if (this.props.showModal === true) {
			display = {display:'block'};
		} 

		return (
			<div>	
				<div className="row"> 
					<div className="col-md-3 card" style={hidden}>
						<span className="header">Saved with extra payments</span>
						<span className="amount">${Number(20000).toLocaleString('en')}</span>
						<span className="message">message</span>				
					</div>
					<div className="col-md-3 card ">
						<span className="header">Interest Paid</span>
						<span className="amount">${Number(parseInt(this.calculateLoanAccruedInterest(this.props.loan))).toLocaleString('en')}</span>
						<span className="message">Cost of loan</span>
					</div>
					<div className="col-md-3 card">
						<span className="header">Interest Earned</span>
						<span className="amount">${Number(parseInt(this.calculateInvestmentAccruedInterest(this.props.investment))).toLocaleString('en')}</span>
						<span className="message">Make money work 4 u</span>
					</div>
					<div className="col-md-3 card" style={hidden}>
						<span className="header">Savings earned extra payments</span>
						<span className="amount">${Number(20000).toLocaleString('en')}</span>
						<span className="message">message</span>
					</div>								
				</div>
				<LaymanSummary
					payoffChoice={this.props.payoffChoice}
					extra={this.props.extra}
					interestDebtPaid={Number(parseInt(this.calculateLoanAccruedInterest(this.props.loan))).toLocaleString('en')}
					interestInvestmentEarned={Number(parseInt(this.calculateInvestmentAccruedInterest(this.props.investment))).toLocaleString('en')}
					timeLength={this.calculateLongestRunningDebtMonths(this.props.loan)}
					/>

			</div>
		);
	}
}


export default Summary;
