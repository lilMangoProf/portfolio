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
	calculateLoanAccruedInterest(loan, payoffChoice, extra) {

		let totalPaidInterest = 0.0;

  		let APR = parseFloat(loan.APR) / 100.0;
		let principal = parseFloat(loan.principal);
		let monthlyPayment = parseFloat(loan.monthlyPayment);

		//Add extra monthly payment towards paying off loans
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//NOTE this adds extra payments towards EACH individual loan!!
		if(payoffChoice === 'DEBT' && extra >0) {

			monthlyPayment = monthlyPayment +	extra;
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
	calculateLongestRunningDebtMonths(loan, payoffChoice, extra) {

		let APR = loan.APR / 100.0;
  		let principal = loan.principal;
  		let monthlyPayment = parseFloat(loan.monthlyPayment);
  		
		//Add extra monthly payment towards loan
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//NOTE this adds extra payments towards EACH individual loan!!
		if(payoffChoice === 'DEBT' && extra >0) {
			monthlyPayment = monthlyPayment + extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)

		return numPayments;
	}

	/*
	* Sum all the monthly compound interest earned  on a single investment.
	* Compounding till the longest running debt is finished.
	* Then will also rollover the debt payments to the investment if the debts are paid off earlier.
	* so we can keep fair comparison of same time length, and amount of contributions
	* arg: investment{APR, principal, monthlyPayment} , payoffChoice (DEBT|INVEST), extra monthly, loan{APR, principal, monthlyPayment}
	* return: float
	*/
	calculateInvestmentAccruedInterest(investment, payoffChoice, extra,loan) {
		
		let totalInvestInterest = 0.0;
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths(loan, null, 0);
		let DEBT_MONTHS = this.calculateLongestRunningDebtMonths(loan, payoffChoice, extra);

  		let APR = parseFloat(investment.APR) / 100.0;
		let principal = parseFloat(investment.principal);
		let monthlyPayment = parseFloat(investment.monthlyPayment);

		if(payoffChoice === 'INVEST' && extra >0) {
			console.log('more invest!');
			monthlyPayment = monthlyPayment + extra;
			console.log('more invest! monthly=',monthlyPayment);
		}

		//calculate monthly compounded interest for eacch investment, 
		//compounding till the original running debt is finished
		for (let j=0; j < MAX_MONTHS; j++){
			let accrued = principal * (1+ APR / 12.0);
			
			let interestAccrued = accrued - principal;			
			
			//add to accumulated interest 
			totalInvestInterest = totalInvestInterest + interestAccrued;	

			//continue calcing through the investment, adding the monthly contribution
			principal = accrued + monthlyPayment;

			//reinvest loan contribution if finished paying debt off 
			//and continue those contributions until original loan length
			if(this.props.doReinvest ===true 
				&& payoffChoice === 'DEBT'
				&& j>DEBT_MONTHS ) {
				principal = principal + parseFloat(loan.monthlyPayment);
			}
		}

		return totalInvestInterest;
	}

	/*
	* Sum the total price of loan, including interest
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateLoanCumulative(loan, payoffChoice, extra) {

  		let APR = parseFloat(loan.APR) / 100.0;
		let principal = parseFloat(loan.principal);
		let monthlyPayment = parseFloat(loan.monthlyPayment);

		//Add extra monthly payment towards paying off loans
		if(payoffChoice === 'DEBT' && extra >0) {
			monthlyPayment = monthlyPayment + extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)

  		return monthlyPayment * numPayments;
	}

	/*
	* Sum the total value of investment, including interest and contributions
	* arg: investment{APR, principal, monthlyPayment}, payoffChoice (DEBT|INVEST), extra monthly payment, loan{APR, principal, monthlyPayment}
	* return: float
	
	*/
	calculateInvestmentCumulative(investment, payoffChoice, extra, loan) {
		
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths( loan,  null,0);
		let DEBT_MONTHS = this.calculateLongestRunningDebtMonths( loan, payoffChoice, extra);
  		
  		let APR = parseFloat(investment.APR) / 100.0;
		let principal = parseFloat(investment.principal);
		let monthlyPayment = parseFloat(investment.monthlyPayment);

		//Add extra monthly payment towards investment
		//TODO handle logic else where for roll over and to apply toward NEXT highest investment. 
		//NOTE this adds extra payments towards EACH individual investment!!
		if(payoffChoice === 'INVEST' && extra >0) {
			monthlyPayment = monthlyPayment + extra;
		}

		//calculate monthly compounded interest for eacch investment, 
		//compounding till the longest running debt is finished
		for (let j=0; j < MAX_MONTHS; j++){
			let accrued = principal * (1+ APR / 12.0);
			
			//continue calcing through the investment, adding the monthly contribution
			principal = accrued + monthlyPayment;

			//reinvest loan contribution if finished paying debt off 
			//and continue those contributions until original loan length
			if(this.props.doReinvest ===true 
				&& payoffChoice === 'DEBT'
				&& j>DEBT_MONTHS ) {
				principal = principal + parseFloat( loan.monthlyPayment);
			}
		}

		return principal;
	}

	toggleGraphMode(mode) {

		let res = {
			cumulativeMode: this.state.cumulativeMode,
			totalPaidInterest: this.calculateLoanAccruedInterest(this.props.loan, this.props.payoffChoice, this.props.extra),
			totalInvestInterest: this.calculateInvestmentAccruedInterest(this.props.investment, this.props.payoffChoice, this.props.extra, this.props.loan),
			totalLoan: this.calculateLoanCumulative(this.props.loan, this.props.payoffChoice, this.props.extra),
			totalInvestment: this.calculateInvestmentCumulative(this.props.investment, this.props.payoffChoice, this.props.extra, this.props.loan)
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
					calculateLongestRunningDebtMonths={this.calculateLongestRunningDebtMonths}
					doReinvest = {this.props.doReinvest}
					/>
				);
		} else {
			return (
				<InterestDebtVsInvestment
					loan={this.props.loan}
					investment={this.props.investment}
					payoffChoice={this.props.payoffChoice}
					extra={this.props.extra}
					calculateLongestRunningDebtMonths={this.calculateLongestRunningDebtMonths}
					doReinvest = {this.props.doReinvest}
					/>
				);
		}
	}

	render() {

		return (
			<div>
				<Summary
					cumulativeMode= {this.state.cumulativeMode}
					totalPaidInterest= {this.calculateLoanAccruedInterest(this.props.loan, this.props.payoffChoice, this.props.extra )}
					totalInvestInterest= {this.calculateInvestmentAccruedInterest(this.props.investment,this.props.payoffChoice, this.props.extra, this.props.loan)}
					totalLoan= {this.calculateLoanCumulative(this.props.loan, this.props.payoffChoice, this.props.extra)}					
					totalInvestment= {this.calculateInvestmentCumulative(this.props.investment, this.props.payoffChoice, this.props.extra, this.props.loan)}
					extra = {this.props.extra}
					payoffChoice = {this.props.payoffChoice}	
					timeLength = {this.calculateLongestRunningDebtMonths(this.props.loan,null, 0)}
					doReinvest = {this.props.doReinvest}
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
