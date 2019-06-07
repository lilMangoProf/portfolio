import React from 'react';
import '../panel.css';

class ExtraPaymentsPanel extends React.Component {


	constructor(props) {
		super(props);		
	}

	/*
	* TODO. Calculates total minimum monthly payments from all debt payments, and investment contributions
	*/
	calculateMinimum () {
		const arraySumFunc = (sum, curElem)=>sum + parseInt(curElem['monthlyPayment']);

		let sum = this.props.loansArray.reduce(arraySumFunc,0);
		sum = sum + this.props.investmentsArray.reduce(arraySumFunc,0);
		return sum;
	}


	render() {
		const hrHighlight= {

			borderTop: '2px solid rgb(3, 169, 244)',
		    borderImage: 'initial',
		    boxSizing: 'content-box',
		    margin: '0px',
		    width: '100%',
		    transform: 'scaleX(1)',
		    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
		}




		return (

			<div id="extra-payments" className="panel-shadow">
	          	<div className="panel-header">
	                {"Monthly Payments"}
	            </div>
		
				<div className="panel-content" id="loans-content-container">
										
					<div>

						<div className="right-align">${Number(parseInt(this.calculateMinimum()))}</div>

						<div className="sub-header">Minimum monthly</div>		
					</div>
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
								placeholder="Extra $ per month"/>
							<hr style={hrHighlight} />
						</div>

					</div>
					<div>
						<div>
							<div className="sub-header" style={{marginTop:'40px'}}>Pay toward:</div>
							<div style={{width:'100%'}}>
								<input type="radio" 
									name="pay-toward"
									value="DEBT"
									style={{marginRight:'10px'}}
									onChange={this.props.onChange}
									checked={this.props.payoffChoice==='DEBT'}
									/>
								<label>Payoffing debt</label>
							</div>
							<div style={{width:'100%'}}>	
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