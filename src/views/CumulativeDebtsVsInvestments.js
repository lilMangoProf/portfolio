import React, { Component } from 'react';
import CanvasJSReact from '../lib/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class CumulativeDebtsVsInvestmentsChart extends Component {

	constructor(props) {
		/*
		var loansArr = [
				{'name':'Undergrad','principal':90000, 'APR':4.58, 'monthlyPayment':400.0, 'id': (new Date().getTime())+'|Undergrad|4.58'},
				{'name':'Grad','principal':8000, 'APR':7.4, 'monthlyPayment':100.0, 'id': (new Date().getTime())+'|Grad|7.4'},
				{'name':'Car Loan','principal':28000, 'APR':4.4, 'monthlyPayment':130.0, 'id': (new Date().getTime())+'|Car Loan|4.4'}
		]
		localStorage.setItem('loans',JSON.stringify(loansArr));
		*/
		super(props);
		
		this.state = {
			maxMonths:this.calculateLongestRunningDebtMonths(this.props.loansArr)
		};		
	}

	/**
	* Selects the debt with lengthiest interval to CAP the investment growth (and compare under equal length of time)
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
	  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12.0)
	  		if(numPayments>max){
	  			max = numPayments;
	  		}
		}	
		
		return max;
	}


	//loanDetail => {name:,APR:,principal:,monthlyPayment}
	generateLoanIntervals(loanDetail) {
		
  		let loan = [];

  		let APR = parseFloat(loanDetail.APR) / 100.0;
  		let principal = parseFloat(loanDetail.principal);
  		let monthlyPayment = parseFloat(loanDetail.monthlyPayment);
  		//console.log('APR:',APR,' principal:',principal,' monthlyPayment', monthlyPayment)

		//Add extra monthly payment towards loan
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//**** NOTE this adds extra payments towards EACH individual loan!! ******
		if(this.props.payoffChoice === 'DEBT' && this.props.extra >0) {
			monthlyPayment = monthlyPayment + this.props.extra;
		}  		

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)
  		

  		let year = (new Date()).getYear() + 1900;
  		let month = (new Date()).getMonth();

  		for (let i=0; i < numPayments; i++){
    		let tmp = {};

    		tmp['x'] = new Date(year,month);

    		//calculate principal after a month of accrued interest, Y-axis will be amount just before payment
    		principal = principal * (1+ APR / 12.0);
    		tmp['y'] = principal;

    		loan.push(tmp);

    		//setup for net iteration
    		//apply payment for next iteration
    		principal = principal - monthlyPayment;

    		month = month + 1

    		if (month>11) {
      			month = 0
      			year = year + 1
    		}
  		}

		//    loan : [
		//    { x: new Date(2016, 2), y: 17000 },
		//    { x: new Date(2016, 3), y: 2600 },]
  		return loan;		
	}

	//investDetail => {name:,APR:,principal:,monthlyPayment}
	generateInvestmentIntervals(investDetail) {

  		let investIntervals = [];

  		let APR = parseFloat(investDetail.APR) / 100.0;
  		let principal = parseFloat(investDetail.principal);
  		let monthlyPayment = parseFloat(investDetail.monthlyPayment);
  		//console.log('APR:',APR,' principal:',principal,' monthlyPayment', monthlyPayment)
  		

		//Add extra monthly payment towards investment
		//TODO handle logic else where for roll over and to apply toward NEXT highest investment. 
		//NOTE this adds extra payments towards EACH individual investment!!
		if(this.props.payoffChoice === 'INVEST' && this.props.extra >0) {
			monthlyPayment = monthlyPayment + this.props.extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		//let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12)
  		//TODO calculate MAX interval from longest debt? or allow user to set length??  		
  		let numPayments = this.calculateLongestRunningDebtMonths(this.props.loansArr);//12 * 10; //12 months * 20 years

  		let year = (new Date()).getYear() + 1900;
  		let month = (new Date()).getMonth();

  		for (let i=0; i < numPayments; i++){
    		let tmp = {};

    		tmp['x'] = new Date(year,month);

    		//calculate principal after a month of accrued interest, Y-axis will be amount just before payment
    		principal = principal * (1+ APR / 12.0);
    		tmp['y'] = -1*principal;

    		investIntervals.push(tmp);

    		//setup for net iteration
    		//apply payment for next iteration
    		principal = principal + monthlyPayment;
    		
    		month = month + 1

    		if (month>11) {
      			month = 0
      			year = year + 1
    		}
  		}

		//    investIntervals : [
		//    { x: new Date(2016, 2), y: 17000 },
		//    { x: new Date(2016, 3), y: 2600 },]
  		return investIntervals;		
	}

	generateCanvasJSDataPoints(loansArr,investmentsArr){
	  
		let canvasJSarr = [];

	  	for(let i=0; i<loansArr.length;i++){
	    	let tmp = {
	      		type: "splineArea", 
	      		showInLegend: true,
	      		name: loansArr[i].name,
	      		yValueFormatString: "$#,##0",     
	      		dataPoints: this.generateLoanIntervals(loansArr[i])    
	    	}
	    	canvasJSarr.push(tmp);
	  	}

	  	for(let i=0;i<investmentsArr.length;i++){
	  		let tmp = {
	  			type: "splineArea",
	  			showInLegend: true,
	  			name: investmentsArr[i].name,
	      		yValueFormatString: "$#,##0",     
	      		dataPoints: this.generateInvestmentIntervals(investmentsArr[i])  	  			
	  		}
	  		canvasJSarr.push(tmp);
	  	}
	  return canvasJSarr;
	}	

	render() {
		const options = {
			theme: "light2",
			animationEnabled: true,
			title: {
				text: "Cumulative Debts & Investment"
			},
			subtitles: [{
				text: ""
			}],
			axisY: {
				includeZero: false,
				prefix: "$"
			},
			toolTip: {
				shared: true
			},
			legend: {
				fontSize: 13
			},
			data: this.generateCanvasJSDataPoints(this.props.loansArr,this.props.investmentsArr)
		};
		
		return (
		<div className="panel-shadow">
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default CumulativeDebtsVsInvestmentsChart;