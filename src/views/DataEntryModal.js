import React from 'react';

class DataEntryModal extends React.Component {

	render() {
		const height72 = { height: '72px'};
		const marginTop0 = {marginTop: '0px'};
		const inputTextStyle = {border:'none',width:'100%'};

		let display = {display:'none'};
		if (this.props.showModal === true) {
			display = {display:'block'};
		} else {

		}

		return (
		<div id="myModal" className="modal" style={display}>

			<div className="modal-content">
			  	<div className="panel-header" onClick={this.props.onClickCloseModal}>
			    	{(this.props.modalForm.id===0)? "Create new " : "Edit "} {(this.props.editMode==='loan')?'loan': 'investment'}
			    	<button ><span className="close" >&times;</span></button>
			  	</div>
			  	<div style={{'padding':'20px'}}>
			    	<div style={height72}>
			      		<input type="text" name="name" onChange={this.props.onChangeInput}
			      		value={this.props.modalForm.name}
			      		placeholder="Loan Nickname" style={inputTextStyle} />
			      		<hr style={marginTop0}/>
			    	</div>
				    <div style={height72}>
				      	<input type="text" name="principal" onChange={this.props.onChangeInput}
				      	value={this.props.modalForm.principal}
				      	placeholder="Principal Remaining" style={inputTextStyle}/>
				      	<hr style={marginTop0}/>
				    </div>
				    <div style={height72}>
				      	<input type="text" name="APR" onChange={this.props.onChangeInput}
				      	value={this.props.modalForm.APR}
				      	placeholder="Annual Percent Rate (APR)" style={inputTextStyle}/>
				      	<hr style={marginTop0}/>
				    </div>                
				    <div style={height72}>
				      	<input type="text" name="monthlyPayment" onChange={this.props.onChangeInput}
				      	value={this.props.modalForm.monthlyPayment}
				      	placeholder="Monthly Payments" style={inputTextStyle}/>
				      	<hr style={marginTop0}/>
				    </div>        
				    <div style={{textAlign:'right'}}>
				      	<button name="saveLoanBtn" 
				      		onClick = {(this.props.editMode==='loan')? this.props.onClickDataEntryModal:this.props.onClickInvestModal}
				      		style={{minWidth:'88px',height:'36px',border:'10px',backgroundColor: 'rgb(229, 229, 229)'}}>
				        	<span style={{position: 'relative',paddingLeft: '16px',paddingRight: '16px',verticalAlign: 'middle',letterSpacing: '0px',textTransform: 'uppercase',fontWeight: 500,fontSize: '14px'}} >
				          	Save
				        	</span>
				      </button>    
				    </div>
			  	</div>	  
			</div>
		</div>
		);
	}
}


export default DataEntryModal;
