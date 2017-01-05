var selectList="<option selected='selected'>Select a Team</option>";
var button=document.getElementById("getTeamData");
var teamSelected;
var p_fail=document.getElementById('failOutput');
var p_success=document.getElementById('successOutput');
var p_warning=document.getElementById('warningOutput');
var teamRosterEntries;
$('#viewOptionsForList').hide();
function showLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = 'Loading data <img height="75" width="75" src="/images/loading.gif"></img>';
}
function stopLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "";
}
var getTeamList= function(){
	showLoadingMessage();
var row = document.getElementById("formRoster");
	xhrGet('/myapp/teamlist', function(data){
		var receivedItems=data || [];
		console.log(receivedItems);
		for (var i=0; i<receivedItems.length ; ++i){
			selectList+="<option value='"+receivedItems[i]+"'>"+receivedItems[i]+"</option>" ;
		}
		stopLoadingMessage();
		row.innerHTML="<select id='TeamName'>"+selectList+"</select> <input type = 'text' id = 'datepicker'>";
		  $(function() {
			//$( "#datepicker" ).datepicker({dateFormat: 'yy-mm' });
			$("#datepicker").monthpicker();
			} );
			button.disabled=false;
		},function(err){
			console.error(err);
	});
};

var getTDList=function(message){
	showLoadingMessage();
	$('#moveButtons').hide();
	$('.mView').show();
	$('.dView').hide();
	$('.wView').hide();
	$('#viewOptionsForList').hide();
	var rowOutput=document.getElementById("tbodyMonthOutput");
	document.getElementById('tbodyWeekOutput').innerHTML="";
	var teamSelected=document.getElementById("TeamName").value;
	if ( teamSelected ==='Select a Team'){alert('Please select a team'); 	stopLoadingMessage();return ;}
	var monthSelected=document.getElementById("monthpick").value;
	monthSelected = Number(monthSelected)+1;
	if (monthSelected <= 9) { monthSelected="0"+monthSelected;}
	console.log(monthSelected);
	console.log(window.JSON);
	var yearSelected=document.getElementById("yearpick").value;
	//var dateSelectedArray=dateSelected.split("-");
	var url_get='/myapp/getRoster?id='+teamSelected+"_"+yearSelected+monthSelected;
	console.log(url_get);
	//console.log(JSON.parse(url_get));
		//alert("this node is "+node + " and value is " + teamSelected + "Date selected is "+dateSelectedArray[0] + "2nd" + dateSelectedArray[1] + "3rd" + dateSelectedArray[2]);
		xhrGet(url_get,function(data){
			if ( data !== 'FILE NOT FOUND') {
			$('#viewOptionsForList').show();
			$("[value=listByMonth]").prop("checked",true);
			var receivedData = data || [];	
			var defaultOutput="<tr><th id='docId2'><input readonly value='"+teamSelected+"_"+yearSelected+String(monthSelected)+"'></input></th></tr><tr name='JSONHeader'class='headerTable' ><td class='content checkBox'><input type='checkbox' name='masterBox' id='checkAll' onclick='toggleCheckBox(this)'></td>	<td class='content' class='headerTable' >Date</td><td class='content' class='headerTable' >Day</td><td class='content' class='headerTable' >Morning</td><td class='content' class='headerTable' >General</td><td class='content' class='headerTable' >Evening</td><td class='content'class='headerTable'>MHC</td><td class='content' class='headerTable'>Oncall</td><td class='content' class='headerTable' >Additional</td><td class='content' class='headerTable'>Leave Plans</td><td class='content' class='headerTable' >AU Holiday</td><td class='content' class='headerTable' >IN Holiday</td></tr>";
			//alert(JSON.stringify(data[0]));
			var actualOutput="";
			teamRosterEntries=receivedData;
			for (var i=0;i<receivedData.length ; ++i){
//actualOutput+="<tr name='JSONData'><td class='content'>"+receivedData[i].Date+"</td><td class='content'>"+receivedData[i].Day+"</td><td class='content'>"+receivedData[i].Morning+"</td><td class='content'>"+receivedData[i].General+"</td><td class='content'>"+receivedData[i].Evening+"</td><td class='content'>"+receivedData[i].MHC+"</td><td class='content'>"+receivedData[i].Oncall+"</td><td class='content'>"+receivedData[i].Additional+"</td><td class='content'>"+receivedData[i].Leave_Plans+"</td><td class='content'>"+receivedData[i].AU_Holiday+"</td><td class='content'>"+receivedData[i].IN_Holiday+"</td></tr>";
actualOutput+="<tr class='trMonthOutput' name='JSONData3'><td class='insertContent checkBox'><input type='checkbox' name='checkBoxInput' ></td><td class='insertContent' name='dateValue'><input class='insertData' value='"+receivedData[i].Date+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+receivedData[i].Day+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'><input class='insertData' value='"+receivedData[i].Morning+"' readonly></td><td class='insertContent' name='GeneralValue'><input class='insertData' value='"+receivedData[i].General+"' readonly></td><td class='insertContent' name='EveningValue'><input class='insertData' value='"+receivedData[i].Evening+"' readonly></td><td class='insertContent' name='MHCValue'><input class='insertData' value='"+receivedData[i].MHC+"' readonly></td><td class='insertContent' name='OncallValue'><input class='insertData' value='"+receivedData[i].Oncall+"' readonly></td><td class='insertContent' name='AdditionalValue'><input class='insertData' value='"+receivedData[i].Additional+"' readonly></td><td class='insertContent' name='LeavePlanValue'><input class='insertData' value='"+receivedData[i].Leave_Plans+"' readonly></td><td class='insertContent' name='AUHolidayValue'><input class='insertData' value='"+receivedData[i].AU_Holiday+"' readonly></td><td class='insertContent' name='INHolidayValue'><input class='insertData' value='"+receivedData[i].IN_Holiday+"' readonly></td></tr>";
			}
			stopLoadingMessage();
			rowOutput.innerHTML=defaultOutput+actualOutput;
			document.getElementById('viewOptions').style.display="none";
			p_fail.innerHTML="";
			console.log('Length of Message: '+message.length);
			if (message.length>0){	p_success.innerHTML=message; } else {p_success.innerHTML="";}
			document.getElementById('buttonsDiv').style.display="";
			//$('#rosterSubmit').hide();
			document.getElementById('rosterSubmit').disabled=true;
			//$('#rosterDownload').show();
			document.getElementById('rosterDownload').disabled=false;
			document.getElementById("viewMonthOutput").style.display="";
			$('#viewOptionsForList').show();
		} else { 
			$('#viewOptionsForList').hide();
			stopLoadingMessage();
			p_fail.innerHTML="Roster not found for " + teamSelected +" for "+monthSelected+"/"+yearSelected+". Click here to create new Roster Doc : <button id='createRoster' class='w3-btn w3-teal' name='createRoster' onclick='createRoster()'>Create</button>";
			console.log('Length of Message: '+message.length);
			if (message.length>0){	p_success.innerHTML=message; } else {p_success.innerHTML="";}			
			document.getElementById("viewMonthOutput").style.display="none";
			document.getElementById('buttonsDiv').style.display="none";
		}
		},function(err){
	console.error(err);
});
	};
	
