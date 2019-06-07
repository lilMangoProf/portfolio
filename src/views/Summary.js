import React from 'react';

import LaymanSummary from './LaymanSummary';
import '../css/Summary.css';



class Summary extends React.Component {
	
	constructor(props) {

		super(props);				

		this.state = {
			maxMonths:this.calculateLongestRunningDebtMonths(this.props.loansArr)
		};
	}

	/*
	* Sum all the monthly compound interest paid  on a single loan.
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateLoanAccruedInterest(argAPR, argPrincipal, argMonthlyPayment) {

		let totalPaidInterest = 0.0;

  		let APR = parseFloat(argAPR) / 100.0;
		let principal = parseFloat(argPrincipal);
		let monthlyPayment = parseFloat(argMonthlyPayment);

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
	* Sum all the accumulated, monthly compounded interest paid for a list of loans
	* arg: [loansDetail Array]
	* return: float
	*
	*/
	calculateAllLoansTotalInterest(loansArr) {
		let totalPaidInterest = 0.0;

		for(let i=0;i<loansArr.length;i++) {
			
			let loanDetail = loansArr[i];
			
  			totalPaidInterest = totalPaidInterest + this.calculateLoanAccruedInterest(loanDetail.APR, loanDetail.principal, loanDetail.monthlyPayment);			
		}

		return totalPaidInterest;
	}		
	


	/*
	* Get the longest running debt amount so we can get a CAP on the invest growth to compare to
	* return integer
	*/
	calculateLongestRunningDebtMonths(loansArr) {
		
		let max=0;

		for(let i=0;i<loansArr.length;i++) {
			let APR = loansArr[i].APR / 100.0;
	  		let principal = loansArr[i].principal;
	  		let monthlyPayment = parseFloat(loansArr[i].monthlyPayment);
	  		
			//Add extra monthly payment towards loan
    		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
    		//NOTE this adds extra payments towards EACH individual loan!!
    		if(this.props.payoffChoice === 'DEBT' && this.props.extra >0) {
    			monthlyPayment = monthlyPayment + this.props.extra;
    		}

	  		//numPayments sorta helps prevent generating infinite amount of payment tables
	  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)
	  		if(numPayments>max){
	  			max = numPayments;
	  		}
		}	
		return max;
	}

	/*
	* Sum all the monthly compound interest earned  on a single investment.
	* Compounding till the longest running debt is finished.
	* arg: APR, principal, monthlyPayment
	* return: float
	*/
	calculateInvestmentAccruedInterest(argAPR, argPrincipal, argMonthlyPayment) {

		let totalInvestInterest = 0.0;
		let MAX_MONTHS = this.calculateLongestRunningDebtMonths(this.props.loansArr);//this.state.maxMonths;

  		let APR = parseFloat(argAPR) / 100.0;
		let principal = parseFloat(argPrincipal);
		let monthlyPayment = parseFloat(argMonthlyPayment);

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

	/*
	* Sum all the accumulated, monthly compound interest earned for a list of Investments
	* arg [investmentDetails Array]
	* return float
	*/
	calculateAllInvestmentTotalInterest(investmentsArr) {
		let totalInvestInterest = 0.0;

		for(let i=0;i<investmentsArr.length;i++) {
			
			let investDetail = investmentsArr[i];
			
  			totalInvestInterest = totalInvestInterest + this.calculateInvestmentAccruedInterest(investDetail.APR, investDetail.principal, investDetail.monthlyPayment);			
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
						<span className="amount">${Number(parseInt(this.calculateAllLoansTotalInterest(this.props.loansArr))).toLocaleString('en')}</span>
						<span className="message">Cost of loan</span>
					</div>
					<div className="col-md-3 card">
						<span className="header">Interest Earned</span>
						<span className="amount">${Number(parseInt(this.calculateAllInvestmentTotalInterest(this.props.investmentsArr))).toLocaleString('en')}</span>
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
					interestDebtPaid={Number(parseInt(this.calculateAllLoansTotalInterest(this.props.loansArr))).toLocaleString('en')}
					interestInvestmentEarned={Number(parseInt(this.calculateAllInvestmentTotalInterest(this.props.investmentsArr))).toLocaleString('en')}
					timeLength={this.calculateLongestRunningDebtMonths(this.props.loansArr)}
					/>

			</div>
		);
	}
}


export default Summary;
