import React from 'react';

import '../css/panel.css';

class InvestmentsControlPanel extends React.Component {


	render() {
		return (
			<div id="investments" className="panel-shadow">
	          	<div className="panel-header">
	                {"Investments"}
	            </div>
	
				<div className="panel-content" id="loans-content-container">
					<div>
						<div className="textbox-div">

							<label 
								className="sub-header"
								htmlFor="input-investment-principal"
								id="label-extra">Investment balance</label>
							<input type="text"								
								id="input-investment-principal"						
								name="investment-principal"
								onChange={this.props.onChange}
								value={(isNaN(this.props.investment.principal))?0:this.props.investment.principal}
								placeholder=""
								className="input-text dollar"/>
							<hr className="input-hr" />
						</div>

						<div className="textbox-div">

							<label 
								className="sub-header"
								htmlFor="input-investment-apr"
								id="label-extra">Annual rate of return</label>
							<input type="text"								
								id="input-investment-apr"						
								name="investment-apr"
								onChange={this.props.onChange}
								value={(isNaN(this.props.investment.APR))?0:this.props.investment.APR}
								placeholder=""
								className="input-text"/>
							<hr className="input-hr" />
						</div>
						
						<div className="textbox-div">
							<label 
								className="sub-header"
								htmlFor="input-investment-monthly"
								id="label-extra">Monthly Contribution</label>
							<input type="text"								
								id="input-investment-monthly"						
								name="investment-monthly"
								onChange={this.props.onChange}
								value={(isNaN(this.props.investment.monthlyPayment))?0:this.props.investment.monthlyPayment}
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

export default InvestmentsControlPanel;