var checkNumDays =function(monthNum){
	var NumOfDays;
	console.log("Month sent to checkNumDays is:"+monthNum);
	switch (monthNum){
		case '0':
		case '2':
		case '4':
		case '6':
		case '7':
		case '9':
		case '11':
		    NumOfDays=31;
		break;
		case '1':
			NumOfDays=28;
			break;
		case '3':
		case '5':
		case '8':
		case '10':
			NumOfDays=30;
	}
	//console.log("Number of Days: "+ NumOfDays);
	return NumOfDays;
};
var create_dates= function (monthNum,yearNum){
	//console.log("Variables sent to create_dates are:"+ monthNum + " " + yearNum);
	var NumOfDays=checkNumDays(monthNum);
	
	var dateArray=new Array();
	monthNum=Number(monthNum)+1;
		if (monthNum<=9){monthNum="0"+monthNum};
	for (var i=01; i<=NumOfDays; i++){
	
		if (i<=9){i="0"+i};
		var tempdate=yearNum+'-'+monthNum+'-'+i;
		console.log(tempdate);
		dateArray.push(tempdate);
	}				
	return dateArray;
	
};
var returnDateHash = function(dAr){
	var dateHash={};
	for (var j = 0; j<dAr.length; ++j){
		var tempDate= new Date(dAr[j]);
		dateHash[dAr[j]]= tempDate.getDay();
	}
	console.log(dateHash);
	return dateHash;
};
var createRoster = function() {
	showLoadingMessage();
		$('#viewOptionsForList').hide();
		var selectListMems="";
		var viewButton=document.getElementById('viewOptions');
		viewButton.style.display='block';
		teamSelected=document.getElementById('TeamName').value;
		var monthSelected=document.getElementById('monthpick').value;					
		var yearSelected=document.getElementById('yearpick').value;
		console.log(teamSelected+ " " + monthSelected+ " " + yearSelected);
			var url="/myapp/teamMem?id="+teamSelected+"_team_members";
			var receivedItems2;
			xhrGet(url, function(data){
				var selectListMem="";
			 receivedItems2=data || [];
			console.log(receivedItems2);
			
		for ( var i=0; i<receivedItems2.length; ++i){
			selectListMem += "<option value='"+receivedItems2[i]+"'>"+receivedItems2[i]+"</option>";
		}
		selectListMem += "<option value='NA'>NA</option></select>";
		selectListMems ='<select id="teamList">'+selectListMem;
		var dateList = create_dates(monthSelected,yearSelected);
		var dateHash = returnDateHash(dateList);
		monthSelected=Number(monthSelected)+1;
		var rowMonthOutput=document.getElementById("tbodyMonthOutput");
		var rowWeekOutput=document.getElementById('tbodyWeekOutput');
		//alert(selectListMems + '----' +dateList);
		var monthSe;
		if (monthSelected <= 9 ) {monthSe="0"+monthSelected ;} else {monthSe=monthSelected;}
		var p_success= document.getElementById('successOutput');
		var defaultMonthOutput="<tr><th id='docId'><input readonly value='"+teamSelected+"_"+yearSelected+monthSe+"'></input></th></tr><tr name='JSONHeader'class='headerTable' ><td class='content' class='headerTable' >Date</td><td class='content' class='headerTable' >Day</td><td class='content' class='headerTable' >Morning</td><td class='content' class='headerTable' >General</td><td class='content' class='headerTable' >Evening</td><td class='content'class='headerTable'>MHC</td><td class='content' class='headerTable'>Oncall</td><td class='content' class='headerTable' >Additional</td><td class='content' class='headerTable'>Leave Plans</td><td class='content' class='headerTable' >AU Holiday</td><td class='content' class='headerTable' >IN Holiday</td></tr>";
		var defaultWeekOutput="<tr><th id='docId'><input readonly value='"+teamSelected+"_"+yearSelected+monthSe+"'></input></th></tr><tr name='JSONHeader'class='headerTable' ><td class='content' class='headerTable' >From Date</td><td class='content' class='headerTable' >From Day</td><td class='content' class='headerTable' >To Date</td><td class='content' class='headerTable' >To Day</td><td class='content' class='headerTable' >Morning</td><td class='content' class='headerTable' >General</td><td class='content' class='headerTable' >Evening</td><td class='content'class='headerTable'>MHC</td><td class='content' class='headerTable'>Oncall</td><td class='content' class='headerTable' >Additional</td><td class='content' class='headerTable'>Leave Plans</td><td class='content' class='headerTable' >AU Holiday</td><td class='content' class='headerTable' >IN Holiday</td></tr>";
		var innerHTMLForTableMonthRoster="";
		var innerHTMLForTableWeekRoster="";
		var weekday = new Array(7);
	    weekday[0] = "Sunday";
	    weekday[1] = "Monday";
	    weekday[2] = "Tuesday";
	    weekday[3] = "Wednesday";
	    weekday[4] = "Thursday";
	    weekday[5] = "Friday";
	    weekday[6] = "Saturday";
		for (var i=0 ; i<dateList.length; ++i){
			var t_dt=new Date(dateList[i]);
			//innerHTMLForTableRoster+="<tr name='JSONData'><td class='insertContent' name='dateValue'><input value='"+dateList[i]+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input value='"+weekday[t_dt.getDay()]+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'>"+selectListMems+"</td><td class='insertContent' name='GeneralValue'>"+selectListMems+"</td><td class='insertContent' name='EveningValue'>"+selectListMems+"</td><td class='insertContent' name='MHCValue'>"+selectListMems+"</td><td class='insertContent' name='OncallValue'>"+selectListMems+"</td><td class='insertContent' name='AdditionalValue'><input type='text'></input></td><td class='insertContent' name='LeavePlanValue'><input type='text'></input></td><td class='insertContent' name='AUHolidayValue'><select name='holiday'><option value='Y'>Y</option><option value='N'>N</option></select></td><td class='insertContent' name='INHolidayValue'><select name='holiday'><option value='Y'>Y</option><option value='N'>N</option></select></td></tr>";
			innerHTMLForTableMonthRoster+="<tr name='JSONData'><td class='insertContent' name='dateValue'><input class='insertData' value='"+dateList[i]+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+weekday[t_dt.getDay()]+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'>"+selectListMems+"</td><td class='insertContent' name='GeneralValue'>"+selectListMems+"</td><td class='insertContent' name='EveningValue'>"+selectListMems+"</td><td class='insertContent' name='MHCValue'>"+selectListMems+"</td><td class='insertContent' name='OncallValue'>"+selectListMems+"</td><td class='insertContent' name='AdditionalValue'><input class='insertData'  type='text'></input></td><td class='insertContent' name='LeavePlanValue'><input type='text' class='insertData' ></input></td><td class='insertContent' name='AUHolidayValue'><select name='holiday' class='insertData' ><option value='N'>N</option><option value='Y'>Y</option></select></td><td class='insertContent' name='INHolidayValue'><select name='holiday' class='insertData' ><option value='N'>N</option><option value='Y'>Y</option></select></td></tr>";
		}
		console.log("Month : "+monthSelected);
		var monthSelected2=monthSelected-1;
		var NumOfDays2=checkNumDays(''+monthSelected2);
		for ( var key in dateHash ) {
			
			console.log("Number of Days"+ NumOfDays2);
			if (dateHash[key]===0) { var num=0;} else{var num=7;}
			if ( key.substring(8) === '01'||dateHash[key] === 1 ){
				var dtmpAr=key.split('-');
				var fromDate=key;
				var fromDay=weekday[dateHash[key]];
				console.log("Start Date is: " + fromDate + " day is : "+ fromDay);
				if ( dateHash[key] <=5) { var math=Number(dtmpAr[2])+(num - dateHash[key]);} else { var math=Number(dtmpAr[2])+1;}
				if (math < 9){math="0"+math;}
				var toDate=dtmpAr[0]+'-'+dtmpAr[1]+'-'+math;
				var tempD2=new Date(toDate);
				var toDay=weekday[tempD2.getDay()];
				
				if ( ! weekday[tempD2.getDay()]) {
				var toDate=dtmpAr[0]+'-'+dtmpAr[1]+'-'+NumOfDays2;
				var tempD2=new Date(toDate);
				var toDay=weekday[tempD2.getDay()];
				}
				console.log("End Value is " + toDate+ " day is: " +toDay );
		var indexOfStartDate=dateList.indexOf(fromDate);
		var indexOfEndDate=dateList.indexOf(toDate);
		var tempDateListAr=[];
		tempDateListAr=dateList.slice(indexOfStartDate, indexOfEndDate+1);
		var selectListAUHoliday="<select class='holidayAUDates' ";
		var selectListINHoliday="<select class='holidayINDates' ";
		var innerHolidayOption="";
		for( var k=0; k<tempDateListAr.length; ++k){
		innerHolidayOption+="<option value="+tempDateListAr[k]+">"+tempDateListAr[k]+"</option>";
		}
		selectListAUHoliday+="id='"+key+"_AU' multiple><option value='NONE'>NONE</option>"+innerHolidayOption+"</select>";
		selectListINHoliday+="id='"+key+"_IN' multiple><option value='NONE'>NONE</option>"+innerHolidayOption+"</select>";
			innerHTMLForTableWeekRoster+="<tr name='JSONData2' class='JSONRow' ><td class='insertContent' name='fromDateValue'><input class='insertData' value='"+fromDate+"' readonly name='fromDateField' ></input></td><td class='insertContent' name='fromDayValue'><input class='insertData' value='"+fromDay+"' readonly name='fromDayField'></input></td><td class='insertContent' name='toDateValue'><input class='insertData' value='"+toDate+"' readonly name='toDateField' ></input></td><td class='insertContent' name='toDayValue'><input class='insertData' value='"+toDay+"' readonly name='toDayField'></input></td><td class='insertContent' name='MorningValue'>"+selectListMems+"</td><td class='insertContent' name='GeneralValue'>"+selectListMems+"</td><td class='insertContent' name='EveningValue'>"+selectListMems+"</td><td class='insertContent' name='MHCValue'>"+selectListMems+"</td><td class='insertContent' name='OncallValue'>"+selectListMems+"</td><td class='insertContent' name='AdditionalValue'><input class='insertData'  type='text'></input></td><td class='insertContent' name='LeavePlanValue'><input type='text' class='insertData' ></input></td><td class='insertContent' name='AUHolidayValue'>"+selectListAUHoliday+"</td><td class='insertContent' name='INHolidayValue'>"+selectListINHoliday+"</td></tr>";
			}
			
		}
		stopLoadingMessage();
		rowMonthOutput.innerHTML=defaultMonthOutput+innerHTMLForTableMonthRoster+"<button id='submitRoster'  class='w3-btn w3-teal' onClick='submitMonthRoster()'>Submit Roster</button>";
		rowWeekOutput.innerHTML=defaultWeekOutput+innerHTMLForTableWeekRoster;
		$("[value=WeekView]").prop("checked",true);
		showWeek();
		},function(err){
			console.error(err);
			
		});
};
var showMonth=function(){
			$('.mView').show();
			$('.wView').hide();
			$('#moveButtons').hide();			
};
var showWeek=function(){
			$('.mView').hide();
			$('.wView').show();
			$('#moveButtons').show();
			var WeekRosterElements=document.getElementsByClassName('JSONRow');
			for (var i=0 ;i<WeekRosterElements.length;i++ ){
				WeekRosterElements[i].style.display='none';
			}
			WeekRosterElements[0].style.display="";
			document.getElementById('next').removeAttribute('disabled');			
			document.getElementById('prev').setAttribute('disabled',true);
};

