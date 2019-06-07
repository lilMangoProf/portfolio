import React from 'react';
import redX from './images/red-x.png';
import pencil from './images/pencil-icon.png';

class InvestmentEntry extends React.Component {

	render() {
		return (
			<div className="row">
				<div className="col-sm-8">
					<div>{this.props.name}</div>
					<span>${this.props.principal} at {this.props.APR}%. </span>
					<span>${this.props.monthlyPayment} per month</span>
				</div>	
				<div className="col-sm-4" style={{padding:'10px'}}>
					<button onClick={this.props.onClickDelete} className="icon-button"><img src={redX}/></button>
					<button onClick={this.props.onClickEditEntry} className="icon-button"><img src={pencil}/></button>					
				</div>
			</div>
		);
	}
}


export default InvestmentEntry;
