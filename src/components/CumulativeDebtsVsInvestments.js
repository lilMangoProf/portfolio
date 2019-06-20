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
			
	}

	getRandomInvestRate() {
		/*
		 * Lower tail quantile for standard normal distribution function.
		 *
		 * This function returns an approximation of the inverse cumulative
		 * standard normal distribution function.  I.e., given P, it returns
		 * an approximation to the X satisfying P = Pr{Z <= X} where Z is a
		 * random variable from the standard normal distribution.
		 *
		 * The algorithm uses a minimax approximation by rational functions
		 * and the result has a relative error whose absolute value is less
		 * than 1.15e-9.
		 *
		 * Author:      Peter John Acklam
		 * E-mail:      jacklam@math.uio.no
		 * WWW URL:     http://home.online.no/~pjacklam/notes/invnorm/
		 *
		 * Javascript implementation by Liorzou Etienne
		 * - Adapted from Dr. Thomas Ziegler's C implementation itself adapted from Peter's Perl version
		 * 
		 * Q: What about copyright?
		 * A: You can use the algorithm for whatever purpose you want, but 
		 * please show common courtesy and give credit where credit is due.
		 * 
		 * If you have any reclamation about this file (ie: normal.inverse.js file),
		 * please contact me.
		 * 
		 */

		/* Coefficients in rational approximations. */
		let a =
		[
			-3.969683028665376e+01,
			 2.209460984245205e+02,
			-2.759285104469687e+02,
			 1.383577518672690e+02,
			-3.066479806614716e+01,
			 2.506628277459239e+00
		];

		let b =
		[
			-5.447609879822406e+01,
			 1.615858368580409e+02,
			-1.556989798598866e+02,
			 6.680131188771972e+01,
			-1.328068155288572e+01
		];

		let c =
		[
			-7.784894002430293e-03,
			-3.223964580411365e-01,
			-2.400758277161838e+00,
			-2.549732539343734e+00,
			 4.374664141464968e+00,
			 2.938163982698783e+00
		];

		let d =
		[
			7.784695709041462e-03,
			3.224671290700398e-01,
			2.445134137142996e+00,
			3.754408661907416e+00
		];

		let LOW = 0.02425;
		let HIGH = 0.97575;


		let ltqnorm = function (p) {
			let q, r;

			// errno = 0;

			if (p < 0 || p > 1)
			{
				// errno = EDOM;
				return 0.0;
			}
			else if (p === 0)
			{
				// errno = ERANGE;
				return Number.NEGATIVE_INFINITY; /* minus "infinity" */;
			}
			else if (p === 1)
			{
				// errno = ERANGE;
				return Number.POSITIVE_INFINITY; /* "infinity" */;
			}
			else if (p < LOW)
			{
				/* Rational approximation for lower region */
				q = Math.sqrt(-2*Math.log(p));
				return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
					((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
			}
			else if (p > HIGH)
			{
				/* Rational approximation for upper region */
				q  = Math.sqrt(-2*Math.log(1-p));
				return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
					((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
			}
			else
			{
				/* Rational approximation for central region */
		    		q = p - 0.5;
		    		r = q*q;
				return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
					(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
			}
		}
		const MEAN = 7.0;
		const STD_DEV = 6.0;
		return ltqnorm(Math.random())*STD_DEV+MEAN;		
	}
	/**
	* Selects the debt with lengthiest interval to CAP the investment growth (and compare under equal length of time)
	*/
	calculateLongestRunningDebtMonths(loan) {
		
		let APR = loan.APR / 100.0;
  		let principal = loan.principal;
  		let monthlyPayment = parseFloat(loan.monthlyPayment);


		//Add extra monthly payment towards loan
		//TODO handle logic else where for roll over and to apply toward NEXT highest loan. 
		//NOTE this adds extra payments towards EACH individual loan!!
		if(this.props.payoffChoice === 'DEBT' && this.props.extra >0) {
			monthlyPayment = monthlyPayment + this.props.extra;
		}

  		//numPayments sorta helps prevent generating infinite amount of payment tables
  		let numPayments = -Math.log(1-(APR/12)*principal/monthlyPayment)/Math.log(1+APR/12.0)
	
		return numPayments;
	}


	//loanDetail => {name:,APR:,principal:,monthlyPayment}
	generateLoanIntervals(loanDetail) {
		
  		let loan = [];
  		const NEGATIVE = -1;

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
    		tmp['y'] = NEGATIVE * principal;

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
  		let numPayments = this.calculateLongestRunningDebtMonths(this.props.loan);//12 * 10; //12 months * 20 years
		//TODO ****

  		let year = (new Date()).getYear() + 1900;
  		let month = (new Date()).getMonth();

  		for (let i=0; i < numPayments; i++){
    		let tmp = {};

    		tmp['x'] = new Date(year,month);

    		APR = this.getRandomInvestRate() / 100.0;
    		
    		//calculate principal after a month of accrued interest, Y-axis will be amount just before payment
    		principal = principal * (1+ APR / 12.0);
    		tmp['y'] = principal;

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

	generateCanvasJSDataPoints(loan,investment){
	  
		let canvasJSarr = [];

    	let tmp = {
			type: "splineArea",
			showInLegend: true,
			name: 'Investment',
	  		yValueFormatString: "$#,##0",     
  			dataPoints: this.generateInvestmentIntervals(investment)  	  			
		}
		canvasJSarr.push(tmp);

		tmp = {
      		type: "splineArea", 
      		showInLegend: true,
      		name: 'Debt',
      		yValueFormatString: "$#,##0",     
      		dataPoints: this.generateLoanIntervals(loan)    
    	}
    	canvasJSarr.push(tmp);	

	  return canvasJSarr;
	}	

	render() {
		const options = {
			theme: "light2",
			animationEnabled: true,
			title: {
				text: "Balance: Debts & Investment"
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
			data: this.generateCanvasJSDataPoints(this.props.loan,this.props.investment)
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