var submitMonthRoster = function () {
	var rosterDoc= [];
	var trNodeList=[];
	trNodeList=document.getElementsByName('JSONData');
	//var rosterList= $("tr[name=JSONData]");
	//alert(JSON.stringify(rosterDoc[1]));
	for (var i=0; i<trNodeList.length; ++i){
		var nodeElement= [];
		var dataNode={};
		nodeElement=trNodeList[i].childNodes;
		//console.log(nodeElement);
		dataNode['Date']=nodeElement[0].firstChild.value;
//		dataNode['Date']=nodeElement[1].firstChild.value;
		dataNode['Day']=nodeElement[1].firstChild.value;
		dataNode['Morning']=nodeElement[2].firstChild.value;
		dataNode['General']=nodeElement[3].firstChild.value;
		dataNode['Evening']=nodeElement[4].firstChild.value;
		dataNode['MHC']=nodeElement[5].firstChild.value;
		dataNode['Oncall']=nodeElement[6].firstChild.value;
		dataNode['Additional']=nodeElement[7].firstChild.value;
		dataNode['Leave_Plans']=nodeElement[8].firstChild.value;
		//dataNode['Comments']=nodeElement[9].firstChild.value;
		dataNode['AU_Holiday']=nodeElement[9].firstChild.value;
		dataNode['IN_Holiday']=nodeElement[10].firstChild.value;
		rosterDoc.push(dataNode);

		
	}
	var dataDoc={
			data : JSON.stringify(rosterDoc)
		};
		var rosterDocId=document.getElementById('docId');
		alert("Uploading Roster for :" + rosterDocId.firstChild.value);
		dataDoc.id=rosterDocId.firstChild.value;
	console.log(JSON.stringify(rosterDoc));
	console.log("Data is :"+dataDoc);
	xhrPost('/myapp/postRoster',dataDoc,function(data){
		if ( data === 'SUCCESS'){
			p_fail.innerHTML="";
			var messageSend="Successfully uploaded doc "+dataDoc.id;
			getTDList(messageSend);
		} else {
			p_fail.innerHTML="Failed to upload doc";
			p_success.innerHTML="";
		}
	},function(err){
		console.log(err);
		p_fail.innerHTML=err;
	});
};

