import React from 'react';

import CumulativeDebtsVsInvestment from './CumulativeDebtsVsInvestments';
import InterestDebtVsInvestment from './InterestDebtVsInvestment';

import Summary from './Summary';

class Results extends React.Component {
	
	constructor(props) {

		super(props);	
		this.state = {
				cumulativeMode: false
		};					
	}

	/*
	* Sum all the monthly compound interest paid on a single loan.
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
			console.log('more loan!: monthly=',monthlyPayment);
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
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths(this.props.loan);

  		let APR = parseFloat(investment.APR) / 100.0;
		let principal = parseFloat(investment.principal);
		let monthlyPayment = parseFloat(investment.monthlyPayment);

		//Add extra monthly payment towards investment
		//TODO handle logic else where for roll over and to apply toward NEXT highest investment. 
		//NOTE this adds extra payments towards EACH individual investment!!
		if(this.props.payoffChoice === 'INVEST' && this.props.extra >0) {
			console.log('more invest!');
			monthlyPayment = monthlyPayment + this.props.extra;
			console.log('more invest! monthly=',monthlyPayment);
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

	/*
	* Sum the total price of loan, including interest
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateLoanCumulative(loan) {

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

  		return monthlyPayment * numPayments;
	}

	/*
	* Sum the total value of investment, including interest and contributions
	* arg: APR, principal, monthlyPayment
	* return: float
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateInvestmentCumulative(investment) {
		
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths(this.props.loan);

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
			
			//continue calcing through the investment, adding the monthly contribution
			principal = accrued + monthlyPayment;
		}

		return principal;
	}

	toggleGraphMode(mode) {

		let res = {
			cumulativeMode: this.state.cumulativeMode,
			totalPaidInterest: this.calculateLoanAccruedInterest(this.props.loan),
			totalInvestInterest: this.calculateInvestmentAccruedInterest(this.props.investment),
			totalLoan: this.calculateLoanCumulative(this.props.loan),
			totalInvestment: this.calculateInvestmentCumulative(this.props.investment),
		};	

		if (this.state.cumulativeMode ===false && mode===1) {//previous state was interest mode, and clicked mode = 1 (cumulative)

			console.log('interest -> cumulative mode');
			res.cumulativeMode = true;
			this.setState(res); 
		} else if(this.state.cumulativeMode ===true && mode ===0) {
			console.log('cumulative -> interest mode');
			res.cumulativeMode = false;
			this.setState(res); 
		} else {
			console.log('no graph render state change');
		}
		
	}

	renderGraph () {
		if(this.state.cumulativeMode) {
			return (	
				<CumulativeDebtsVsInvestment
					loan={this.props.loan}
					investment={this.props.investment}
					payoffChoice={this.props.payoffChoice}
					extra={this.props.extra}
					/>
				);
		} else {
			return (
				<InterestDebtVsInvestment
					loan={this.props.loan}
					investment={this.props.investment}
					payoffChoice={this.props.payoffChoice}
					extra={this.props.extra}
					/>
				);
		}
	}

	render() {

		return (
			<div>
				<Summary
					cumulativeMode= {this.state.cumulativeMode}
					totalPaidInterest= {this.calculateLoanAccruedInterest(this.props.loan)}
					totalInvestInterest= {this.calculateInvestmentAccruedInterest(this.props.investment)}
					totalLoan= {this.calculateLoanCumulative(this.props.loan)}					
					totalInvestment= {this.calculateInvestmentCumulative(this.props.investment)}
					extra = {this.props.extra}
					payoffChoice = {this.props.payoffChoice}	
					timeLength = {this.calculateLongestRunningDebtMonths(this.props.loan)}
					/>
					<div className="graph-nav">
						<button onClick={()=>this.toggleGraphMode(0)}
							className={(this.state.cumulativeMode===false)?'selected':''}
							>
							<span>Total Interest</span>
						</button>
						<button onClick={()=>this.toggleGraphMode(1)}
							className={(this.state.cumulativeMode===true)?'selected':''}
							>
							<span>Total Amount</span>
						</button>
					</div>	
				{this.renderGraph()}
			</div>
		);
	}
}


export default Results;
