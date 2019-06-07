import React from 'react';
import InvestmentEntry from  './InvestmentEntry';

import './panel.css';

import plusIcon from './images/plus.png';

class InvestmentsControlPanel extends React.Component {

	constructor(props) {
		super(props);		
	}

	renderInvestmentsTable = (argInvestmentsArray) => {
		
		/*
		let investmentsArray = [
			{
				id:1,
				principal:92000,
				name:"ROTH",
				APR:4.2,
				monthlyPayment:1000
			},
			{
				id:2,
				principal:4000,
				name:"index",
				APR:4.2,
				monthlyPayment:300
			}			
		]
		*/

		let investmentsTable = []

		for(let i=0; i<argInvestmentsArray.length;i++){
			let tmp = <InvestmentEntry
						id={argInvestmentsArray[i].id}
						key={argInvestmentsArray[i].id}
						principal={argInvestmentsArray[i].principal}
						name={argInvestmentsArray[i].name}
						APR={argInvestmentsArray[i].APR}
						monthlyPayment={argInvestmentsArray[i].monthlyPayment}
						
						onClickDelete={()=>this.props.onClickDelete(argInvestmentsArray[i].id)}						
						onClickEditEntry={()=>this.props.onClickShowModal(argInvestmentsArray[i].id)}						
						
						/>

			investmentsTable.push(tmp);
		}

		return investmentsTable;
	}


	render() {
		return (
			<div id="investments" className="panel-shadow">
	          	<div className="panel-header">
	                {"Investments"}
	            </div>
	            <div className="panel-add">
	                <button id="btnAddInvest" onClick={()=>this.props.onClickShowModal(0)} className="icon-button">
	                	<img width="40" src={plusIcon}/>
	                </button>
	            </div>			
				<div className="panel-content" id="loans-content-container">
					{this.renderInvestmentsTable(this.props.investmentsArray)}
				</div>
			</div>
		)
	}
}

export default InvestmentsControlPanel;