var submitWeekRoster = function () {
	var rosterDocWeek= [];
	var trNodeListWeek=[];
	var weekday = new Array(7);
	    weekday[0] = "Sunday";
	    weekday[1] = "Monday";
	    weekday[2] = "Tuesday";
	    weekday[3] = "Wednesday";
	    weekday[4] = "Thursday";
	    weekday[5] = "Friday";
	    weekday[6] = "Saturday";
	trNodeListWeek=document.getElementsByName('JSONData2');
	var dateWeekFrom=trNodeListWeek[0].firstChild.firstChild.value.split('-');
	var monthSelectedWeek=dateWeekFrom[1];
	var yearSelectedWeek=dateWeekFrom[0];
	console.log(monthSelectedWeek,yearSelectedWeek);
	monthSelectedWeek=Number(monthSelectedWeek)-1;
	var datesWeek=create_dates(String(monthSelectedWeek),yearSelectedWeek);
	var datesWeekHash=returnDateHash(datesWeek);
	console.log(datesWeek + datesWeekHash);
	for (var i=0; i<trNodeListWeek.length; ++i){
		var nodeElementWeek= [];
		nodeElementWeek=trNodeListWeek[i].childNodes;
	//	console.log(nodeElementWeek[0].firstChild.value);
		var startDate=nodeElementWeek[0].firstChild.value;
		var startDay=nodeElementWeek[1].firstChild.value;
		var endDate=nodeElementWeek[2].firstChild.value;
		var endDay=nodeElementWeek[3].firstChild.value;
		var morningValue=nodeElementWeek[4].firstChild.value;
		var generalValue=nodeElementWeek[5].firstChild.value;
		var eveningValue=nodeElementWeek[6].firstChild.value;
		var mhcValue=nodeElementWeek[7].firstChild.value;
		var oncallValue=nodeElementWeek[8].firstChild.value;
		var additionalValue=nodeElementWeek[9].firstChild.value;
		var leaveplanValue=nodeElementWeek[10].firstChild.value;
		var auHolidayListAr=[];
		var inHolidayListAr=[];
		auHolidayListAr=$('#'+startDate+"_AU").val();
		inHolidayListAr=$('#'+startDate+"_IN").val();
		console.log(auHolidayListAr);
		console.log(inHolidayListAr);
		//alert(auHolidayListAr);
		//alert(inHolidayListAr);
		//console.log(startDate+', '+startDay+', '+endDate+', '+endDay+', '+morningValue+', '+generalValue+', '+eveningValue+', '+mhcValue+', '+oncallValue+', '+additionalValue+', '+leaveplanValue+', ' + auHolidayListAr+', '+inHolidayListAr);
		var indexStart=datesWeek.indexOf(startDate);
		var indexEnd=datesWeek.indexOf(endDate);
		var weekAr=datesWeek.slice(indexStart,indexEnd+1);
		console.log(weekAr);
		for (var j=0; j<weekAr.length ; j++ ){
			var dataNodeWeek={};
			dataNodeWeek['Date']=weekAr[j];
			dataNodeWeek['Day']=weekday[datesWeekHash[weekAr[j]]];
			if (datesWeekHash[weekAr[j]] === 6 || datesWeekHash[weekAr[j]] === 0){
				dataNodeWeek['Morning']='NA';
				dataNodeWeek['General']='NA';
				dataNodeWeek['Evening']='NA';
				dataNodeWeek['MHC']='NA';
			}else {
				dataNodeWeek['Morning']=morningValue;
				dataNodeWeek['General']=generalValue;
				dataNodeWeek['Evening']=eveningValue;
				dataNodeWeek['MHC']=mhcValue;				
			}
			dataNodeWeek['Oncall']=oncallValue;
			dataNodeWeek['Additional']=additionalValue;
			dataNodeWeek['Leave_Plans']=leaveplanValue;
			//dataNode['Comments']=
			var auholidayval;
			var inholidayval;
			if ( auHolidayListAr ===null || auHolidayListAr.length <= 0 ) { auholidayval="N";} else {
				if ( auHolidayListAr[0]=== "NONE") {auholidayval="N";} else {
					if ( auHolidayListAr.indexOf(weekAr[j]) > -1 ){ auholidayval="Y";dataNodeWeek['MHC']='NA';} else {auholidayval="N";}
				}
				
			}
			if ( inHolidayListAr ===null || inHolidayListAr.length <= 0 ) { inholidayval="N";} else {
				if ( inHolidayListAr[0]=== "NONE") {inholidayval="N";} else {
					if ( inHolidayListAr.indexOf(weekAr[j]) > -1 ){ inholidayval="Y";} else {inholidayval="N";}
				}
			}
			dataNodeWeek['AU_Holiday']=auholidayval;
			dataNodeWeek['IN_Holiday']=inholidayval;
			rosterDocWeek.push(dataNodeWeek);
		}
	}
	var dataDocWeek={
		data : JSON.stringify(rosterDocWeek)
	};
	var rosterDocIdWeek=document.getElementById('docId');
	alert("Uploading Roster for :" + rosterDocIdWeek.firstChild.value);
	dataDocWeek.id=rosterDocIdWeek.firstChild.value;
	console.log(JSON.stringify(rosterDocWeek));
	console.log("Data is :"+dataDocWeek);
	xhrPost('/myapp/postRoster',dataDocWeek,function(data){
		if ( data === 'SUCCESS'){
			p_fail.innerHTML="";
			var messageSend="Successfully uploaded doc "+dataDocWeek.id;
			getTDList(messageSend);
		} else {
			p_fail.innerHTML="Failed to upload doc";
			p_success.innerHTML="";
		}
	},function(err){
		console.log(err);
		p_fail.innerHTML=err;
	});
};

var toggleCheckBox = function(node){
	var elementsCheck=document.getElementsByName('checkBoxInput');
	if (node.checked === true) {
		for (var i=0; i<elementsCheck.length ;i++){
			elementsCheck[i].checked=true;
		}
	} else {
		for (var i=0; i<elementsCheck.length ;i++){
				elementsCheck[i].checked=false;
		}
	};
};

var editRosterChild = function (selectListMems,selectListYrN) {
if (document.getElementById('viewWeekOutput').getAttribute('style') !== 'display: none;' ){
	var inputWeekCheckBox=document.getElementsByName('checkBoxWeekInput');
	for (var i=0; i<inputWeekCheckBox.length; i++){
		if (inputWeekCheckBox[i].checked=== true){
			var parentRow=inputWeekCheckBox[i].parentNode.parentNode;
			console.log(parentRow);
			parentRow.childNodes[5].innerHTML=selectListMems;
			parentRow.childNodes[6].innerHTML=selectListMems;
			parentRow.childNodes[7].innerHTML=selectListMems;
			parentRow.childNodes[8].innerHTML=selectListMems;			
			parentRow.childNodes[9].innerHTML=selectListMems;
			parentRow.childNodes[10].firstChild.removeAttribute('readonly');
			parentRow.childNodes[11].firstChild.removeAttribute('readonly');
			parentRow.childNodes[12].firstChild.removeAttribute('readonly');
			parentRow.childNodes[13].firstChild.removeAttribute('readonly');
		}
	}
}else{	
	var inputCheckBox=document.getElementsByName('checkBoxInput');
	for (var i=0; i<inputCheckBox.length; i++){
		if (inputCheckBox[i].checked=== true){
			var parentRow=inputCheckBox[i].parentNode.parentNode;
			console.log(parentRow);
			parentRow.childNodes[3].innerHTML=selectListMems;
			parentRow.childNodes[4].innerHTML=selectListMems;
			parentRow.childNodes[5].innerHTML=selectListMems;
			parentRow.childNodes[6].innerHTML=selectListMems;			
			parentRow.childNodes[7].innerHTML=selectListMems;
			parentRow.childNodes[8].firstChild.removeAttribute('readonly');
			parentRow.childNodes[9].firstChild.removeAttribute('readonly');
			parentRow.childNodes[10].innerHTML=selectListYrN;
			parentRow.childNodes[11].innerHTML=selectListYrN;
		}
	}
}
};

