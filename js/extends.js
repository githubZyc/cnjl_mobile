/***
 *
 * @param {Object} csharpTimeString
 */
Date.prototype.setCsharpTime = function(csharpTimeString) {
	var time = csharpTimeString.replace("/Date(", "").replace(")/", "");
	this.setTime(parseInt(time));
	return this;
	//new Date(parseInt(time)).toLocaleDateString().replace(/\//g,'-'); 
}

Date.prototype.setCsharpInt = function(csharpTimeString) {
	var time = csharpTimeString.replace("/Date(", "").replace(")/", "");
	return parseInt(time);
}

/**
 * yyyy-MM-dd hh:mm:ss
 * @param {Object} formatString
 * yyyy-MM-dd
 * yyyy/MM/dd hh:mm:ss
 */
Date.prototype.toFormatString = function(formatString) {
	var yyyy = this.getFullYear();
	var MM = this.getMonth() + 1;
	MM = MM > 9 ? "" + MM : "0" + MM;
	var dd = this.getDate();
	dd = dd > 9 ? "" + dd : "0" + dd;
	var hh = this.getHours();
	hh = hh > 9 ? "" + hh : "0" + hh;
	var mm = this.getMinutes();
	mm = mm > 9 ? "" + mm : "0" + mm;
	var ss = this.getSeconds();
	ss = ss > 9 ? "" + ss : "0" + ss;
	var result = formatString.replace("yyyy", yyyy);
	result = result.replace("MM", MM);
	result = result.replace("dd", dd);
	result = result.replace("hh", hh);
	result = result.replace("mm", mm);
	result = result.replace("ss", ss);
	return result;

}

Date.prototype.toCSharpDateString = function() {
	return "/Date(" + this.getTime() + ")/";

}

Date.prototype.getAge = function(cSharpTime) {
	var bir = new Date(cSharpTime).getTime();
	var now = new Date().getTime();

	var hours = (now - bir) / 1000 / 60 / 60;
	var year = Math.floor(hours / (24 * 365));

	return year < 0 ? 0 : year;

}
Date.prototype.getAge2 = function() {
		var bir = this.getTime();
		var now = new Date().getTime();

		var hours = (now - bir) / 1000 / 60 / 60;
		var year = Math.floor(hours / (24 * 365));

		return year < 0 ? 0 : year;

	}
	//判断元素是否存在于array数组中
	//Array.prototype.inArr = function(arr) {
	//	for (var i = 0; i < this.length; i++) {
	//		if (this[i] == arr) {
	//			return true;
	//		}
	//	}
	//	return false;
	//}

//判断元素是否存在于数组中
function inArr(arr, a) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == a) {
			return true;
		}
	}
	return false;
}

/**
 * 
 
 var timeString = time.replace("/Date(","").replace(")/","");
	var time=parseInt(timeString);
	var d=new Date();
	d.setTime(time);
		return new Date(parseInt(time)).toLocaleDateString().replace(/\//g,'-'); 
 */

/**
	 * [ago 多少小时前、多少分钟前、多少秒前]
	 * @return {[type]} [string]
	 * new Date(1421313395359).ago(1411430400000)
	//=> "3个月前"
	new Date(1421313395359).ago('1987-04-03')
	//=> "28年前"
	 * new Date(’2015-10-22‘).ago('1995-10-22');        20年前
	 */
Date.prototype.ago = function() {
	if (!arguments.length) return '';
	var arg = arguments,
		now = this.getTime(),
		past = !isNaN(arg[0]) ? arg[0] : new Date(arg[0]).getTime(),
		diffValue = now - past,
		result = '',
		// console.log(new Date(past).getTime(), "2332")
		minute = 1000 * 60,
		hour = minute * 60,
		day = hour * 24,
		halfamonth = day * 15,
		month = day * 30,
		year = month * 12,

		_year = diffValue / year,
		_month = diffValue / month,
		_week = diffValue / (7 * day),
		_day = diffValue / day,
		_hour = diffValue / hour,
		_min = diffValue / minute;

	if (_year >= 1) result = parseInt(_year) + "年前";
	else if (_month >= 1) result = parseInt(_month) + "个月前";
	else if (_week >= 1) result = parseInt(_week) + "周前";
	else if (_day >= 1) result = parseInt(_day) + "天前";
	else if (_hour >= 1) result = parseInt(_hour) + "个小时前";
	else if (_min >= 1) result = parseInt(_min) + "分钟前";
	else result = "刚刚";
	return result;
}