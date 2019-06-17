import React from 'react';

import LaymanSummary from './LaymanSummary';
import '../css/Summary.css';



class Summary extends React.Component {
	

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
						<span className="header">{(this.props.cumulativeMode)?'Loan Total':'Interest Paid'}</span>
						<span className="amount">${Number(parseInt((this.props.cumulativeMode)?this.props.totalLoan:this.props.totalPaidInterest)).toLocaleString('en')}</span>
						<span className="message">Cost of loan</span>
					</div>
					<div className="col-md-3 card">
						<span className="header">{(this.props.cumulativeMode)?'Investment Total':'Interest Earned'}</span>
						<span className="amount">${Number(parseInt((this.props.cumulativeMode)?this.props.totalInvestment:this.props.totalInvestInterest)).toLocaleString('en')}</span>
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
					interestDebtPaid={Number(parseInt(this.props.totalPaidInterest)).toLocaleString('en')}
					interestInvestmentEarned={Number(parseInt(this.props.totalInvestInterest)).toLocaleString('en')}
					timeLength={this.props.timeLength}
					/>

			</div>
		);
	}
}


export default Summary;