var editRoster=function(){
	var trNodeList12=[];
	var typeOfView12;
		if (document.getElementById('viewMonthOutput').getAttribute('style') !== 'display: none;') {typeOfView12='simple';trNodeList12=document.getElementsByClassName('trMonthOutput'); }
		else if(document.getElementById('viewWeekOutput').getAttribute('style') !== 'display: none;') {typeOfView12='week';trNodeList12=document.getElementsByClassName('trWeekOutput');}		
		else if(document.getElementById('viewDateOutput').getAttribute('style') !== 'display: none;') {typeOfView12='simple';trNodeList12=document.getElementsByClassName('trDateOutput');}
		var counter12=0;
		for (var i=0; i<trNodeList12.length;i++){
			var nodeElement12=trNodeList12[i].childNodes;
			if($(nodeElement12[0].firstChild).prop('checked') === true) {counter12++;}
		}
		if (counter12===0){alert("Please select any checkbox to edit"); return;}
	var teamSelectedEdit=document.getElementById('docId2').firstChild.value.split('_')[0];
	console.log('Team Selected :' + teamSelectedEdit);
	var url="/myapp/teamMem?id="+teamSelectedEdit+"_team_members";
	xhrGet(url, function(data){
		var selectListMem="";
		receivedItems3=data || [];
		console.log(receivedItems3);
		for ( var i=0; i<receivedItems3.length; ++i){
			selectListMem += "<option value='"+receivedItems3[i]+"'>"+receivedItems3[i]+"</option>";
		}
		selectListMem += "<option value='NA'>NA</option></select>";
		var selectListMems ='<select id="teamList">'+selectListMem+'</select>';
		var selectListYrN="<select><option value='Y'>Y</option><option value='N'>N</option></select>";
		editRosterChild(selectListMems,selectListYrN);
		//$('#rosterSubmit').show();
		document.getElementById('rosterSubmit').disabled=false;
		//$('#rosterDownload').hide();
		document.getElementById('rosterDownload').disabled=true;
	},function(err){
		console.log(err);
	});	
	
};

var deleteRoster = function () {
	var rosterDocId2=document.getElementById('docId2').firstChild.value;
	var url="/myapp/delRoster?id="+rosterDocId2;
	xhrDelete(url, function(data){
			if (data === 'SUCCESS' ) {
				var messageSend='Roster Deleted'; 
				alert('Roster Successfully deleted'+rosterDocId2);
			} else {
				messageSend='Roster could not be deleted, please retry again';
			}
			getTDList(messageSend);
		}, function(err){
			console.error(err);
	});
};
var refreshRoster =  function () {
	getTDList("");	
};

var updateRoster = function () {
	console.log("Submit Triggered");
	console.log(document.getElementById('viewMonthOutput').getAttribute('style'));
	console.log(document.getElementById('viewWeekOutput').getAttribute('style'));
	console.log(document.getElementById('viewDateOutput').getAttribute('style'))
	var trNodeList=[];
	var typeOfView;
		if (document.getElementById('viewMonthOutput').getAttribute('style') !== 'display: none;') {typeOfView='simple';trNodeList=document.getElementsByClassName('trMonthOutput'); }
		else if(document.getElementById('viewWeekOutput').getAttribute('style') !== 'display: none;') {typeOfView='week';trNodeList=document.getElementsByClassName('trWeekOutput');}		
		else if(document.getElementById('viewDateOutput').getAttribute('style') !== 'display: none;') {typeOfView='simple';trNodeList=document.getElementsByClassName('trDateOutput');}
	if (typeOfView==='simple'){
		var rosterDoc= [];
	//	alert(JSON.stringify(rosterDoc[1]));
		for (var i=0; i<trNodeList.length; ++i){
			var nodeElement= [];
			var dataNode={};
			nodeElement=trNodeList[i].childNodes;
			//console.log(nodeElement);
			dataNode['Date']=nodeElement[1].firstChild.value;
	//		dataNode['Date']=nodeElement[1].firstChild.value;
			dataNode['Day']=nodeElement[2].firstChild.value;
			dataNode['Morning']=nodeElement[3].firstChild.value;
			dataNode['General']=nodeElement[4].firstChild.value;
			dataNode['Evening']=nodeElement[5].firstChild.value;
			dataNode['MHC']=nodeElement[6].firstChild.value;
			dataNode['Oncall']=nodeElement[7].firstChild.value;
			dataNode['Additional']=nodeElement[8].firstChild.value;
			dataNode['Leave_Plans']=nodeElement[9].firstChild.value;
			//dataNode['Comments']=nodeElement[9].firstChild.value;
			dataNode['AU_Holiday']=nodeElement[10].firstChild.value;
			dataNode['IN_Holiday']=nodeElement[11].firstChild.value;
			rosterDoc.push(dataNode);
		}
		var dataDoc={
				data : JSON.stringify(rosterDoc)
			};
			var rosterDocId=document.getElementById('docId2');
			alert("Uploading Roster for :" + rosterDocId.firstChild.value);
			dataDoc.id=rosterDocId.firstChild.value;
		console.log(JSON.stringify(rosterDoc));
		console.log("Data is :"+dataDoc);
		xhrPut('/myapp/putRoster',dataDoc,function(data){
			if ( data === 'SUCCESS'){
				p_fail.innerHTML="";
				var messageSend="Successfully uploaded doc "+dataDoc.id;
				getTDList(messageSend);
			} else {
				console.log("Err is :"+data);
				p_fail.innerHTML="Failed to upload doc";
				p_success.innerHTML="";
			}
		},function(err){
			console.log(err);
			p_fail.innerHTML=err;
		});
	}else{
		alert('weekUpload Triggered');
		var rosterUpdateDocWeek= [];
		var trWeekRosterNodes=[];
		var weekday = new Array(7);
		    weekday[0] = "Sunday";
		    weekday[1] = "Monday";
		    weekday[2] = "Tuesday";
		    weekday[3] = "Wednesday";
		    weekday[4] = "Thursday";
		    weekday[5] = "Friday";
		    weekday[6] = "Saturday";
		trWeekRosterNodes=document.getElementsByName('checkBoxWeekInput');
		var rowWeekRosterNode=trWeekRosterNodes[0].parentNode.parentNode.childNodes;
		var datestamp=rowWeekRosterNode[1].firstChild.value.split('-');
		var monthOfWeek=datestamp[1];
		var yearOfWeek=datestamp[0];
		console.log(monthOfWeek,yearOfWeek);
		monthOfWeek=Number(monthOfWeek)-1;
		var dateWeekAr=create_dates(String(monthOfWeek),yearOfWeek);
		var dateWeekHa=returnDateHash(dateWeekAr);
		for (var p=0;p<trWeekRosterNodes.length; p++){
			var singleRowWeek=trWeekRosterNodes[p].parentNode.parentNode.childNodes;
			var tempStartDate=singleRowWeek[1].firstChild.value;
			var tempStartDay=singleRowWeek[2].firstChild.value;
			var tempEndDate=singleRowWeek[3].firstChild.value;
			var tempEndDay=singleRowWeek[4].firstChild.value;
			var tempMorningVal=singleRowWeek[5].firstChild.value;
			var tempGeneralVal=singleRowWeek[6].firstChild.value;
			var tempEveningVal=singleRowWeek[7].firstChild.value;
			var tempMHCVal=singleRowWeek[8].firstChild.value;
			var tempOncallVal=singleRowWeek[9].firstChild.value;
			var tempAdditionalVal=singleRowWeek[10].firstChild.value;
			var tempLeaveplanVal=singleRowWeek[11].firstChild.value;
			var auWeekHolidayListAr=[];
			var inWeekHolidayListAr=[];
			auWeekHolidayListAr=$('#'+tempStartDate+"_AUEdit").val();
			inWeekHolidayListAr=$('#'+tempStartDate+"_INEdit").val();
			console.log(auWeekHolidayListAr);
			console.log(inWeekHolidayListAr);
			var indexStartWeek=dateWeekAr.indexOf(tempStartDate);
			var indexEndWeek=dateWeekAr.indexOf(tempEndDate);
			var weekArEdit=dateWeekAr.slice(indexStartWeek,indexEndWeek+1);
			for (var q=0; q<weekArEdit.length;q++){
				var dataWeekEdit={};
				dataWeekEdit['Date']=weekArEdit[q];
				dataWeekEdit['Day']=weekday[dateWeekHa[weekArEdit[q]]];
				if (dateWeekHa[weekArEdit[q]] ===6 || dateWeekHa[weekArEdit[q]]===0){
					dataWeekEdit['Morning']='NA';
					dataWeekEdit['General']='NA';
					dataWeekEdit['Evening']='NA';
					dataWeekEdit['MHC']='NA';
				}else{
					dataWeekEdit['Morning']=tempMorningVal;
					dataWeekEdit['General']=tempGeneralVal;
					dataWeekEdit['Evening']=tempEveningVal;
					dataWeekEdit['MHC']=tempMHCVal;
				}
				dataWeekEdit['Oncall']=tempOncallVal;
				dataWeekEdit['Additional']=tempAdditionalVal;
				dataWeekEdit['Leave_Plans']=tempLeaveplanVal;
				var tempAUHolidayVal;
				var tempINHolidayVal;
				if ( auWeekHolidayListAr ===null || auWeekHolidayListAr.length <= 0 ) { 
					tempAUHolidayVal="N";
				} else {
					if ( auWeekHolidayListAr[0]=== "NONE") {
						tempAUHolidayVal="N";
					} else {
						if ( auWeekHolidayListAr.indexOf(weekArEdit[q]) > -1 ){ 
							tempAUHolidayVal="Y";
							dataWeekEdit['MHC']='NA';
						} else {
							tempAUHolidayVal="N";
							}
					}
					
				}
				if ( inWeekHolidayListAr ===null || inWeekHolidayListAr.length <= 0 ) { 
					tempINHolidayVal="N";
				} else {
					if ( inWeekHolidayListAr[0]=== "NONE") {
						tempINHolidayVal="N";
					} else {
						if ( inWeekHolidayListAr.indexOf(weekArEdit[q]) > -1 ){ 
							tempINHolidayVal="Y";
						} else {
							tempINHolidayVal="N";
							}
					}
					
				}			
				dataWeekEdit['AU_Holiday']=tempAUHolidayVal;
				dataWeekEdit['IN_Holiday']=tempINHolidayVal;
				rosterUpdateDocWeek.push(dataWeekEdit);
			}
		}
		var dataDocWeekEdit={
			data : JSON.stringify(rosterUpdateDocWeek)
		};
		var dataDocWeekId=document.getElementById('docId2');
		alert("Uploading Roster for : " + dataDocWeekId.firstChild.value+" from Week");
		dataDocWeekEdit.id=dataDocWeekId.firstChild.value;
		console.log(JSON.stringify(dataDocWeekEdit));
		xhrPut('/myapp/putRoster',dataDocWeekEdit,function(data){
			if ( data === 'SUCCESS'){
				p_fail.innerHTML="";
				var messageSend="Successfully uploaded doc " + dataDocWeekEdit.id;
				getTDList(messageSend);
			} else {
				console.log("Err is :"+data);
				p_fail.innerHTML="Failed to upload doc";
				p_success.innerHTML="";
			}
		},function(err){
			console.log(err);
			p_fail.innerHTML=err;
		});	
	}
};

