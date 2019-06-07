//TODO how to export in ES6
class MathCalcUtils {
	calculateMinimum(loansArr) {

		let minimumMonthly=0;
		const arraySumFunc = (sum, curElem)=>sum + curElem['monthlyPayment'];

		let sum = loansArr.reduce(arraySumFunc);
		console.log('total monthly payments:', sum);

	}
}

export default MathCalcUtils;