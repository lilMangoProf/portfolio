import React from 'react';

import '../css/panel.css';

class LoanControlPanel extends React.Component {

	render() {
		return (
			<div id="loans" className="panel-shadow">
	          	<div className="panel-header">
	                {"Loans"}
	            </div>
				<div className="panel-content" id="loans-content-container">
					<div>
						<div className="textbox-div">

							<label 
								className="sub-header"
								htmlFor="input-loan-principal"
								id="label-extra">Loan balance</label>
							<input type="text"								
								id="input-loan-principal"						
								name="loan-principal"
								onChange={this.props.onChange}
								value={(isNaN(this.props.loan.principal))?0:this.props.loan.principal}
								placeholder=""
								className="input-text dollar"/>
							<hr className="input-hr" />
						</div>

						<div className="textbox-div">

							<label 
								className="sub-header"
								htmlFor="input-loan-apr"
								id="label-extra">Average interest rate</label>
							<input type="text"								
								id="input-loan-apr"						
								name="loan-apr"
								onChange={this.props.onChange}
								value={(isNaN(this.props.loan.APR))?0:this.props.loan.APR}
								placeholder=""
								className="input-text"/>
							<hr className="input-hr" />
						</div>
						
						<div className="textbox-div">
							<label 
								className="sub-header"
								htmlFor="input-loan-monthly"
								id="label-extra">Monthly payment</label>
							<input type="text"								
								id="input-loan-monthly"						
								name="loan-monthly"
								onChange={this.props.onChange}
								value={(isNaN(this.props.loan.monthlyPayment))?0:this.props.loan.monthlyPayment}
								placeholder=""
								className="input-text dollar"/>
							<hr className="input-hr" />
						</div>
					</div>					
				</div>
			</div>
		)
	}
}

export default LoanControlPanel;