var nextRow = function() {
	var weekRows=document.getElementsByClassName('JSONRow');
	var indexOfRow;
	var mn;
	for (var z=0; z<weekRows.length; ++z){
		if ( weekRows[z].getAttribute('style') === "" ) {
			mn=z;
			indexOfRow=z+1;
		}
	}
	console.log('Index of next'+indexOfRow);
	weekRows[mn].style.display="none";
	weekRows[indexOfRow].style.display="";
	if (indexOfRow === weekRows.length-1) {
			document.getElementById('next').setAttribute('disabled',true);
	}

	if (mn===0){
		console.log('actual Index:'+mn);
		document.getElementById('prev').removeAttribute('disabled');
	}
};

var prevRow = function() {
	var weekRows=document.getElementsByClassName('JSONRow');
	var indexOfRow;
	var mn;
	for (var z=weekRows.length-1; z>=0; z--){
		if ( weekRows[z].getAttribute('style') === "" ) {
			mn=z;
			indexOfRow=z-1;
		}
	}
	console.log('Index of prev'+indexOfRow);
	weekRows[mn].style.display="none";
	weekRows[indexOfRow].style.display="";
	if (indexOfRow === 0) {
			document.getElementById('prev').setAttribute('disabled',true);
	}

	if (mn===weekRows.length-1){
		console.log('prev actual Index:'+mn);
		document.getElementById('next').removeAttribute('disabled');
	}
};

