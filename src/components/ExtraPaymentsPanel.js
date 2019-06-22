import React from 'react';
import '../css/panel.css';

class ExtraPaymentsPanel extends React.Component {


	render() {

		return (

			<div id="extra-payments" className="panel-shadow">
	          	<div className="panel-header">
	                {"Extra Monthly Payments"}
	            </div>
		
				<div className="panel-content" id="loans-content-container">
										

					<div>
						<div className="textbox-div">

							<label 
								className="sub-header"
								htmlFor="input-extra-monthly"
								id="label-extra">Extra monthly payment amount</label>
							<input type="text"								
								id="input-extra-monthly"						
								name="extra"
								onChange={this.props.onChange}
								value={(isNaN(this.props.extra))?0:this.props.extra}
								placeholder="Extra $ per month"
								className="input-text"
								/>
							<hr className="input-hr" />
						</div>

					</div>
					<div>
						<div>
							<div className="sub-header" style={{marginTop:'40px'}}>Pay toward:</div>
							<span style={{width:'50%'}}>
								<input type="radio" 
									name="pay-toward"
									value="DEBT"
									style={{marginRight:'10px'}}
									onChange={this.props.onChange}
									checked={this.props.payoffChoice==='DEBT'}
									/>
								<label>Payoffing debt</label>
							</span>
							<span style={{width:'50%'}}>	
								<input type="checkbox" 
									name="reinvest-loan"
									style={{marginRight:'10px'}}
									onChange={this.props.onChange}
									checked={this.props.doReinvest===true}
									disabled={this.props.payoffChoice!=='DEBT'}
									/>
								<label>Reinvest loan payments</label>
							</span>								
							<div style={{width:'50%'}}>	
								<input type="radio" 
									name="pay-toward"
									value="INVEST"
									style={{marginRight:'10px'}}
									onChange={this.props.onChange}
									checked={this.props.payoffChoice==='INVEST'}
									/>
								<label>Investing more</label>
							</div>	
							
						</div>
						
					</div>					
					
				</div>
			</div>
		)
	}
}

export default ExtraPaymentsPanel;