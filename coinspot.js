/*

Connor Grayden 2024

*/

const { symlinkSync } = require("fs");

var hmac = require("crypto").createHmac,
	https = require('https');

function coinspot(key, secret) {
  	var self = this;
  	self.key = key;
  	self.secret = secret;

	// Request function and init from https://github.com/rtw/npm-coinspot-api
	var request = function(path, postdata, callback) {
		var nonce = new Date().getTime();
		
		var postdata = postdata || {};
		postdata.nonce = nonce;
		
		var stringmessage = JSON.stringify(postdata);
		var signedMessage = new hmac("sha512", self.secret);

		signedMessage.update(stringmessage);

		var sign = signedMessage.digest('hex');

		var options = {
			rejectUnauthorized: false,
			method: 'POST',
			host: 'www.coinspot.com.au',
			port: 443,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': self.key
			}
		};

		var req = https.request(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function(chunk){
				callback(null, data);
			});
		}).on("error", function(e){
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	}


	// Public API (Not Working)


	// Latest Prices
	self.prices = function(callback){
		request('/pubapi/v2/latest', {}, callback);
	}

	// Latest Coin Prices
	self.coinprices = function(cointype,callback){
		request('/pubapi/v2/latest/' + cointype, {}, callback);
	}

	// Latest Coin / Market Prices
	self.coinpricesmarket = function(cointype,markettype,callback){
		request('/pubapi/v2/latest/' + cointype + '/' + markettype, {}, callback);
	}

	// Latest Buy Price
	self.buyprice = function(cointype,callback){
		request('/pubapi/v2/buyprice/' + cointype, {}, callback);
	}

	// Latest Buy Price / Market
	self.buypricemarket = function(cointype,markettype,callback){
		request('/pubapi/v2/buyprice/' + cointype + '/' + markettype, {}, callback);
	}

	// Latest Sell Price 
	self.sellprice = function(cointype,callback){
		request('/pubapi/v2/sellprice/' + cointype, {}, callback);
	}

	// Latest Sell Price / Market
	self.sellpricemarket = function(cointype,markettype,callback){
		request('/pubapi/v2/sellprice/' + cointype + '/' + markettype, {}, callback);
	}
	
	// Open Orders By Coin
	self.opencoin = function(cointype,callback){
		request('/pubapi/v2/orders/open/' + cointype, {}, callback);
	}

	// Open Orders By Coin / Market
	self.opencoinmarket = function(cointype,markettype,callback){
		request('/pubapi/v2/orders/open/' + cointype + '/' + markettype, {}, callback);
	}
	
	// Completed Orders By Coin
	self.completedcoin = function(cointype,callback){
		request('/pubapi/v2/orders/completed/' + cointype, {}, callback);
	}

	// Completed Orders By Coin / Market
	self.completedcoinmarket = function(cointype,markettype,callback){
		request('/pubapi/v2/orders/completed/' + cointype + '/' + markettype, {}, callback);
	}

	// API

	
	// Full Access Status Check
	self.status = function(callback){
		request('/api/v2/status', {}, callback);
	}

	// My Coin Deposit Address
	self.depositaddress = function(cointype, callback){
		data = {cointype:cointype}
		request('/api/v2/my/coin/deposit', data, callback);
	}

	// Buy Now Quote
	self.quotebuynow = function(cointype, amount, amounttype, callback){
		data = {cointype:cointype, amount:amount, amounttype:amounttype}
		request('/api/v2/quote/buy/now', data, callback)
	}
	
	// Sell Now Quote
	self.quotesellnow = function(cointype, amount, amounttype, callback){
		data = {cointype:cointype, amount:amount, amounttype:amounttype}
		request('/api/v2/quote/sell/now', data, callback)
	}

	// Swap Now Quote
	self.quoteswapnow = function(cointypesell, cointypebuy, amount, callback){
		data = {cointypesell:cointypesell, cointypebuy:cointypebuy, amount:amount}
		request('/api/v2/quote/swap/now', data, callback)
	}

	// Place Market Buy Order
	self.marketbuy = function(cointype, amount, rate, callback){
		data = {cointype:cointype, amount:amount, rate:rate}
		request('/api/v2/my/buy', data, callback)
	}

	// Place Buy Now Order
	self.marketbuynow = function(cointype, amounttype, amount, callback){
		data = {cointype:cointype, amounttype:amounttype, amount:amount}
		request('/api/v2/my/buy/now', data, callback)
	}

	// Place Market Sell Order
	self.marketsell = function(cointype, amount, rate, callback){
		data = {cointype:cointype, amount:amount, rate:rate}
		request('/api/v2/my/sell', data, callback)
	}

	// Place Sell Now Order
	self.marketsellnow = function(cointype, amounttype, amount, callback){
		data = {cointype:cointype, amounttype:amounttype, amount:amount}
		request('/api/v2/my/sell/now', data, callback)
	}

	// Place Swap Now Order
	self.marketswapnow = function(cointypesell, cointypebuy, amount, callback){
		data = {cointypesell:cointypesell, cointypebuy:cointypebuy, amount:amount}
		request('/api/v2/my/swap/now', data, callback)
	}

	// Cancel My Buy Order
	self.cancelbuy = function(id, callback){
		data = {id:id}
		request('/api/v2/my/buy/cancel', data, callback);
	}

	// Cancel My Sell Order
	self.cancelsell = function(id, callback){
		data = {id:id}
		request('/api/v2/my/sell/cancel', data, callback);
	}

	// Get Coin Withdrawal Details
	self.withdrawaldetails = function(cointype, callback){
		data = {cointype:cointype}
		request('/api/v2/my/coin/withdraw/senddetails', data, callback);
	}

	// Coin Withdrawal
	self.withdraw = function(cointype, amount, address, callback){
		data = {cointype:cointype, amount:amount, address:address}
		request('/api/v2/my/coin/withdraw/send', data, callback);
	}

	// Read Only API


	// Read Only Status Check
	self.readstatus = function(callback){
		request('/api/v2/ro/status', {}, callback);
	}

	// Open Market Orders
	self.openmarketorders = function(cointype, callback){
		data = {cointype:cointype}
		request('/api/v2/ro/orders/market/open', data, callback);
	}

	// Completed Market Orders
	self.completedmarketorders = function(cointype, callback){
		data = {cointype:cointype}
		request('/api/v2/ro/orders/market/completed', data, callback);
	}

	// My Coin Balances
	self.balances = function(callback) {
		request('/api/v2/ro/my/balances', {}, callback);
	}

	// My Coin Balance (Available)
	self.balancesavailable = function(cointype, available, callback) {
		request('/api/v2/ro/my/balance/'+cointype+'?available='+available, {}, callback);
	}

	// My Open Market Orders
	self.myopenmarketorders = function(callback) {
		request('/api/v2/ro/my/orders/market/open', {}, callback);
	}

	// My Open Limit Orders
	self.myopenlimitorders = function(callback) {
		request('/api/v2/ro/my/orders/limit/open', {}, callback);
	}

	// My Order History
	self.orderhistory = function(callback) {
		request('/api/v2/ro/my/orders/completed', {}, callback);
	}

	// My Market Order History
	self.marketorderhistory = function(callback) {
		request('/api/v2/ro/my/orders/market/completed', {}, callback);
	}

	// My Send & Receive History
	self.sendreceivehistory = function(callback) {
		request('/api/v2/ro/my/sendreceive', {}, callback);
	}

	// My Deposit History
	self.deposithistory = function(callback) {
		request('/api/v2/ro/my/deposits', {}, callback);
	}

	// My Withdrawal History
	self.withdrawalhistory = function(callback) {
		request('/api/v2/ro/my/withdrawals', {}, callback);
	}

	// My Affiliate Payments
	self.affiliate = function(callback) {
		request('/api/v2/ro/my/affiliatepayments', {}, callback);
	}

	// My Referral Payments
	self.referral = function(callback) {
		request('/api/v2/ro/my/referralpayments', {}, callback);
	}
}

module.exports = coinspot;