var listByWeek = function() {
	var rosterHeader=document.getElementById('docId2').firstChild.value.split('_');
	console.log(rosterHeader);
	$('.mView').hide();
	$('.dView').hide();
	$('.wView').show();
	var monthForRoster=rosterHeader[1].substring(4);
	var yearForRoster=rosterHeader[1].substring(0,4);
	console.log(monthForRoster,yearForRoster);
	var dateArrayForWeekRoster=create_dates(String(Number(monthForRoster)-1),yearForRoster);
	var dateHashForWeekRoster=returnDateHash(dateArrayForWeekRoster);
	var weekday = new Array(7);
	    weekday[0] = "Sunday";
	    weekday[1] = "Monday";
	    weekday[2] = "Tuesday";
	    weekday[3] = "Wednesday";
	    weekday[4] = "Thursday";
	    weekday[5] = "Friday";
	    weekday[6] = "Saturday";
	var rowWeekRosterOutput=document.getElementById("tbodyWeekOutput");
	var defaultWeekRosterOutput="<tr><th id='docId2'><input readonly value='"+rosterHeader[0]+"_"+rosterHeader[1]+"'></input></th></tr><tr name='JSONHeader'class='headerTable' ><td class='content checkBox'><input type='checkbox' name='masterBox' id='checkAll' onclick='toggleCheckBox(this)'></td>	<td class='content' class='headerTable' >From Date</td><td class='content' class='headerTable' >From Day</td><td class='content' class='headerTable' >To Date</td><td class='content' class='headerTable' >To Day</td><td class='content' class='headerTable' >Morning</td><td class='content' class='headerTable' >General</td><td class='content' class='headerTable' >Evening</td><td class='content'class='headerTable'>MHC</td><td class='content' class='headerTable'>Oncall</td><td class='content' class='headerTable' >Additional</td><td class='content' class='headerTable'>Leave Plans</td><td class='content' class='headerTable' >AU Holiday</td><td class='content' class='headerTable' >IN Holiday</td></tr>";	
	var actualWeekRosterOutput="";
	var AUHolidayAr;
	var INHolidayAr;
	for (var i=0;i<teamRosterEntries.length ; ++i){
		if (teamRosterEntries[i].Date.split('-')[2]==='01'|| teamRosterEntries[i].Day==='Monday'){
			var StartDate=teamRosterEntries[i].Date;
			var StartDay=teamRosterEntries[i].Day;
			var MorningVal=teamRosterEntries[i].Morning;
			var GeneralVal=teamRosterEntries[i].General;
			var EveningVal=teamRosterEntries[i].Evening;
			var MHCVal=teamRosterEntries[i].MHC;
			var OnCallVal=teamRosterEntries[i].Oncall;
			var AdditionalVal=teamRosterEntries[i].Additional;
			var LeavePlansVal=teamRosterEntries[i].Leave_Plans;
			
		}
		if (teamRosterEntries[i].AU_Holiday==='Y'){
			AUHolidayAr+="<option selected value='"+teamRosterEntries[i].Date+"'>"+teamRosterEntries[i].Date+"</option>";
		}else{
			AUHolidayAr+="<option value='"+teamRosterEntries[i].Date+"'>"+teamRosterEntries[i].Date+"</option>";
		}
		if (teamRosterEntries[i].IN_Holiday==='Y'){
			INHolidayAr+="<option selected value='"+teamRosterEntries[i].Date+"'>"+teamRosterEntries[i].Date+"</option>";
		}else{
			INHolidayAr+="<option value='"+teamRosterEntries[i].Date+"'>"+teamRosterEntries[i].Date+"</option>";
		}
			

		if (teamRosterEntries[i].Day==='Sunday' || i === teamRosterEntries.length-1){
				var End_DateVal=teamRosterEntries[i].Date;
				var End_DayVal=teamRosterEntries[i].Day;
				actualWeekRosterOutput+="<tr class='trWeekOutput' name='JSONData3'><td class='insertContent checkBox'><input type='checkbox' name='checkBoxWeekInput' ></td><td class='insertContent' name='dateValue'><input class='insertData' value='"+StartDate+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+StartDay+"' readonly name='dayField'></input></td><td class='insertContent' name='dateValue'><input class='insertData' value='"+End_DateVal+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+End_DayVal+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'><input class='insertData' value='"+MorningVal+"' readonly></td><td class='insertContent' name='GeneralValue'><input class='insertData' value='"+GeneralVal+"' readonly></td><td class='insertContent' name='EveningValue'><input class='insertData' value='"+EveningVal+"' readonly></td><td class='insertContent' name='MHCValue'><input class='insertData' value='"+MHCVal+"' readonly></td><td class='insertContent' name='OncallValue'><input class='insertData' value='"+OnCallVal+"' readonly></td><td class='insertContent' name='AdditionalValue'><input class='insertData' value='"+AdditionalVal+"' readonly></td><td class='insertContent' name='LeavePlanValue'><input class='insertData' value='"+LeavePlansVal+"' readonly></td><td class='insertContent' name='AUHolidayValue'><select id='"+StartDate+"_AUEdit' multiple readonly> <option value='NONE'>NONE</option>"+AUHolidayAr+"</select></td><td class='insertContent' name='INHolidayValue'><select  id='"+StartDate+"_INEdit' multiple readonly><option value='NONE'>NONE</option>"+INHolidayAr+"</select></td></tr>"
				AUHolidayAr="";
				INHolidayAr="";
		}
		
	}
	rowWeekRosterOutput.innerHTML=defaultWeekRosterOutput+actualWeekRosterOutput;
};
var listByDate = function() {
	$('.mView').hide();
	$('.dView').show();
	$('.wView').hide();
	var rowDateRosterOutput=document.getElementById("tbodyDateOutput");
	rowDateRosterOutput.innerHTML="";
	var rosterHeader=document.getElementById('docId2').firstChild.value.split('_');
	console.log(rosterHeader);
	var monthForRoster=rosterHeader[1].substring(4);
	var yearForRoster=rosterHeader[1].substring(0,4);
	console.log(monthForRoster,yearForRoster);
	var dateArrayForDateRoster=create_dates(String(Number(monthForRoster)-1),yearForRoster);
	var dateDiv=document.getElementById('multipleDatesInput');
	dateDiv.innerHTML="";
	var innerHtmlForDateInput="<select id='dateInputSelect' multiple>";
	for (var l=0;l<dateArrayForDateRoster.length;l++){
		innerHtmlForDateInput+="<option value='"+dateArrayForDateRoster[l]+"'>"+dateArrayForDateRoster[l]+"</option>";
	}
	dateDiv.innerHTML=innerHtmlForDateInput+"</select> <br><button onclick='dateExpand()'>Submit Dates</button>";

};
var dateExpand = function (){
	//$('#tbodyDateOutput').hide();
	var datesSelectedAr=$("#dateInputSelect").val();
	var rosterDocId=document.getElementById('docId2');
	console.log("Dates selected:"+datesSelectedAr);
	var datesRosterNode=document.getElementById('tbodyDateOutput');
	datesRosterNode.innerHTML="";
	
	var defaultDateOutput="<tr><th id='docId2'><input readonly value='"+rosterDocId.firstChild.value+"'></input></th></tr><tr name='JSONHeader'class='headerTable' ><td class='content checkBox'></td>	<td class='content' class='headerTable' >Date</td><td class='content' class='headerTable' >Day</td><td class='content' class='headerTable' >Morning</td><td class='content' class='headerTable' >General</td><td class='content' class='headerTable' >Evening</td><td class='content'class='headerTable'>MHC</td><td class='content' class='headerTable'>Oncall</td><td class='content' class='headerTable' >Additional</td><td class='content' class='headerTable'>Leave Plans</td><td class='content' class='headerTable' >AU Holiday</td><td class='content' class='headerTable' >IN Holiday</td></tr>";
	var actualDateOutput="";
	for (var i=0;i<teamRosterEntries.length ; ++i){
//actualOutput+="<tr name='JSONData'><td class='content'>"+receivedData[i].Date+"</td><td class='content'>"+receivedData[i].Day+"</td><td class='content'>"+receivedData[i].Morning+"</td><td class='content'>"+receivedData[i].General+"</td><td class='content'>"+receivedData[i].Evening+"</td><td class='content'>"+receivedData[i].MHC+"</td><td class='content'>"+receivedData[i].Oncall+"</td><td class='content'>"+receivedData[i].Additional+"</td><td class='content'>"+receivedData[i].Leave_Plans+"</td><td class='content'>"+receivedData[i].AU_Holiday+"</td><td class='content'>"+receivedData[i].IN_Holiday+"</td></tr>";
		console.log('Idx before is: '+datesSelectedAr.indexOf(teamRosterEntries[i].Date));
		if (datesSelectedAr.indexOf(teamRosterEntries[i].Date) >=0){
			console.log('Index is:'+datesSelectedAr.indexOf(teamRosterEntries[i].Date));
			actualDateOutput+="<tr class='trDateOutput' name='JSONData3' ><td class='insertContent checkBox'><input type='checkbox' name='checkBoxInput' ></td><td class='insertContent' name='dateValue'><input class='insertData' value='"+teamRosterEntries[i].Date+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+teamRosterEntries[i].Day+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'><input class='insertData' value='"+teamRosterEntries[i].Morning+"' readonly></td><td class='insertContent' name='GeneralValue'><input class='insertData' value='"+teamRosterEntries[i].General+"' readonly></td><td class='insertContent' name='EveningValue'><input class='insertData' value='"+teamRosterEntries[i].Evening+"' readonly></td><td class='insertContent' name='MHCValue'><input class='insertData' value='"+teamRosterEntries[i].MHC+"' readonly></td><td class='insertContent' name='OncallValue'><input class='insertData' value='"+teamRosterEntries[i].Oncall+"' readonly></td><td class='insertContent' name='AdditionalValue'><input class='insertData' value='"+teamRosterEntries[i].Additional+"' readonly></td><td class='insertContent' name='LeavePlanValue'><input class='insertData' value='"+teamRosterEntries[i].Leave_Plans+"' readonly></td><td class='insertContent' name='AUHolidayValue'><input class='insertData' value='"+teamRosterEntries[i].AU_Holiday+"' readonly></td><td class='insertContent' name='INHolidayValue'><input class='insertData' value='"+teamRosterEntries[i].IN_Holiday+"' readonly></td></tr>";
		}else{
			actualDateOutput+="<tr class='trDateOutput' name='JSONData3' style='display:none'><td class='insertContent checkBox'><input type='checkbox' name='checkBoxInput' ></td><td class='insertContent' name='dateValue'><input class='insertData' value='"+teamRosterEntries[i].Date+"' readonly name='dateField' ></td><td class='insertContent' name='dayValue'><input class='insertData' value='"+teamRosterEntries[i].Day+"' readonly name='dayField'></input></td><td class='insertContent' name='MorningValue'><input class='insertData' value='"+teamRosterEntries[i].Morning+"' readonly></td><td class='insertContent' name='GeneralValue'><input class='insertData' value='"+teamRosterEntries[i].General+"' readonly></td><td class='insertContent' name='EveningValue'><input class='insertData' value='"+teamRosterEntries[i].Evening+"' readonly></td><td class='insertContent' name='MHCValue'><input class='insertData' value='"+teamRosterEntries[i].MHC+"' readonly></td><td class='insertContent' name='OncallValue'><input class='insertData' value='"+teamRosterEntries[i].Oncall+"' readonly></td><td class='insertContent' name='AdditionalValue'><input class='insertData' value='"+teamRosterEntries[i].Additional+"' readonly></td><td class='insertContent' name='LeavePlanValue'><input class='insertData' value='"+teamRosterEntries[i].Leave_Plans+"' readonly></td><td class='insertContent' name='AUHolidayValue'><input class='insertData' value='"+teamRosterEntries[i].AU_Holiday+"' readonly></td><td class='insertContent' name='INHolidayValue'><input class='insertData' value='"+teamRosterEntries[i].IN_Holiday+"' readonly></td></tr>";
		}
	}
	datesRosterNode.innerHTML=defaultDateOutput+actualDateOutput;
	
};
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Roster_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
var downloadRoster=function(){
	var trNodeList2=[];
	var typeOfView2;
	if (document.getElementById('viewMonthOutput').getAttribute('style') !== 'display: none;') {typeOfView2='simple';trNodeList2=document.getElementsByClassName('trMonthOutput'); }
	else if(document.getElementById('viewWeekOutput').getAttribute('style') !== 'display: none;') {typeOfView2='week';trNodeList2=document.getElementsByClassName('trWeekOutput');}		
	else if(document.getElementById('viewDateOutput').getAttribute('style') !== 'display: none;') {typeOfView2='simple';trNodeList2=document.getElementsByClassName('trDateOutput');}
	if (typeOfView2==='simple'){
		var rosterDoc2= [];
	//	alert(JSON.stringify(rosterDoc[1]));
		for (var i=0; i<trNodeList2.length; ++i){
			var nodeElement2= [];
			var dataNode2={};
			nodeElement2=trNodeList2[i].childNodes;
			if($(nodeElement2[0].firstChild).prop('checked') === true) {
			dataNode2['Date']=nodeElement2[1].firstChild.value;
	//		dataNode2['Date']=nodeElement2[1].firstChild.value;
			dataNode2['Day']=nodeElement2[2].firstChild.value;
			dataNode2['Morning']=nodeElement2[3].firstChild.value;
			dataNode2['General']=nodeElement2[4].firstChild.value;
			dataNode2['Evening']=nodeElement2[5].firstChild.value;
			dataNode2['MHC']=nodeElement2[6].firstChild.value;
			dataNode2['Oncall']=nodeElement2[7].firstChild.value;
			dataNode2['Additional']=nodeElement2[8].firstChild.value;
			dataNode2['Leave_Plans']=nodeElement2[9].firstChild.value;
			//dataNode2['Comments']=nodeElement2[9].firstChild.value;
			dataNode2['AU_Holiday']=nodeElement2[10].firstChild.value;
			dataNode2['IN_Holiday']=nodeElement2[11].firstChild.value;
			rosterDoc2.push(dataNode2);
			}
		}
		if (rosterDoc2.length===0){
			alert('Please select any/some checkbox(es)');
		} else{
			JSONToCSVConvertor(rosterDoc2,document.getElementById('docId2').firstChild.value, true);
		}
	} else {
		console.log('type of view'+typeOfView2 + " " + trNodeList2.length);
		var rosterDoc2= [];
	//	alert(JSON.stringify(rosterDoc[1]));
		for (var i=0; i<trNodeList2.length; ++i){
			var nodeElement2= [];
			var dataNode2={};
			//console.log(trNodeList2[i]);
			nodeElement2=trNodeList2[i].childNodes;
			if($(nodeElement2[0].firstChild).prop('checked') === true) {
				console.log($(nodeElement2[0].firstChild).prop('checked'));
			dataNode2['From Date']=nodeElement2[1].firstChild.value;
	//		dataNode2['Date']=nodeElement2[1].firstChild.value;
			dataNode2['Day']=nodeElement2[2].firstChild.value;
			dataNode2['To Date']=nodeElement2[3].firstChild.value;
			dataNode2['Day']=nodeElement2[4].firstChild.value;
			dataNode2['Morning']=nodeElement2[5].firstChild.value;
			dataNode2['General']=nodeElement2[6].firstChild.value;
			dataNode2['Evening']=nodeElement2[7].firstChild.value;
			dataNode2['MHC']=nodeElement2[8].firstChild.value;
			dataNode2['Oncall']=nodeElement2[9].firstChild.value;
			dataNode2['Additional']=nodeElement2[10].firstChild.value;
			dataNode2['Leave_Plans']=nodeElement2[11].firstChild.value;
			//dataNode2['Comments']=nodeElement2[9].firstChild.value;
			dataNode2['AU_Holiday']=$(nodeElement2[12].firstChild).val();
			dataNode2['IN_Holiday']=$(nodeElement2[13].firstChild).val();
			rosterDoc2.push(dataNode2);
			}
		}
		if (rosterDoc2.length===0){
			alert('Please select any/some checkbox(es)');
		} else{
			JSONToCSVConvertor(rosterDoc2,document.getElementById('docId2').firstChild.value, true);
		}
	}
};