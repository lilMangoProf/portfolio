import React from 'react';
import LoanEntry from  './LoanEntry';

import './panel.css';

import plusIcon from './images/plus.png';

class LoanControlPanel extends React.Component {

	constructor(props) {
		super(props);		
	}

	renderLoansTable = (argLoansArray) => {
		/*
		let loansArray = [
			{
				id:1,
				principal:92000,
				name:"student",
				APR:4.2,
				monthlyPayment:1000
			},
			{
				id:2,
				principal:4000,
				name:"student",
				APR:4.2,
				monthlyPayment:300
			}			
		]
		*/

		let loansTable = []

		for(let i=0; i<argLoansArray.length;i++){
			let tmp = <LoanEntry
						id={argLoansArray[i].id}
						key={argLoansArray[i].id}
						principal={argLoansArray[i].principal}
						name={argLoansArray[i].name}
						APR={argLoansArray[i].APR}
						monthlyPayment={argLoansArray[i].monthlyPayment}

						onClickDelete={()=>this.props.onClickDelete(argLoansArray[i].id)}
						onClickEditEntry={()=>this.props.onClickShowModal(argLoansArray[i].id)}						

						/>

			loansTable.push(tmp);
		}

		return loansTable;
	}


	render() {
		return (
			<div id="loans" className="panel-shadow">
	          	<div className="panel-header">
	                {"Loans"}
	            </div>
	            <div className="panel-add">
	                <button id="btnAddLoan" onClick={()=>this.props.onClickShowModal(0)} className="icon-button">
	                	<img width="40" src={plusIcon}/>
                	</button>
	            </div>			
				<div className="panel-content" id="loans-content-container">
					{this.renderLoansTable(this.props.loansArray)}
				</div>
			</div>
		)
	}
}

export default LoanControlPanel;